# UGC Brand Outreach Tracker

A small private dashboard for pitching brands for UGC (TikTok/Instagram
video) collaborations: keep a pipeline of brands, auto-draft a
personalized outreach email and Instagram DM for each one, send the email
for real, and track replies through to a closed deal.

## Why Instagram DMs aren't auto-sent

Meta's official Instagram API only lets a business account message people
who've already messaged *it* first — there's no legitimate API for cold
DM-ing a brand that's never talked to you. The only way to fully automate
that would be a bot logging in as you and faking real usage, which is
exactly the behavior Instagram detects and permanently bans accounts for.
That's not a risk worth taking with an account you rely on for your
business.

So instead, for each brand this tool:
1. Drafts a personalized DM (fills in the brand name, niche, your
   portfolio link, etc. from templates you control in Settings).
2. Gives you a "Copy message" button and an "Open Instagram" button.

You tap both and paste-send it yourself — it takes a few seconds, it's a
real message from your real account, and there's no ban risk. Email, on
the other hand, *is* sent for real from here (via Gmail), since there's
nothing unofficial or bannable about sending a normal email.

## What it does

- Add brands you find (Instagram handle, TikTok handle, email, niche, notes).
- Auto-drafted, editable outreach email and DM per brand, filled in from
  templates you set once in Settings (your name, portfolio link, rate,
  niches).
- One click to send the email for real (Gmail SMTP) — updates status and
  timestamps automatically.
- Pipeline status per brand: Not contacted → Emailed / DM sent → Replied →
  Negotiating → Closed (won/lost).
- Dashboard flags brands you contacted N+ days ago with no reply, so
  follow-ups don't fall through the cracks.
- All data lives in a local SQLite file (`outreach.db`) — nothing leaves
  your machine except the emails you choose to send.

## 1. Install

You'll need Python 3.9+.

```bash
cd ugc-outreach
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Set up email sending (Gmail app password)

1. Turn on 2-Step Verification on the Gmail account you want to send from:
   https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords, create an app password
   (name it something like "UGC Outreach"), and copy the 16-character code.
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in `.env`:
   ```
   GMAIL_ADDRESS=youraddress@gmail.com
   GMAIL_APP_PASSWORD=the16charcodefromstep2
   FLASK_SECRET_KEY=any-random-string
   ```

You can skip this step and use the app anyway — email drafts still work,
you'd just use "Open in mail app instead" rather than sending from the
dashboard directly.

**Volume note:** Gmail rate-limits sending to roughly 500 messages/day,
which is far more than manual brand outreach needs.

## 3. Run it

```bash
python3 app.py
```

Open http://localhost:5000 in a browser. On first run it creates
`outreach.db` automatically.

## 4. Fill in your outreach templates

Go to **Settings** and fill in your name, portfolio link, rates, and the
email/DM templates. Templates support these placeholders:
`{brand_name}`, `{creator_name}`, `{niche}`, `{portfolio_link}`,
`{rate_info}`.

## 5. Day-to-day use

1. Browse Instagram/TikTok yourself for brands worth pitching (there's no
   safe way to automate *finding* brands either — Instagram doesn't offer
   a public search API, and scraping violates its terms and gets IPs/accounts
   blocked).
2. **+ Add brand** — paste in the handle/niche/email you found.
3. Open the brand's page — review the drafted email and DM, edit if you
   want, then **Send email now** and/or **Copy message → Open Instagram**
   to send the DM yourself.
4. As replies come in, update the brand's status so the dashboard's
   follow-up reminders stay accurate.

## Letting your girlfriend use this without you running it

Running `python3 app.py` on your own machine works fine if you're around
to start it, but for her to use it independently, the easiest options are:

- **Free hosting (recommended):** deploy this folder to
  [Render](https://render.com) or [Railway](https://railway.app) free tier
  — both support a Python/Flask app out of the box (`pip install -r
  requirements.txt` then `python app.py`, or a `gunicorn app:app` start
  command). Set `GMAIL_ADDRESS`, `GMAIL_APP_PASSWORD`, and
  `FLASK_SECRET_KEY` as environment variables/secrets in their dashboard,
  same as this README's `.env` values. She'd get a permanent URL to bookmark.
- **Local, always-on machine:** run it on a laptop/desktop that stays on,
  and have her open `http://<that-computer's-IP>:5000` from her phone on
  the same wifi.

There's no login/auth built in — anyone with the URL can use it, so if you
host it publicly, treat the URL itself as the access control (don't post
it publicly), or ask if you'd like basic password protection added.

## Troubleshooting

- **"Set GMAIL_ADDRESS and GMAIL_APP_PASSWORD..."** — you haven't filled
  in `.env`, or forgot to restart the app after editing it.
- **SMTP auth error** — you're using your normal Gmail password instead of
  an app password, or 2-Step Verification isn't turned on (required for
  app passwords to exist).
- **Instagram link opens but nothing's pre-filled** — that's expected;
  Instagram has no way to pre-fill a DM via a link. Use "Copy message"
  first, then paste it in once the DM thread is open.
