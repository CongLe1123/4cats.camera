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
            <Link href={banner.link || '#'} className="block w-full h-full relative cursor-pointer group/slide">
                <img 
                   src={banner.image} 
                   alt={banner.title || "Banner"} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover/slide:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8 md:p-16">
                  <div className="transform transition-all duration-700 translate-y-0 opacity-100 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                      {banner.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow-md mx-auto leading-relaxed">
                      {banner.description}
                    </p>
                    {banner.cta_text && (
                      <span className="inline-flex items-center justify-center bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                        {banner.cta_text}
                      </span>
                    )}
                  </div>
                </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <ChevronLeft className="text-white w-8 h-8" />
          </button>
           <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <ChevronRight className="text-white w-8 h-8" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${current === idx ? "bg-primary scale-125 shadow-lg ring-2 ring-primary/50" : "bg-white/50 hover:bg-white/80"}`}
                />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
