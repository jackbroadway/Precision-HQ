#!/usr/bin/env python3
"""
Watches open positions created by webhook_server.py and posts a Telegram
update the moment price touches a TP or the SL.

Runs continuously, polling a free no-key price feed every
POLL_INTERVAL_SECONDS. Positions are watched 24/7 regardless of trading
session, since a level can still be hit after the Asia session ends.

Can run as its own long-running process (recommended for production —
see README.md), or is started automatically as a background thread by
webhook_server.py for simple single-process deployments.
"""

import sys
import time

import common


def _first_unhit_index(tps):
    for i, tp in enumerate(tps):
        if not tp["hit"]:
            return i
    return None


def apply_price(position, price):
    """Mutates position in place. Returns a list of human-readable event
    strings for anything that just triggered (usually 0 or 1, but a big
    price gap between polls could trigger more than one at once)."""
    events = []
    side = position["side"]
    decimals = common.decimals_for_pip_size(position["pip_size"])

    def sl_hit():
        return price <= position["sl"] if side == "buy" else price >= position["sl"]

    def tp_hit(tp):
        return price >= tp["price"] if side == "buy" else price <= tp["price"]

    if not position["sl_hit"] and sl_hit():
        position["sl_hit"] = True
        position["status"] = "closed"
        if position.get("breakeven_moved"):
            events.append(f"🟨 BREAKEVEN HIT on {position['symbol']} @ {price:.{decimals}f} — closed flat, no loss")
        else:
            events.append(f"🔴 SL HIT on {position['symbol']} @ {price:.{decimals}f}")
        return events  # SL closes the position; no point checking TPs after

    for i, tp in enumerate(position["tps"], start=1):
        if not tp["hit"] and tp_hit(tp):
            tp["hit"] = True
            events.append(f"✅ TP{i} HIT on {position['symbol']} @ {price:.{decimals}f}")
            if common.BREAKEVEN_AFTER_TP and i == common.BREAKEVEN_AFTER_TP and not position.get("breakeven_moved"):
                position["sl"] = position["entry"]
                position["breakeven_moved"] = True
                events.append(f"🟨 SL moved to breakeven ({position['entry']:.{decimals}f}) on {position['symbol']}")

    if all(tp["hit"] for tp in position["tps"]):
        position["status"] = "closed"

    return events


def monitor_loop():
    common.validate_telegram_config()
    print(f"monitor: watching positions every {common.POLL_INTERVAL_SECONDS}s", file=sys.stderr)
    while True:
        try:
            run_once()
        except Exception as exc:  # noqa: BLE001 - keep the loop alive on any transient failure
            print(f"monitor: unexpected error: {exc}", file=sys.stderr)
        time.sleep(common.POLL_INTERVAL_SECONDS)


def run_once():
    with common.locked_positions() as all_positions:
        open_positions = [p for p in all_positions if p["status"] == "open"]
        if not open_positions:
            return

        prices = {}
        for symbol in {p["symbol"] for p in open_positions}:
            try:
                prices[symbol] = common.fetch_price(symbol)
            except Exception as exc:  # noqa: BLE001 - skip this symbol this round, try again next poll
                print(f"monitor: price fetch failed for {symbol}: {exc}", file=sys.stderr)

        for position in open_positions:
            price = prices.get(position["symbol"])
            if price is None:
                continue
            events = apply_price(position, price)
            if not events:
                continue
            common.edit_message(position["message_id"], common.format_signal_message(position))
            for event in events:
                common.send_message(event, reply_to=position["message_id"])


if __name__ == "__main__":
    monitor_loop()
