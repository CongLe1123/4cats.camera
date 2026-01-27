import LookupClient from "./LookupClient";

export const metadata = {
  title: "Quản lý danh mục | 4cats.camera Admin",
  description: "Quản lý hãng, loại máy, dòng máy and other lookup tables.",
};

export default function LookupsPage() {
  return <LookupClient />;
}
