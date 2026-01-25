"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
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
  Loader2,
  Check,
} from "lucide-react";
import { BannerCarousel } from "../../components/BannerCarousel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function OrderCameraPage() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    details: "", // Model name or Link
  });

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setBanners(data);
    };
    fetchBanners();
  }, []);

  const handleSubmit = async () => {
    if (!formData.fullname || !formData.contact || !formData.details) {
      alert("Vui lòng điền đầy đủ thông tin: Tên, SĐT và Tên máy/Link");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: formData.fullname,
        customer_contact: formData.contact,
        type: "BUY", // Default for direct order request
        status: "NEW",
        customer_message: `Yêu cầu tìm máy: ${formData.details}`,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Lỗi gửi yêu cầu: " + error.message);
    } else {
      setShowSuccess(true);
      setFormData({ fullname: "", contact: "", details: "" });
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
              <Card className="shadow-xl border-primary/10 sticker-static bg-white">
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Họ và tên</label>
                    <Input
                      placeholder="Tên của bạn..."
                      className="bg-secondary/20 border-primary/20"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      Số điện thoại / Zalo
                    </label>
                    <Input
                      placeholder="Số điện thoại để liên hệ..."
                      className="bg-secondary/20 border-primary/20"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      Tên Model hoặc Link sản phẩm
                    </label>
                    <Input
                      placeholder="VD: Fujifilm X100V hoặc link eBay..."
                      className="bg-secondary/20 border-primary/20"
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 text-lg sticker mt-4"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Gửi yêu cầu đặt hàng
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
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
                <BannerCarousel banners={banners} />
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
            className="mt-8 w-full max-w-[200px] rounded-full"
            onClick={() => setShowSuccess(false)}
          >
            Đã hiểu
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
