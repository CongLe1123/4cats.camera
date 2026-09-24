import { getCameras, getFilters } from "../../lib/fetchCameras";
import RentalClient from "./RentalClient";

export const revalidate = 60;

export const metadata = {
  title: "Dịch Vụ Thuê Máy Ảnh Trải Nghiệm Giá Sinh Viên — 4cats Camera",
  description:
    "Dịch vụ cho thuê máy ảnh Mirrorless, Compact du lịch, chụp kỷ yếu, đi cafe giá rẻ, thủ tục nhanh gọn, thiết bị mới đẹp tại Hà Nội.",
  alternates: {
    canonical: "https://4catscamera.com/rental",
  },
  openGraph: {
    title: "Dịch Vụ Thuê Máy Ảnh Trải Nghiệm Giá Sinh Viên — 4cats Camera",
    description:
      "Dịch vụ cho thuê máy ảnh Mirrorless, Compact du lịch, chụp kỷ yếu giá tốt tại 4cats Camera.",
    url: "https://4catscamera.com/rental",
    type: "website",
  },
};

export default async function RentalPage() {
  const [cameras, filters] = await Promise.all([getCameras(), getFilters()]);

  return <RentalClient cameras={cameras} filters={filters} />;
}
