"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BannerCarousel({ banners = [] }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
        nextSlide();
    }, 5000); // Auto scroll every 5 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-[2rem] group shadow-lg">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative h-full">
            <Link href={banner.link || '#'} className="block w-full h-full relative cursor-pointer">
                {/* Image only - Overlay removed as requested */}
                <img 
                   src={banner.image} 
                   alt="Banner" 
                   className="w-full h-full object-cover"
                />
            </Link>
          </div>
        ))}
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
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
                    className={`w-3 h-3 rounded-full transition-all ${current === idx ? "bg-primary scale-125 shadow-md border border-white/50" : "bg-white/50 hover:bg-white/80"}`}
                />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
