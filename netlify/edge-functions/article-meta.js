// Injects per-article Open Graph / Twitter tags so social cards work.
// Twitter's crawler doesn't run JS, so we rewrite the HTML at the edge.
// Scoped to /article.html only — it never runs on any other page.

const API = "https://oracle-api-7q4wz.ondigitalocean.app";
const SITE = "https://oraclebasketball.com";
const FALLBACK_IMAGE = SITE + "/assets/oracle-og.png";

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Turn the excerpt (or body) into a clean ~200 char description
function describe(a) {
  const raw = a.excerpt || a.body_markdown || "";
  const text = String(raw)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "Arizona high school basketball coverage from The Oracle.";
  return text.length > 200 ? text.slice(0, 197).trimEnd() + "…" : text;
}

// cover_image is a full Supabase storage URL; tolerate a relative path too
function coverImage(a) {
  const v = a.cover_image;
  if (v && typeof v === "string" && v.trim()) {
    const u = v.trim();
    return /^https?:\/\//i.test(u) ? u : SITE + (u.startsWith("/") ? u : "/" + u);
  }
  return FALLBACK_IMAGE;
}

export default async (request, context) => {
  const response = await context.next();

  const ctype = response.headers.get("content-type") || "";
  if (!ctype.includes("text/html")) return response;

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return response;

  let article;
  try {
    const res = await fetch(`${API}/article?slug=${encodeURIComponent(slug)}`, {
      headers: { accept: "application/json" }
    });
    if (!res.ok) return response;
    const json = await res.json();
    article = Array.isArray(json) ? json[0] : (json.article || json);
  } catch (_) {
    return response;
  }
  if (!article || typeof article !== "object") return response;

  const title = article.title || "The Oracle";
  const desc = describe(article);
  const image = coverImage(article);
  const url = `${SITE}/article.html?slug=${encodeURIComponent(slug)}`;
  const author = article.author || "";
  const published = article.published_at || article.created_at || "";

  const tags = `
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="The Oracle" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  ${author ? `<meta property="article:author" content="${esc(author)}" />` : ""}
  ${published ? `<meta property="article:published_time" content="${esc(published)}" />` : ""}
`;

  let html = await response.text();

  // Replace the static <title> so the card headline matches the article
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)} · The Oracle</title>`);

  // Insert our tags right after <head>
  html = html.replace(/<head([^>]*)>/i, (m) => m + tags);

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });
};

export const config = { path: "/article.html" };
