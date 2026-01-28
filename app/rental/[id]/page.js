import { getCameraById, getStoreSettings } from "../../../lib/fetchCameras";
import RentalDetailClient from "./RentalDetailClient";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

export default async function RentalDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [camera, storeSettings] = await Promise.all([
    getCameraById(id),
    getStoreSettings(),
  ]);

  return <RentalDetailClient camera={camera} storeSettings={storeSettings} />;
}
