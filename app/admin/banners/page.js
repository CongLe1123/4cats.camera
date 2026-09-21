"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  adminGetBanners,
  adminSaveBanner,
  adminDeleteBanner
} from "../../../lib/adminApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Upload,
  X,
  ImageIcon,
  Calendar,
  Eye,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { compressImage } from "../../../lib/utils";
import { validateUploadFile, generateSafeFileName } from "../../../lib/upload-utils";
import { toast } from "sonner";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop | mobile

  // Form State
  const [formData, setFormData] = useState({
    internal_name: "",
    image: "",
    mobile_image: "",
    title: "",
    description: "",
    cta_text: "Xem ưu đãi ngay",
    link: "/may-anh/canon-eos-r50",
    start_at: "",
    end_at: "",
    display_order: 1,
    is_active: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await adminGetBanners();
      setBanners(data);
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi tải danh sách banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e, type = "desktop") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, "image");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const compressed = await compressImage(file, {
        maxWidth: type === "desktop" ? 1920 : 900,
        quality: 0.8,
      });

      if (type === "desktop") {
        setImageFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } else {
        setMobileImageFile(compressed);
        setMobilePreviewUrl(URL.createObjectURL(compressed));
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể xử lý ảnh.");
    }
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      toast.warning("Vui lòng nhập tiêu đề banner.");
      return;
    }

    setIsUploading(true);
    let finalImageUrl = formData.image;
    let finalMobileImageUrl = formData.mobile_image || formData.image;

    try {
      // 1. Upload Desktop Image
      if (imageFile) {
        const fileName = generateSafeFileName(imageFile.name, "banner-desk");
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      // 2. Upload Mobile Image
      if (mobileImageFile) {
        const fileName = generateSafeFileName(mobileImageFile.name, "banner-mobile");
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, mobileImageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        finalMobileImageUrl = publicUrl;
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
        mobile_image: finalMobileImageUrl || finalImageUrl,
        id: editingBanner?.id
      };

      await adminSaveBanner(payload);
      toast.success(editingBanner ? "Cập nhật banner thành công! ✨" : "Thêm banner mới thành công! ✨");
      setOpen(false);
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      toast.error("Lỗi khi lưu: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!confirm(`Bạn có chắc muốn xóa banner "${banner.title}"?`)) return;
    try {
      await adminDeleteBanner(banner.id);
      toast.success("Đã xóa banner!");
      await fetchBanners();
    } catch (e) {
      toast.error("Lỗi khi xóa: " + e.message);
    }
  };

  const openEdit = (b) => {
    setEditingBanner(b);
    setFormData({
      internal_name: b.internal_name || b.title,
      image: b.image || "",
      mobile_image: b.mobile_image || b.image || "",
      title: b.title || "",
      description: b.description || "",
      cta_text: b.cta_text || "Xem ưu đãi ngay",
      link: b.link || "/shop",
      start_at: b.start_at ? b.start_at.slice(0, 16) : "",
      end_at: b.end_at ? b.end_at.slice(0, 16) : "",
      display_order: b.display_order || 1,
      is_active: b.is_active !== false
    });
    setPreviewUrl("");
    setMobilePreviewUrl("");
    setImageFile(null);
    setMobileImageFile(null);
    setOpen(true);
  };

  const openNew = () => {
    setEditingBanner(null);
    setFormData({
      internal_name: "",
      image: "",
      mobile_image: "",
      title: "",
      description: "",
      cta_text: "Xem ưu đãi ngay",
      link: "/may-anh/canon-eos-r50",
      start_at: "",
      end_at: "",
      display_order: banners.length + 1,
      is_active: true
    });
    setPreviewUrl("");
    setMobilePreviewUrl("");
    setImageFile(null);
    setMobileImageFile(null);
    setOpen(true);
  };

  const getStatusBadge = (calculatedStatus) => {
    switch (calculatedStatus) {
      case "active":
        return <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Đang hiển thị</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-600 text-white text-[10px] font-bold">Đã lên lịch</Badge>;
      case "expired":
        return <Badge variant="outline" className="text-muted-foreground text-[10px] font-bold">Hết hạn</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-bold">Bản nháp</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Promotion Carousel Banners 🎠
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý banner quảng cáo trang chủ với tính năng hẹn giờ tự động và ảnh riêng cho mobile
          </p>
        </div>

        <Button onClick={openNew} className="rounded-xl text-xs font-bold h-9">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm banner mới
        </Button>
      </div>

      {/* Banner Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <Card key={b.id} className="rounded-3xl border shadow-xs overflow-hidden group">
              <div className="aspect-[16/9] relative bg-muted overflow-hidden">
                {b.image && (
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(b.calculatedStatus)}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEdit(b)}
                    className="h-8 text-xs font-bold rounded-xl shadow-md bg-white/90 backdrop-blur-xs"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(b)}
                    className="h-8 w-8 rounded-xl shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Simulated Caption Preview */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <p className="text-xs font-bold text-primary-foreground tracking-wider uppercase">Thứ tự: #{b.display_order}</p>
                  <h3 className="text-sm sm:text-base font-black leading-tight line-clamp-1">{b.title}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{b.description}</p>
                </div>
              </div>

              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Nút CTA: <strong className="text-foreground">{b.cta_text}</strong></span>
                  <span>Link: <code className="text-primary">{b.link}</code></span>
                </div>

                {(b.start_at || b.end_at) && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1 border-t">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>
                      {b.start_at ? new Date(b.start_at).toLocaleDateString("vi-VN") : "Bắt đầu"} → {b.end_at ? new Date(b.end_at).toLocaleDateString("vi-VN") : "Vô thời hạn"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Banner Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center justify-between pr-6">
              <span>{editingBanner ? "Chỉnh Sửa Banner" : "Thêm Banner Mới"}</span>
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                    previewMode === "desktop" ? "bg-white text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                    previewMode === "mobile" ? "bg-white text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Thiết lập nội dung và xem trước trực tiếp trên Desktop và Mobile trước khi lưu
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 text-xs">
            {/* Left Column: Media & Live Preview */}
            <div className="space-y-4">
              <Label className="text-xs font-bold">Xem trước hiển thị ({previewMode.toUpperCase()})</Label>

              {/* Simulated Live Preview Box */}
              <div
                className={`relative rounded-2xl overflow-hidden border bg-black/90 shadow-md mx-auto transition-all ${
                  previewMode === "mobile" ? "w-64 aspect-[9/16]" : "w-full aspect-[16/9]"
                }`}
              >
                <img
                  src={
                    previewMode === "mobile"
                      ? mobilePreviewUrl || formData.mobile_image || previewUrl || formData.image || "/favicon.ico"
                      : previewUrl || formData.image || "/favicon.ico"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                    4cats Ưu Đãi
                  </span>
                  <h4 className="font-black text-sm sm:text-base leading-tight">
                    {formData.title || "Tiêu đề banner"}
                  </h4>
                  <p className="text-[11px] text-white/80 line-clamp-2">
                    {formData.description || "Mô tả ưu đãi..."}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-xl bg-primary text-white text-[11px] font-bold">
                      {formData.cta_text || "Xem ngay"} →
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload controls */}
              <div className="space-y-2 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Ảnh Desktop (1920x1080 khuyến nghị)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "desktop")}
                    className="h-9 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Hoặc dán URL ảnh desktop..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="h-8 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <Label className="text-xs font-bold">Ảnh Mobile (Tùy chọn, 800x1200 hoặc vuông)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "mobile")}
                    className="h-9 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Hoặc dán URL ảnh mobile..."
                    value={formData.mobile_image}
                    onChange={(e) => setFormData({ ...formData, mobile_image: e.target.value })}
                    className="h-8 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Form Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tên nội bộ banner</Label>
                <Input
                  placeholder="ví dụ: Canon R50 Khuyến Mãi Tháng 9"
                  value={formData.internal_name}
                  onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Tiêu đề lớn xuất hiện trên banner *</Label>
                <Input
                  placeholder="ví dụ: ƯU ĐÃI CANON EOS R50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-9 text-xs rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Mô tả ngắn</Label>
                <Input
                  placeholder="Giảm ngay 1.500.000đ kèm quà tặng thẻ nhớ 64GB..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Nút kêu gọi (CTA Text)</Label>
                  <Input
                    placeholder="Xem ưu đãi ngay"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Link điều hướng khi bấm</Label>
                  <Input
                    placeholder="/may-anh/canon-eos-r50"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Bắt đầu hiển thị (Hẹn giờ)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Kết thúc hiển thị</Label>
                  <Input
                    type="datetime-local"
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Thứ tự hiển thị (1, 2, 3...)</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) || 1 })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border self-end h-9">
                  <Label className="text-xs font-bold">Bật hiển thị</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUploading}
              className="rounded-xl text-xs font-bold min-w-28"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Lưu Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
