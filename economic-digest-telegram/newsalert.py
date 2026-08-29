#!/usr/bin/env python3
"""
Breaking geopolitical / market-moving news alerts, posted to a Telegram topic.

Pulls headlines from a curated Google News search — restricted to major wire
services and to war/conflict or market-relevant Trump news — and posts each
new match once, in the same style as digest.py.

See README.md in this folder for setup instructions.
"""

import json
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import requests

# ============================================================
# CONFIGURATION
# ============================================================
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "PASTE_YOUR_BOT_TOKEN_HERE")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "PASTE_YOUR_GROUP_CHAT_ID_HERE")
TOPIC_ID = os.environ.get("TELEGRAM_NEWS_TOPIC_ID", "")  # leave blank to post to the group's main chat
TIMEZONE = os.environ.get("DIGEST_TIMEZONE", "Europe/London")

# ============================================================
# Internals
# ============================================================
STATE_FILE = Path(__file__).resolve().parent / ".posted_news.json"
MAX_SEEN = 300

# Kept deliberately narrow to avoid spam: real war/conflict escalation terms
# tied to actual flashpoints, and Trump news only when paired with something
# market-relevant (plain "Trump did X" headlines are excluded on purpose).
SEARCH_QUERY = (
    '(war OR invades OR invasion OR strikes OR missile OR ceasefire OR nuclear) '
    'AND (Russia OR Ukraine OR Israel OR Iran OR Gaza OR China OR Taiwan) '
    'OR (Trump AND (tariff OR tariffs OR sanctions OR "Federal Reserve" OR "interest rate" OR shutdown))'
)
SOURCES = "site:reuters.com OR site:apnews.com OR site:bloomberg.com OR site:bbc.com OR site:aljazeera.com"


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
            + "\nSet the matching environment variables / GitHub secrets before running this script."
        )


def build_feed_url():
    query = f"({SEARCH_QUERY}) AND ({SOURCES})"
    params = urllib.parse.urlencode({"q": query, "hl": "en-US", "gl": "US", "ceid": "US:en"})
    return f"https://news.google.com/rss/search?{params}"


def clean_title(title):
    # Google News appends " - Source Name" to every title; strip that off.
    return re.sub(r"\s+-\s+[^-]+$", "", title).strip()


def fetch_headlines():
    resp = requests.get(build_feed_url(), timeout=15)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    items = []
    for item in root.findall("./channel/item"):
        raw_title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        guid = (item.findtext("guid") or link).strip()
        pub_date = item.findtext("pubDate")
        try:
            pub_dt = parsedate_to_datetime(pub_date) if pub_date else None
        except (TypeError, ValueError, IndexError):
            pub_dt = None
        if not raw_title or not guid:
            continue
        items.append({"guid": guid, "title": clean_title(raw_title), "pub_dt": pub_dt})
    return items


def load_seen():
    try:
        return json.loads(STATE_FILE.read_text())
    except (OSError, ValueError):
        return []


def save_seen(seen):
    STATE_FILE.write_text(json.dumps(seen[-MAX_SEEN:]))


def send_telegram_message(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text}
    if TOPIC_ID:
        payload["message_thread_id"] = int(TOPIC_ID)
    resp = requests.post(url, json=payload, timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"Telegram API error {resp.status_code}: {resp.text}")


def run():
    validate_config()
    tz = ZoneInfo(TIMEZONE)
    try:
        items = fetch_headlines()
    except Exception as exc:  # noqa: BLE001 - don't spam Telegram on transient fetch failures
        print(f"news alert: skipping this run, fetch failed: {exc}", file=sys.stderr)
        return

    seen = load_seen()
    seen_set = set(seen)
    bootstrap = not seen  # first-ever run: record the current backlog silently, don't blast it out

    new_seen = list(seen)
    for item in reversed(items):  # oldest first, so messages land in chronological order
        if item["guid"] in seen_set:
            continue
        if not bootstrap:
            when = item["pub_dt"].astimezone(tz).strftime("%H:%M") if item["pub_dt"] else datetime.now(tz).strftime("%H:%M")
            send_telegram_message(f"🚨 {when} BREAKING — {item['title']}")
        new_seen.append(item["guid"])
        seen_set.add(item["guid"])

    save_seen(new_seen)


if __name__ == "__main__":
    run()
