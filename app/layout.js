import "./globals.css";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { getStoreSettings } from "../lib/fetchCameras";

export const metadata = {
  title: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
  description:
    "Chuyên cung cấp máy ảnh chất lượng, dịch vụ order máy ảnh uy tín cho người mới và creator.",
};

export default async function RootLayout({ children }) {
  const storeSettings = await getStoreSettings();

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
        <LayoutWrapper storeSettings={storeSettings}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
