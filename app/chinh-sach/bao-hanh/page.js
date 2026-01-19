import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ShieldCheck, Clock, RefreshCcw } from "lucide-react";

export default function WarrantyPolicy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center italic text-primary">
        Chính sách bảo hành
      </h1>

      <div className="space-y-8">
        <section>
          <Card className="border-none bg-primary/5 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Cam kết chất lượng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Mọi máy ảnh bán ra từ 4cats.camera đều được team kiểm tra kỹ
                lưỡng 2 lần: một lần khi máy về kho và một lần trước khi giao
                cho bạn. Chúng mình cam kết máy hoạt động hoàn hảo, không lỗi
                lầm.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Thời gian bảo hành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bảo hành phần cứng từ 3 - 6 tháng tùy dòng máy. Trong suốt thời
                gian này, chúng mình sẽ hỗ trợ sửa chữa miễn phí các lỗi từ nhà
                sản xuất.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/30 sticker">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <RefreshCcw className="h-5 w-5 text-primary" />
                Lỗi 1 đổi 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Trong 7 ngày đầu tiên, nếu máy có bất kỳ lỗi kỹ thuật nào, đừng
                lo lắng nhé! 4cats sẽ đổi ngay máy tương đương hoặc hoàn tiền
                100%.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-primary/10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 italic">Điều kiện bảo hành</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Máy còn nguyên tem bảo hành của 4cats.camera.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Máy không bị rơi rớt, cấn móp hoặc có dấu hiệu vào nước.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">●</span>
              Chưa qua can thiệp kỹ thuật từ bên thứ 3.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
