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
  Camera,
  Send,
  ShoppingCart,
  Truck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export default function OrderCameraPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 sticker">
          <ShoppingCart className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 italic text-primary">
          Dịch vụ đặt hàng máy ảnh
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Chúng mình sẽ giúp bạn săn tìm và mua chiếc máy ảnh trong mơ. Chỉ cần
          cho 4cats biết bạn cần gì, chúng mình sẽ lo liệu phần còn lại!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-primary/10 sticker-static">
            <CardHeader>
              <CardTitle>Yêu cầu đặt hàng</CardTitle>
              <CardDescription>
                Hãy cung cấp chi tiết nhất có thể để chúng mình tìm đúng chiếc
                máy bạn cần nhé.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Hãng máy ảnh</label>
                  <Input placeholder="VD: Fujifilm, Canon, Sony..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Tên Model hoặc Link sản phẩm
                  </label>
                  <Input placeholder="VD: Fujifilm X100V hoặc link eBay..." />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Tình trạng mong muốn
                  </label>
                  <div className="flex flex-wrap gap-2 ">
                    <Button
                      variant="outline"
                      className="flex-1 border-primary bg-primary/5"
                    >
                      Mới 100%
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Like New / Đã qua sử dụng
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Tình trạng nào cũng được
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  Cửa hàng ưu tiên (Nếu có)
                </label>
                <Input placeholder="VD: eBay, Amazon, Map Camera Nhật..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Địa chỉ nhận hàng</label>
                <Input placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Số điện thoại / Email liên hệ
                  </label>
                  <Input placeholder="4cats nên liên hệ với bạn qua đâu?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Yêu cầu đặc biệt</label>
                  <Input placeholder="Ví dụ: Cần máy gấp trước ngày..." />
                </div>
              </div>

              <Button size="lg" className="w-full h-14 text-lg sticker">
                Gửi yêu cầu đặt hàng
                <Send className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground italic">
                * 4cats sẽ liên hệ lại với bạn để báo giá cuối cùng (Giá máy +
                Phí dịch vụ + Phí vận chuyển) trước khi tiến hành mua hàng.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="bg-white/50 backdrop-blur p-8 rounded-[2rem] border border-primary/20 shadow-sm sticker">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Quy trình đặt hàng
            </h3>
            <div className="space-y-8">
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
                <div key={i} className="flex gap-4">
                  <div className="bg-primary/20 p-3 rounded-2xl h-fit">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
