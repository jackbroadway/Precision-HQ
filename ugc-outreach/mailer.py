"""Sends outreach emails via Gmail SMTP using an app password.

Never store the real password in code — it's read from the
GMAIL_APP_PASSWORD environment variable (see README.md for how to
generate one). Nothing here ever sends outbound messages on its own;
every send is triggered by an explicit click in the dashboard.
"""

import os
import smtplib
from email.message import EmailMessage

GMAIL_ADDRESS = os.environ.get("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


class EmailNotConfigured(Exception):
    pass


def is_configured():
    return bool(GMAIL_ADDRESS and GMAIL_APP_PASSWORD)


def send_email(to_address: str, subject: str, body: str):
    if not is_configured():
        raise EmailNotConfigured(
            "Set GMAIL_ADDRESS and GMAIL_APP_PASSWORD (see README.md) before sending email."
        )

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_address
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.send_message(msg)
