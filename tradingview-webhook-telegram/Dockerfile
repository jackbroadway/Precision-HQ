FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common.py monitor.py webhook_server.py ./

# Overridden by docker-compose.yml / `fly launch` process groups to run
# monitor.py instead in the second process. Default: the web service.
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8080", "webhook_server:app"]
