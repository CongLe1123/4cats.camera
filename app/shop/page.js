import { getCameras, getFilters } from "../../lib/fetchCameras";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export const metadata = {
  title: "Cửa Hàng Máy Ảnh Chính Hãng Mới 100% — 4cats Camera",
  description:
    "Khám phá các dòng máy ảnh Canon, Sony, Fujifilm, Nikon mới chính hãng dành cho người mới, selfie, vlog và du lịch. Giá tốt, bảo hành 12–24 tháng, 7 ngày 1 đổi 1.",
  alternates: {
    canonical: "https://4catscamera.com/shop",
  },
  openGraph: {
    title: "Cửa Hàng Máy Ảnh Chính Hãng Mới 100% — 4cats Camera",
    description:
      "Khám phá các dòng máy ảnh Canon, Sony, Fujifilm, Nikon mới chính hãng dành cho người mới, selfie, vlog và du lịch.",
    url: "https://4catscamera.com/shop",
    type: "website",
  },
};

export default async function ShopPage() {
  const [cameras, filters] = await Promise.all([getCameras(), getFilters()]);

  return <ShopClient cameras={cameras} filters={filters} />;
}
