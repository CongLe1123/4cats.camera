import { getProductModel, getStoreSettings } from "../../../lib/fetchCameras";
import ModelDetailView from "../../../components/ModelDetailView";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const model = await getProductModel(slug);

  if (!model) {
    return {
      title: "Không tìm thấy máy ảnh — 4cats Camera",
      description: "Dòng máy ảnh bạn đang tìm kiếm hiện không có sẵn tại 4cats Camera."
    };
  }

  const title = `${model.brand} ${model.model_name} Chính Hãng Mới 100% — 4cats Camera`;
  const desc =
    model.beginner_summary ||
    model.short_description ||
    `Mua máy ảnh ${model.brand} ${model.model_name} mới 100% chính hãng tại 4cats Camera. Bảo hành 12–24 tháng chính hãng, 7 ngày 1 đổi 1, freeship toàn quốc.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://4catscamera.com/may-anh/${model.slug}`
    },
    openGraph: {
      title,
      description: desc,
      url: `https://4catscamera.com/may-anh/${model.slug}`,
      siteName: "4cats Camera",
      images: [
        {
          url: model.main_image || model.image || "/favicon.ico",
          width: 800,
          height: 600,
          alt: `${model.brand} ${model.model_name}`
        }
      ],
      type: "website"
    }
  };
}

export default async function ProductModelPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [model, storeSettings] = await Promise.all([
    getProductModel(slug),
    getStoreSettings()
  ]);

  if (!model) {
    notFound();
  }

  // Generate JSON-LD Schema for New Camera Product
  const minPrice = model.minPrice || 10000000;
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${model.brand} ${model.model_name}`,
    image: model.main_image || model.image,
    description: model.short_description || model.beginner_summary,
    brand: {
      "@type": "Brand",
      name: model.brand
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: minPrice,
      offerCount: model.variants?.length || 1,
      availability: model.isAvailable !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "4cats Camera"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModelDetailView model={model} storeSettings={storeSettings} />
    </>
  );
}
