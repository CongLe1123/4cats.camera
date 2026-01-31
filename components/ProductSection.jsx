"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import { ArrowRight } from "lucide-react";

export function ProductSection({ title, brand, items }) {
  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" className="rounded-full border-primary/50 text-primary hover:bg-primary hover:text-white transition-all" asChild>
          <Link href={`/shop?brand=${brand}`}>
            Xem thêm <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <Card
            key={i}
            className="overflow-hidden flex flex-col group h-full border-none shadow-lg hover:shadow-xl transition-all"
          >
            <div className="aspect-4/3 relative overflow-hidden bg-muted">
              <Link href={item.link || `/shop/${item.id || '#'}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                />
              </Link>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge
                  variant="secondary"
                  className="border-none px-3 py-1 text-[10px] uppercase font-black bg-white text-[#FF3377] shadow-md"
                >
                  {item.brand || brand}
                </Badge>
                {item.condition && (
                  <Badge
                    variant="outline"
                    className="border-none px-3 py-1 text-[10px] uppercase font-black bg-white text-[#C10066] shadow-md"
                  >
                    {item.condition}
                  </Badge>
                )}
              </div>
            </div>
            <CardHeader className="p-5">
              <Link href={item.link || `/shop/${item.id || '#'}`}>
                <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                  {item.name}
                </CardTitle>
              </Link>
              <CardDescription className="flex flex-wrap gap-2 mt-1">
                {item.features && item.features.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-bold text-muted-foreground/70 bg-secondary/50 px-2 py-0.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-4 grow">
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.desc}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button className="w-full sticker h-10" asChild>
                <Link href={item.link || `/shop/${item.id || '#'}`}>
                    {item.cta || "Xem chi tiết"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
