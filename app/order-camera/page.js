"use client";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Send,
  ShoppingCart,
  Truck,
  CreditCard,
  CheckCircle2,
  Ticket,
  Gift,
  Sparkles,
} from "lucide-react";
import { BannerCarousel } from "../../components/BannerCarousel";

export default function OrderCameraPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
        {/* LEFT COLUMN */}
        <div className="space-y-12">
          {/* Chính sách order */}
          <section>
            <h1 className="text-4xl font-bold mb-8 italic text-primary">
              Chính sách order
            </h1>
            <div className="space-y-6">
              {[
                {
                  icon: Send,
                  title: "1. Bạn yêu cầu",
                  desc: "Cho 4cats biết chiếc máy ảnh bạn muốn (hoặc nhờ chúng mình tư vấn).",
                },
                {
                  icon: ShoppingCart,
                  title: "2. Chúng mình mua",
                  desc: "4cats sẽ tìm mua từ các nguồn uy tín nhất tại nước ngoài (Nhật, Mỹ...).",
                },
                {
                  icon: CheckCircle2,
                  title: "3. Chúng mình kiểm tra",
                  desc: "Máy về tay 4cats sẽ được test kỹ ngoại hình và chức năng trước khi giao cho bạn.",
                },
                {
                  icon: Truck,
                  title: "4. Giao đến bạn",
                  desc: "Máy được đóng gói cẩn thận và giao tận cửa nhà bạn kèm bảo hành.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-primary/10 hover:bg-white/80 transition-all"
                >
                  <div className="bg-primary/20 p-3 rounded-2xl h-fit">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-3xl font-bold mb-6 italic text-primary">
              Nhập thông tin
            </h2>
            <Card className="shadow-xl border-primary/10 sticker-static bg-white">
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Họ và tên</label>
                  <Input
                    placeholder="Tên của bạn..."
                    className="bg-secondary/20 border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Số điện thoại / Zalo
                  </label>
                  <Input
                    placeholder="Số điện thoại để liên hệ..."
                    className="bg-secondary/20 border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Tên Model hoặc Link sản phẩm
                  </label>
                  <Input
                    placeholder="VD: Fujifilm X100V hoặc link eBay..."
                    className="bg-secondary/20 border-primary/20"
                  />
                </div>

                <Button size="lg" className="w-full h-14 text-lg sticker mt-4">
                  Gửi yêu cầu đặt hàng
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8 sticky top-4">
          {/* Quảng cáo */}
          <section>
            <h2 className="text-3xl font-bold mb-6 italic text-primary text-right">
              Góc ưu đãi
            </h2>
            <div className="rounded-[2rem] overflow-hidden shadow-lg border border-primary/20">
              <BannerCarousel />
            </div>
          </section>

          {/* Giá cả */}
          <Card className="bg-primary text-primary-foreground p-8 rounded-[2rem] border-none shadow-lg shadow-primary/20 sticker">
            <h3 className="text-2xl font-bold mb-4 italic flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Lưu ý về giá
            </h3>
            <div className="space-y-4 text-sm opacity-90">
              <p>Giá cuối cùng của bạn bao gồm:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Giá máy niêm yết tại web/store</li>
                <li>Phí dịch vụ săn máy</li>
                <li>Phí vận chuyển quốc tế & nội địa</li>
              </ul>
              <hr className="border-white/20" />
              <p className="font-bold">
                Chúng mình luôn minh bạch giá cả trong từng chặng đường!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
