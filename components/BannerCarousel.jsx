"use client";

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeSearch } from "./HomeSearch";

export function BannerCarousel({ banners = [] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setItemsToShow(3);
      else if (width >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure current index is valid when resizing
  useEffect(() => {
    const maxIdx = Math.max(0, banners.length - itemsToShow);
    if (current > maxIdx) {
      setCurrent(maxIdx);
    }
  }, [itemsToShow, banners.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev >= banners.length - itemsToShow ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? Math.max(0, banners.length - itemsToShow) : prev - 1));
  };

  useEffect(() => {
    if (!banners?.length || banners.length <= itemsToShow || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev >= banners.length - itemsToShow ? 0 : prev + 1));
    }, 2000); 
    
    return () => clearInterval(interval);
  }, [banners.length, isPaused, itemsToShow, banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Search Bar atop Carousel */}
      <HomeSearch />

      <div 
        ref={containerRef}
        className="relative w-full rounded-4xl group shadow-2xl overflow-hidden bg-muted"
        style={{ height: containerWidth > 0 ? `${(containerWidth / itemsToShow) * 4 / 3}px` : 'auto' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Absolute wrapper for the sliding content */}
        <div className="absolute inset-0">
          <div 
            className="flex h-full transition-transform duration-700 ease-out" 
            style={{ 
              transform: `translateX(-${current * (100 / itemsToShow)}%)` 
            }}
          >
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                className="h-full shrink-0 px-1"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <Link href={banner.link || '#'} className="relative block w-full h-full cursor-pointer group/slide overflow-hidden rounded-[2.5rem]">
                    <img 
                       src={banner.image} 
                       alt={banner.title || "Banner"} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover/slide:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/10 to-transparent flex flex-col justify-end p-6 md:p-12 pb-16 md:pb-24">
                      <div className="transform transition-all duration-700 max-w-2xl">
                          {banner.title && (
                            <h2 className="text-xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-2xl line-clamp-2">
                              {banner.title}
                            </h2>
                          )}
                          {banner.description && (
                            <p className="hidden md:block text-lg text-white/90 mb-6 font-medium line-clamp-2">
                              {banner.description}
                            </p>
                          )}
                          <span className="inline-flex items-center justify-center bg-white text-primary px-6 md:px-8 py-2 md:py-3 rounded-full font-black text-xs md:text-base hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                            {banner.cta_text || "Xem ngay"}
                          </span>
                      </div>
                    </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {banners.length > itemsToShow && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full backdrop-blur-xl transition-all opacity-0 group-hover:opacity-100 border border-white/20 text-white shadow-2xl scale-75 md:scale-100 invisible sm:visible"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
             <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full backdrop-blur-xl transition-all opacity-0 group-hover:opacity-100 border border-white/20 text-white shadow-2xl scale-75 md:scale-100 invisible sm:visible"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Mobile-only subtle next button if you'd like, or just swipe/indicators */}

            {/* Indicators */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
              {banners.map((_, idx) => (
                idx <= banners.length - itemsToShow ? (
                  <button 
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${current === idx ? "w-6 md:w-8 bg-white" : "w-1.5 md:w-2 bg-white/40 hover:bg-white/60"}`}
                  />
                ) : null
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
