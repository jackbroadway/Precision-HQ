"""
Shared config, storage, pricing, and Telegram helpers used by both
webhook_server.py (receives TradingView alerts) and monitor.py (watches
open positions and posts TP/SL updates).
"""

import fcntl
import hmac
import json
import os
import sys
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

import requests

# ============================================================
# CONFIGURATION
# Set these as environment variables (see README.md).
# ============================================================
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")
TOPIC_ID = os.environ.get("TELEGRAM_TOPIC_ID", "")  # leave blank to post to the group's main chat
WEBHOOK_SECRET = os.environ.get("TRADINGVIEW_WEBHOOK_SECRET", "")  # strongly recommended, see README.md

SL_PIPS = float(os.environ.get("SL_PIPS", "100"))
TP_PIPS = [float(x) for x in os.environ.get("TP_PIPS", "80,200,300").split(",") if x.strip()]
POLL_INTERVAL_SECONDS = int(os.environ.get("POLL_INTERVAL_SECONDS", "30"))

# After this TP number hits, move the SL to breakeven (the entry price) so
# the trade can no longer close at a loss. Set to 0 to disable.
BREAKEVEN_AFTER_TP = int(os.environ.get("BREAKEVEN_AFTER_TP", "1"))

# Only take new alerts during the Asia trading session (Tokyo session by
# default). Positions already open keep being monitored for TP/SL 24/7
# regardless of session — price can still hit a level after the session
# ends. Times are UTC "HH:MM"; the window may wrap past midnight.
ASIA_SESSION_START_UTC = os.environ.get("ASIA_SESSION_START_UTC", "00:00")
ASIA_SESSION_END_UTC = os.environ.get("ASIA_SESSION_END_UTC", "09:00")

POSITIONS_FILE = Path(os.environ.get("POSITIONS_FILE", Path(__file__).resolve().parent / "positions.json"))


def validate_telegram_config():
    missing = [name for name, value in {"TELEGRAM_BOT_TOKEN": BOT_TOKEN, "TELEGRAM_CHAT_ID": CHAT_ID}.items() if not value]
    if missing:
        sys.exit(
            "Missing configuration: " + ", ".join(missing) + "\n"
            "Set these as environment variables before running. See README.md."
        )


# ============================================================
# Position storage (JSON file, locked so the webhook server and the
# monitor process can safely share it even though they're separate
# processes).
# ============================================================
@contextmanager
def locked_positions():
    POSITIONS_FILE.touch(exist_ok=True)
    with open(POSITIONS_FILE, "r+") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        try:
            try:
                data = json.load(f)
            except ValueError:
                data = []
            yield data
            f.seek(0)
            f.truncate()
            json.dump(data, f, indent=2)
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)


# ============================================================
# Pip math
# ============================================================
def normalize_side(value):
    v = str(value or "").strip().lower()
    if v in ("buy", "long"):
        return "buy"
    if v in ("sell", "short"):
        return "sell"
    return None


def pip_size_for(symbol, override=None):
    if override:
        return float(override)
    s = symbol.upper()
    if "JPY" in s:
        return 0.01
    if s.startswith("XAU"):  # gold
        return 0.1
    return 0.0001


def decimals_for_pip_size(pip_size):
    if pip_size == 0.0001:
        return 5
    if pip_size == 0.01:
        return 3
    if pip_size == 0.1:
        return 2
    if pip_size >= 1:
        return 2
    return 5


def compute_levels(entry, side, pip_size):
    sign = 1 if side == "buy" else -1
    sl = round(entry - sign * SL_PIPS * pip_size, 8)
    tps = [round(entry + sign * pips * pip_size, 8) for pips in TP_PIPS]
    return sl, tps


# ============================================================
# Telegram
# ============================================================
def _telegram_api(method, payload):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    resp = requests.post(url, json=payload, timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"Telegram API error ({method}) {resp.status_code}: {resp.text}")
    return resp.json()


def send_message(text, reply_to=None):
    payload = {"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML"}
    if TOPIC_ID:
        payload["message_thread_id"] = int(TOPIC_ID)
    if reply_to:
        payload["reply_to_message_id"] = reply_to
    result = _telegram_api("sendMessage", payload)
    return result["result"]["message_id"]


def edit_message(message_id, text):
    payload = {"chat_id": CHAT_ID, "message_id": message_id, "text": text, "parse_mode": "HTML"}
    try:
        _telegram_api("editMessageText", payload)
    except RuntimeError as exc:
        # Telegram errors if the new text is identical to the old one; harmless, ignore it.
        if "message is not modified" not in str(exc):
            raise


def format_signal_message(position):
    side_label = "🟢 BUY" if position["side"] == "buy" else "🔴 SELL"
    decimals = decimals_for_pip_size(position["pip_size"])
    lines = [f"📊 <b>{side_label} {position['symbol']}</b>"]
    if position.get("label"):
        lines.append(position["label"])
    lines.append("")
    lines.append(f"Entry: {position['entry']:.{decimals}f}")
    sl_mark = "🔴" if position["sl_hit"] else ("🟨" if position.get("breakeven_moved") else "⬜")
    sl_label = "SL (breakeven)" if position.get("breakeven_moved") else "SL"
    sl_note = "" if position.get("breakeven_moved") else f"  (-{SL_PIPS:g} pips)"
    lines.append(f"{sl_mark} {sl_label}: {position['sl']:.{decimals}f}{sl_note}")
    for i, tp in enumerate(position["tps"], start=1):
        mark = "✅" if tp["hit"] else "⬜"
        lines.append(f"{mark} TP{i}: {tp['price']:.{decimals}f}  (+{tp['pips']:g} pips)")
    if position["status"] == "closed":
        lines.append("")
        if position["sl_hit"] and position.get("breakeven_moved"):
            lines.append("🟨 Position closed — breakeven stop hit (no loss).")
        elif position["sl_hit"]:
            lines.append("❌ Position closed — stop loss hit.")
        else:
            lines.append("🏁 Position closed — all targets hit.")
    return "\n".join(lines)


def in_asia_session(now_utc=None):
    now_utc = now_utc or datetime.now(timezone.utc)
    start_h, start_m = (int(x) for x in ASIA_SESSION_START_UTC.split(":"))
    end_h, end_m = (int(x) for x in ASIA_SESSION_END_UTC.split(":"))
    start = now_utc.replace(hour=start_h, minute=start_m, second=0, microsecond=0)
    end = now_utc.replace(hour=end_h, minute=end_m, second=0, microsecond=0)
    if start <= end:
        return start <= now_utc <= end
    return now_utc >= start or now_utc <= end  # window wraps past midnight UTC


def secret_matches(provided):
    if not WEBHOOK_SECRET:
        return True  # no secret configured, nothing to check (see README.md warning)
    return hmac.compare_digest(str(provided or ""), WEBHOOK_SECRET)


# ============================================================
# Live price feed (Yahoo Finance's public chart endpoint — no API key
# needed, same "no signup" spirit as the other scripts in this repo).
# ============================================================
def yahoo_ticker(symbol):
    s = symbol.upper().strip()
    if "-" in s or s.endswith("USDT") or s.endswith("USDC"):
        return s  # already in Yahoo's crypto format, e.g. BTC-USD
    return f"{s}=X"


def fetch_price(symbol):
    ticker = yahoo_ticker(symbol)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
    resp = requests.get(
        url,
        params={"interval": "1m", "range": "1d"},
        timeout=10,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    resp.raise_for_status()
    result = resp.json()["chart"]["result"]
    if not result:
        raise RuntimeError(f"no chart data for {ticker}")
    price = result[0]["meta"].get("regularMarketPrice")
    if price is None:
        raise RuntimeError(f"no live price for {ticker}")
    return float(price)
