import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MessageCircle, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { getStoreSettings } from "../../lib/fetchCameras";

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const mainPhone = settings.contact_phones?.[0] || "039 824 9856";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Liên hệ với {settings.brand_name?.replace(" 📸", "") || "4cats"}! 🐱✨
        </h1>
        <p className="text-muted-foreground text-lg">
          Chúng mình luôn sẵn sàng hỗ trợ bạn trên hành trình nhiếp ảnh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 border-none bg-primary text-primary-foreground shadow-2xl overflow-hidden relative sticker">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Thông tin</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-xl mt-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Địa chỉ</h4>
                    <div className="opacity-80 text-sm space-y-2">
                      {settings.locations?.map((loc, idx) => (
                        <p key={idx}>{`CS${idx + 1}: ${loc.address}`}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-xl mt-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Hotline</h4>
                    <p className="opacity-80">
                      {settings.contact_phones?.join(" - ")}
                    </p>
                  </div>
                </div>
                {settings.contact_email && (
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-xl mt-1">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="opacity-80">{settings.contact_email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <Button variant="secondary" className="rounded-full px-8 sticker">
                Xem bản đồ
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </Card>

        {/* Social Cards */}
        <div className="flex flex-col gap-6">
          {settings.support_links
            ?.filter((l) => l.is_social)
            .map((link, idx) => {
              const platform = link.platform || "Other";
              const isZalo = platform === "Zalo";
              const isIG = platform === "Instagram";
              const isFB = platform === "Facebook";
              const isTikTok = platform === "TikTok";

              let bgClass = "bg-primary";
              let Icon = MessageCircle;

              if (isIG) {
                bgClass =
                  "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]";
                Icon = Instagram;
              } else if (isFB) {
                bgClass = "bg-[#0084FF]";
                Icon = MessageCircle;
              } else if (isZalo) {
                bgClass = "bg-[#0068FF]";
              } else if (isTikTok) {
                bgClass = "bg-black";
              }

              return (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="hover:border-primary transition-all cursor-pointer group sticker">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`${bgClass} p-3 rounded-2xl shadow-lg flex items-center justify-center min-w-14 h-14`}
                        >
                          {isZalo ? (
                            <span className="text-white font-black text-2xl">
                              Z
                            </span>
                          ) : (
                            <Icon className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{platform}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {link.label || "Liên hệ với chúng mình"}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" className="rounded-full shrink-0">
                        {isIG ? "Theo dõi" : isFB ? "Nhắn tin" : "Mở ngay"}
                      </Button>
                    </CardContent>
                  </Card>
                </a>
              );
            })}

          {/* Backup static links if none in DB (for safety) */}
          {(!settings.support_links ||
            settings.support_links.filter((l) => l.is_social).length === 0) && (
            <div className="text-center p-8 border-2 border-dashed rounded-3xl opacity-50">
              <p>Chưa có thông tin mạng xã hội được thiết lập.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
