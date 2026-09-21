import { Node, mergeAttributes } from "@tiptap/core";

export const CustomVideoExtension = Node.create({
  name: "customVideo",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      caption: {
        default: "",
      },
      controls: {
        default: true,
      },
      preload: {
        default: "metadata",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-video-block]",
        getAttrs: (element) => {
          const video = element.querySelector("video");
          const caption = element.querySelector("figcaption");
          return {
            src: video?.getAttribute("src") || null,
            caption: caption?.textContent || "",
          };
        },
      },
      {
        tag: "video[src]",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          caption: element.getAttribute("data-caption") || "",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, caption } = HTMLAttributes;

    const figureAttrs = {
      "data-video-block": "true",
      class: "camera-article-video my-6 text-center",
    };

    const videoAttrs = mergeAttributes(HTMLAttributes, {
      src,
      controls: "true",
      preload: "metadata",
      playsinline: "true",
      class: "w-full rounded-2xl max-h-[520px] bg-black shadow-md mx-auto aspect-video",
    });

    if (caption && caption.trim()) {
      return [
        "figure",
        figureAttrs,
        ["video", videoAttrs],
        [
          "figcaption",
          {
            class:
              "text-xs text-center text-muted-foreground mt-2 font-medium tracking-wide",
          },
          caption,
        ],
      ];
    }

    return ["figure", figureAttrs, ["video", videoAttrs]];
  },

  addCommands() {
    return {
      setCustomVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
