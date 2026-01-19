import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ShoppingBag, CreditCard, Truck, MessageCircle } from "lucide-react";

export default function PurchasePolicy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center italic text-primary">
        Chính sách mua hàng
      </h1>

      <div className="space-y-12">
        {/* Step by step */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Các bước mua máy tại 4cats 🐾
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: "Chọn máy",
                desc: "Xem danh sách máy và nhắn tin cho chúng mình để tư vấn kỹ hơn nhé.",
              },
              {
                icon: CreditCard,
                title: "Thanh toán",
                desc: "Bạn có thể chuyển khoản hoặc thanh toán trực tiếp khi nhận máy (COD).",
              },
              {
                icon: Truck,
                title: "Nhận hàng",
                desc: "Máy sẽ được đóng gói chống sốc kỹ lưỡng và giao đến bạn trong 1-3 ngày.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-none bg-primary/5 text-center p-6 sticker"
              >
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>● Chuyển khoản ngân hàng (Techcombank/Vietcombank).</p>
              <p>● Ví điện tử Momo.</p>
              <p>
                ● Thanh toán khi nhận hàng (COD) sau khi cọc phí vận chuyển.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="text-lg">Giao hàng & Phí ship</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>● Miễn phí giao hàng cho đơn từ 10.000.000đ.</p>
              <p>● Các đơn khác phí ship đồng giá 50.000đ toàn quốc.</p>
              <p>● Thời gian giao: Nội thành 1 ngày, tỉnh 2-4 ngày.</p>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <section className="bg-primary/20 p-8 rounded-[2rem] text-center sticker">
          <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Bạn còn thắc mắc?</h2>
          <p className="text-muted-foreground mb-6">
            Đừng ngần ngại nhắn tin cho 4cats ngay để được giải đáp nhé!
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white px-6 py-2 rounded-full text-primary font-bold shadow-sm hover:shadow-md transition-all">
              Messenger
            </button>
            <button className="bg-white px-6 py-2 rounded-full text-primary font-bold shadow-sm hover:shadow-md transition-all">
              Zalo
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
