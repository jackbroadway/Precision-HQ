#!/usr/bin/env python3
"""
UGC Brand Outreach Tracker.

A small dashboard for finding and working a pipeline of brands to pitch
for UGC (TikTok/Instagram) collaborations: track contacts, auto-draft a
personalized outreach email and Instagram DM for each one, send the email
for real (Gmail SMTP), and one-tap-open Instagram with the DM text ready
to paste and send yourself.

Instagram DMs are intentionally NOT auto-sent. Meta's official API only
lets a business message people who've already messaged it first — there's
no legitimate "cold DM a stranger's brand account" API. Anything that did
that automatically would have to fake being a real logged-in user, which
is exactly the bot behavior Instagram detects and bans accounts for. So
this tool drafts the message and gets you one tap from sending it, but a
human (you) always does the actual send, from your own account.

See README.md for setup instructions.
"""

import hmac
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, session, url_for
from urllib.parse import quote

load_dotenv()

import db
import mailer

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-only-change-me")
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
# Set SESSION_COOKIE_SECURE=1 once this is deployed behind HTTPS (Render/Railway
# both terminate TLS for you) — off by default so the login also works over
# plain http://localhost during local development.
app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", "0") == "1"

ACCESS_PASSWORD = os.environ.get("ACCESS_PASSWORD", "")

FOLLOW_UP_STATUSES = {"emailed", "dm_sent"}


@app.before_request
def require_login():
    if not ACCESS_PASSWORD:
        # No password configured — leave the app open (e.g. local dev).
        return None
    if request.endpoint in ("login", "static"):
        return None
    if not session.get("authenticated"):
        return redirect(url_for("login", next=request.path))


@app.route("/login", methods=["GET", "POST"])
def login():
    if not ACCESS_PASSWORD:
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        submitted = request.form.get("password", "")
        if hmac.compare_digest(submitted, ACCESS_PASSWORD):
            session.clear()
            session["authenticated"] = True
            session.permanent = True
            next_url = request.form.get("next") or url_for("dashboard")
            return redirect(next_url)
        flash("Wrong password.", "error")
    return render_template("login.html", next=request.args.get("next", ""))


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))


def render_template_str(template: str, **kwargs) -> str:
    try:
        return template.format(**kwargs)
    except (KeyError, IndexError):
        return template


def build_messages(contact, settings):
    context = {
        "brand_name": contact["brand_name"] or "there",
        "creator_name": settings.get("creator_name") or "your name",
        "niche": contact["niche"] or settings.get("niches") or "your",
        "portfolio_link": settings.get("portfolio_link") or "",
        "rate_info": settings.get("rate_info") or "",
    }
    subject = render_template_str(settings.get("email_subject_template", ""), **context)
    body = render_template_str(settings.get("email_body_template", ""), **context)
    dm_text = render_template_str(settings.get("dm_template", ""), **context)
    return subject, body, dm_text


def days_since(iso_timestamp):
    if not iso_timestamp:
        return None
    try:
        then = datetime.strptime(iso_timestamp, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None
    return (datetime.utcnow() - then).days


@app.template_filter("status_label")
def status_label(value):
    return db.STATUS_LABELS.get(value, value)


@app.context_processor
def inject_auth_state():
    return {"logged_in": bool(ACCESS_PASSWORD) and session.get("authenticated", False)}


@app.route("/")
def dashboard():
    status_filter = request.args.get("status") or None
    contacts = list_contacts_with_followup(status_filter)
    settings = db.get_settings()
    follow_up_days = int(settings.get("follow_up_days") or 5)
    needs_follow_up = [c for c in contacts if c["overdue"]]
    return render_template(
        "dashboard.html",
        contacts=contacts,
        statuses=db.STATUSES,
        status_labels=db.STATUS_LABELS,
        active_status=status_filter,
        needs_follow_up_count=len(needs_follow_up),
        follow_up_days=follow_up_days,
        email_configured=mailer.is_configured(),
    )


def list_contacts_with_followup(status_filter):
    settings = db.get_settings()
    follow_up_days = int(settings.get("follow_up_days") or 5)
    rows = db.list_contacts(status_filter)
    contacts = []
    for row in rows:
        d = dict(row)
        age = days_since(row["last_contacted_at"])
        d["days_since_contact"] = age
        d["overdue"] = (
            row["status"] in FOLLOW_UP_STATUSES and age is not None and age >= follow_up_days
        )
        contacts.append(d)
    return contacts


@app.route("/add", methods=["GET", "POST"])
def add_contact():
    if request.method == "POST":
        data = {
            "brand_name": request.form.get("brand_name", "").strip(),
            "instagram_handle": request.form.get("instagram_handle", "").strip().lstrip("@"),
            "tiktok_handle": request.form.get("tiktok_handle", "").strip().lstrip("@"),
            "email": request.form.get("email", "").strip(),
            "website": request.form.get("website", "").strip(),
            "niche": request.form.get("niche", "").strip(),
            "notes": request.form.get("notes", "").strip(),
        }
        if not data["brand_name"]:
            flash("Brand name is required.", "error")
            return render_template("add_contact.html", form=data)
        contact_id = db.add_contact(data)
        flash(f"Added {data['brand_name']}.", "success")
        return redirect(url_for("contact_detail", contact_id=contact_id))
    return render_template("add_contact.html", form={})


@app.route("/contact/<int:contact_id>")
def contact_detail(contact_id):
    contact = db.get_contact(contact_id)
    if not contact:
        flash("Contact not found.", "error")
        return redirect(url_for("dashboard"))
    settings = db.get_settings()
    subject, body, dm_text = build_messages(contact, settings)
    instagram_url = (
        f"https://instagram.com/{contact['instagram_handle']}"
        if contact["instagram_handle"]
        else None
    )
    mailto_url = (
        f"mailto:{contact['email']}?subject={quote(subject)}&body={quote(body)}"
        if contact["email"]
        else None
    )
    return render_template(
        "contact_detail.html",
        contact=contact,
        statuses=db.STATUSES,
        status_labels=db.STATUS_LABELS,
        subject=subject,
        body=body,
        dm_text=dm_text,
        instagram_url=instagram_url,
        mailto_url=mailto_url,
        email_configured=mailer.is_configured(),
    )


@app.route("/contact/<int:contact_id>/send_email", methods=["POST"])
def send_email(contact_id):
    contact = db.get_contact(contact_id)
    if not contact:
        flash("Contact not found.", "error")
        return redirect(url_for("dashboard"))
    if not contact["email"]:
        flash("This contact has no email address on file.", "error")
        return redirect(url_for("contact_detail", contact_id=contact_id))

    subject = request.form.get("subject", "")
    body = request.form.get("body", "")
    try:
        mailer.send_email(contact["email"], subject, body)
    except mailer.EmailNotConfigured as exc:
        flash(str(exc), "error")
        return redirect(url_for("contact_detail", contact_id=contact_id))
    except Exception as exc:  # smtplib errors, network errors, etc.
        flash(f"Failed to send email: {exc}", "error")
        return redirect(url_for("contact_detail", contact_id=contact_id))

    db.update_contact_status(contact_id, "emailed", touch_last_contacted=True)
    flash(f"Email sent to {contact['brand_name']}.", "success")
    return redirect(url_for("contact_detail", contact_id=contact_id))


@app.route("/contact/<int:contact_id>/status", methods=["POST"])
def update_status(contact_id):
    status = request.form.get("status")
    touch = request.form.get("touch_last_contacted") == "1"
    if status not in db.STATUSES:
        flash("Unknown status.", "error")
    else:
        db.update_contact_status(contact_id, status, touch_last_contacted=touch)
        flash("Status updated.", "success")
    return redirect(url_for("contact_detail", contact_id=contact_id))


@app.route("/contact/<int:contact_id>/notes", methods=["POST"])
def update_notes(contact_id):
    db.update_contact_notes(contact_id, request.form.get("notes", ""))
    flash("Notes saved.", "success")
    return redirect(url_for("contact_detail", contact_id=contact_id))


@app.route("/contact/<int:contact_id>/delete", methods=["POST"])
def delete_contact(contact_id):
    db.delete_contact(contact_id)
    flash("Contact deleted.", "success")
    return redirect(url_for("dashboard"))


@app.route("/settings", methods=["GET", "POST"])
def settings_page():
    if request.method == "POST":
        values = {key: request.form.get(key, "") for key in db.DEFAULT_SETTINGS}
        db.save_settings(values)
        flash("Settings saved.", "success")
        return redirect(url_for("settings_page"))
    return render_template("settings.html", settings=db.get_settings())


db.init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
