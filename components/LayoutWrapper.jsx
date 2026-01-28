"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { FloatingContact } from "./FloatingContact";

export function LayoutWrapper({ children, storeSettings }) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  // settings is already merged with defaults in getStoreSettings()
  // but we add a final safety check here
  const settings = storeSettings || {
    brand_name: "4cats.camera 📸",
    brand_description: "Chuyên cung cấp máy ảnh chất lượng.",
    locations: [],
    support_links: [],
    contact_phones: []
  };

  return (
    <>
      {!isAdminOrLogin && <Navbar />}
      <main className={`grow ${!isAdminOrLogin ? "pt-20" : ""}`}>{children}</main>
      {!isAdminOrLogin && (
        <footer className="bg-white/50 backdrop-blur-sm border-t py-4 mt-auto text-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
              {/* Brand Info */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary italic">
                  {settings.brand_name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {settings.brand_description}
                </p>
                <div className="flex gap-4">
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-facebook"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-instagram"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Hệ thống cửa hàng */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Hệ thống cửa hàng 🏠</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {settings.locations?.map((loc, idx) => (
                    <div key={idx}>
                      <strong className="text-foreground block mb-1">
                        {loc.name}
                      </strong>
                      <p>{loc.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chính sách */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Hỗ trợ khách hàng 🤝</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {settings.support_links
                    ?.filter((link) => !link.is_social)
                    .map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.href || "#"}
                          className="hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Liên hệ 💌</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {settings.contact_email && (
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span>{settings.contact_email}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="flex flex-col">
                      {settings.contact_phones?.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="hover:text-primary transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </li>
                  {settings.opening_hours && (
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{settings.opening_hours}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                {settings.copyright_text}
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Được thiết kế với tình yêu dành cho người mới bắt đầu.
              </p>
            </div>
          </div>
        </footer>
      )}
      {!isAdminOrLogin && <FloatingContact settings={settings} />}
    </>
  );
}
