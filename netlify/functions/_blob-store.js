const { getStore } = require("@netlify/blobs");

// Netlify's zero-config Blobs context (auto-injected siteID/token) isn't
// available for every account/deploy setup. Falling back to explicit
// credentials (BLOBS_SITE_ID + BLOBS_TOKEN env vars) makes this work
// regardless of that.
function getBlobStore(name) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

module.exports = { getBlobStore };
