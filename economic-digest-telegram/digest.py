#!/usr/bin/env python3
"""
Daily high/medium impact economic calendar digest, posted to a Telegram topic.

See README.md in this folder for full setup instructions (getting a bot
token, chat ID, and topic ID, and scheduling this with cron).
"""

import os
import sys
import time
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import requests

# ============================================================
# CONFIGURATION
# Fill these in directly, or set them as environment variables
# of the same name (env vars take priority if both are set).
# ============================================================
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "PASTE_YOUR_BOT_TOKEN_HERE")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "PASTE_YOUR_GROUP_CHAT_ID_HERE")
TOPIC_ID = os.environ.get("TELEGRAM_TOPIC_ID", "")  # leave blank to post to the group's main chat instead of a topic
TIMEZONE = os.environ.get("DIGEST_TIMEZONE", "Europe/London")  # your local timezone, e.g. "America/New_York"
DAILY_RUN_TIME = os.environ.get("DIGEST_RUN_TIME", "07:00")  # only used in --loop mode, 24h "HH:MM"

# ============================================================
# Internals
# ============================================================
CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
IMPACT_EMOJI = {"high": "🔴", "medium": "🟡"}


def validate_config():
    placeholders = {
        "TELEGRAM_BOT_TOKEN": BOT_TOKEN,
        "TELEGRAM_CHAT_ID": CHAT_ID,
    }
    missing = [name for name, value in placeholders.items() if not value or value.startswith("PASTE_")]
    if missing:
        sys.exit(
            "Missing configuration: "
            + ", ".join(missing)
            + "\nEdit the CONFIGURATION section at the top of digest.py "
            "(or set the matching environment variables) before running this script. "
            "See README.md for step-by-step instructions."
        )


def fetch_calendar_events():
    last_exc = None
    for attempt in range(3):
        try:
            resp = requests.get(CALENDAR_URL, timeout=15)
            resp.raise_for_status()
            return resp.json()
        except Exception as exc:  # noqa: BLE001 - we want to retry on any request/parse failure
            last_exc = exc
            if attempt < 2:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"could not fetch the economic calendar: {last_exc}")


def get_todays_events(raw_events, tz):
    today = datetime.now(tz).date()
    todays = []
    for ev in raw_events:
        impact = (ev.get("impact") or "").strip().lower()
        if impact not in ("high", "medium"):
            continue
        date_str = ev.get("date")
        if not date_str:
            continue
        try:
            event_dt = datetime.fromisoformat(date_str)
        except ValueError:
            continue
        event_local = event_dt.astimezone(tz)
        if event_local.date() != today:
            continue
        todays.append(
            {
                "sort_key": event_local,
                "time": event_local.strftime("%H:%M"),
                "currency": (ev.get("country") or "").strip(),
                "title": (ev.get("title") or "Unknown event").strip(),
                "impact": impact,
            }
        )
    todays.sort(key=lambda e: e["sort_key"])
    return todays


def build_message(events, tz):
    today_str = datetime.now(tz).strftime("%A, %d %B %Y")
    if not events:
        return f"📅 Economic Calendar — {today_str}\n\n😴 No high or medium impact events today. Quiet one."
    lines = [f"📅 Today's High Impact Events — {today_str}", ""]
    for ev in events:
        emoji = IMPACT_EMOJI.get(ev["impact"], "⚪")
        lines.append(f"{emoji} {ev['time']} {ev['currency']} — {ev['title']}")
    return "\n".join(lines)


def send_telegram_message(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text}
    if TOPIC_ID:
        payload["message_thread_id"] = int(TOPIC_ID)
    resp = requests.post(url, json=payload, timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"Telegram API error {resp.status_code}: {resp.text}")


def run_daily_digest():
    tz = ZoneInfo(TIMEZONE)
    try:
        raw_events = fetch_calendar_events()
        events = get_todays_events(raw_events, tz)
        message = build_message(events, tz)
    except Exception as exc:  # noqa: BLE001 - report the failure to Telegram instead of failing silently
        message = f"⚠️ Couldn't build today's economic digest ({exc})."
    send_telegram_message(message)


def sleep_until(run_time_str, tz):
    hour, minute = map(int, run_time_str.split(":"))
    target = datetime.now(tz).replace(hour=hour, minute=minute, second=0, microsecond=0)
    if target <= datetime.now(tz):
        target += timedelta(days=1)
    while True:
        remaining = (target - datetime.now(tz)).total_seconds()
        if remaining <= 0:
            return
        time.sleep(min(remaining, 60))


def main():
    validate_config()
    if "--loop" in sys.argv:
        tz = ZoneInfo(TIMEZONE)
        print(f"Loop mode: will post every day at {DAILY_RUN_TIME} ({TIMEZONE}). Press Ctrl+C to stop.")
        while True:
            sleep_until(DAILY_RUN_TIME, tz)
            run_daily_digest()
    else:
        run_daily_digest()


if __name__ == "__main__":
    main()
