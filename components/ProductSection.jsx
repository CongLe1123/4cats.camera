"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, ShoppingBag, CheckCircle2 } from "lucide-react";

export function ProductSection({ title, brand = "All", items = [], viewAllLink = null }) {
  const formatPrice = (val) => {
    if (!val) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(val) + "đ";
  };

  const destinationLink = viewAllLink || (brand !== "All" ? `/shop?brand=${encodeURIComponent(brand)}` : "/shop");

  if (!items || items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs shadow-2xs"
          asChild
        >
          <Link href={destinationLink}>
            Xem tất cả <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item, i) => {
          const targetLink = item.slug ? `/may-anh/${item.slug}` : (item.link || `/shop/${item.id || "#"}`);
          const displayPrice = item.minPrice || item.price || item.variants?.[0]?.price;
          const comparePrice = item.compare_at_price || item.original_price;
          const hasDiscount = comparePrice && comparePrice > displayPrice;
          const discountPercent = item.discountPercent || (hasDiscount ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0);

          return (
            <Card
              key={item.id || item.slug || i}
              className="overflow-hidden flex flex-col group h-full border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white hover:-translate-y-1"
            >
              {/* Image & Badges */}
              <div className="aspect-4/3 relative overflow-hidden bg-secondary/15">
                <Link href={targetLink} className="block w-full h-full relative">
                  <Image
                    src={item.image || item.main_image || "/favicon.ico"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                  />
                </Link>

                {/* Top-left Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <Badge
                    variant="secondary"
                    className="border-none px-2.5 py-0.5 text-[10px] uppercase font-black bg-white text-primary shadow-xs"
                  >
                    {item.brand || brand}
                  </Badge>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Mới 100%
                  </span>
                </div>

                {/* Top-right Discount Badge */}
                {hasDiscount && discountPercent > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      -{discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <CardHeader className="p-4 pb-1 space-y-1.5">
                <Link href={targetLink}>
                  <CardTitle className="text-base md:text-lg font-black text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                    {item.name}
                  </CardTitle>
                </Link>

                {/* Purpose / Feature Tags */}
                <div className="flex flex-wrap gap-1">
                  {(item.features || item.use_cases || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="px-4 py-2 grow flex flex-col justify-end space-y-1.5">
                {/* Price Display */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    {item.variants && item.variants.length > 1 ? "Giá từ:" : "Giá chính hãng:"}
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-black text-primary">
                      {formatPrice(displayPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Card Footer: CTA */}
              <CardFooter className="p-4 pt-1 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-9"
                  asChild
                >
                  <Link href={targetLink}>
                    Chi tiết
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl sticker font-bold text-xs h-9 shadow-xs"
                  asChild
                >
                  <Link href={`${targetLink}#dat-mua`}>
                    Mua ngay
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
