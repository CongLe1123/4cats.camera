import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return {
    alternates: {
      canonical: `https://4catscamera.com/may-anh/${slug}`
    }
  };
}

export default async function LegacyInventoryUnitRedirect({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  redirect(`/may-anh/${slug}`);
}
