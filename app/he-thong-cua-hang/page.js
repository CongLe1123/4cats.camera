import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function StoreSystem() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center italic text-primary">
        Hệ thống cửa hàng
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        Ghé thăm chúng mình để trải nghiệm máy trực tiếp nhé! 📸🐾
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Store 1 */}
        <Card className="border-none bg-white shadow-xl sticker overflow-hidden">
          <div className="h-48 bg-primary/20 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold italic text-primary">
              4cats - Chi nhánh Sài Gòn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-start">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                123 Đường Pastel, Phường 4, Quận Cute, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">09xx-xxx-xxx</p>
            </div>
            <div className="flex gap-3 items-center">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">09:00 - 21:00 (Hàng ngày)</p>
            </div>
          </CardContent>
        </Card>

        {/* Store 2 */}
        <Card className="border-none bg-white shadow-xl sticker overflow-hidden">
          <div className="h-48 bg-primary/20 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold italic text-primary">
              4cats - Chi nhánh Hà Nội
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-start">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                456 Phố Vintage, Quận Hoàn Kiếm, Hà Nội
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">08xx-xxx-xxx</p>
            </div>
            <div className="flex gap-3 items-center">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground">09:00 - 20:30 (Hàng ngày)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 bg-secondary/30 p-8 rounded-[2rem] text-center sticker">
        <h2 className="text-2xl font-bold mb-4 italic">
          Theo dõi chúng mình trên Instagram để cập nhật máy mới mỗi ngày!
        </h2>
        <a
          href="https://instagram.com/4cats.camera"
          target="_blank"
          className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full text-primary font-bold shadow-lg hover:scale-105 transition-all"
        >
          <Instagram className="h-5 w-5" />
          @4cats.camera
        </a>
      </div>
    </div>
  );
}
