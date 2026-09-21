"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  Package,
  MapPin,
  Check,
  X,
  Phone,
  HelpCircle,
  Clock,
  Heart
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { STORE_POLICIES } from "../lib/productData";

export default function ModelDetailView({
  model,
  storeSettings = null
}) {
  const policies = STORE_POLICIES;

  // Variants list from model
  const variants = useMemo(() => model?.variants || [], [model]);

  // Selected variant state (default to first in-stock variant or first variant)
  const [selectedVariantId, setSelectedVariantId] = useState(() => {
    if (variants.length > 0) {
      const inStock = variants.find((v) => v.stock_quantity > 0 || v.is_in_stock);
      return inStock?.id || variants[0].id;
    }
    return null;
  });

  const selectedVariant = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId) || variants[0] || null;
  }, [variants, selectedVariantId]);

  // Color & Kit options derived from variants
  const kitOptions = useMemo(() => {
    const map = new Map();
    variants.forEach((v) => {
      if (!map.has(v.kit_type)) {
        map.set(v.kit_type, {
          kit_type: v.kit_type,
          kit_label: v.kit_label || v.kit_type,
          included_lens: v.included_lens,
          configuration_note: v.configuration_note
        });
      }
    });
    return Array.from(map.values());
  }, [variants]);

  const colorOptions = useMemo(() => {
    const map = new Map();
    variants.forEach((v) => {
      if (!map.has(v.color)) {
        map.set(v.color, {
          color: v.color,
          color_label: v.color_label || v.color,
          color_hex: v.color_hex || "#1F2937"
        });
      }
    });
    return Array.from(map.values());
  }, [variants]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  // Gallery Images
  const galleryImages = useMemo(() => {
    if (model?.official_images && model.official_images.length > 0) {
      return model.official_images;
    }
    if (model?.main_image || model?.image) {
      return [model.main_image || model.image];
    }
    return ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"];
  }, [model]);

  // Format currency
  const formatVND = (num) => {
    if (!num) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Switch kit type while preserving color if available
  const handleSelectKit = (kitType) => {
    const currentColor = selectedVariant?.color;
    const match = variants.find(
      (v) => v.kit_type === kitType && v.color === currentColor
    );
    if (match) {
      setSelectedVariantId(match.id);
    } else {
      const fallback = variants.find((v) => v.kit_type === kitType);
      if (fallback) setSelectedVariantId(fallback.id);
    }
  };

  // Switch color while preserving kit type if available
  const handleSelectColor = (color) => {
    const currentKit = selectedVariant?.kit_type;
    const match = variants.find(
      (v) => v.color === color && v.kit_type === currentKit
    );
    if (match) {
      setSelectedVariantId(match.id);
    } else {
      const fallback = variants.find((v) => v.color === color);
      if (fallback) setSelectedVariantId(fallback.id);
    }
  };

  // Current price and discount calculations
  const currentPrice = selectedVariant?.price || model.minPrice || model.price || 0;
  const comparePrice = selectedVariant?.compare_at_price || model.compare_at_price;
  const hasDiscount = comparePrice && comparePrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;

  // Contextual messaging for Zalo
  const getContextualZaloUrl = (topic = "") => {
    const phone = "0398249856";
    const cameraName = `${model.brand} ${model.model_name}`;
    const variantDesc = selectedVariant
      ? `(${selectedVariant.kit_label || selectedVariant.kit_type}, màu ${selectedVariant.color_label || selectedVariant.color}, giá ${formatVND(currentPrice)})`
      : "";
    const msg = topic
      ? `Chào 4cats, mình cần tư vấn về ${cameraName} ${variantDesc}: ${topic}`
      : `Chào 4cats, mình quan tâm máy ảnh ${cameraName} ${variantDesc} mới 100% chính hãng. Cửa hàng còn sẵn tại Hà Nội không ạ?`;

    return `https://zalo.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  // Handle Order Form Submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const address = (formData.get("address") || "Nhận tại cửa hàng").toString().trim();
    const note = (formData.get("note") || "").toString().trim();

    if (!name || !phone) {
      toast.error("Vui lòng điền họ tên và số điện thoại.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_contact: phone,
          customer_address: address,
          customer_message: `ĐẶT MUA MÁY MỚI: ${model.brand} ${model.model_name} | Phiên bản: ${selectedVariant?.kit_label || selectedVariant?.kit_type || "Chuẩn"} | Màu: ${selectedVariant?.color_label || selectedVariant?.color || "Tiêu chuẩn"} | Giá: ${formatVND(currentPrice)}. Ghi chú: ${note}`,
          camera_id: model.id,
          type: "BUY"
        })
      });

      const result = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        toast.error(result.error || "Không thể gửi đơn đặt mua. Vui lòng liên hệ hotline.");
      } else {
        setIsOrderSuccess(true);
        toast.success("Đặt mua thành công! 4cats sẽ liên hệ với bạn trong 15 phút 💖");
        setTimeout(() => {
          setIsOrderSuccess(false);
          setIsOrderDialogOpen(false);
        }, 3000);
      }
    } catch {
      setIsSubmitting(false);
      toast.error("Lỗi kết nối. Vui lòng liên hệ trực tiếp hotline hoặc Zalo.");
    }
  };

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-primary mb-4">Không tìm thấy máy ảnh 😿</h1>
        <p className="text-muted-foreground mb-8">
          Dòng máy bạn đang tìm kiếm hiện không có sẵn.
        </p>
        <Button asChild className="sticker">
          <Link href="/shop">Quay lại danh sách máy ảnh</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F7] min-h-screen pb-24 md:pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Máy ảnh
          </Link>
          <span>/</span>
          <Link
            href={`/shop?brand=${encodeURIComponent(model.brand)}`}
            className="hover:text-primary transition-colors"
          >
            {model.brand}
          </Link>
          <span>/</span>
          <span className="font-bold text-foreground truncate">
            {model.brand} {model.model_name}
          </span>
        </nav>
      </div>

      <main className="container mx-auto px-4 max-w-6xl space-y-10">
        {/* ==================================================================== */}
        {/* SECTION 1: PRODUCT HERO & BUYING AREA */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-4xl p-6 md:p-10 shadow-sm border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Official Images Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-secondary/15 border border-primary/10 group shadow-xs">
                {/* Main Active Image */}
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`${model.brand} ${model.model_name} mới chính hãng`}
                  className="w-full h-full object-cover select-none cursor-pointer transition-transform duration-500 hover:scale-105"
                  onClick={() => setIsFullscreenGallery(true)}
                />

                {/* Arrow Controls */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Ảnh trước"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-primary flex items-center justify-center shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Ảnh kế tiếp"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-primary flex items-center justify-center shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges on main image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mới 100% Chính Hãng
                  </span>
                  <span className="bg-white/95 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-primary/20">
                    Nguyên Seal Fullbox
                  </span>
                </div>

                {/* Zoom button */}
                <button
                  onClick={() => setIsFullscreenGallery(true)}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm text-foreground/80 hover:text-primary transition-colors"
                  title="Phóng to ảnh"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/20 scale-105"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Ảnh thu nhỏ ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Configuration & Purchase (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Type Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary/30 font-black">
                    {model.brand}
                  </Badge>
                  <Badge variant="secondary" className="font-bold">
                    {model.camera_type}
                  </Badge>
                  {model.use_cases?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold text-muted-foreground bg-secondary/30 px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  {model.brand} {model.model_name}
                </h1>

                {/* Short beginner summary */}
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {model.beginner_summary || model.short_description}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-3xl bg-secondary/20 border border-primary/15 flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold block">
                      Giá bán chính hãng:
                    </span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl md:text-4xl font-black text-primary">
                        {formatVND(currentPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatVND(comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </div>

                {/* ============================================================== */}
                {/* VARIANT SELECTOR: BODY VS KIT LENS */}
                {/* ============================================================== */}
                {kitOptions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-foreground uppercase tracking-wider">
                        1. Chọn phiên bản máy:
                      </span>
                      <span className="text-primary font-bold">
                        {selectedVariant?.kit_label || selectedVariant?.kit_type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {kitOptions.map((opt) => {
                        const isSelected = selectedVariant?.kit_type === opt.kit_type;
                        const isBody = opt.kit_type.toLowerCase().includes("body");

                        return (
                          <div
                            key={opt.kit_type}
                            onClick={() => handleSelectKit(opt.kit_type)}
                            className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all space-y-1 ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                                : "border-gray-200 bg-white hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs text-foreground">
                                {opt.kit_label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {isBody
                                ? "📦 Chưa kèm lens — Cần có thêm lens để chụp"
                                : "📸 Đã có sẵn lens zoom — Mua về chụp ngay!"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* VARIANT SELECTOR: COLOR SELECTION */}
                {/* ============================================================== */}
                {colorOptions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-foreground uppercase tracking-wider">
                        2. Chọn màu sắc:
                      </span>
                      <span className="text-foreground font-bold">
                        {selectedVariant?.color_label || selectedVariant?.color}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((c) => {
                        const isSelected = selectedVariant?.color === c.color;
                        return (
                          <button
                            key={c.color}
                            onClick={() => handleSelectColor(c.color)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20"
                                : "border-gray-200 bg-white text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                              style={{ backgroundColor: c.color_hex }}
                            />
                            <span>{c.color_label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock & Branch Availability */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sẵn hàng tại Hà Nội (Cơ sở Cầu Giấy & Thanh Xuân)
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Bảo hành: {selectedVariant?.warranty || "12–24 tháng chính hãng"}
                  </span>
                </div>

                {/* 4cats Official Warranty & Trust Highlights */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      Chính Hãng Mới 100%
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Nguyên seal, kích hoạt bảo hành điện tử chính hãng.
                    </p>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                      7 Ngày 1 Đổi 1
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Đổi mới ngay nếu có lỗi kỹ thuật từ nhà sản xuất.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: [Mua ngay] + [Hỏi 4cats qua Zalo / Hotline] */}
              <div id="dat-mua" className="space-y-3 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Primary Buy Button */}
                  <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="h-14 text-base font-black uppercase tracking-wider sticker shadow-lg shadow-primary/20 w-full cursor-pointer"
                      >
                        Mua ngay 🐾
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md rounded-4xl border-none shadow-2xl p-6">
                      {isOrderSuccess ? (
                        <div className="py-10 px-4 text-center space-y-4">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <DialogTitle className="text-2xl font-black text-primary">
                            Đặt mua thành công!
                          </DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                            Cửa hàng 4cats đã ghi nhận thông tin mua máy: <br />
                            <strong className="text-foreground">
                              {model.brand} {model.model_name} — {selectedVariant?.kit_label || selectedVariant?.kit_type} ({selectedVariant?.color_label || selectedVariant?.color})
                            </strong>
                            <br />
                            Giá niêm yết: <strong>{formatVND(currentPrice)}</strong>
                            <br />
                            Chuyên viên sẽ gọi điện xác nhận và chuẩn bị máy mới nguyên seal ngay cho bạn nhé! 💖
                          </DialogDescription>
                        </div>
                      ) : (
                        <div>
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-black text-primary">
                              Đặt Mua Máy Mới Chính Hãng
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                              Máy: <strong>{model.brand} {model.model_name}</strong> | Phiên bản: <strong>{selectedVariant?.kit_label || selectedVariant?.kit_type}</strong> | Màu: <strong>{selectedVariant?.color_label || selectedVariant?.color}</strong>
                              <br />
                              Giá thanh toán: <strong className="text-primary font-black">{formatVND(currentPrice)}</strong>
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleOrderSubmit} className="space-y-4 pt-1">
                            <div className="space-y-1">
                              <Label htmlFor="order-name" className="text-xs font-bold uppercase text-muted-foreground">
                                Họ và tên bạn
                              </Label>
                              <Input
                                id="order-name"
                                name="name"
                                required
                                placeholder="Ví dụ: Nguyễn Phương Mai"
                                className="rounded-xl h-11 border-primary/20 text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="order-phone" className="text-xs font-bold uppercase text-muted-foreground">
                                Số điện thoại nhận máy / Zalo
                              </Label>
                              <Input
                                id="order-phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder="Ví dụ: 0398249856"
                                className="rounded-xl h-11 border-primary/20 text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="order-address" className="text-xs font-bold uppercase text-muted-foreground">
                                Địa chỉ giao hàng hoặc cơ sở nhận máy
                              </Label>
                              <Input
                                id="order-address"
                                name="address"
                                placeholder="VD: Nhận tại CS 158 Nguyễn Khánh Toàn HOẶC Số nhà, Phường, Quận"
                                className="rounded-xl h-11 border-primary/20 text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="order-note" className="text-xs font-bold uppercase text-muted-foreground">
                                Lời nhắn cho 4cats (Không bắt buộc)
                              </Label>
                              <Input
                                id="order-note"
                                name="note"
                                placeholder="VD: Giao trước 5h chiều, hướng dẫn lắp lens..."
                                className="rounded-xl h-10 border-primary/20 text-xs"
                              />
                            </div>

                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full h-12 text-sm font-black uppercase sticker shadow-md mt-2 cursor-pointer"
                            >
                              {isSubmitting ? "Đang gửi đơn hàng..." : "Xác nhận đặt hàng 🐾"}
                            </Button>

                            <p className="text-[11px] text-center text-muted-foreground">
                              * 4cats cam kết hàng mới 100% nguyên seal, kiểm tra hàng trước khi thanh toán.
                            </p>
                          </form>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Secondary: Tư vấn qua Zalo */}
                  <a
                    href={getContextualZaloUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-[#0068FF] text-[#0068FF] hover:bg-[#0068FF] hover:text-white font-black text-sm transition-all shadow-xs"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Tư vấn Zalo / Hotline
                  </a>
                </div>

                {/* Pre-made Quick Action Questions */}
                <div className="pt-2">
                  <p className="text-[11px] text-muted-foreground font-semibold mb-2">
                    💬 Câu hỏi nhanh cho chuyên viên tư vấn:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Máy này còn màu trắng không?",
                      "Nên lấy Body hay kèm Lens Kit?",
                      "Có quà tặng phụ kiện kèm theo không?",
                      "Hỗ trợ trả góp 0% như thế nào?"
                    ].map((q, idx) => (
                      <a
                        key={idx}
                        href={getContextualZaloUrl(q)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-muted-foreground hover:text-primary bg-secondary/15 hover:bg-primary/10 px-2.5 py-1 rounded-full border border-primary/10 transition-colors"
                      >
                        {q} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 2: "MÁY NÀY HỢP VỚI AI?" (BEGINNER ADVICE) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-primary tracking-widest">
              Định vị thân thiện cho người mới
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Máy Ảnh Này Có Phù Hợp Với Bạn Không? 🤔
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              4cats tư vấn khách quan và trung thực để bạn chọn đúng chiếc máy vừa vặn nhất cho đam mê của mình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Strengths */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Rất phù hợp nếu bạn muốn:
              </div>
              <ul className="space-y-2.5">
                {model.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-emerald-950 font-medium">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-black text-base">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Lưu ý nhỏ khi sử dụng:
              </div>
              <ul className="space-y-2.5">
                {model.limitations?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-amber-950 font-medium">
                    <span className="text-amber-600 font-bold mt-0.5">△</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 3: BODY VS KIT EDUCATION & LENS ECOSYSTEM */}
        {/* ==================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Body vs Kit Explanation */}
          <Card className="rounded-3xl border-primary/15 bg-white shadow-xs p-6 space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-primary">
              <Package className="w-5 h-5 text-primary" />
              Hiểu đúng về Body vs Kit Lens
            </div>
            <div className="p-4 rounded-2xl bg-secondary/20 space-y-2">
              <div className="text-sm font-bold text-foreground">
                {selectedVariant?.kit_type === "Body only"
                  ? "📦 Bạn đang xem bản Thân máy (Body only)"
                  : "📸 Bạn đang xem bản Kèm ống kính Kit"}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedVariant?.kit_type === "Body only"
                  ? "Bản thân máy chưa bao gồm ống kính. Thích hợp nếu bạn đã có sẵn ống kính tương thích ngàm hoặc muốn mua riêng một ống kính chân dung xóa phông."
                  : "Bản kit đã bao gồm thân máy và 1 ống kính zoom góc rộng tiêu chuẩn chính hãng. Bạn chỉ cần gắn thẻ nhớ vào là có thể chụp ngay lập tức!"}
              </p>
            </div>
          </Card>

          {/* Lens Compatibility */}
          <Card className="rounded-3xl border-primary/15 bg-white shadow-xs p-6 space-y-3">
            <div className="flex items-center gap-2 font-black text-base text-foreground">
              <Layers className="w-5 h-5 text-primary" />
              Ngàm & Khả Năng Tương Thích Ống Kính
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="font-bold text-muted-foreground">Ngàm máy (Lens Mount):</span>
                <span className="font-black text-primary">{model.lens_mount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="font-bold text-muted-foreground">Dùng trực tiếp:</span>
                <span className="font-bold text-emerald-700">
                  ✓ {model.compatible_native_mounts?.join(", ") || "Các lens cùng hệ ngàm"}
                </span>
              </div>
              {model.compatible_adapter_mounts && model.compatible_adapter_mounts.length > 0 && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="font-bold text-muted-foreground">Dùng qua ngàm chuyển:</span>
                  <span className="font-medium text-muted-foreground">
                    △ {model.compatible_adapter_mounts.join(", ")}
                  </span>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground pt-1">
                {model.lens_ecosystem_note || "Nhắn tin cho 4cats để được gợi ý những ống kính chân dung xóa phông hoặc góc rộng giá rẻ phù hợp nhất."}
              </p>
            </div>
          </Card>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 4: TECHNICAL SPECIFICATIONS */}
        {/* ==================================================================== */}
        {model.technical_specs && Object.keys(model.technical_specs).length > 0 && (
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-4">
            <h2 className="text-2xl font-black text-foreground">
              Thông Số Kỹ Thuật Chi Tiết ⚙️
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {Object.entries(model.technical_specs).map(([specKey, specVal]) => (
                <div
                  key={specKey}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-bold text-muted-foreground">{specKey}:</span>
                  <span className="font-medium text-foreground text-right pl-4">{specVal}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen Image Lightbox Modal */}
      {isFullscreenGallery && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreenGallery(false)}
        >
          <button
            onClick={() => setIsFullscreenGallery(false)}
            className="absolute top-6 right-6 text-white hover:text-primary p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={galleryImages[activeImageIndex]}
            alt="Phóng to"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
