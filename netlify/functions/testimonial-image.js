const { getBlobStore } = require("./_blob-store");

// Streams a single cached testimonial screenshot back to the browser.
exports.handler = async (event) => {
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: "missing id" };

  const imagesStore = getBlobStore("testimonial-shot-images");
  const result = await imagesStore.getWithMetadata(id, { type: "arrayBuffer" });
  if (!result) return { statusCode: 404, body: "not found" };

  return {
    statusCode: 200,
    headers: {
      "content-type": result.metadata?.contentType || "image/jpeg",
      "cache-control": "public, max-age=86400, immutable",
    },
    body: Buffer.from(result.data).toString("base64"),
    isBase64Encoded: true,
  };
};
