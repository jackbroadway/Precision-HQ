#!/usr/bin/env python3
"""
Webhook receiver for TradingView Pine Script alerts.

On each alert (entry price + buy/sell side), computes SL (-100 pips) and
three TPs (+80/+200/+300 pips), posts a formatted trade signal to
Telegram (with an open-ended TP4 runner and a disclaimer footer — see
common.format_signal_message), and hands the position off to monitor.py
to watch for TP/SL hits.

Only takes new alerts during the Asia trading session (see
ASIA_SESSION_START_UTC / ASIA_SESSION_END_UTC in common.py); positions
already open keep being monitored 24/7 until they close.

See README.md for the TradingView alert JSON format and deployment
instructions.
"""

import datetime
import os
import threading
import uuid

from flask import Flask, jsonify, request

import common
import monitor

app = Flask(__name__)

_monitor_lock = threading.Lock()
_monitor_started = False


def start_monitor_thread_once():
    """Convenience for single-process deployments (e.g. `python3 webhook_server.py`
    or a single gunicorn worker). If you run gunicorn with more than one
    worker, set RUN_MONITOR_IN_PROCESS=false and run monitor.py as its own
    process instead — otherwise every worker would post duplicate updates."""
    global _monitor_started
    if os.environ.get("RUN_MONITOR_IN_PROCESS", "true").lower() not in ("1", "true", "yes"):
        return
    with _monitor_lock:
        if _monitor_started:
            return
        threading.Thread(target=monitor.monitor_loop, daemon=True).start()
        _monitor_started = True


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/positions", methods=["GET"])
def positions():
    with common.locked_positions() as data:
        return jsonify(data)


@app.route("/webhook", methods=["POST"])
def webhook():
    common.validate_telegram_config()
    data = request.get_json(silent=True) or {}

    if not common.secret_matches(data.get("secret")):
        return jsonify({"error": "invalid or missing secret"}), 403

    symbol = str(data.get("symbol") or "").upper().strip()
    side = common.normalize_side(data.get("side") or data.get("action") or data.get("direction"))
    entry_raw = data.get("entry", data.get("price", data.get("close")))

    if not symbol or side is None or entry_raw is None:
        return (
            jsonify({"error": "payload must include 'symbol', 'side' ('buy'/'sell'), and 'entry' (price)"}),
            400,
        )

    if not common.symbol_allowed(symbol):
        return jsonify({"status": "ignored", "reason": f"symbol {symbol} not in ALLOWED_SYMBOLS"}), 200

    if not common.alert_allowed_now(symbol):
        reason = (
            f"{symbol} only accepted on weekends"
            if symbol in common.WEEKEND_ONLY_SYMBOLS
            else "outside Asia trading session"
        )
        return jsonify({"status": "ignored", "reason": reason}), 200

    try:
        entry = float(entry_raw)
    except (TypeError, ValueError):
        return jsonify({"error": "'entry' must be a number"}), 400

    entry_high_raw = data.get("entry_high")
    entry_high = None
    if entry_high_raw not in (None, ""):
        try:
            entry_high = float(entry_high_raw)
        except (TypeError, ValueError):
            return jsonify({"error": "'entry_high' must be a number"}), 400

    decimals_raw = data.get("decimals")
    decimals = None
    if decimals_raw not in (None, ""):
        try:
            decimals = int(decimals_raw)
        except (TypeError, ValueError):
            return jsonify({"error": "'decimals' must be an integer"}), 400

    pip_size = common.pip_size_for(symbol, data.get("pip_size"))
    sl, tps = common.compute_levels(entry, side, pip_size)
    chat_id = common.chat_id_for(symbol)

    position = {
        "id": str(uuid.uuid4()),
        "symbol": symbol,
        "label": str(data.get("label") or data.get("signal") or ""),
        "side": side,
        "entry": entry,
        "entry_high": entry_high,
        "pip_size": pip_size,
        "decimals": decimals,
        "sl": sl,
        "sl_hit": False,
        "breakeven_moved": False,
        "tps": [{"pips": pips, "price": price, "hit": False} for pips, price in zip(common.TP_PIPS, tps)],
        "status": "open",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "message_id": None,
        "chat_id": chat_id,
    }
    try:
        position["message_id"] = common.send_message(common.format_signal_message(position), chat_id=chat_id)
    except RuntimeError as exc:
        return jsonify({"error": f"failed to post to Telegram: {exc}"}), 502

    with common.locked_positions() as all_positions:
        all_positions.append(position)

    return jsonify({"status": "ok", "id": position["id"], "sl": sl, "tps": tps}), 200


start_monitor_thread_once()

if __name__ == "__main__":
    common.validate_telegram_config()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
