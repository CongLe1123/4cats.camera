import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Gift
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export const metadata = {
  title: "Cẩm Nang Chọn Mua Máy Ảnh Cho Người Mới Bắt Đầu — 4cats Camera",
  description: "Hướng dẫn chọn mua máy ảnh mới chính hãng cho người mới: phân biệt Mirrorless vs Compact, chọn Body vs Kit lens, tiêu chí chọn máy selfie, vlog, du lịch."
};

export default function BeginnerCameraGuidePage() {
  return (
    <div className="bg-[#FAF8F7] min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" /> Cẩm nang người mới bắt đầu
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Cách Chọn Chiếc Máy Ảnh Đầu Tiên Phù Hợp 📸✨
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bạn đang muốn mua máy ảnh để chụp du lịch, sống ảo cafe hay quay vlog nhưng chưa biết bắt đầu từ đâu? Dưới đây là những tiêu chí quan trọng nhất giúp bạn chọn đúng máy, tránh lãng phí.
          </p>
        </div>

        {/* 1. Nhu cầu sử dụng */}
        <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-black text-foreground">
              1. Xác định rõ nhu cầu chụp ảnh chính
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mỗi dòng máy ảnh có thế mạnh riêng biệt về màu sắc, thiết kế và tính năng:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-secondary/15 border border-primary/10 space-y-1.5">
              <span className="font-bold text-sm text-primary">🌸 Thích chụp người, da đẹp, selfie:</span>
              <p className="text-xs text-muted-foreground">
                Ưu tiên <strong>Canon EOS R50</strong> hoặc <strong>Sony ZV-1 II</strong> với màn hình xoay lật 180° và tông màu da trắng hồng nịnh mắt.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/15 border border-primary/10 space-y-1.5">
              <span className="font-bold text-sm text-primary">🎞️ Thích màu film hoài cổ vintage:</span>
              <p className="text-xs text-muted-foreground">
                Lựa chọn hàng đầu là <strong>Fujifilm X-T30 II</strong> hoặc <strong>Fujifilm X-S20</strong> với bộ giả lập màu film độc quyền chụp xong ăn ngay.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/15 border border-primary/10 space-y-1.5">
              <span className="font-bold text-sm text-primary">🎥 Quay Vlog, TikTok, sáng tạo nội dung:</span>
              <p className="text-xs text-muted-foreground">
                Ưu tiên <strong>Sony ZV-E10 II</strong> hoặc <strong>Sony ZV-1 II</strong> với hệ thống micro 3 củ lọc gió thông minh và lấy nét bám mắt siêu tốc.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/15 border border-primary/10 space-y-1.5">
              <span className="font-bold text-sm text-primary">✈️ Du lịch bỏ túi siêu nhỏ nhẹ:</span>
              <p className="text-xs text-muted-foreground">
                Các dòng máy trọng lượng dưới 400g để bạn có thể đeo cổ cả ngày hoặc bỏ vừa túi xách mang đi chơi hàng ngày.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Thân máy (Body only) vs Kèm ống kính Kit */}
        <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <HelpCircle className="w-6 h-6" />
            <h2 className="text-2xl font-black text-foreground">
              2. Người mới nên mua Body only hay Kèm Lens Kit?
            </h2>
          </div>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border space-y-1">
                <span className="font-bold text-foreground block">📦 Thân máy (Body only):</span>
                <p className="text-xs text-muted-foreground">
                  Chỉ bao gồm thân máy, chưa có ống kính. Phù hợp nếu bạn muốn mua riêng 1 ống kính khẩu lớn chuyên chụp chân dung xóa phông (như 35mm f/1.8 hoặc 50mm f/1.8).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">📸 Bộ kèm Lens Kit (Khuyên dùng):</span>
                <p className="text-xs text-emerald-950">
                  Đã có sẵn ống kính zoom góc rộng nhỏ gọn chính hãng. Mua về lắp thẻ nhớ là có thể chụp ngay lập tức từ phong cảnh, cafe đến chân dung gia đình.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Chính sách bảo hành máy mới tại 4cats */}
        <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-2xl font-black text-foreground">
              3. Cam kết quyền lợi khi mua máy mới tại 4cats Camera
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-secondary/15 space-y-1.5">
              <span className="text-2xl font-black text-primary block">100%</span>
              <span className="text-xs font-bold text-foreground block">Chính hãng nguyên seal</span>
              <p className="text-[11px] text-muted-foreground">Kích hoạt bảo hành điện tử chính hãng</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/15 space-y-1.5">
              <span className="text-2xl font-black text-primary block">12 – 24 Tháng</span>
              <span className="text-xs font-bold text-foreground block">Bảo hành chính hãng</span>
              <p className="text-[11px] text-muted-foreground">Hỗ trợ kỹ thuật và vệ sinh trọn đời</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/15 space-y-1.5">
              <span className="text-2xl font-black text-primary block">7 Ngày</span>
              <span className="text-xs font-bold text-foreground block">Lỗi 1 đổi 1 mới 100%</span>
              <p className="text-[11px] text-muted-foreground">Đổi ngay máy mới nếu có lỗi từ NSX</p>
            </div>
          </div>
        </section>

        {/* CTA to Shop */}
        <div className="text-center pt-4">
          <Button asChild size="lg" className="rounded-full px-10 h-13 sticker shadow-md font-black text-sm">
            <Link href="/shop">
              Xem danh mục máy ảnh chính hãng tại 4cats <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
