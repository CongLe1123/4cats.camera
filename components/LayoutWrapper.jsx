"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { FloatingContact } from "./FloatingContact";
import { BrandLogo } from "./BrandLogo";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
  Heart,
} from "lucide-react";

export function LayoutWrapper({ children, storeSettings }) {
  const pathname = usePathname();
  const isAdminOrLogin =
    pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  const settings = storeSettings || {
    brand_name: "4cats.camera 📸",
    brand_description:
      "Chuyên cung cấp các dòng máy ảnh Compact, Mirrorless, DSLR đã qua sử dụng với chất lượng tốt nhất.",
    locations: [],
    support_links: [],
    contact_phones: ["039 824 9856"],
    contact_email: "fourcatscamera@gmail.com",
    opening_hours: "09:00 - 21:00 hàng ngày",
    copyright_text:
      "© 2026 4cats.camera - Người bạn đồng hành cùng đam mê nhiếp ảnh 🐱📸",
  };

  return (
    <>
      {!isAdminOrLogin && <Navbar />}
      <main className={`grow ${!isAdminOrLogin ? "pt-20 sm:pt-24" : ""}`}>
        {children}
      </main>
      {!isAdminOrLogin && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-primary/15 py-12 mt-auto text-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {/* Brand Info */}
              <div className="space-y-4">
                <BrandLogo size="md" />
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {settings.brand_description}
                </p>
                <div className="flex gap-3 pt-2">
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                      aria-label="Facebook Fanpage"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Hệ thống cửa hàng */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-base uppercase tracking-wider text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Hệ thống cửa hàng
                </h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {settings.locations?.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <strong className="text-foreground block font-bold text-xs uppercase tracking-wide">
                        {loc.name}
                      </strong>
                      <p className="text-xs leading-relaxed">{loc.address}</p>
                    </div>
                  ))}
                  <Link
                    href="/he-thong-cua-hang"
                    className="inline-block text-xs font-bold text-primary hover:underline pt-1"
                  >
                    Xem bản đồ chỉ đường →
                  </Link>
                </div>
              </div>

              {/* Chính sách & Thông tin */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-base uppercase tracking-wider text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Hỗ trợ khách hàng
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/chinh-sach/bao-hanh"
                      className="hover:text-primary transition-colors text-xs font-medium"
                    >
                      Chính sách bảo hành 1 đổi 1
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chinh-sach/mua-hang"
                      className="hover:text-primary transition-colors text-xs font-medium"
                    >
                      Hướng dẫn mua hàng & Vận chuyển
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rental"
                      className="hover:text-primary transition-colors text-xs font-medium"
                    >
                      Dịch vụ thuê máy trải nghiệm
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/order-camera"
                      className="hover:text-primary transition-colors text-xs font-medium"
                    >
                      Dịch vụ order máy theo yêu cầu
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-base uppercase tracking-wider text-primary flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Liên hệ trực tiếp
                </h4>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  {settings.contact_email && (
                    <li className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="hover:text-primary transition-colors font-medium"
                      >
                        {settings.contact_email}
                      </a>
                    </li>
                  )}
                  <li className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      {settings.contact_phones?.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="hover:text-primary transition-colors font-bold text-foreground text-sm"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </li>
                  {settings.opening_hours && (
                    <li className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>{settings.opening_hours}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-primary/10 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <p className="font-medium">
                {settings.copyright_text || "© 2026 4cats.camera 📸"}
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                Thiết kế với <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> cho người yêu nhiếp ảnh
              </p>
            </div>
          </div>
        </footer>
      )}
      {!isAdminOrLogin && <FloatingContact settings={settings} />}
    </>
  );
}
