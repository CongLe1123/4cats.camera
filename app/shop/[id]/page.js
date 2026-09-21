import { getCameraById, getStoreSettings } from "../../../lib/fetchCameras";
import ModelDetailView from "../../../components/ModelDetailView";
import ProductDetailClient from "./ProductDetailClient";
import { notFound, redirect } from "next/navigation";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const camera = await getCameraById(id);

  if (!camera) {
    return {
      title: "Không tìm thấy sản phẩm — 4cats Camera"
    };
  }

  const name = camera.brand && camera.model_name ? `${camera.brand} ${camera.model_name}` : camera.name;
  return {
    title: `${name} Chính Hãng Mới 100% — 4cats Camera`,
    description: camera.beginner_summary || camera.short_description || camera.desc || "Máy ảnh chính hãng mới 100% tại 4cats Camera."
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [camera, storeSettings] = await Promise.all([
    getCameraById(id),
    getStoreSettings(),
  ]);

  if (!camera) {
    notFound();
  }

  // If camera has a slug, redirect to canonical slug URL
  if (camera.slug) {
    redirect(`/may-anh/${camera.slug}`);
  }

  // If the camera is a full ProductModel with variants, render the new rich ModelDetailView
  if (camera.variants && camera.variants.length > 0) {
    return <ModelDetailView model={camera} storeSettings={storeSettings} />;
  }

  // Otherwise, render backward-compatible ProductDetailClient
  return <ProductDetailClient camera={camera} storeSettings={storeSettings} />;
}
