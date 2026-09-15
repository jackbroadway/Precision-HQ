"""SQLite storage for the UGC outreach tracker. No ORM — the schema is small
enough that raw SQL stays more readable than an abstraction layer."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "outreach.db"

STATUSES = [
    "not_contacted",
    "emailed",
    "dm_sent",
    "replied",
    "negotiating",
    "closed_won",
    "closed_lost",
]

STATUS_LABELS = {
    "not_contacted": "Not contacted",
    "emailed": "Emailed",
    "dm_sent": "DM sent",
    "replied": "Replied",
    "negotiating": "Negotiating",
    "closed_won": "Closed — won",
    "closed_lost": "Closed — lost",
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL,
    instagram_handle TEXT,
    tiktok_handle TEXT,
    email TEXT,
    website TEXT,
    niche TEXT,
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'not_contacted',
    last_contacted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
"""

DEFAULT_SETTINGS = {
    "creator_name": "",
    "portfolio_link": "",
    "niches": "",
    "rate_info": "starting at $X per video",
    "follow_up_days": "5",
    "email_subject_template": "UGC content for {brand_name}?",
    "email_body_template": (
        "Hi {brand_name} team,\n\n"
        "I'm {creator_name}, a UGC creator making short-form video content "
        "(TikTok/Instagram/Reels) for {niche} brands.\n\n"
        "I'd love to create a video for {brand_name} — happy to send examples "
        "from my portfolio: {portfolio_link}\n\n"
        "My rates {rate_info}. Let me know if you'd be interested and I'll put "
        "together some concept ideas tailored to your brand.\n\n"
        "Best,\n{creator_name}"
    ),
    "dm_template": (
        "Hi {brand_name}! I'm {creator_name}, a UGC creator ({niche}). "
        "I'd love to make a TikTok/Reel for you — portfolio: {portfolio_link}. "
        "Interested? 🙂"
    ),
}


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript(SCHEMA)
        existing = {row["key"] for row in conn.execute("SELECT key FROM settings")}
        for key, value in DEFAULT_SETTINGS.items():
            if key not in existing:
                conn.execute("INSERT INTO settings (key, value) VALUES (?, ?)", (key, value))


def get_settings():
    with get_db() as conn:
        rows = conn.execute("SELECT key, value FROM settings").fetchall()
    settings = {row["key"]: row["value"] for row in rows}
    for key, default in DEFAULT_SETTINGS.items():
        settings.setdefault(key, default)
    return settings


def save_settings(values: dict):
    with get_db() as conn:
        for key, value in values.items():
            conn.execute(
                "INSERT INTO settings (key, value) VALUES (?, ?) "
                "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                (key, value),
            )


def list_contacts(status_filter=None):
    query = "SELECT * FROM contacts"
    params = ()
    if status_filter:
        query += " WHERE status = ?"
        params = (status_filter,)
    query += " ORDER BY created_at DESC"
    with get_db() as conn:
        return conn.execute(query, params).fetchall()


def get_contact(contact_id):
    with get_db() as conn:
        return conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()


def add_contact(data: dict):
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO contacts
               (brand_name, instagram_handle, tiktok_handle, email, website, niche, notes)
               VALUES (:brand_name, :instagram_handle, :tiktok_handle, :email, :website, :niche, :notes)""",
            data,
        )
        return cur.lastrowid


def update_contact_status(contact_id, status, touch_last_contacted=False):
    with get_db() as conn:
        if touch_last_contacted:
            conn.execute(
                "UPDATE contacts SET status = ?, last_contacted_at = datetime('now') WHERE id = ?",
                (status, contact_id),
            )
        else:
            conn.execute("UPDATE contacts SET status = ? WHERE id = ?", (status, contact_id))


def update_contact_notes(contact_id, notes):
    with get_db() as conn:
        conn.execute("UPDATE contacts SET notes = ? WHERE id = ?", (notes, contact_id))


def delete_contact(contact_id):
    with get_db() as conn:
        conn.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
