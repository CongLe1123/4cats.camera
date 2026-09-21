import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const CustomImageExtension = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
      },
      align: {
        default: "center",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-image-block]",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          const caption = element.querySelector("figcaption");
          return {
            src: img?.getAttribute("src") || null,
            alt: img?.getAttribute("alt") || "",
            caption: caption?.textContent || "",
            align: element.getAttribute("data-align") || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          alt: element.getAttribute("alt") || "",
          caption: element.getAttribute("data-caption") || "",
          align: element.getAttribute("data-align") || "center",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption, align } = HTMLAttributes;

    const alignClass =
      align === "left"
        ? "text-left mr-auto"
        : align === "right"
          ? "text-right ml-auto"
          : "text-center mx-auto";

    const figureAttrs = {
      "data-image-block": "true",
      "data-align": align || "center",
      class: `camera-article-image my-6 ${alignClass}`,
    };

    const imgAttrs = mergeAttributes(HTMLAttributes, {
      src,
      alt: alt || caption || "Hình ảnh sản phẩm 4cats Camera",
      class:
        "rounded-2xl max-w-full h-auto object-contain mx-auto shadow-sm border border-black/5 hover:shadow-md transition-shadow",
    });

    if (caption && caption.trim()) {
      return [
        "figure",
        figureAttrs,
        ["img", imgAttrs],
        [
          "figcaption",
          {
            class:
              "text-xs text-center text-muted-foreground mt-2 font-medium tracking-wide italic",
          },
          caption,
        ],
      ];
    }

    return ["figure", figureAttrs, ["img", imgAttrs]];
  },
});
