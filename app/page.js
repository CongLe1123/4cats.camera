import { Button } from "../components/ui/button";
import Link from "next/link";
import { BannerCarousel } from "../components/BannerCarousel";
import { BrandList } from "../components/BrandList";
import { ProductSection } from "../components/ProductSection";
import { HomeSearch } from "../components/HomeSearch";
import {
  getFeaturedCameras,
  getBrandSections,
  getBanners,
} from "../lib/fetchCameras";

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const [hotTrendData, brandSections, banners] = await Promise.all([
    getFeaturedCameras(),
    getBrandSections(),
    getBanners(),
  ]);

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 pt-7 sm:pt-8 md:pt-9">
      <HomeSearch />
      {/* Banner Carousel Section - Replaces Hero */}
      <section className="container mx-auto px-4 py-3 md:py-4">
        <BannerCarousel banners={banners} />
      </section>

      {/* Brand List Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Thương Hiệu Nổi Bật</h2>
        </div>
        <BrandList />
      </section>

      {/* Hot Trend Section */}
      {hotTrendData && hotTrendData.length > 0 && (
        <ProductSection
          title="Dòng máy Hot / Trend 🔥"
          brand="All"
          items={hotTrendData}
        />
      )}

      {/* Dynamic Brand Specific Sections */}
      {brandSections.map((section) => (
        <ProductSection
          key={section.brandName}
          title={`Máy ảnh ${section.brandName}`}
          brand={section.brandName}
          items={section.items}
        />
      ))}

      {/* CTA section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-4xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sẵn sàng ghi lại khoảnh khắc?
            </h2>
            <p className="text-primary-foreground/80 mb-10 text-lg md:text-xl max-w-xl mx-auto">
              Hãy để 4cats.camera cùng bạn bắt đầu hành trình nhiếp ảnh đầy thú
              vị.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full px-12 h-14 text-lg sticker"
              asChild
            >
              <Link href="/shop">Xem danh sách máy ngay</Link>
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </section>
    </div>
  );
}
