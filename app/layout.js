import "./globals.css";
import { Navbar } from "../components/Navbar";
import { FloatingContact } from "../components/FloatingContact";

export const metadata = {
  title: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
  description:
    "Chuyên cung cấp máy ảnh chất lượng, dịch vụ order máy ảnh uy tín cho người mới và creator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
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
                    href="#"
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
                    href="https://instagram.com/4cats.camera"
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
                      Chi nhánh Sài Gòn
                    </strong>
                    <p>123 Đường Pastel, Phường 4, Quận Cute, TP.HCM</p>
                    <p className="mt-1">Hotline: 09xx-xxx-xxx</p>
                  </div>
                  <div>
                    <strong className="text-foreground block mb-1">
                      Chi nhánh Hà Nội
                    </strong>
                    <p>456 Phố Vintage, Quận Hoàn Kiếm, Hà Nội</p>
                    <p className="mt-1">Hotline: 08xx-xxx-xxx</p>
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
                    <span>hello@4cats.camera</span>
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>09xx-xxx-xxx (Zalo/Imess)</span>
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
        <FloatingContact />
      </body>
    </html>
  );
}
