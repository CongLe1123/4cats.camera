"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Send,
  ShoppingCart,
  Truck,
  CreditCard,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import { BannerCarousel } from "../../components/BannerCarousel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function OrderCameraClient({ banners = [] }) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    details: "",
  });

  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError("");

    if (!formData.fullname.trim()) {
      setFormError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!formData.contact.trim()) {
      setFormError("Vui lòng nhập số điện thoại hoặc Zalo để chúng mình liên hệ.");
      return;
    }
    if (!formData.details.trim()) {
      setFormError("Vui lòng nhập tên máy ảnh hoặc link sản phẩm bạn muốn tìm.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.fullname.trim(),
          customer_contact: formData.contact.trim(),
          type: "BUY",
          customer_message: `Yêu cầu tìm máy: ${formData.details.trim()}`,
        }),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setFormError(result.error || "Gửi yêu cầu không thành công. Vui lòng thử lại.");
        toast.error(result.error || "Gửi yêu cầu thất bại.");
      } else {
        setShowSuccess(true);
        toast.success("Yêu cầu tìm máy đã được gửi thành công! 💖");
        setFormData({ fullname: "", contact: "", details: "" });
      }
    } catch {
      setLoading(false);
      setFormError("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
      toast.error("Lỗi kết nối.");
    }
  };

  return (
    <>
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
              <Card className="shadow-xl border-primary/10 sticker-static bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-6 pt-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="fullname" className="text-sm font-bold block text-foreground">
                        Họ và tên <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="fullname"
                        name="fullname"
                        required
                        placeholder="Tên của bạn..."
                        className="bg-secondary/20 border-primary/20 rounded-xl h-11"
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact" className="text-sm font-bold block text-foreground">
                        Số điện thoại / Zalo <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="contact"
                        name="contact"
                        type="tel"
                        required
                        placeholder="Ví dụ: 0398249856"
                        className="bg-secondary/20 border-primary/20 rounded-xl h-11"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="details" className="text-sm font-bold block text-foreground">
                        Tên Model hoặc Link sản phẩm <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="details"
                        name="details"
                        required
                        placeholder="VD: Fujifilm X100V, Ricoh GR III hoặc link sản phẩm..."
                        className="bg-secondary/20 border-primary/20 rounded-xl h-11"
                        value={formData.details}
                        onChange={(e) =>
                          setFormData({ ...formData, details: e.target.value })
                        }
                      />
                    </div>

                    {formError && (
                      <div className="text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl">
                        {formError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-base font-bold sticker mt-4 uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 cursor-pointer"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" /> Đang gửi yêu cầu...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Gửi yêu cầu đặt hàng
                          <Send className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
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
              <div className="rounded-4xl overflow-hidden shadow-lg border border-primary/20">
                <BannerCarousel banners={banners} />
              </div>
            </section>

            {/* Giá cả */}
            <Card className="bg-primary text-primary-foreground p-8 rounded-4xl border-none shadow-lg shadow-primary/20 sticker">
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

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center justify-center p-10 rounded-3xl">
          <DialogHeader className="items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <Check className="w-10 h-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-primary mb-2">
              Đặt hàng thành công!
            </DialogTitle>
            <DialogDescription className="text-lg font-medium text-muted-foreground">
              Cửa hàng đã nhận được thông tin của bạn. <br />
              Chúng mình sẽ gọi lại cho bạn sớm nhé! 💖
            </DialogDescription>
          </DialogHeader>
          <Button
            className="mt-8 w-full max-w-50 rounded-full cursor-pointer"
            onClick={() => setShowSuccess(false)}
          >
            Đã hiểu
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
