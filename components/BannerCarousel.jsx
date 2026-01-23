"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock Banners
const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
    title: "Chào mừng đến với 4cats",
    subtitle: "Giảm 10% cho đơn hàng đầu tiên. Mã: WELCOME4CATS",
    link: "/shop",
    cta: "Mua ngay"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop",
    title: "Combo Máy + Phụ Kiện",
    subtitle: "Tặng kèm thẻ nhớ và túi đựng khi mua combo.",
    link: "/shop",
    cta: "Xem combo"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=1600&auto=format&fit=crop",
    title: "Săn Máy Film Cực Chất",
    subtitle: "Dịch vụ order máy từ Nhật, Mỹ với giá tốt nhất.",
    link: "/order-camera",
    cta: "Đặt hàng"
  }
];

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
        nextSlide();
    }, 5000); // Auto scroll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-[2rem] group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative h-full">
            <Link href={banner.link} className="block w-full h-full relative">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <img 
                   src={banner.image} 
                   alt={banner.title} 
                   className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">{banner.title}</h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-sm">{banner.subtitle}</p>
                    <Button size="lg" className="rounded-full px-8 text-lg sticker hover:scale-105 transition-transform" asChild>
                        <span>{banner.cta}</span>
                    </Button>
                </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="text-white w-8 h-8" />
      </button>
       <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="text-white w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, idx) => (
            <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${current === idx ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"}`}
            />
        ))}
      </div>
    </div>
  );
}
