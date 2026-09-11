const { getStore } = require("@netlify/blobs");

const MAX_ENTRIES = 30;

// Receives Telegram's webhook updates from the testimonials group. Every
// photo posted there gets pulled down and cached in Netlify Blobs so the
// site's live scroller can serve it without hitting Telegram on every
// visitor request (Telegram's own file URLs expire).
exports.handler = async (event) => {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    expectedSecret &&
    event.headers["x-telegram-bot-api-secret-token"] !== expectedSecret
  ) {
    return { statusCode: 401, body: "unauthorized" };
  }

  let update;
  try {
    update = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "bad request" };
  }

  const message = update.message || update.channel_post;
  if (!message || !message.photo || message.photo.length === 0) {
    return { statusCode: 200, body: "ignored" };
  }

  const allowedChatId = process.env.TELEGRAM_GROUP_ID;
  if (allowedChatId && String(message.chat.id) !== String(allowedChatId)) {
    return { statusCode: 200, body: "ignored (wrong chat)" };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return { statusCode: 500, body: "bot token not configured" };
  }

  // Telegram sends the same photo at several resolutions; the last is largest.
  const largestPhoto = message.photo[message.photo.length - 1];

  const fileInfoRes = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`
  );
  const fileInfo = await fileInfoRes.json();
  if (!fileInfo.ok) {
    return { statusCode: 502, body: "failed to resolve file" };
  }

  const fileRes = await fetch(
    `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`
  );
  const imageBuffer = Buffer.from(await fileRes.arrayBuffer());

  const id = `${message.message_id}-${message.date}`;
  const imagesStore = getStore("testimonial-shot-images");
  await imagesStore.set(id, imageBuffer, {
    metadata: { contentType: "image/jpeg" },
  });

  const indexStore = getStore("testimonial-shots");
  const existing = (await indexStore.get("index", { type: "json" })) || [];
  const withoutDuplicate = existing.filter((entry) => entry.id !== id);
  const entry = { id, caption: message.caption || "", date: message.date * 1000 };
  const updatedList = [entry, ...withoutDuplicate].slice(0, MAX_ENTRIES);
  await indexStore.setJSON("index", updatedList);

  return { statusCode: 200, body: "ok" };
};
