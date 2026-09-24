import "./globals.css";
import { Lexend } from "next/font/google";
import localFont from "next/font/local";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { getStoreSettings } from "../lib/fetchCameras";

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
  display: "swap",
});

const genty = localFont({
  src: "../public/fonts/Genty.otf",
  variable: "--font-genty",
  display: "swap",
});

export const revalidate = 60;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff6b88",
};

export const metadata = {
  metadataBase: new URL("https://4catscamera.com"),
  title: {
    default: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
    template: "%s | 4cats.camera",
  },
  description:
    "Chuyên cung cấp máy ảnh chính hãng mới 100%, tư vấn chọn máy ảnh cho người mới và creator. Bảo hành chính hãng 12-24 tháng, 7 ngày 1 đổi 1.",
  keywords: [
    "máy ảnh chính hãng",
    "máy ảnh cho người mới",
    "compact camera",
    "mirrorless",
    "thuê máy ảnh",
    "order máy ảnh",
    "4cats camera",
  ],
  authors: [{ name: "4cats.camera" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "4cats.camera | Cửa hàng máy ảnh nhỏ xinh 🐱📸",
    description:
      "Chuyên cung cấp máy ảnh chất lượng, dịch vụ order máy ảnh uy tín cho người mới và creator.",
    type: "website",
    locale: "vi_VN",
    url: "https://4catscamera.com",
    siteName: "4cats.camera",
  },
};

export default async function RootLayout({ children }) {
  const storeSettings = await getStoreSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "CameraStore",
    name: "4cats.camera",
    url: "https://4catscamera.com",
    description: "Cửa hàng máy ảnh chính hãng nhỏ xinh dành cho người mới và creator.",
    telephone: "0398249856",
    email: "fourcatscamera@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Số 6A2 ngõ 158 Nguyễn Khánh Toàn, Cầu Giấy",
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=100093056073018",
      "https://www.instagram.com/4cats.camera/",
    ],
  };

  return (
    <html lang="vi" className={`${lexend.variable} ${genty.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
        <LayoutWrapper storeSettings={storeSettings}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
