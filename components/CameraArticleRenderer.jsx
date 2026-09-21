"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

export default function CameraArticleRenderer({ content, className = "" }) {
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";

    // 1. If content is legacy block array
    if (Array.isArray(content)) {
      if (content.length === 0) return "";
      const htmlParts = content.map((block) => {
        if (!block) return "";
        if (block.type === "text" && block.value) {
          return `<p class="leading-relaxed text-foreground/90 my-4 text-sm md:text-base">${escapeHtml(block.value)}</p>`;
        }
        if (block.type === "image" && block.value) {
          return `
            <figure class="camera-article-image my-6 text-center" data-image-block="true">
              <img src="${escapeHtml(block.value)}" alt="${escapeHtml(block.caption || 'Hình ảnh sản phẩm')}" class="rounded-2xl max-w-full h-auto mx-auto shadow-sm border border-black/5" loading="lazy" />
              ${block.caption ? `<figcaption class="text-xs text-center text-muted-foreground mt-2 font-medium tracking-wide italic">${escapeHtml(block.caption)}</figcaption>` : ""}
            </figure>
          `;
        }
        if (block.type === "video" && block.value) {
          return `
            <figure class="camera-article-video my-6 text-center" data-video-block="true">
              <video src="${escapeHtml(block.value)}" controls preload="metadata" playsinline class="w-full rounded-2xl max-h-[520px] bg-black shadow-md mx-auto aspect-video"></video>
              ${block.caption ? `<figcaption class="text-xs text-center text-muted-foreground mt-2 font-medium tracking-wide">${escapeHtml(block.caption)}</figcaption>` : ""}
            </figure>
          `;
        }
        return "";
      });
      return htmlParts.join("");
    }

    // 2. If content is an HTML string
    if (typeof content === "string") {
      if (typeof window === "undefined") {
        // Simple SSR pass
        return content;
      }

      // Configure DOMPurify to only permit trusted YouTube iframes
      const clean = DOMPurify.sanitize(content, {
        ADD_TAGS: ["iframe", "video", "figure", "figcaption"],
        ADD_ATTR: [
          "allow",
          "allowfullscreen",
          "frameborder",
          "scrolling",
          "playsinline",
          "controls",
          "preload",
          "target",
          "data-*",
        ],
        FORCE_BODY: true,
      });

      // Extra safety check: sanitize iframe sources so only YouTube is allowed
      const parser = new DOMParser();
      const doc = parser.parseFromString(clean, "text/html");
      const iframes = doc.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";
        const isYouTube =
          src.startsWith("https://www.youtube.com/") ||
          src.startsWith("https://www.youtube-nocookie.com/") ||
          src.startsWith("https://youtube.com/");
        if (!isYouTube) {
          iframe.remove();
        } else {
          // Ensure responsive iframe styling
          iframe.classList.add(
            "w-full",
            "h-full",
            "rounded-2xl",
            "border-0",
          );
        }
      });

      return doc.body.innerHTML;
    }

    return "";
  }, [content]);

  if (!sanitizedHtml || !sanitizedHtml.trim()) {
    return null;
  }

  return (
    <article
      className={`camera-article-prose prose prose-pink max-w-none font-sans text-foreground/90 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
