"use client";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Camera, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { BannerCarousel } from "../components/BannerCarousel";

import { BrandList } from "../components/BrandList";
import { ProductSection } from "../components/ProductSection";

export default function Home() {
  const hotTrendData = [
    {
      // Linked to Fujifilm X-T30 II (ID: 1)
      name: "Fujifilm Series X-T30 II",
      image:
        "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
      brand: "Fujifilm",
      condition: "Hot Trend",
      features: ["Film Simulation", "Retro Design"],
      desc: "Dòng máy Mirrorless được yêu thích nhất với thiết kế hoài cổ.",
      cta: "Xem chi tiết",
      link: "/shop/1",
    },
    {
      // Linked to Sony ZV-1 II (ID: 3)
      id: 3,
      name: "Sony ZV-1 II",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      brand: "Sony",
      condition: "Best Vlog",
      features: ["4K Video", "Fast AF"],
      desc: "Lựa chọn hàng đầu cho Vlogger và Content Creator.",
      cta: "Xem chi tiết",
      link: "/shop/3",
    },
    {
      // Linked to Canon EOS R50 (ID: 2)
      id: 2,
      name: "Canon EOS R50",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      brand: "Canon",
      condition: "Best Seller",
      features: ["Skin Tone", "Easy to use"],
      desc: "Màu da nịnh mắt, dễ sử dụng cho người mới bắt đầu.",
      cta: "Xem chi tiết",
      link: "/shop/2",
    },
  ];

  const casioData = [
    {
      name: "Casio Exilim ZR50",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
      desc: "Máy ảnh selfie thần thánh, làn da trắng hồng tự nhiên.",
      features: ["Selfie", "Smooth Skin"],
      condition: "Rare",
      link: "/shop?brand=Casio",
    },
    {
      name: "Casio TR-M11",
      image:
        "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop",
      desc: "Thiết kế hộp phấn độc đáo, chuyên dụng cho làm đẹp.",
      features: ["Unique Design", "Beauty Mode"],
      condition: "New 99%",
      link: "/shop?brand=Casio",
    },
    {
      name: "Casio ZR3600",
      image:
        "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800&auto=format&fit=crop",
      desc: "Màu ảnh trong trẻo, kết nối wifi chuyển ảnh nhanh chóng.",
      features: ["WiFi", "Fast Shot"],
      condition: "Like New",
      link: "/shop?brand=Casio",
    },
  ];

  const canonData = [
    {
      name: "Canon G7X Mark III",
      image:
        "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=800&auto=format&fit=crop",
      desc: "King of Vlogging của Canon, quay video 4K không crop.",
      features: ["4K Video", "Live Stream"],
      condition: "Best Seller",
      link: "/shop?brand=Canon",
    },
    {
      name: "Canon Simpson IXY",
      image:
        "https://images.unsplash.com/photo-1564466021184-463ac358547b?q=80&w=800&auto=format&fit=crop",
      desc: "Dòng compact cổ điển với chất màu vintage đặc trưng.",
      features: ["Vintage", "CCD Sensor"],
      condition: "Vintage",
      link: "/shop?brand=Canon",
    },
    {
      name: "Canon EOS M50 Mark II",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      desc: "Hoàn hảo cho người mới bắt đầu chơi máy ảnh ống kính rời.",
      features: ["Eye AF", "Touch Screen"],
      condition: "Like New",
      link: "/shop?brand=Canon",
    },
  ];

  const sonyData = [
    {
      name: "Sony ZV-E10",
      image:
        "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
      desc: "Máy quay Vlog ống kính rời, cảm biến APS-C lớn.",
      features: ["Vlog", "Livestream"],
      condition: "Hot",
      link: "/shop?brand=Sony",
    },
    {
      name: "Sony Cyber-shot WX500",
      image:
        "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800&auto=format&fit=crop",
      desc: "Zoom quang học 30x trong thân máy siêu nhỏ gọn.",
      features: ["Super Zoom", "Compact"],
      condition: "98%",
      link: "/shop?brand=Sony",
    },
    {
      name: "Sony A7C",
      image:
        "https://images.unsplash.com/photo-1513635269975-5906d4b99d65?q=80&w=800&auto=format&fit=crop",
      desc: "Full-frame nhỏ gọn nhất thế giới, chất lượng đỉnh cao.",
      features: ["Full Frame", "Compact"],
      condition: "New 100%",
      link: "/shop?brand=Sony",
    },
  ];

  const nikonData = [
    {
      name: "Nikon Z fc",
      image:
        "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
      desc: "Thiết kế Heritage, cảm hứng từ dòng máy phim FM2 huyền thoại.",
      features: ["Retro", "Z Mount"],
      condition: "Style",
      link: "/shop?brand=Nikon",
    },
    {
      name: "Nikon Coolpix S6900",
      image:
        "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800&auto=format&fit=crop",
      desc: "Màn hình xoay lật selfie, chân đế tích hợp tiện lợi.",
      features: ["Selfie Stand", "Glamour"],
      condition: "Cute",
      link: "/shop?brand=Nikon",
    },
    {
      name: "Nikon D3500",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      desc: "DSLR nhỏ nhẹ, thời lượng pin cực khủng 1550 tấm.",
      features: ["Great Battery", "Easy Mode"],
      condition: "Good",
      link: "/shop?brand=Nikon",
    },
  ];

  const fujiData = [
    {
      name: "Fujifilm X100V",
      image:
        "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800&auto=format&fit=crop",
      desc: "Biểu tượng của nhiếp ảnh đường phố, thiết kế rangefinder.",
      features: ["Hybrid Viewfinder", "Film Sim"],
      condition: "Premium",
      link: "/shop?brand=Fujifilm",
    },
    {
      name: "Fujifilm X-A7",
      image:
        "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=800&auto=format&fit=crop",
      desc: "Màn hình lớn, màu da đẹp, chuyên cho người mới.",
      features: ["Smart Menu", "Skin Tone"],
      condition: "Like New",
      link: "/shop?brand=Fujifilm",
    },
    {
      name: "Instax Mini Evo",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
      desc: "Máy ảnh Hybrid, chụp và in ảnh ngay lập tức.",
      features: ["Print Instant", "Fun"],
      condition: "New",
      link: "/shop?brand=Fujifilm",
    },
  ];

  const lumixData = [
    {
      name: "Lumix GF10",
      image:
        "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop",
      desc: "Nhỏ xinh thời trang, chế độ Selfie ban đêm cực đỉnh.",
      features: ["Night Selfie", "Fashion"],
      condition: "Pink/White",
      link: "/shop?brand=Lumix",
    },
    {
      name: "Lumix LX100 II",
      image:
        "https://images.unsplash.com/photo-1564466021184-463ac358547b?q=80&w=800&auto=format&fit=crop",
      desc: "Cảm biến 4/3 lớn trong thân máy compact, ống kính Leica f/1.7.",
      features: ["Leica Lens", "Large Sensor"],
      condition: "Pro",
      link: "/shop?brand=Lumix",
    },
    {
      name: "Lumix G100",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      desc: "Thiết kế riêng cho Vlogger, âm thanh OZO Audio xịn xò.",
      features: ["OZO Audio", "Vlog"],
      condition: "New 99%",
      link: "/shop?brand=Lumix",
    },
  ];

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Banner Carousel Section - Replaces Hero */}
      <section className="container mx-auto px-4 py-8">
        <BannerCarousel />
      </section>

      {/* Brand List Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Thương hiệu yêu thích 💖</h2>
        </div>
        <BrandList />
      </section>

      {/* Hot Trend Section */}
      <ProductSection
        title="Dòng máy Hot / Trend 🔥"
        brand="All"
        items={hotTrendData}
      />

      {/* Brand Specific Sections */}
      <ProductSection
        title="Máy ảnh Casio ✨"
        brand="Casio"
        items={casioData}
      />
      <ProductSection
        title="Máy ảnh Canon 📸"
        brand="Canon"
        items={canonData}
      />
      <ProductSection title="Máy ảnh Sony 📹" brand="Sony" items={sonyData} />
      <ProductSection
        title="Máy ảnh Nikon 🦅"
        brand="Nikon"
        items={nikonData}
      />
      <ProductSection
        title="Máy ảnh Fujifilm 🎞️"
        brand="Fujifilm"
        items={fujiData}
      />
      <ProductSection
        title="Máy ảnh Lumix 🍭"
        brand="Lumix"
        items={lumixData}
      />

      {/* CTA section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
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
