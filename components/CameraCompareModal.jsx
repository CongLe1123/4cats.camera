"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Scale, Check, X, ArrowRight } from "lucide-react";
import { getCameras } from "../lib/fetchCameras";

export function CameraCompareModal({ defaultModelSlug = null, allCameras = [] }) {
  const [fetchedCameras, setFetchedCameras] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if ((!allCameras || allCameras.length === 0) && isOpen) {
      getCameras().then((cams) => setFetchedCameras(cams || []));
    }
  }, [allCameras, isOpen]);

  const allModels = (allCameras && allCameras.length > 0) ? allCameras : fetchedCameras;

  const [selectedSlugs, setSelectedSlugs] = useState(() => {
    if (defaultModelSlug) {
      const other = allCameras.find((m) => m.slug !== defaultModelSlug)?.slug;
      return other ? [defaultModelSlug, other] : [defaultModelSlug];
    }
    return allCameras.slice(0, 2).map((m) => m.slug);
  });

  const selectedModels = selectedSlugs
    .map((slug) => allModels.find((m) => m.slug === slug))
    .filter(Boolean);

  const toggleModel = (slug) => {
    if (selectedSlugs.includes(slug)) {
      if (selectedSlugs.length > 2) {
        setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
      }
    } else {
      if (selectedSlugs.length < 3) {
        setSelectedSlugs([...selectedSlugs, slug]);
      } else {
        // Replace last
        setSelectedSlugs([selectedSlugs[0], selectedSlugs[1], slug]);
      }
    }
  };

  const formatPrice = (val) => {
    if (!val) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(val) + "đ";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs gap-1.5 shadow-xs"
        >
          <Scale className="w-3.5 h-3.5" /> So sánh máy ảnh
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl rounded-4xl border-none shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2 border-b border-gray-100 pb-4">
          <DialogTitle className="text-2xl font-black text-foreground flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" /> So Sánh Các Dòng Máy Ảnh
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Chọn từ 2 đến 3 dòng máy để so sánh trực quan những điểm khác biệt quan trọng nhất cho người mới.
          </p>

          {/* Model Selector Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {allModels.map((m) => {
              const isSelected = selectedSlugs.includes(m.slug);
              return (
                <button
                  key={m.slug}
                  onClick={() => toggleModel(m.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-gray-50 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 inline mr-1 stroke-[3]" />}
                  {m.brand} {m.model_name}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Comparison Table */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 font-bold text-muted-foreground w-1/4">Tiêu chí</th>
                {selectedModels.map((m) => (
                  <th key={m.slug} className="p-3 font-black text-sm text-foreground">
                    <div className="space-y-1">
                      <span>{m.brand} {m.model_name}</span>
                      <span className="block text-primary font-bold text-xs">
                        Từ {formatPrice(m.minPrice)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-bold text-muted-foreground">Loại máy (Type)</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 font-medium text-foreground">
                    {m.camera_type} ({m.sensor_type})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Trọng lượng (Weight)</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 font-medium text-foreground">
                    <span className="font-bold">{m.weight}</span>
                    <span className="block text-[11px] text-muted-foreground">{m.weight_interpretation}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Màn hình lật xoay (Selfie)</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 font-medium text-foreground">
                    {m.screen_type?.includes("xoay lật") || m.screen_type?.includes("180") ? (
                      <span className="text-green-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Có (Tiện selfie/vlog)
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        △ Lật 2 chiều (Không selfie được)
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Kính ngắm mắt (EVF)</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 font-medium text-foreground">
                    {m.viewfinder?.includes("OLED") ? (
                      <span className="text-green-700 font-bold">✓ Có kính ngắm sắc nét</span>
                    ) : (
                      <span className="text-muted-foreground">Không trang bị (ngắm qua LCD)</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Đèn flash cóc</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 font-medium text-foreground">
                    {m.built_in_flash ? (
                      <span className="text-green-700 font-bold">✓ Tích hợp sẵn trên máy</span>
                    ) : (
                      <span className="text-muted-foreground">Cần gắn flash rời</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Thế mạnh vượt trội</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 text-foreground leading-relaxed">
                    {m.slug === "canon-eos-r50" && "Màu da người trắng hồng tự nhiên, lấy nét mắt siêu nhạy, giao diện cực dễ dùng."}
                    {m.slug === "fujifilm-x-t30-ii" && "18 giả lập màu film nghệ thuật hoài cổ, thiết kế cơ học retro sang trọng."}
                    {m.slug === "sony-zv-1-ii" && "Ống kính ZEISS 18-50mm gắn liền, siêu nhẹ 292g, micro 3 củ lọc âm cực đỉnh."}
                    {m.slug === "sony-a6400" && "Real-time Eye AF khóa nét mắt 0.02s, vỏ magie bền bỉ, kho lens Sony E bạt ngàn."}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-muted-foreground">Tình trạng máy</td>
                {selectedModels.map((m) => (
                  <td key={m.slug} className="p-3 text-foreground">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block text-[11px]">
                      ✓ Mới 100% Chính Hãng (Sẵn hàng)
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Bottom Guidance */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedModels.map((m) => (
            <div key={m.slug} className="p-3 bg-secondary/15 rounded-2xl space-y-2">
              <span className="font-bold text-xs text-foreground block">
                Nên chọn {m.model_name} nếu:
              </span>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {m.slug === "canon-eos-r50" && "Bạn là người mới, thích chụp ảnh chân dung bạn bè/gia đình nịnh da hoặc làm vlog nhẹ nhàng."}
                {m.slug === "fujifilm-x-t30-ii" && "Bạn mê chất màu film cổ điển, thích chụp đường phố cafe OOTD và vẻ đẹp hoài cổ."}
                {m.slug === "sony-zv-1-ii" && "Bạn muốn chiếc máy nhỏ gọn nhét túi áo, mua về quay TikTok/Vlog ngay không cần mua thêm lens."}
                {m.slug === "sony-a6400" && "Bạn cần chiếc máy cứng cáp, lấy nét siêu nhanh và muốn dùng lâu dài với kho lens phong phú."}
              </p>
              <Button asChild size="sm" className="w-full sticker h-8 text-[11px] font-bold" onClick={() => setIsOpen(false)}>
                <Link href={`/may-anh/${m.slug}`}>
                  Xem máy {m.model_name} <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
