# Daily Economic News Digest → Telegram Topic

A single script (`digest.py`) that once a day fetches today's high/medium
impact economic calendar events and posts a clean summary into a specific
topic inside a Telegram group.

```
📅 Today's High Impact Events — Friday, 29 August 2026

🔴 08:30 GBP — UK GDP m/m
🟡 13:30 USD — Retail Sales
🔴 15:00 USD — FOMC Statement
```

On a day with no high/medium impact events, it posts a short "quiet day"
message instead of nothing, so you know the script is still alive.

On a day with a market holiday (an exchange closure flagged by the feed), the
digest also lists it, e.g.:
```
🏦 Market Holidays:
🏦 JPY — Bank Holiday
```

Data source: Forex Factory's public calendar feed (no signup or API key
needed). If that feed is ever unreachable, the script retries a few times
and, failing that, posts a message telling you the fetch failed instead of
staying silent.

## 15-minute warnings for High-impact events

A second workflow (`.github/workflows/event-warnings.yml`) checks every 15
minutes during the trading day (Mon–Fri, 06:00–21:45 UTC) for any
**High-impact** event about to start, and sends a one-off ping shortly
before it:
```
⏰ In 15 min: 🔴 15:00 USD — FOMC Statement
```
Medium-impact events aren't included here (to keep the pings to the ones
that actually move markets) — they still show up in the once-a-day 6am
digest. Each event only ever triggers one ping; this is tracked in
`.warned_events.json`, which the workflow updates and commits back to the
repo automatically — you don't need to touch it.

## Breaking geopolitical / market-moving news alerts

A third workflow (`.github/workflows/news-alerts.yml`) checks every 15
minutes, all day, for breaking news that's likely to move markets — real
war/conflict escalation (Russia/Ukraine, Israel/Iran/Gaza, China/Taiwan) or
Trump news paired with something market-relevant (tariffs, the Fed,
interest rates, sanctions, a shutdown). It's deliberately narrow to avoid
noise: plain political headlines that don't touch markets are left out on
purpose. Headlines are pulled only from major wire services (Reuters, AP,
Bloomberg, BBC, Al Jazeera) via a filtered Google News search — no signup or
API key needed. Each story only ever posts once (tracked in
`.posted_news.json`, auto-committed like the file above), in the same style
as the other alerts:
```
🚨 08:15 BREAKING — Russia launches missile strikes on Kyiv power grid
```

This one needs its own Telegram topic (it'll get noisy mixed in with the
calendar events). Set it up the same way as your other topic (see step 4
above — create the topic, send a test message, copy its link to get the
topic ID), then add one more GitHub secret:
- `TELEGRAM_NEWS_TOPIC_ID` → the new topic's ID

If you'd rather it post into the same topic as the calendar digest, just
reuse that topic's ID (or your group's main chat, if you leave it blank).

**Note on Actions minutes:** this workflow runs 24/7 (news doesn't keep
office hours), which uses considerably more GitHub Actions minutes than the
other two. If your repo is private, this will likely exceed the free
2,000 min/month tier; making the repo public removes that cap entirely
(Settings → scroll to "Danger Zone" → Change visibility). Your bot
token and chat/topic IDs stay hidden either way, since they're stored as
encrypted secrets, never written into the code.

---

## 1. Create your Telegram bot

1. Open Telegram and message **@BotFather**.
2. Send `/newbot` and follow the prompts (pick a name and a username ending in `bot`).
3. BotFather replies with a token that looks like `123456789:AAExampleTokenHere`.
   Save it — this is your `TELEGRAM_BOT_TOKEN`.

## 2. Add the bot to your group

1. Open your Telegram group → **group name → Add Members** → add your bot.
2. Your group must have **Topics** enabled to have separate topics/threads
   (group settings → "Topics" toggle). If it's already using topics, you're set.
3. Give the bot permission to send messages (if your group restricts posting,
   make the bot an admin, or at least allow it to send messages/see topics).

## 3. Get your group's chat ID

1. Send any message in the group (in any topic).
2. In your browser, go to:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   (replace `<YOUR_TOKEN>` with your real bot token).
3. Look for a block like:
   ```json
   "chat": { "id": -1001234567890, "title": "Your Group", ... }
   ```
   That negative number is your `TELEGRAM_CHAT_ID`. Copy it including the minus sign.

If you see an empty `"result": []`, send a fresh message in the group first,
then reload the URL — Telegram only shows recent updates.

## 4. Get the topic (thread) ID

1. Open the **specific topic** you want the digest posted into, and send a
   test message inside it.
2. Reload the same `getUpdates` URL from step 3.
3. In the newest update, look for:
   ```json
   "message_thread_id": 42
   ```
   That number is your `TELEGRAM_TOPIC_ID`.

   (If a message was sent in the group's "General" topic, this field may be
   missing — that's fine, it just means "General". Leave `TELEGRAM_TOPIC_ID`
   blank to post there.)

## 5. Install and configure

You'll need Python 3.9 or newer installed.

```bash
cd economic-digest-telegram
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Now open `digest.py` in any text editor and fill in the **CONFIGURATION**
section near the top:

```python
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "123456789:AAExampleTokenHere")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "-1001234567890")
TOPIC_ID = os.environ.get("TELEGRAM_TOPIC_ID", "42")
TIMEZONE = os.environ.get("DIGEST_TIMEZONE", "Europe/London")
```

Set `TIMEZONE` to your own [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
(e.g. `America/New_York`, `Europe/London`, `Australia/Sydney`). This controls
both "what counts as today" and the times shown in the message.

(If you'd rather not edit the file, you can instead set these as environment
variables with the same names — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
`TELEGRAM_TOPIC_ID`, `DIGEST_TIMEZONE` — and leave the file untouched.)

## 6. Test it

```bash
python3 digest.py
```

You should see a message appear in your Telegram topic within a few
seconds. If nothing shows up, re-check the token/chat ID/topic ID and that
the bot is actually a member of the group.

## 7. Schedule it to run every morning

### Recommended: GitHub Actions (no computer needed at all)

This repo includes `.github/workflows/daily-digest.yml`, which runs the
script automatically on GitHub's own servers, Monday–Friday at 6am London
time (it accounts for daylight saving automatically). Your laptop doesn't
need to be on, or even exist, for this to work.

Setup:
1. In the repo on GitHub, go to **Settings → Secrets and variables →
   Actions**, and add three repository secrets: `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHAT_ID`, `TELEGRAM_TOPIC_ID` (values from steps 1–4 above).
2. That's it — the schedule in the workflow file handles the rest.

**Important:** GitHub only runs *scheduled* workflows from your repo's
**default branch** (usually `main`). If this workflow currently lives on a
different branch, merge it into `main` before the 6am schedule will
actually start firing.

**To test it immediately** without waiting until 6am: go to the repo's
**Actions** tab → click **"Daily Economic Digest"** in the left sidebar →
click the **"Run workflow"** button → **"Run workflow"** again to confirm.
Check your Telegram topic a few seconds later.

### Alternative: cron (Mac/Linux) or Windows Task Scheduler, on your own machine

The simplest and most reliable *local* option is **cron** (Mac/Linux) — it runs the
script once at a fixed time each day, then exits, using no memory in between.

1. Open your crontab:
   ```bash
   crontab -e
   ```
2. Add a line to run it every day at 7:00am **in your system's local time**
   (adjust the path to match where you saved this folder):
   ```
   0 7 * * * /full/path/to/economic-digest-telegram/venv/bin/python3 /full/path/to/economic-digest-telegram/digest.py >> /full/path/to/economic-digest-telegram/digest.log 2>&1
   ```
   Find the full paths with `pwd` (run it from inside the folder) and
   `which python3` (after activating the venv).
3. Save and exit. Cron uses your computer's clock, so make sure your
   system timezone matches (or adjust the `7` to compensate) — the
   `TIMEZONE` setting in `digest.py` only affects how "today" and event
   times are calculated, not when cron fires.

**Alternative — built-in scheduler:** if you can't use cron (e.g. you just
want to leave a terminal running), start the script in loop mode instead:

```bash
python3 digest.py --loop
```

It will sleep until `DAILY_RUN_TIME` (default `07:00`, in the `TIMEZONE` you
configured) each day, post the digest, then wait for the next day. Leave
this running in a terminal, `screen`/`tmux` session, or as a background
service — if the process stops, the digest stops until you restart it,
so cron is the more robust choice for unattended use.

## Troubleshooting

- **"Missing configuration" error** — you haven't filled in the token/chat ID
  in `digest.py` (or the matching environment variables).
- **No message arrives, no error** — double check the bot is a member of the
  group and can post; if the group restricts non-admins from posting, make
  the bot an admin.
- **Message posts to the wrong topic / "General"** — re-check `TOPIC_ID` from
  step 4; an empty or wrong value falls back to the main chat.
- **Telegram API error 400 "chat not found"** — the `CHAT_ID` is wrong; redo
  step 3 (group IDs for supergroups start with `-100`).
