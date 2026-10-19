# Precision-HQ

## economic-digest-telegram

A standalone script that posts a daily high/medium impact economic calendar
digest into a Telegram topic. See [economic-digest-telegram/README.md](economic-digest-telegram/README.md)
for setup instructions.

## tradingview-webhook-telegram

A webhook receiver for TradingView Pine Script alerts. Auto-calculates
SL/TP levels from the entry price, posts a formatted trade signal to
Telegram, and monitors the position to auto-update Telegram when each
TP or SL is hit. See [tradingview-webhook-telegram/README.md](tradingview-webhook-telegram/README.md)
for setup and deployment instructions.