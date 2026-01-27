import { getStoreSettings } from "../../../lib/fetchCameras";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="p-4 md:p-8">
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
