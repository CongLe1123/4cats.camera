"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";

import { CustomImageExtension } from "../../lib/editor/CustomImageExtension";
import { CustomVideoExtension } from "../../lib/editor/CustomVideoExtension";
import MediaLibraryPickerModal from "./MediaLibraryPickerModal";
import CameraArticleRenderer from "../CameraArticleRenderer";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../lib/utils";
import { validateUploadFile, generateSafeFileName } from "../../lib/upload-utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video as VideoIcon,
  Youtube as YoutubeIcon,
  Maximize2,
  Minimize2,
  Eye,
  FileText,
  Upload,
  Plus,
  Loader2,
  Check,
  X,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

// Predefined Content Templates
const ARTICLE_TEMPLATES = {
  camera: `
<h2>Giới thiệu tổng quan</h2>
<p>Viết 1-2 đoạn ngắn gọn giới thiệu về chiếc máy ảnh: cảm xúc khi lần đầu cầm trên tay, đối tượng hướng đến và tại sao chiếc máy này lại được các bạn trẻ yêu thích...</p>

<h2>Điểm nổi bật không thể bỏ qua</h2>
<ul>
  <li><strong>Thiết kế & trọng lượng:</strong> Cực kỳ nhỏ gọn, dễ dàng bỏ túi mang đi cafe hoặc du lịch cả ngày.</li>
  <li><strong>Khả năng lấy nét tự động:</strong> Nhận diện mắt người và thú cưng siêu nhạy, không lo trượt nét.</li>
  <li><strong>Màn hình xoay lật đa hướng:</strong> Hỗ trợ selfie và quay vlog TikTok góc cao/thấp linh hoạt.</li>
  <li><strong>Tông màu JPEG trứ danh:</strong> Chụp xong có ảnh đẹp ngay để bắn qua điện thoại đăng Story.</li>
</ul>

<h2>Khả năng chụp ảnh thực tế</h2>
<p>Chia sẻ trải nghiệm chụp chân dung xóa phông, chụp phong cảnh hoặc chụp thiếu sáng...</p>

<h2>Khả năng quay video & sáng tạo nội dung</h2>
<p>Trải nghiệm quay video 4K sắc nét, khả năng thu âm của micro và chống rung khi vừa đi bộ vừa quay...</p>

<h2>Chiếc máy ảnh này dành cho ai?</h2>
<p>Tóm tắt nhóm người dùng phù hợp nhất: học sinh, sinh viên, người mới bắt đầu bước vào nhiếp ảnh hoặc các bạn sáng tạo nội dung...</p>
`,
  lens: `
<h2>Giới thiệu ống kính</h2>
<p>Giới thiệu tiêu cự, khẩu độ tối đa và lý do bạn nên sở hữu chiếc ống kính này cùng với thân máy...</p>

<h2>Chất lượng quang học & độ sắc nét</h2>
<ul>
  <li><strong>Độ nét tâm và rìa ảnh:</strong> Chi tiết sắc nét ngay từ khẩu độ lớn nhất.</li>
  <li><strong>Hiệu ứng xóa phông (Bokeh):</strong> Mịn màng, làm nổi bật chủ thể trong ảnh chân dung.</li>
  <li><strong>Mô-tơ lấy nét:</strong> Vận hành êm ái, thích hợp cho cả chụp ảnh tĩnh lẫn quay video.</li>
</ul>

<h2>Trải nghiệm sử dụng thực tế</h2>
<p>Nhận xét về cảm giác cầm nắm, vòng xoay lấy nét và độ tiện dụng khi mang theo hàng ngày...</p>
`,
  accessory: `
<h2>Thông tin sản phẩm</h2>
<p>Mô tả chi tiết công dụng, thông số kỹ thuật và khả năng tương thích của phụ kiện với các dòng máy ảnh...</p>

<h2>Tại sao bạn nên trang bị phụ kiện này?</h2>
<ul>
  <li>Đảm bảo an toàn và kéo dài tuổi thọ cho thiết bị máy ảnh.</li>
  <li>Tăng tính tiện dụng và độ chuyên nghiệp trong quá trình chụp ảnh/quay phim.</li>
  <li>Bảo hành chính hãng 12 tháng tại 4cats Camera.</li>
</ul>
`,
};

export default function RichContentEditor({
  value = "",
  onChange,
  placeholder = "Bắt đầu viết bài đánh giá/mô tả camera ở đây như trong Google Docs...",
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Modals state
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCaption, setVideoCaption] = useState("");

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Normalize initial value (support string HTML or legacy block array)
  const initialContent = typeof value === "string" ? value : "";

  // Setup Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        dropcursor: {
          color: "#f43f5e",
          width: 2,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary font-bold underline hover:text-primary/80 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CustomImageExtension,
      CustomVideoExtension,
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-2xl shadow-md my-6 mx-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[520px] max-w-none text-foreground/90 font-sans focus:outline-none p-6 md:p-10",
      },
      // Handle drag & drop of images
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            event.preventDefault();
            handleDirectImageUpload(file);
            return true;
          }
        }
        return false;
      },
      // Handle paste of images from clipboard
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
              const file = item.getAsFile();
              if (file) {
                event.preventDefault();
                handleDirectImageUpload(file);
                return true;
              }
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Sync content if value changes externally (and editor is empty or distinct)
  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      // Only set if editor is not focused to prevent cursor jumping
      if (!editor.isFocused && (editor.isEmpty || Math.abs(editor.getHTML().length - value.length) > 20)) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  // Handle Fullscreen ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Direct upload for drag-and-drop & paste
  const handleDirectImageUpload = async (file) => {
    const validation = validateUploadFile(file, "image");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgressText("Đang nén và tải ảnh lên...");

    try {
      const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.82 });
      const safeName = generateSafeFileName(file.name, "article-img");

      const { data, error } = await supabase.storage
        .from("products")
        .upload(safeName, compressed, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(safeName);

      editor
        ?.chain()
        .focus()
        .setImage({ src: publicUrl, alt: file.name.replace(/\.[^/.]+$/, "") })
        .run();

      toast.success("Đã chèn ảnh vào bài viết! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải ảnh: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  // Image Upload Dialog submission
  const handleConfirmImageInsert = async () => {
    if (imageUrl) {
      editor
        ?.chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: imageAlt || imageCaption || "",
          caption: imageCaption || "",
        })
        .run();
      setIsImageDialogOpen(false);
      setImageUrl("");
      setImageCaption("");
      setImageAlt("");
      toast.success("Đã chèn ảnh! ✨");
    }
  };

  const handleImageFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, "image");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgressText("Đang tải ảnh lên máy chủ...");

    try {
      const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.82 });
      const safeName = generateSafeFileName(file.name, "article-img");

      const { error } = await supabase.storage
        .from("products")
        .upload(safeName, compressed, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(safeName);

      setImageUrl(publicUrl);
      if (!imageCaption) {
        setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
      }
      toast.success("Tải ảnh lên thành công! Bạn có thể thêm chú thích trước khi chèn.");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải ảnh: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  // YouTube Dialog submission
  const handleConfirmYoutubeInsert = () => {
    if (!youtubeUrl.trim()) {
      toast.error("Vui lòng nhập đường dẫn video YouTube.");
      return;
    }

    // Match normal, youtu.be, shorts, and embed URLs
    const match = youtubeUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
    );

    if (!match || !match[1]) {
      toast.error(
        "Đường dẫn YouTube không hợp lệ. Vui lòng nhập link dạng: https://youtube.com/watch?v=... hoặc https://youtu.be/...",
      );
      return;
    }

    const videoId = match[1];
    editor
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: `https://www.youtube.com/watch?v=${videoId}`,
      })
      .run();

    setIsYoutubeDialogOpen(false);
    setYoutubeUrl("");
    toast.success("Đã chèn video YouTube vào bài viết! 🎬");
  };

  // Video Upload Dialog submission
  const handleVideoFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, "video");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgressText("Đang tải video lên máy chủ (tối đa 30 MB)...");

    try {
      const safeName = generateSafeFileName(file.name, "article-video");

      const { error } = await supabase.storage
        .from("products")
        .upload(safeName, file, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(safeName);

      setVideoUrl(publicUrl);
      if (!videoCaption) {
        videoCaption || setVideoCaption("Video đánh giá sản phẩm");
      }
      toast.success("Tải video lên thành công! Bạn có thể bấm chèn ngay.");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải video: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  const handleConfirmVideoInsert = () => {
    if (!videoUrl.trim()) {
      toast.error("Vui lòng tải video hoặc nhập link video.");
      return;
    }

    editor
      ?.chain()
      .focus()
      .setCustomVideo({
        src: videoUrl,
        caption: videoCaption,
      })
      .run();

    setIsVideoDialogOpen(false);
    setVideoUrl("");
    setVideoCaption("");
    toast.success("Đã chèn video vào bài viết! 🎥");
  };

  // Link Dialog submission
  const handleOpenLinkDialog = () => {
    const previousUrl = editor?.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("mailto:") && !formattedUrl.startsWith("tel:")) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  // Template insertion
  const handleApplyTemplate = (type) => {
    const templateHtml = ARTICLE_TEMPLATES[type];
    if (!templateHtml || !editor) return;

    editor.commands.setContent(templateHtml);
    if (onChange) {
      onChange(templateHtml);
    }
    setIsTemplateDialogOpen(false);
    toast.success("Đã áp dụng mẫu bài viết! ✨");
  };

  // Word count helper
  const wordCount = editor
    ? editor.state.doc.textContent.split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = editor ? editor.state.doc.textContent.length : 0;

  if (!editor) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground border rounded-3xl bg-muted/10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs">Đang khởi tạo trình soạn thảo Google Docs...</p>
      </div>
    );
  }

  // Heading Select Value
  const getHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  return (
    <div
      className={`rounded-3xl border border-primary/20 bg-muted/15 shadow-sm transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none bg-background flex flex-col h-screen overflow-hidden p-0"
          : "relative flex flex-col"
      }`}
    >
      {/* Uploading progress notification */}
      {isUploading && (
        <div className="bg-primary text-white text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 animate-pulse rounded-t-3xl">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{uploadProgressText || "Đang xử lý tập tin..."}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* GOOGLE DOCS TOOLBAR */}
      {/* ==================================================================== */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 p-2 sm:p-2.5 rounded-t-3xl flex flex-wrap items-center justify-between gap-1.5 shadow-xs">
        {/* Left Toolbar Items */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <div className="flex items-center border-r border-gray-200 pr-1.5 mr-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Làm lại (Ctrl+Shift+Z)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Style / Heading Select */}
          <Select
            value={getHeadingValue()}
            onValueChange={(val) => {
              if (val === "p") {
                editor.chain().focus().setParagraph().run();
              } else if (val === "h1") {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else if (val === "h2") {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } else if (val === "h3") {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }
            }}
          >
            <SelectTrigger className="h-8 w-32 text-xs font-bold rounded-lg border-gray-200 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p" className="text-xs font-normal">
                Văn bản thường
              </SelectItem>
              <SelectItem value="h1" className="text-sm font-black">
                Tiêu đề lớn (H1)
              </SelectItem>
              <SelectItem value="h2" className="text-xs font-bold text-primary">
                Tiêu đề vừa (H2)
              </SelectItem>
              <SelectItem value="h3" className="text-xs font-semibold">
                Tiêu đề nhỏ (H3)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Inline Text Formatting: B, I, U, S */}
          <div className="flex items-center border-l border-r border-gray-200 px-1 mx-0.5">
            <Button
              type="button"
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("bold") ? "bg-primary/15 text-primary font-black" : ""
              }`}
              title="In đậm (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("italic") ? "bg-primary/15 text-primary" : ""
              }`}
              title="In nghiêng (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("underline") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("underline") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Gạch chân (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("strike") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("strike") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Gạch ngang chữ"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-0.5">
            <Button
              type="button"
              variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className="h-8 w-8 rounded-lg"
              title="Căn lề trái"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className="h-8 w-8 rounded-lg"
              title="Căn giữa"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className="h-8 w-8 rounded-lg"
              title="Căn lề phải"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-0.5">
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("bulletList") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Danh sách dấu chấm"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("orderedList") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Danh sách số"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("blockquote") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Đoạn trích dẫn"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-8 w-8 rounded-lg"
              title="Đường kẻ phân cách"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {/* Link */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-0.5">
            <Button
              type="button"
              variant={editor.isActive("link") ? "secondary" : "ghost"}
              size="icon"
              onClick={handleOpenLinkDialog}
              className={`h-8 w-8 rounded-lg ${
                editor.isActive("link") ? "bg-primary/15 text-primary" : ""
              }`}
              title="Chèn liên kết (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            {editor.isActive("link") && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="h-8 w-8 rounded-lg text-destructive"
                title="Hủy liên kết"
              >
                <Unlink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* MEDIA INSERTION MENU */}
          <div className="flex items-center gap-1">
            {/* Image Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImageDialogOpen(true)}
              className="h-8 rounded-lg text-xs font-bold border-pink-200 text-pink-600 hover:bg-pink-50 gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
              Ảnh
            </Button>

            {/* YouTube Action - CRITICAL */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsYoutubeDialogOpen(true)}
              className="h-8 rounded-lg text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
            >
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              YouTube
            </Button>

            {/* Video Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVideoDialogOpen(true)}
              className="h-8 rounded-lg text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 gap-1.5"
            >
              <VideoIcon className="w-3.5 h-3.5 text-blue-600" />
              Video
            </Button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1 mt-1 sm:mt-0">
          {/* Template Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsTemplateDialogOpen(true)}
            className="h-8 rounded-lg text-xs font-bold text-muted-foreground hover:text-primary gap-1"
            title="Sử dụng mẫu bài viết có sẵn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Mẫu bài viết</span>
          </Button>

          {/* Preview Toggle */}
          <Button
            type="button"
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="h-8 rounded-lg text-xs font-bold gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            {isPreviewMode ? "Quay lại soạn thảo" : "Xem trước"}
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            title={isFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* EDITOR CANVAS OR PREVIEW MODE */}
      {/* ==================================================================== */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/20 flex flex-col items-center">
        {isPreviewMode ? (
          /* Live Storefront Preview View */
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 md:p-12 shadow-md border border-gray-100 min-h-[500px]">
            <div className="border-b pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  Xem trước hiển thị trên trang sản phẩm
                </span>
                <h3 className="text-lg font-black text-foreground mt-2">
                  Đánh Giá & Chi Tiết Máy Ảnh 📸
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                className="text-xs rounded-xl"
              >
                Trở lại chỉnh sửa
              </Button>
            </div>

            <CameraArticleRenderer content={editor.getHTML()} />
          </div>
        ) : (
          /* Google Docs Document Area */
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-200/80 min-h-[550px] relative transition-shadow hover:shadow-md">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* FOOTER STATUS BAR */}
      {/* ==================================================================== */}
      <div className="bg-white/80 border-t border-gray-200/60 px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between rounded-b-3xl">
        <div className="flex items-center gap-3">
          <span>
            <strong>{wordCount}</strong> từ
          </span>
          <span>•</span>
          <span>
            <strong>{charCount}</strong> ký tự
          </span>
          <span>•</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> Sẵn sàng lưu
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-muted-foreground/70">
            Kéo thả ảnh hoặc dán (Ctrl+V) trực tiếp vào trang
          </span>
          {isFullscreen && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="h-6 text-[11px] text-primary"
            >
              Thoát toàn màn hình (Esc)
            </Button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DIALOGS */}
      {/* ==================================================================== */}

      {/* 1. YouTube Embed Dialog */}
      <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2 text-red-600">
              <YoutubeIcon className="w-5 h-5" />
              Chèn Video YouTube
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Dán link video YouTube để tự động tạo khung video 16:9 sắc nét, không cần copy mã iframe HTML
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="yt-url" className="text-xs font-bold">
                Đường dẫn YouTube *
              </Label>
              <Input
                id="yt-url"
                placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmYoutubeInsert();
                  }
                }}
                className="rounded-xl text-xs h-10 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Hỗ trợ cả link video dài, link rút gọn <code>youtu.be</code> và <code>shorts</code>.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsYoutubeDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleConfirmYoutubeInsert}
              className="rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
            >
              Chèn Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Image Insert Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2 text-primary">
              <ImageIcon className="w-5 h-5" />
              Chèn Hình Ảnh Vào Bài Viết
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tải ảnh chất lượng cao lên máy chủ, tự động tối ưu hóa và hiển thị sắc nét
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Direct File Upload Zone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">Tải ảnh từ thiết bị</Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsImageDialogOpen(false);
                    setIsMediaLibraryOpen(true);
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Chọn từ Thư viện Media ↗
                </button>
              </div>
              <label className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                <Upload className="w-8 h-8 text-primary mb-2" />
                <span className="text-xs font-bold text-foreground">
                  Bấm vào đây để chọn ảnh từ máy tính
                </span>
                <span className="text-[11px] text-muted-foreground mt-1">
                  Định dạng: JPG, PNG, WebP (Tối đa 5 MB)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageFileInputChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-1">
              <Label htmlFor="img-url-direct" className="text-xs font-bold">
                Hoặc dán đường dẫn ảnh trực tiếp (URL)
              </Label>
              <Input
                id="img-url-direct"
                placeholder="https://images.unsplash.com/... hoặc link ảnh online"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl text-xs h-9 font-mono"
              />
            </div>

            {/* Preview or URL */}
            {imageUrl && (
              <div className="space-y-1.5 p-3 bg-muted/40 rounded-2xl border">
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ảnh đã sẵn sàng
                </p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-36 object-contain rounded-xl mx-auto border"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="img-caption" className="text-xs font-bold">
                Chú thích ảnh (Hiển thị ngay dưới ảnh trên web)
              </Label>
              <Input
                id="img-caption"
                placeholder="Ví dụ: Canon EOS R50 kèm ống kính zoom RF-S 18-45mm"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="rounded-xl text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="img-alt" className="text-xs font-bold">
                Text mô tả ảnh (Hỗ trợ SEO và người dùng khiếm thị)
              </Label>
              <Input
                id="img-alt"
                placeholder="Mô tả ngắn gọn nội dung bức ảnh..."
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="rounded-xl text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsImageDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleConfirmImageInsert}
              disabled={!imageUrl}
              className="rounded-xl text-xs font-bold"
            >
              Chèn Vào Bài Viết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Normal Video Upload Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2 text-blue-600">
              <VideoIcon className="w-5 h-5" />
              Tải Lên Video Ngắn (MP4 / WebM)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Đăng video clip thực tế từ máy ảnh. Giới hạn dung lượng: <strong>30 MB</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Chọn tệp video từ máy tính</Label>
              <label className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-xs font-bold text-foreground">
                  Chọn video clip (MP4, WebM)
                </span>
                <span className="text-[11px] text-muted-foreground mt-1">
                  Dung lượng tối đa: 30 MB
                </span>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileInputChange}
                  className="hidden"
                />
              </label>
            </div>

            {videoUrl && (
              <div className="space-y-1.5 p-3 bg-muted/40 rounded-2xl border">
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Video đã tải lên thành công
                </p>
                <video
                  src={videoUrl}
                  controls
                  className="max-h-36 rounded-xl mx-auto w-full aspect-video bg-black"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="vid-caption" className="text-xs font-bold">
                Chú thích video
              </Label>
              <Input
                id="vid-caption"
                placeholder="Ví dụ: Clip test độ nhạy lấy nét Dual Pixel AF II"
                value={videoCaption}
                onChange={(e) => setVideoCaption(e.target.value)}
                className="rounded-xl text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsVideoDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleConfirmVideoInsert}
              disabled={!videoUrl}
              className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Chèn Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Chèn / Chỉnh Sửa Liên Kết
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-url-input" className="text-xs font-bold">
                Đường dẫn liên kết (URL)
              </Label>
              <Input
                id="link-url-input"
                placeholder="https://4catscamera.com/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmLink();
                  }
                }}
                className="rounded-xl text-xs h-9 font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLinkDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleConfirmLink}
              className="rounded-xl text-xs font-bold"
            >
              Lưu Liên Kết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Article Template Selector Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Chọn Mẫu Bài Viết Có Sẵn
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tiết kiệm thời gian với cấu trúc bài viết chuẩn hóa, dễ dàng điền nội dung và ảnh minh họa
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 py-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate("camera")}
              className="w-full text-left p-4 rounded-2xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer space-y-1 block"
            >
              <div className="font-black text-sm text-foreground flex items-center justify-between">
                <span>📸 Mẫu Đánh Giá Máy Ảnh Chi Tiết</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  Khuyên dùng
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bao gồm: Giới thiệu tổng quan, Điểm nổi bật, Khả năng chụp ảnh thực tế, Khả năng quay video & vlog, Đối tượng phù hợp.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleApplyTemplate("lens")}
              className="w-full text-left p-4 rounded-2xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer space-y-1 block"
            >
              <div className="font-bold text-sm text-foreground">
                🔍 Mẫu Giới Thiệu Ống Kính (Lens)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bao gồm: Tiêu cự & khẩu độ, Độ sắc nét & xóa phông, Trải nghiệm chụp thực tế.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleApplyTemplate("accessory")}
              className="w-full text-left p-4 rounded-2xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer space-y-1 block"
            >
              <div className="font-bold text-sm text-foreground">
                🎒 Mẫu Phụ Kiện Máy Ảnh (Pin, Túi, Thẻ Nhớ)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bao gồm: Thông số kỹ thuật phụ kiện, Tương thích và Lý do nên trang bị.
              </p>
            </button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsTemplateDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={(selectedUrl) => {
          setImageUrl(selectedUrl);
          setIsImageDialogOpen(true);
        }}
      />
    </div>
  );
}
