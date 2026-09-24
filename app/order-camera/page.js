import { getBanners } from "../../lib/fetchCameras";
import OrderCameraClient from "./OrderCameraClient";

export const revalidate = 60;

export const metadata = {
  title: "Dịch Vụ Order Máy Ảnh Theo Yêu Cầu Uy Tín — 4cats Camera",
  description:
    "Tìm kiếm dòng máy ảnh hiếm, phiên bản màu đặc biệt từ Nhật, Mỹ? 4cats Camera nhận order máy ảnh uy tín, kiểm định kỹ thuật 100%, bảo hành chính hãng.",
  alternates: {
    canonical: "https://4catscamera.com/order-camera",
  },
  openGraph: {
    title: "Dịch Vụ Order Máy Ảnh Theo Yêu Cầu Uy Tín — 4cats Camera",
    description:
      "Tìm kiếm dòng máy ảnh hiếm, phiên bản màu đặc biệt từ Nhật, Mỹ? 4cats Camera nhận order máy ảnh uy tín, kiểm định kỹ thuật 100%, bảo hành chính hãng.",
    url: "https://4catscamera.com/order-camera",
    type: "website",
  },
};

export default async function OrderCameraPage() {
  const banners = await getBanners();

  return <OrderCameraClient banners={banners} />;
}
