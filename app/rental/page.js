import { getCameras, getFilters } from "../../lib/fetchCameras";
import RentalClient from "./RentalClient";

export const dynamic = "force-dynamic";

export default async function RentalPage() {
  const [cameras, filters] = await Promise.all([getCameras(), getFilters()]);

  return <RentalClient cameras={cameras} filters={filters} />;
}
