const { getBlobStore } = require("./_blob-store");

// Returns the list of cached testimonial screenshots (newest first) for the
// homepage scroller to render. Each entry points back to
// testimonial-image.js rather than embedding the image itself.
exports.handler = async () => {
  const indexStore = getBlobStore("testimonial-shots");
  const list = (await indexStore.get("index", { type: "json" })) || [];

  const items = list.map((entry) => ({
    ...entry,
    // Truncate to first word only, even for entries cached before the
    // webhook started doing this itself - never show a member's full name
    // next to their financial results.
    name: (entry.name || "").trim().split(/\s+/)[0] || "",
    url: `/.netlify/functions/testimonial-image?id=${encodeURIComponent(entry.id)}`,
  }));

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=60",
    },
    body: JSON.stringify(items),
  };
};
