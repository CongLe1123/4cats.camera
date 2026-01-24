"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { FloatingContact } from "./FloatingContact";

export function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <>
      {!isAdminOrLogin && <Navbar />}
      <main className={`flex-grow ${!isAdminOrLogin ? "pt-20" : ""}`}>{children}</main>
      {!isAdminOrLogin && (
        <footer className="bg-white/50 backdrop-blur-sm border-t py-4 mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
              {/* Brand Info */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary italic">
                  4cats.camera 📸
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Chuyên cung cấp các dòng máy ảnh Compact, Mirrorless, DSLR đã
                  qua sử dụng với chất lượng tốt nhất. Uy tín tạo nên thương
                  hiệu.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=100093056073018"
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
                  <a
                    href="https://www.instagram.com/4cats.camera/"
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
                </div>
              </div>

              {/* Hệ thống cửa hàng */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Hệ thống cửa hàng 🏠</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground block mb-1">
                      Cơ sở 1 - Cầu Giấy
                    </strong>
                    <p>
                      Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà
                      Nội
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground block mb-1">
                      Cơ sở 2 - Thanh Xuân
                    </strong>
                    <p>Số 51 Nguyễn Trãi, Ngã tư Sở, Thanh Xuân, Hà Nội</p>
                  </div>
                </div>
              </div>

              {/* Chính sách */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Hỗ trợ khách hàng 🤝</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Chính sách bảo hành
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Chính sách đổi trả
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Hướng dẫn mua hàng
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Gửi yêu cầu bảo hành
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Liên hệ 💌</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
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
                    <span>fourcatscamera@gmail.com</span>
                  </li>
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
                      <a
                        href="tel:0398249856"
                        className="hover:text-primary transition-colors"
                      >
                        039 824 9856
                      </a>
                      <a
                        href="tel:0932356869"
                        className="hover:text-primary transition-colors"
                      >
                        093 235 68 69
                      </a>
                    </div>
                  </li>
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
                    <span>Open: 9:00 - 21:00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                © 2026 4cats.camera - Người bạn đồng hành cùng đam mê nhiếp ảnh
                🐱📸
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Được thiết kế với tình yêu dành cho người mới bắt đầu.
              </p>
            </div>
          </div>
        </footer>
      )}
      {!isAdminOrLogin && <FloatingContact />}
    </>
  );
}
