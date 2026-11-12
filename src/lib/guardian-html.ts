import sanitizeHtml from "sanitize-html";

/** Keep editorial markup without allowing executable third-party HTML. */
export function sanitizeGuardianHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "video",
      "audio",
      "source",
    ],
    allowedAttributes: {
      "*": ["id", "lang"],
      a: ["href", "title"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
      video: ["src", "poster", "controls", "width", "height"],
      audio: ["src", "controls"],
      source: ["src", "type"],
      time: ["datetime"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["https", "http"],
      video: ["https", "http"],
      audio: ["https", "http"],
      source: ["https", "http"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href?.startsWith("/") && !attribs.href.startsWith("//")
            ? { href: new URL(attribs.href, "https://www.theguardian.com").href }
            : {}),
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy", decoding: "async" },
      }),
    },
  });
}
