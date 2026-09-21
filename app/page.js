import Link from "next/link";
import { Button } from "../components/ui/button";
import { BannerCarousel } from "../components/BannerCarousel";
import { BrandList } from "../components/BrandList";
import { ProductSection } from "../components/ProductSection";
import { HomeSearch } from "../components/HomeSearch";
import {
  getFeaturedCameras,
  getBrandSections,
  getBanners,
  getCameras
} from "../lib/fetchCameras";
import {
  getDiscountedProducts,
  getNewArrivalProducts
} from "../lib/productData";
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Gift,
  Flame,
  Camera,
  Heart
} from "lucide-react";
import { CameraQuizModal } from "../components/CameraQuizModal";
import { CameraCompareModal } from "../components/CameraCompareModal";

export const revalidate = 60;

export default async function Home() {
  const [featuredCameras, brandSections, banners, allCameras] = await Promise.all([
    getFeaturedCameras(),
    getBrandSections(),
    getBanners(),
    getCameras()
  ]);

  const discountedCameras = getDiscountedProducts();
  const newArrivals = getNewArrivalProducts();

  // Compact Quick Shopping Shortcuts
  const quickShortcuts = [
    { label: "Máy cho người mới", icon: "🌱", href: "/shop?intent=Người+mới" },
    { label: "Selfie góc rộng", icon: "🤳", href: "/shop?intent=Selfie" },
    { label: "Quay Vlog", icon: "🎥", href: "/shop?intent=Vlog" },
    { label: "Du lịch nhỏ nhẹ", icon: "✈️", href: "/shop?intent=Du+lịch" },
    { label: "Chụp người OOTD", icon: "👗", href: "/shop?intent=Chụp+người" },
    { label: "Tone màu Film", icon: "🎞️", href: "/shop?intent=Film+look" },
    { label: "Dưới 15 triệu", icon: "💰", href: "/shop?maxPrice=15000000" }
  ];

  // Needs/Intent cards
  const intentCards = [
    { label: "Selfie / Tự sướng", icon: "🤳", query: "Selfie", desc: "Màn hình lật 180°, màu da mịn đẹp tươi tắn" },
    { label: "Chụp người / Chân dung", icon: "👗", query: "Chụp người", desc: "Xóa phông ảo diệu, tôn dáng OOTD" },
    { label: "Du lịch / Bỏ túi", icon: "✈️", query: "Du lịch", desc: "Siêu nhẹ dưới 400g, đồng hành mọi chuyến đi" },
    { label: "Quay Vlog / TikTok", icon: "🎥", query: "Vlog", desc: "Bắt nét mắt cực nhạy, micro thu âm trong trẻo" },
    { label: "Màu Film Vintage", icon: "🎞️", query: "Film look", desc: "Giả lập màu film hoài cổ chụp ăn ngay" },
    { label: "Người mới bắt đầu", icon: "🌱", query: "Người mới", desc: "Giao diện tiếng Việt dễ dùng, tự động thông minh" }
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-20 pt-4 sm:pt-6">
      {/* 1. HERO PROMOTIONAL CAROUSEL (TOP PRIORITY) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <BannerCarousel banners={banners} />
      </section>

      {/* 2. QUICK SHOPPING SHORTCUTS BAR */}
      <section className="container mx-auto px-4 max-w-6xl -mt-4 md:-mt-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-4 border border-primary/15 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center">
            {quickShortcuts.map((chip, idx) => (
              <Link
                key={idx}
                href={chip.href}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary/15 hover:bg-primary hover:text-white text-foreground text-xs font-bold transition-all border border-primary/10 shadow-2xs hover:scale-105 active:scale-95"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (# MÁY ĐƯỢC YÊU THÍCH / NỔI BẬT) WITH PRICES DIRECTLY ON HOMEPAGE */}
      {featuredCameras && featuredCameras.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl space-y-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase text-primary tracking-wider">
              Khuyên dùng cho người mới
            </span>
          </div>
          <ProductSection
            title="Máy Ảnh Được Yêu Thích Nhất 🔥"
            brand="All"
            items={featuredCameras}
            viewAllLink="/shop"
          />
        </section>
      )}

      {/* 4. COMPACT SEARCH & DISCOVERY BAR */}
      <section className="container mx-auto px-4 max-w-4xl py-2">
        <div className="text-center space-y-1 mb-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Tìm nhanh chiếc máy mong muốn
          </span>
        </div>
        <HomeSearch />
      </section>

      {/* 5. CURRENT PROMOTIONS / DEALS (# ƯU ĐÃI HÔM NAY) */}
      {discountedCameras && discountedCameras.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Gift className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase text-red-500 tracking-wider">
              Khuyến mãi đang diễn ra
            </span>
          </div>
          <ProductSection
            title="Ưu Đãi Hôm Nay 🎁"
            brand="All"
            items={discountedCameras}
            viewAllLink="/shop"
          />
        </section>
      )}

      {/* 6. CHỌN MÁY THEO NHU CẦU (# BẠN CẦN MÁY ĐỂ... ✨) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black uppercase text-primary tracking-wider">
              Lựa chọn thông minh
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Bạn Cần Máy Để Làm Gì? ✨
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {intentCards.map((intent, idx) => (
            <Link
              key={idx}
              href={`/shop?intent=${encodeURIComponent(intent.query)}`}
              className="p-4 rounded-3xl bg-white border border-primary/15 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {intent.icon}
              </span>
              <span className="font-bold text-xs md:text-sm text-foreground group-hover:text-primary transition-colors">
                {intent.label}
              </span>
              <span className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                {intent.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. NEW ARRIVALS (# DÒNG MÁY MỚI VỀ / MỚI RA MẮT ✨) */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase text-primary tracking-wider">
              Hàng mới về kho
            </span>
          </div>
          <ProductSection
            title="Dòng Máy Mới Về ✨"
            brand="All"
            items={newArrivals}
            viewAllLink="/shop"
          />
        </section>
      )}

      {/* 8. THƯƠNG HIỆU NỔI BẬT (# HỆ THỐNG CHÍNH HÃNG) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black uppercase text-primary tracking-wider">
              Hệ sinh thái chính hãng
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Thương Hiệu Máy Ảnh 🏷️
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Khám phá kho máy <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <BrandList />
      </section>

      {/* 9. DYNAMIC BRAND SECTIONS */}
      {brandSections.map((section) => (
        <ProductSection
          key={section.brandName}
          title={`Máy ảnh ${section.brandName} Mới Chính Hãng`}
          brand={section.brandName}
          items={section.items}
        />
      ))}

      {/* 10. BEGINNER RECOMMENDATION / ASSISTANCE BLOCK */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-linear-to-r from-secondary/40 via-white to-primary/10 rounded-4xl p-6 md:p-10 border border-primary/20 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase text-primary tracking-widest">
              Dành riêng cho bạn mới bắt đầu
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-foreground">
              Bạn Chưa Biết Nên Chọn Chiếc Máy Nào? 🐾
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Làm bài trắc nghiệm 30 giây để nhận gợi ý chiếc máy vừa vặn nhất với nhu cầu và túi tiền, hoặc so sánh chi tiết các mẫu máy bạn đang phân vân.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0 justify-center">
            <CameraQuizModal />
            <CameraCompareModal />
          </div>
        </div>
      </section>

      {/* 11. TRUST & COMMITMENT FROM 4CATS CAMERA */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-4xl p-8 md:p-12 border border-primary/15 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-primary tracking-widest">
              Cam kết dịch vụ 4cats Camera
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Vì Sao Bạn Yên Tâm Khi Mua Tại 4cats? 🐱💖
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Mọi sản phẩm tại 4cats đều là máy ảnh mới 100% chính hãng, nguyên seal, kích hoạt bảo hành điện tử chính hãng và được hỗ trợ kỹ thuật trọn đời.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-3xl bg-secondary/15 border border-primary/10 space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-primary shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Mới 100% Chính Hãng</h3>
              <p className="text-xs text-muted-foreground">
                Nguyên seal fullbox đầy đủ phụ kiện. Kích hoạt bảo hành điện tử chính hãng từ Canon, Sony, Fujifilm.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-secondary/15 border border-primary/10 space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-primary shadow-xs">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Bảo Hành 12 – 24 Tháng</h3>
              <p className="text-xs text-muted-foreground">
                Bảo hành phần cứng toàn diện. Hỗ trợ vệ sinh cảm biến và tư vấn thông số kỹ thuật trọn đời máy.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-secondary/15 border border-primary/10 space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-primary shadow-xs">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm text-foreground">7 Ngày 1 Đổi 1</h3>
              <p className="text-xs text-muted-foreground">
                Nếu phát sinh bất kỳ lỗi kỹ thuật nào từ nhà sản xuất trong 7 ngày đầu, 4cats đổi máy mới ngay.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-secondary/15 border border-primary/10 space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-primary shadow-xs">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Freeship Toàn Quốc</h3>
              <p className="text-xs text-muted-foreground">
                Miễn phí giao hàng cho đơn từ 10 triệu. Đóng hộp chống sốc chuyên dụng và bảo hiểm hàng hóa 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CTA BANNER */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-primary text-primary-foreground rounded-4xl p-8 md:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black">
              Sẵn Sàng Ghi Lại Khoảnh Khắc? 📸✨
            </h2>
            <p className="text-primary-foreground/90 text-sm md:text-lg max-w-lg mx-auto">
              Hãy để 4cats.camera cùng bạn bắt đầu hành trình nhiếp ảnh tuyệt vời với chiếc máy ảnh mới ưng ý nhất.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 h-13 text-base font-black sticker shadow-md cursor-pointer"
                asChild
              >
                <Link href="/shop">Khám phá tất cả máy ảnh</Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
