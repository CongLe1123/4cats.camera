import { getCameraById } from "../../../lib/fetchCameras";
import ProductDetailClient from "./ProductDetailClient";
import { use } from "react";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const camera = await getCameraById(id);

  return <ProductDetailClient camera={camera} />;
}
