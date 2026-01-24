import { getCameras, getFilters } from "../../lib/fetchCameras";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [cameras, filters] = await Promise.all([getCameras(), getFilters()]);

  return <ShopClient cameras={cameras} filters={filters} />;
}
