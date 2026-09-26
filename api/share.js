// api/share.js — Vercel serverless function
// Serves OG meta tags per hamper so WhatsApp (and other crawlers) show
// the hamper image and name in link previews. Also redirects real users
// to the catalog panel via hampers.html?open=<slug>.

const path = require('path');
const fs   = require('fs');

const SITE = 'https://www.hampleegifting.com';

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function loadHampers() {
  const dataPath = path.join(process.cwd(), 'data', 'hampers.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.hampers || [];
}

module.exports = (req, res) => {
  const openParam = (req.query.open || '').trim();

  // If no param, redirect to hampers page
  if (!openParam) {
    res.writeHead(302, { Location: `${SITE}/hampers.html` });
    return res.end();
  }

  let hamper = null;
  try {
    const hampers = loadHampers();
    hamper = hampers.find(h => toSlug(h.name) === openParam)
           || hampers.find(h => h.id === openParam);
  } catch (e) {
    // data load failed — just redirect
  }

  const targetUrl = `${SITE}/hampers.html?open=${encodeURIComponent(openParam)}`;

  if (!hamper) {
    res.writeHead(302, { Location: targetUrl });
    return res.end();
  }

  // Use 1200-wide JPEG for OG (good balance of quality and size)
  const imageUrl = `${SITE}/${hamper.image.replace(/\.(png|jpe?g)$/i, '-1200.jpg')}`;
  const title       = escapeHtml(`${hamper.name} — Hamplee Luxury Gifting`);
  const description = escapeHtml(hamper.tagline || hamper.description || 'Luxury curated hampers for corporate and personal gifting.');
  const safeTarget  = escapeHtml(targetUrl);
  const safeImage   = escapeHtml(imageUrl);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>

  <!-- Open Graph — WhatsApp, Facebook, LinkedIn previews -->
  <meta property="og:type"               content="website">
  <meta property="og:site_name"          content="Hamplee Luxury Gifting">
  <meta property="og:title"              content="${title}">
  <meta property="og:description"        content="${description}">
  <meta property="og:image"             content="${safeImage}">
  <meta property="og:image:width"        content="1200">
  <meta property="og:image:height"       content="900">
  <meta property="og:url"               content="${safeTarget}">

  <!-- Twitter / X card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${safeImage}">

  <!-- Redirect real users to the catalog immediately -->
  <meta http-equiv="refresh" content="0;url=${safeTarget}">
  <link rel="canonical" href="${safeTarget}">
</head>
<body>
  <p style="font-family:sans-serif;padding:24px">
    Redirecting to <a href="${safeTarget}">Hamplee — ${escapeHtml(hamper.name)}</a>…
  </p>
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache for 1 hour — crawlers re-fetch infrequently anyway
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
};
