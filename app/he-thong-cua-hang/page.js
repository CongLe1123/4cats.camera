import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Mail,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {settings.locations?.map((loc, index) => (
          <Card
            key={index}
            className="border-none bg-white shadow-xl sticker overflow-hidden flex flex-col h-full"
          >
            <div className="h-64 bg-gray-100 relative overflow-hidden shrink-0">
              {loc.iframe_url ? (
                <iframe
                  src={loc.iframe_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : index === 0 ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8481119837325!2d105.79822241030531!3d21.038762580532197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3edc7bd19d%3A0xe62497f72909045d!2zNmEyIE5nLiAxNTggxJAuIE5ndXnhu4VuIEtow6FuaCBUb8OgbiwgUXVhbiBIb2EsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpIDEwMDAwLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1770485061727!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : index === 1 ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7608510508912!2d105.81966159999999!3d21.0022214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac84fafbf469%3A0xbc58d65e5e48b023!2zNTEgxJAuIE5ndXnhu4VuIFRyw6NpLCBOZ8OjIFTGsCBT4bufLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpIDEwMDAwMCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1770485168357!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20">
                  <MapPin className="h-16 w-16 text-primary" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold italic text-primary">
                {loc.name || `4cats - Chi nhánh ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 grow">
              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{loc.address}</p>
              </div>

              {/* Hours */}
              <div className="flex gap-3 items-center">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-muted-foreground">
                  {settings.opening_hours || "09:00 - 21:00 (Hàng ngày)"}
                </p>
              </div>

              <div className="border-t border-dashed my-2"></div>

              {/* Phone */}
              <div className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Hotline
                  </span>
                  <a
                    href={`tel:${(loc.phone || settings.contact_phones?.[index] || "").replace(/\s/g, "")}`}
                    className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
                  >
                    {loc.phone || settings.contact_phones?.[index] || "---"}
                  </a>
                </div>
              </div>

              {/* Email */}
              {(loc.email || settings.contact_email) && (
                <div className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Email
                    </span>
                    <a
                      href={`mailto:${loc.email || settings.contact_email}`}
                      className="text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      {loc.email || settings.contact_email}
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t border-dashed my-2"></div>

              {/* Socials List */}
              <div className="flex flex-wrap gap-3">
                {(() => {
                  const socialLinks =
                    loc.social_links && loc.social_links.length > 0
                      ? loc.social_links
                      : [
                          (loc.facebook || settings.facebook_url) && {
                            platform: "Facebook",
                            url: loc.facebook || settings.facebook_url,
                            label: "Fanpage",
                          },
                          loc.zalo && {
                            platform: "Zalo",
                            url: loc.zalo,
                            label: "Zalo Chat",
                          },
                        ].filter(Boolean);

                  return socialLinks.map((link, linkIdx) => {
                    const { platform, label, url } = link;
                    let icon, bgClass, textColor;

                    switch (platform) {
                      case "Facebook":
                        bgClass = "bg-[#0084FF]";
                        icon = <Facebook className="w-4 h-4 text-white" />;
                        textColor = "text-blue-600";
                        break;
                      case "Zalo":
                        bgClass = "bg-[#0068FF]";
                        icon = (
                          <span className="font-black text-[10px] text-white">
                            Z
                          </span>
                        );
                        textColor = "text-blue-600";
                        break;
                      case "Instagram":
                        bgClass =
                          "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]";
                        icon = <Instagram className="w-4 h-4 text-white" />;
                        textColor = "text-pink-600";
                        break;
                      case "TikTok":
                        bgClass = "bg-black";
                        icon = (
                          <span className="font-bold text-[10px] text-white">
                            Tk
                          </span>
                        );
                        textColor = "text-black";
                        break;
                      case "Threads":
                        bgClass = "bg-black";
                        icon = (
                          <span className="font-bold text-sm text-white">
                            @
                          </span>
                        );
                        textColor = "text-black";
                        break;
                      default:
                        bgClass = "bg-gray-700";
                        icon = <LinkIcon className="w-4 h-4 text-white" />;
                        textColor = "text-gray-700";
                    }

                    return (
                      <a
                        key={linkIdx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all shadow-sm group"
                      >
                        <div
                          className={`${bgClass} w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}
                        >
                          {icon}
                        </div>
                        <span className={`text-sm font-semibold ${textColor}`}>
                          {label || platform}
                        </span>
                      </a>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
