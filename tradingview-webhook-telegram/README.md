# TradingView Webhook → Telegram Trade Signals

Receives TradingView Pine Script alerts over a webhook, auto-calculates
SL/TP levels from the entry price, posts a formatted trade signal to a
Telegram channel/group, and keeps watching the price so it can edit that
same message (and ping a reply) the moment each TP or the SL is hit.

```
📊 BUY EURUSD
Asia Range Breakout

Entry: 1.08500
⬜ SL: 1.07500  (-100 pips)
⬜ TP1: 1.08580  (+80 pips)
⬜ TP2: 1.09700  (+200 pips)
⬜ TP3: 1.10800  (+300 pips)
```

When TP1 hits, the message above is edited in place (⬜ → ✅) and a reply
is posted:
```
✅ TP1 HIT on EURUSD @ 1.08582
```

**Only new alerts arriving during the Asia trading session are taken**
(Tokyo session, `00:00`–`09:00` UTC by default — adjust with
`ASIA_SESSION_START_UTC` / `ASIA_SESSION_END_UTC`, see below). Alerts
outside that window are acknowledged but not posted. Positions already
open keep being monitored around the clock, since a level can still be
hit after the session ends.

For a **long/buy**: `SL = entry - 100 pips`, `TP1/2/3 = entry + 80/200/300 pips`.
For a **short/sell**, it's mirrored: `SL = entry + 100 pips`, `TP1/2/3 = entry - 80/200/300 pips`.
Pip sizes and levels are configurable (see `.env.example`).

## How it works

Two long-running processes, sharing state via `positions.json`:

- **`webhook_server.py`** — a small Flask app. TradingView POSTs each
  alert to `/webhook`; it computes SL/TP, posts the initial signal to
  Telegram, and saves the position.
- **`monitor.py`** — polls a live price feed every `POLL_INTERVAL_SECONDS`
  (default 30s) for every open position's symbol, and updates Telegram
  the moment a TP or SL price is touched.

Both need to be **always running and reachable from the internet**
(TradingView has to be able to reach your webhook URL) — this is not a
GitHub Actions cron job like the other scripts in this repo. See
**Deployment** below.

Price data comes from Yahoo Finance's public chart endpoint (no API key,
same "no signup needed" approach as the rest of this repo) — forex pairs
are queried as e.g. `EURUSD=X`.

## 1. Create your Telegram bot and get your chat/topic IDs

Same steps as the economic digest script — see
[`../economic-digest-telegram/README.md`](../economic-digest-telegram/README.md#1-create-your-telegram-bot)
sections 1–4 if you haven't already got a `TELEGRAM_BOT_TOKEN`,
`TELEGRAM_CHAT_ID`, and (optionally) `TELEGRAM_TOPIC_ID`.

## 2. Configure

```bash
cd tradingview-webhook-telegram
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and fill in:
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_TOPIC_ID`
- `TRADINGVIEW_WEBHOOK_SECRET` — **set this.** TradingView's standard
  webhook alerts can't send custom auth headers, so the secret travels
  in the alert's JSON body instead (see step 3) and this script checks
  it. Without it, anyone who discovers your webhook URL can post fake
  signals to your channel. Generate one with:
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
- `SL_PIPS` / `TP_PIPS` — defaults match the brief (100 / 80,200,300).
- `ASIA_SESSION_START_UTC` / `ASIA_SESSION_END_UTC` — defaults to the
  Tokyo session, `00:00`–`09:00` UTC. Widen this (e.g. `22:00`–`09:00`)
  if you want to include the Sydney session too.

Then load it into your shell (or let your hosting platform inject these
as secrets/env vars instead — see **Deployment**):
```bash
export $(grep -v '^#' .env | xargs)
```

## 3. Set up the TradingView alert

In your Pine Script strategy/indicator, create an alert (or use
`alertcondition()` / `alert()`) with:

- **Webhook URL**: `https://your-server.example.com/webhook`
- **Message** (JSON body):
  ```json
  {
    "secret": "the TRADINGVIEW_WEBHOOK_SECRET you set above",
    "symbol": "EURUSD",
    "side": "buy",
    "entry": "{{close}}",
    "label": "Asia Range Breakout"
  }
  ```

Field reference:
| Field | Required | Notes |
|---|---|---|
| `secret` | recommended | must match `TRADINGVIEW_WEBHOOK_SECRET` |
| `symbol` | yes | e.g. `EURUSD`, `USDJPY`, `XAUUSD` |
| `side` | yes | `buy`/`long` or `sell`/`short` |
| `entry` | yes | the entry price — use `{{close}}` or `{{strategy.order.price}}` in Pine so TradingView fills in the real fill price. `price`/`close` are accepted as aliases. |
| `label` | no | shown under the signal header, e.g. your strategy/setup name |
| `pip_size` | no | override auto-detected pip size (0.0001 normal, 0.01 for JPY pairs, 0.1 for gold) — useful for indices/crypto |

Test it with `curl` before wiring up TradingView:
```bash
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","symbol":"EURUSD","side":"buy","entry":1.0850,"label":"Test Alert"}'
```
(If it's outside your configured Asia session window, you'll get back
`{"status": "ignored", "reason": "outside Asia trading session"}` —
temporarily widen `ASIA_SESSION_START_UTC`/`END_UTC` to test at any hour.)

`GET /positions` returns the current state of all tracked positions (handy
for debugging); `GET /health` is a plain liveness check for your host's
health monitor.

## 4. Run it

**Locally (single process, good for testing):**
```bash
python3 webhook_server.py
```
This starts the Flask app *and* automatically starts the monitor loop in
a background thread (`RUN_MONITOR_IN_PROCESS=true`, the default) — one
process does everything.

**Production — two separate long-running processes (recommended):**

Set `RUN_MONITOR_IN_PROCESS=false` and run each independently, e.g. via
systemd, Docker Compose, or your platform's process types:

```bash
# process 1
gunicorn -w 4 -b 0.0.0.0:8080 webhook_server:app

# process 2
python3 monitor.py
```

Running the monitor as its own process means it isn't tied to how many
web workers you run — with `RUN_MONITOR_IN_PROCESS=true` and more than
one gunicorn worker, each worker would start its own monitor loop and
you'd get duplicate Telegram updates.

## 5. Deployment (needs a public URL TradingView can reach)

Pick whichever fits what you already use:
- **A small always-on VPS** (systemd services for each process, or
  Docker Compose with `webhook_server` + `monitor` services, behind
  nginx/Caddy for TLS). Most robust option, and `positions.json` persists
  across restarts.
- **Render / Railway / Fly.io** (free/hobby tier): deploy as a web
  service running `gunicorn -w 1 -b 0.0.0.0:$PORT webhook_server:app`
  (single worker keeps `RUN_MONITOR_IN_PROCESS=true` safe) or as two
  services if the platform supports a background worker type. Note
  ephemeral filesystems on some free tiers will lose `positions.json` on
  redeploy/restart — fine for testing, less ideal for long-lived
  positions.
- **Testing on your own machine**: run `python3 webhook_server.py`, then
  expose it with `ngrok http 8080` and use the printed `https://...`
  URL as your TradingView webhook URL. Only good while ngrok/your
  machine stays running.

## Troubleshooting

- **"Missing configuration" error** — `TELEGRAM_BOT_TOKEN` /
  `TELEGRAM_CHAT_ID` aren't set in the environment.
- **403 "invalid or missing secret"** — the alert's `secret` field
  doesn't match `TRADINGVIEW_WEBHOOK_SECRET`.
- **`{"status": "ignored", ...}` and nothing posts** — the alert arrived
  outside your configured Asia session window; that's by design.
- **No Telegram message, no error** — check the bot is a member of the
  group/channel and allowed to post (make it an admin if the group
  restricts posting).
- **TP/SL never update** — confirm `monitor.py` is actually running
  (it's a separate process in production) and check its logs for price
  fetch failures; some symbols/tickers aren't available on Yahoo Finance
  under the auto-generated ticker — pass `pip_size` and double check the
  `symbol` you're sending matches a standard forex ticker.
