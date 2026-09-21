import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    alternates: {
      canonical: "https://4catscamera.com/huong-dan/chon-may-anh-cho-nguoi-moi"
    }
  };
}

export default async function LegacyBuyerGuideRedirect() {
  redirect("/huong-dan/chon-may-anh-cho-nguoi-moi");
}
