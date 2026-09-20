import "./globals.css";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { getStoreSettings } from "../lib/fetchCameras";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
  description:
    "Chuyên cung cấp máy ảnh chất lượng, dịch vụ order máy ảnh uy tín cho người mới và creator.",
  keywords: [
    "máy ảnh",
    "compact camera",
    "mirrorless",
    "thuê máy ảnh",
    "order máy ảnh",
    "4cats camera",
  ],
  authors: [{ name: "4cats.camera" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#ff6b88",
  openGraph: {
    title: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
    description:
      "Chuyên cung cấp máy ảnh chất lượng, dịch vụ order máy ảnh uy tín cho người mới và creator.",
    type: "website",
    locale: "vi_VN",
    siteName: "4cats.camera",
  },
};

export default async function RootLayout({ children }) {
  const storeSettings = await getStoreSettings();

  return (
    <html lang="vi">
      <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
        <LayoutWrapper storeSettings={storeSettings}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
