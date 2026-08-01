const SITE_URL = "https://blog.rudrakasturi.com";

// Table-based layout, inline styles only — matches the site's visual
// language (mono eyebrow label, bordered cards, ink/accent palette) as
// closely as email clients' patchy CSS support allows.
export function renderEmailShell(opts: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  return `
<div style="background:#faf9f7;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e1da;border-radius:12px;padding:32px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
      <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:999px;background:#1c1917;color:#faf9f7;font-family:Georgia,serif;font-weight:bold;font-size:14px;">R</span>
      <span style="font-family:Georgia,serif;font-size:16px;font-weight:bold;">Rudra Kasturi</span>
    </div>

    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a3324;margin:0 0 8px;">
      ${opts.eyebrow}
    </p>
    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:bold;margin:0 0 16px;line-height:1.3;">
      ${opts.heading}
    </h1>

    <div style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#3a3733;">
      ${opts.bodyHtml}
    </div>

    <p style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e1da;font-family:Arial,sans-serif;font-size:11px;color:#8a8580;">
      Sent from <a href="${SITE_URL}" style="color:#8a8580;">blog.rudrakasturi.com</a> ·
      <a href="${opts.unsubscribeUrl}" style="color:#8a8580;">Unsubscribe</a>
    </p>
  </div>
</div>`.trim();
}

export function relatedReadsHtml(posts: { slug: string; title: string }[]): string {
  if (posts.length === 0) return "";
  const items = posts
    .map(
      (p) =>
        `<li style="margin-bottom:8px;"><a href="${SITE_URL}/${p.slug}" style="color:#1c1917;text-decoration:underline;">${p.title}</a></li>`
    )
    .join("");
  return `
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8a8580;margin:24px 0 8px;">
      Related reads
    </p>
    <ul style="margin:0;padding-left:18px;">${items}</ul>
  `;
}
