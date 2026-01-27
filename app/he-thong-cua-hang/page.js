import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { getStoreSettings } from "../../lib/fetchCameras";

export default async function StoreSystem() {
  const settings = await getStoreSettings();

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center italic text-primary">
        Hệ thống cửa hàng
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        Ghé thăm chúng mình để trải nghiệm máy trực tiếp nhé! 📸🐾
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settings.locations?.map((loc, index) => (
          <Card
            key={index}
            className="border-none bg-white shadow-xl sticker overflow-hidden"
          >
            <div className="h-48 bg-primary/20 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold italic text-primary">
                {loc.name || `4cats - Chi nhánh ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <p className="text-muted-foreground">{loc.address}</p>
              </div>

              {/* Show corresponding phone if available, otherwise show all */}
              <div className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <div className="flex flex-col">
                  {settings.contact_phones &&
                  settings.contact_phones.length > index ? (
                    <a
                      href={`tel:${settings.contact_phones[index].replace(/\s/g, "")}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {settings.contact_phones[index]}
                    </a>
                  ) : (
                    settings.contact_phones?.map((p, idx) => (
                      <a
                        key={idx}
                        href={`tel:${p.replace(/\s/g, "")}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {p}
                      </a>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-muted-foreground">
                  {settings.opening_hours || "09:00 - 21:00 (Hàng ngày)"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-secondary/30 p-8 rounded-4xl text-center sticker">
        <h2 className="text-2xl font-bold mb-4 italic">
          Theo dõi chúng mình trên Instagram để cập nhật máy mới mỗi ngày!
        </h2>
        {settings.instagram_url && (
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full text-primary font-bold shadow-lg hover:scale-105 transition-all"
          >
            <Instagram className="h-5 w-5" />@
            {settings.instagram_url.split("/").filter(Boolean).pop() ||
              "4cats.camera"}
          </a>
        )}
      </div>
    </div>
  );
}
