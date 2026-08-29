# TradingView Webhook → Telegram Trade Signals

Receives TradingView Pine Script alerts over a webhook, auto-calculates
SL/TP levels from the entry price, posts a formatted trade signal to a
Telegram channel/group, and keeps watching the price so it can update that
same message (and ping a reply) the moment each TP or the SL is hit.

```
BUY NOW - EURUSD 1.08500

SL - 1.07500

TP1 - 1.08580

TP2 - 1.09700

TP3 - 1.10800

TP4 - OPEN

NOT FINANCIAL ADVICE. THIS IS A PERSONAL TRADE IDEA.
```

When TP1 hits, the message above is edited in place to append " ✅ HIT" to
the `TP1` line, the SL line moves to breakeven (see below), and a reply is
posted:
```
✅ TP1 HIT on EURUSD @ 1.08582
```

**Only takes alerts for XAUUSD by default** (`ALLOWED_SYMBOLS`, comma-separated
— set it to a wider list, or leave it blank, to accept other symbols too).
Anything else is acknowledged but not posted.

**Only new alerts arriving during the Asia trading session are taken**
(Tokyo session, `00:00`–`09:00` UTC by default — adjust with
`ASIA_SESSION_START_UTC` / `ASIA_SESSION_END_UTC`, see below). Alerts
outside that window are acknowledged but not posted. Positions already
open keep being monitored around the clock, since a level can still be
hit after the session ends.

For a **long/buy**: `SL = entry - 100 pips`, `TP1/2/3 = entry + 80/200/300 pips`.
For a **short/sell**, it's mirrored: `SL = entry + 100 pips`, `TP1/2/3 = entry - 80/200/300 pips`.
Pip sizes and levels are configurable (see `.env.example`).

**TP4 - OPEN**: a fourth, open-ended runner target with no fixed price —
shown for style/consistency, never auto-marked "hit" since it has no
level to check. The position keeps being monitored for SL after TP1–3
hit; it only actually closes on an SL (or breakeven) hit. Disable with
`OPEN_RUNNER_ENABLED=false` to go back to auto-closing once TP1–3 have
all hit.

**Breakeven:** once TP1 hits, the SL is automatically moved to the entry
price (so the trade can no longer close at a loss), Telegram gets a
"🟨 SL moved to breakeven" reply, and the SL line updates to
`SL - {entry} (moved to breakeven)`. If price then comes back to entry,
it's reported as "🟨 BREAKEVEN HIT — closed flat" rather than a stop-loss.
Configurable via `BREAKEVEN_AFTER_TP` (default `1`; set to `0` to disable,
or e.g. `2` to wait until TP2 instead).

**Entry range:** if your alert sends both `entry` and `entry_high`, the
header shows a range (`BUY NOW - EURUSD 1.08500-1.08520`) instead of a
single price; `entry` (the low/reference price) is still what SL/TP are
calculated from.

The disclaimer footer text is configurable via `DISCLAIMER_TEXT`; the
symbol in the header can be turned off with `INCLUDE_SYMBOL_IN_HEADER=false`
if every alert already goes to its own symbol-specific Telegram topic.

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
| `symbol` | yes | e.g. `EURUSD`, `USDJPY`, `XAUUSD`, `US30` |
| `side` | yes | `buy`/`long` or `sell`/`short` |
| `entry` | yes | the entry price (or the low end of an entry zone) — use `{{close}}` or `{{strategy.order.price}}` in Pine so TradingView fills in the real fill price. `price`/`close` are accepted as aliases. |
| `entry_high` | no | high end of an entry zone, for a range header like `1.08500-1.08520` |
| `label` | no | shown under the signal header, e.g. your strategy/setup name |
| `pip_size` | no | override auto-detected pip size (0.0001 normal, 0.01 for JPY pairs, 0.1 for gold, use `1` for a points-based index) — useful for indices/crypto |
| `decimals` | no | override how many decimal places are shown (auto-detected from `pip_size` otherwise; indices default to `0`) |

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

**This needs to run on a server, not your laptop.** Once it's deployed to
any of the options below, it runs continuously on that host — your own
machine doesn't need to be on at all. (The only case where your machine
matters is the "testing on your own machine" option below, which is for
trying it out, not for real use.)

A `Dockerfile` and `docker-compose.yml` are included, running the
`webhook` and `monitor` services separately (sharing a persistent volume
for `positions.json`) — this is the config to point any of the options
below at.

**Cheap, always-on, no laptop needed — [Fly.io](https://fly.io) (~$2-5/mo):**
Fly.io dropped its unconditional free tier in late 2024 — new accounts get
a short trial, then need a card on file. A small always-on VM this size
still runs only a couple of dollars a month.
```bash
# one-time: https://fly.io/docs/hands-on/install-flyctl/, then:
fly auth login
cd tradingview-webhook-telegram
fly launch --dockerfile Dockerfile --no-deploy   # creates a fly.toml, pick a small region/size when asked
fly volumes create positions_data --size 1        # persistent disk for positions.json
fly secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... TRADINGVIEW_WEBHOOK_SECRET=...
fly deploy
```
Your webhook URL becomes `https://your-app-name.fly.dev/webhook`.

**Genuinely free, always-on — Oracle Cloud's "Always Free" tier:**
Oracle's Always Free VM instances stay free indefinitely (no trial, no
expiry) — more manual setup than Fly.io (you provision the VM yourself in
Oracle's console and SSH in), but zero ongoing cost:
1. Create a free account at [cloud.oracle.com](https://cloud.oracle.com) and provision an "Always Free"
   compute instance (Ampere A1 or the VM.Standard.E2.1.Micro shape).
2. Install Docker on it, open port 443/80 in the instance's security list,
   `git clone` this repo (or `scp` the `tradingview-webhook-telegram`
   folder over), fill in `.env`, then `docker compose up -d`.
3. Point a domain (or the VM's public IP) at it, behind Caddy/nginx for
   TLS, and use that as your TradingView webhook URL.

**Other options:**
- **Render / Railway** (free/hobby tier) — same Docker setup; check each
  platform's free-tier disk persistence, since some ephemeral filesystems
  lose `positions.json` on redeploy (fine for testing, less ideal for
  long-lived positions).
- **Testing on your own machine only**: run `python3 webhook_server.py`,
  then expose it with `ngrok http 8080` and use the printed `https://...`
  URL as your TradingView webhook URL. Only works while your machine and
  ngrok stay running — not a real deployment.

**Why not Netlify:** Netlify is serverless (no persistent process, no
local disk), so the continuous 30-second price-monitoring loop can't run
there as-is — it would need a rewrite to JavaScript/TypeScript plus
Netlify Blobs for storage and Scheduled Functions for polling (realistically
capped around once a minute instead of 30s). The Docker route above gets
real-time monitoring for free with no rewrite.

## Troubleshooting

- **"Missing configuration" error** — `TELEGRAM_BOT_TOKEN` /
  `TELEGRAM_CHAT_ID` aren't set in the environment.
- **403 "invalid or missing secret"** — the alert's `secret` field
  doesn't match `TRADINGVIEW_WEBHOOK_SECRET`.
- **`{"status": "ignored", ...}` and nothing posts** — either the alert's
  `symbol` isn't in `ALLOWED_SYMBOLS` (default: XAUUSD only), or it arrived
  outside your configured Asia session window; both are by design. The
  `reason` field in the response says which.
- **No Telegram message, no error** — check the bot is a member of the
  group/channel and allowed to post (make it an admin if the group
  restricts posting).
- **TP/SL never update** — confirm `monitor.py` is actually running
  (it's a separate process in production) and check its logs for price
  fetch failures; some symbols/tickers aren't available on Yahoo Finance
  under the auto-generated ticker — pass `pip_size` and double check the
  `symbol` you're sending matches a standard forex ticker.
