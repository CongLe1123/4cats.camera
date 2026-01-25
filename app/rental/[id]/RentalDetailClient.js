"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Facebook,
  Instagram,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Send,
  CalendarDays,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

import { supabase } from "../../../lib/supabase";

export default function RentalDetailClient({ camera }) {
  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  const [activeImage, setActiveImage] = useState(0);
  // Default to first rental option
  const [selectedDuration, setSelectedDuration] = useState(camera?.rental?.[0]);
  const [selectedColor, setSelectedColor] = useState(
    camera?.availableColors?.[0],
  );
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if camera is available in the selected color
  const isAvailable = camera?.variants?.some(
    (v) => v.color === selectedColor && v.inStock,
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const orderData = {
      customer_name: formData.get("name") || "",
      customer_contact: formData.get("phone") || "",
      customer_message: `Rental: ${camera.name} | Duration: ${selectedDuration?.duration} | Color: ${selectedColor} | Address: ${formData.get("address")}`,
      camera_id: camera.id,
      type: "RENT",
      status: "NEW",
    };

    const { error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      console.error(error);
      alert("Failed to submit order. Please try again.");
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOrderDialogOpen(false);
      }, 3000);
    }
    setIsSubmitting(false);
  };

  // Combine main image with gallery images
  const displayImages = camera
    ? [...(camera.image ? [camera.image] : []), ...(camera.images || [])]
    : [];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % (displayImages.length || 1));
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? (displayImages.length || 1) - 1 : prev - 1,
    );
  };

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm :(</h1>
        <Button asChild className="mt-4">
          <Link href="/rental">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link
        href="/rental"
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại danh sách thuê
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Left Column: Visuals (Main Image + Thumbnails) */}
        <div className="space-y-6">
          <div className="relative aspect-4/3 rounded-4xl overflow-hidden bg-muted border-2 border-transparent hover:border-primary/20 transition-all group">
            {/* Sliding Image Container */}
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeImage * 100}%)` }}
            >
              {displayImages.map((img, idx) => (
                <div key={idx} className="w-full h-full shrink-0">
                  <img
                    src={img}
                    alt={`${camera.name} - View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                >
                  <ChevronLeft className="h-6 w-6 text-primary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                >
                  <ChevronRight className="h-6 w-6 text-primary" />
                </button>
              </>
            )}

            <Badge className="absolute top-4 left-4 bg-primary text-white shadow-lg">
              Cho thuê
            </Badge>
          </div>

          {/* Angle Selectors (Thumbnails) */}
          <div className="flex justify-center">
            <div className="flex gap-4 p-2 bg-secondary/30 rounded-full border border-primary/5">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-0.5 hover:scale-110 active:scale-95 ${
                    activeImage === idx
                      ? "border-primary bg-primary/20 ring-4 ring-primary/10"
                      : "border-transparent bg-white/50 shadow-sm"
                  }`}
                  title={`View Angle ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions (Title -> Specs -> Buy Button) */}
        <div className="space-y-8 flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                {camera.brand}
              </Badge>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                Sẵn sàng cho thuê
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{camera.name}</h1>
            <div className="flex flex-wrap gap-2">
              {camera.features &&
                camera.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md"
                  >
                    #{f}
                  </span>
                ))}
            </div>
            <div className="text-4xl font-black text-primary pt-2">
              {selectedDuration?.price
                ? formatPrice(selectedDuration.price)
                : "Liên hệ"}
              <span className="text-lg text-muted-foreground font-medium ml-2">
                / {selectedDuration?.duration || "kỳ"}
              </span>
            </div>
          </div>

          <Card className="bg-secondary/15 border-none rounded-4xl shadow-sm">
            <CardContent className="p-8 space-y-8">
              {/* Duration Selector */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <CalendarDays className="w-3 h-3" />
                  Chọn thời gian thuê (Duration)
                </span>
                <div className="flex flex-wrap gap-3">
                  {camera.rental?.map((opt) => (
                    <button
                      key={opt.duration}
                      onClick={() => setSelectedDuration(opt)}
                      className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                        selectedDuration?.duration === opt.duration
                          ? "border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                          : "border-primary/5 bg-white hover:border-primary/20 hover:bg-primary/5 shadow-sm"
                      }`}
                    >
                      {opt.duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Chọn màu sắc (Color)
                </span>
                <div className="flex flex-wrap gap-3">
                  {camera.availableColors &&
                    camera.availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                          selectedColor === color
                            ? "border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                            : "border-primary/5 bg-white hover:border-primary/20 hover:bg-primary/5 shadow-sm"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border border-black/10`}
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </button>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-primary/10">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground/80 text-xs font-bold uppercase tracking-widest">
                    Thủ tục
                  </span>
                  <span className="font-black text-lg">Nhanh gọn (CCCD)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Section integrated directly here */}
          <div className="pt-4">
            <Dialog
              open={isOrderDialogOpen}
              onOpenChange={setIsOrderDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full h-16 text-xl sticker shadow-2xl shadow-primary/30 font-black uppercase tracking-wider"
                >
                  {isAvailable ? "Thuê ngay" : "Hiện tại không cho thuê"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                {isSuccess ? (
                  <div className="py-16 px-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-inner">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <DialogTitle className="text-3xl font-black text-primary mb-2">
                      Gửi yêu cầu thành công!
                    </DialogTitle>
                    <DialogDescription className="text-lg font-medium text-muted-foreground">
                      Cửa hàng đã nhận được yêu cầu thuê máy của bạn. <br />
                      Chúng mình sẽ gọi lại để xác nhận sớm nhé! 💖
                    </DialogDescription>
                  </div>
                ) : isAvailable ? (
                  <div className="p-8">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Send className="w-6 h-6 text-primary" />
                        </div>
                        Thông tin thuê máy
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        Bạn đang đăng ký thuê **{camera.name}**
                        <br />
                        <span className="text-primary font-bold">
                          ({selectedDuration?.duration} - {selectedColor})
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleOrderSubmit}
                      className="space-y-6 pt-4"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="flex items-center gap-2 font-bold"
                          >
                            <User className="w-4 h-4 text-primary" /> Họ và tên
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className="rounded-xl border-primary/20 h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="flex items-center gap-2 font-bold"
                          >
                            <Phone className="w-4 h-4 text-primary" /> Số điện
                            thoại
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            placeholder="Ví dụ: 0901234567"
                            className="rounded-xl border-primary/20 h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="address"
                            className="flex items-center gap-2 font-bold"
                          >
                            <MapPin className="w-4 h-4 text-primary" /> Địa chỉ
                            nhận máy
                          </Label>
                          <Input
                            id="address"
                            required
                            placeholder="Số nhà, đường, phường, quận..."
                            className="rounded-xl border-primary/20 h-11"
                          />
                        </div>
                      </div>

                      <div className="bg-secondary/30 p-4 rounded-2xl border border-primary/10">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-muted-foreground text-sm">
                            Giá thuê ({selectedDuration?.duration}):
                          </span>
                          <span className="font-bold">
                            {formatPrice(selectedDuration?.price)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-primary/5">
                          <span className="text-muted-foreground text-sm">
                            Cọc:
                          </span>
                          <span className="text-primary font-bold text-[10px]">
                            Thỏa thuận/Giấy tờ
                          </span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg sticker shadow-xl shadow-primary/20 font-bold"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang xử lý...
                          </div>
                        ) : (
                          "Gửi yêu cầu thuê"
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="p-8">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        Liên hệ với chúng mình
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Hãy liên hệ với chúng mình để biết thêm chi tiết nhé! ✨
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-6">
                      {/* Instagram */}
                      <Link
                        href="https://www.instagram.com/4cats.camera/"
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Instagram className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">Instagram</div>
                            <div className="text-muted-foreground text-sm">
                              @4cats.camera
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors pr-2">
                          Theo dõi
                        </div>
                      </Link>

                      {/* Facebook */}
                      <Link
                        href="https://www.facebook.com/profile.php?id=100093056073018"
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#0084FF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Facebook className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">Facebook</div>
                            <div className="text-muted-foreground text-sm">
                              Fanpage 4cats.camera
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors pr-2">
                          Nhắn tin
                        </div>
                      </Link>

                      {/* Zalo */}
                      <Link
                        href="https://zalo.me/0398249856"
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#0068FF] flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <span className="text-white text-3xl font-black italic">
                              Z
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-lg">Zalo</div>
                            <div className="text-muted-foreground text-sm">
                              Admin: 039.824.9856
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors pr-2">
                          Chat trực tiếp
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <p className="text-xs text-center text-muted-foreground pt-4">
              * Giảm 10% khi thuê dài hạn (trên 1 tuần)
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges - Moved out of grid for better alignment */}
      <div className="flex justify-end max-w-6xl mx-auto mb-20">
        <div className="w-full lg:w-1/2 flex gap-6 pt-4 border-t border-primary/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Thiết bị hoạt
            động hoàn hảo
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> Vệ sinh sạch sẽ
          </div>
        </div>
      </div>

      {/* Specs Section */}
      {camera.specs && (
        <div className="max-w-4xl mx-auto mb-20 px-4">
          <div className="space-y-4 text-center mb-10">
            <h3 className="text-3xl font-black text-primary tracking-tight uppercase">
              Thông số kỹ thuật
            </h3>
            <div className="w-16 h-1.5 bg-primary/20 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(camera.specs).map(([key, value]) => {
              const specLabels = {
                resolution: "Độ phân giải",
                sensor: "Cảm biến",
                processor: "Bộ xử lý",
                iso: "Dải ISO",
                autofocus: "Hệ thống AF",
                video: "Quay Video",
                screen: "Màn hình",
                weight: "Trọng lượng",
              };
              return (
                <div
                  key={key}
                  className="flex justify-between items-center p-5 bg-white rounded-2xl border border-primary/5 hover:border-primary/20 transition-all shadow-sm hover:shadow-md"
                >
                  <span className="text-muted-foreground font-bold text-sm uppercase tracking-wide">
                    {specLabels[key] || key}
                  </span>
                  <span className="font-extrabold text-foreground text-right ml-4">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Width Description Section below the fold */}
      <div className="border-t pt-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h3 className="text-4xl font-extrabold text-primary tracking-tight">
              Mô tả chi tiết
            </h3>
            <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full" />
          </div>

          <div className="space-y-10">
            {camera.content &&
              camera.content.map((block, index) => {
                if (block.type === "text") {
                  return (
                    <p
                      key={index}
                      className="text-muted-foreground leading-relaxed text-xl font-medium"
                    >
                      {block.value}
                    </p>
                  );
                }
                if (block.type === "image") {
                  return (
                    <div key={index} className="space-y-3">
                      <div className="rounded-[3rem] overflow-hidden border-8 border-secondary/20 shadow-2xl">
                        <img
                          src={block.value}
                          alt={block.caption}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {block.caption && (
                        <p className="text-sm text-center font-bold tracking-wide uppercase text-muted-foreground/60">
                          {block.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                if (block.type === "video") {
                  return (
                    <div key={index} className="space-y-3">
                      <div className="rounded-[3rem] overflow-hidden border-8 border-secondary/20 shadow-2xl aspect-video bg-black">
                        <video
                          src={block.value}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      {block.caption && (
                        <p className="text-sm text-center font-bold tracking-wide uppercase text-muted-foreground/60">
                          {block.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
