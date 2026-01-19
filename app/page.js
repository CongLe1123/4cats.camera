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

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Banner Carousel Section - Replaces Hero */}
      <section className="container mx-auto px-4 py-8">
        <BannerCarousel />
      </section>

      {/* Hot Trend Section - Updated to match Shop Page Style */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Dòng máy Hot / Trend 🔥</h2>
          <Link
            href="/shop"
            className="text-primary font-medium hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Fujifilm Series X",
              image:
                "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
              brand: "Fujifilm",
              condition: "Hot Trend",
              features: ["Film Simulation", "Retro Design"],
              desc: "Dòng máy Mirrorless được yêu thích nhất với thiết kế hoài cổ.",
              cta: "Xem Series X",
              link: "/shop?brand=Fujifilm&series=X-Series",
            },
            {
              id: 3,
              name: "Sony ZV Series",
              image:
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
              brand: "Sony",
              condition: "Best Vlog",
              features: ["4K Video", "Fast AF"],
              desc: "Lựa chọn hàng đầu cho Vlogger và Content Creator.",
              cta: "Xem Sony ZV",
              link: "/shop?brand=Sony&series=ZV",
            },
            {
              id: 2,
              name: "Canon R Series",
              image:
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
              brand: "Canon",
              condition: "Best Seller",
              features: ["Skin Tone", "Easy to use"],
              desc: "Màu da nịnh mắt, dễ sử dụng cho người mới bắt đầu.",
              cta: "Xem Canon R",
              link: "/shop?brand=Canon&series=EOS R",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="overflow-hidden flex flex-col group h-full border-none shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge
                    variant="secondary"
                    className="glass border-none px-3 py-1 text-[10px] uppercase font-bold"
                  >
                    {item.brand}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/90 border-none px-3 py-1 text-[10px] uppercase font-bold text-primary"
                  >
                    {item.condition}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-5">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {item.name}
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-2 mt-1">
                  {item.features.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold text-muted-foreground/70 bg-secondary/50 px-2 py-0.5 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-4 flex-grow">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.desc}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button className="w-full sticker h-10" asChild>
                  <Link href={item.link}>{item.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

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
