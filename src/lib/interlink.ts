import { getAllPosts } from "./content";

interface Hub {
  slug: string;
  title: string;
}

let hubMap: Map<string, Hub> | null = null;
let hubRegex: RegExp | null = null;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// One hub post per tag across the whole site — the most recent post
// carrying that tag becomes the link target, so topic clusters point at
// current authority rather than an arbitrary older post.
function buildHubIndex() {
  if (hubMap) return;
  hubMap = new Map();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const key = tag.trim().toLowerCase();
      if (key.length < 4) continue;
      if (!hubMap.has(key)) hubMap.set(key, { slug: post.slug, title: post.title });
    }
  }
  const phrases = [...hubMap.keys()].sort((a, b) => b.length - a.length);
  hubRegex = phrases.length
    ? new RegExp(`\\b(${phrases.map(escapeRegex).join("|")})\\b`, "gi")
    : null;
}

const MAX_AUTOLINKS = 4;

// Scans post body text for phrases that match another post's tags and
// links the first occurrence to that post — real interlinking driven by
// the site's own taxonomy, not a random related-posts widget.
export function autoLinkContent(markdown: string, currentSlug: string): string {
  buildHubIndex();
  if (!hubMap || !hubRegex) return markdown;
  const map = hubMap;
  const regex = hubRegex;

  let inCodeFence = false;
  let linksInserted = 0;
  const usedTargets = new Set<string>();

  const lines = markdown.split("\n").map((line) => {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      return line;
    }
    if (inCodeFence) return line;
    if (/^\s{0,3}#{1,6}\s/.test(line)) return line; // heading
    if (line.includes("](")) return line; // already links somewhere
    if (line.trim().length < 40) return line; // too short to be real prose
    if (linksInserted >= MAX_AUTOLINKS) return line;

    let replacedInLine = false;
    return line.replace(regex, (match) => {
      if (replacedInLine || linksInserted >= MAX_AUTOLINKS) return match;
      const hub = map.get(match.toLowerCase());
      if (!hub || hub.slug === currentSlug || usedTargets.has(hub.slug)) return match;
      usedTargets.add(hub.slug);
      linksInserted++;
      replacedInLine = true;
      return `[${match}](/${hub.slug})`;
    });
  });

  return lines.join("\n");
}
