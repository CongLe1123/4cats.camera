import { getCameraById, getStoreSettings } from "../../../lib/fetchCameras";
import ProductDetailClient from "./ProductDetailClient";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [camera, storeSettings] = await Promise.all([
    getCameraById(id),
    getStoreSettings(),
  ]);

  return <ProductDetailClient camera={camera} storeSettings={storeSettings} />;
}
