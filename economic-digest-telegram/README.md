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

Data source: Forex Factory's public calendar feed (no signup or API key
needed). If that feed is ever unreachable, the script retries a few times
and, failing that, posts a message telling you the fetch failed instead of
staying silent.

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

The simplest and most reliable option is **cron** (Mac/Linux) — it runs the
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
