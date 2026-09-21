import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ShieldCheck, Clock, RefreshCcw, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Hành Chính Hãng — 4cats Camera",
  description: "Cam kết bảo hành chính hãng 12-24 tháng, 1 đổi 1 trong 7 ngày, hỗ trợ kỹ thuật và vệ sinh máy trọn đời tại 4cats Camera."
};

export default function WarrantyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase text-primary tracking-widest">
          An tâm tuyệt đối
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight">
          Chính Sách Bảo Hành Chính Hãng 🛡️
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto">
          Mọi máy ảnh tại 4cats.camera đều là hàng mới 100% chính hãng, nguyên seal và được bảo hành điện tử chính hãng toàn diện.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <Card className="border-none bg-primary/5 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-black text-foreground">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Cam kết máy mới 100% chính hãng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                4cats Camera cam kết 100% máy ảnh bán ra đều là hàng mới nguyên hộp (fullbox), nguyên seal từ các hãng máy ảnh chính thức tại Việt Nam (Canon, Sony, Fujifilm, Nikon). Khách hàng được hướng dẫn kích hoạt bảo hành điện tử chính hãng ngay khi nhận máy.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base font-black text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                Thời gian bảo hành 12 – 24 tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Bảo hành phần cứng chính hãng từ 12 tháng (Canon, Sony) đến 24 tháng (Fujifilm). Trong suốt thời gian này, quý khách được hỗ trợ sửa chữa, thay thế linh kiện chính hãng miễn phí theo chính sách của hãng.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base font-black text-foreground">
                <RefreshCcw className="h-5 w-5 text-primary" />
                7 ngày lỗi 1 đổi 1 mới 100%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Trong 7 ngày đầu tiên kể từ ngày nhận hàng, nếu sản phẩm phát sinh bất kỳ lỗi kỹ thuật nào từ nhà sản xuất, 4cats sẽ đổi ngay một chiếc máy mới nguyên seal tương đương hoặc hoàn tiền 100%.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-4xl border border-primary/10 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-foreground">Điều kiện tiếp nhận bảo hành</h2>
          <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Sản phẩm có phiếu bảo hành hoặc thông tin bảo hành điện tử chính hãng kích hoạt theo số serial.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Thân máy và ống kính không bị rơi vỡ, nứt móp, ẩm ướt hoặc có dấu hiệu chập cháy do nguồn điện bên ngoài.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Chưa qua can thiệp kỹ thuật hoặc tháo mở linh kiện từ các đơn vị không được ủy quyền.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              4cats hỗ trợ vệ sinh cảm biến và tư vấn cài đặt máy miễn phí trọn đời cho toàn bộ khách hàng.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
