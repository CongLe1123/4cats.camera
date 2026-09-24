"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function BannerCarousel({ banners = [] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const timerRef = useRef(null);

  const length = banners.length;

  const nextSlide = useCallback(() => {
    if (length <= 1) return;
    setCurrent((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    if (length <= 1) return;
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  // Autoplay with 5 seconds loop, respecting reduced motion and pause state
  useEffect(() => {
    if (length <= 1 || isPaused) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [length, isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Touch / Swipe handling for mobile
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section
      aria-label="Khuyến mãi nổi bật"
      className="relative w-full outline-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="relative w-full rounded-3xl md:rounded-4xl overflow-hidden shadow-lg border border-primary/15 bg-neutral-900 aspect-16/9 sm:aspect-21/9 md:aspect-24/9 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className="relative w-full h-full shrink-0"
              aria-hidden={current !== index}
            >
              {/* Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={banner.image}
                  alt={banner.title || "Khuyến mãi máy ảnh 4cats"}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover object-center transform transition-transform duration-1000 scale-100 group-hover:scale-105"
                />
              </div>

              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent flex items-center p-6 sm:p-10 md:p-14">
                <div className="max-w-xl text-white space-y-2 md:space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest border border-white/25">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" /> Ưu đãi độc quyền
                  </div>

                  {banner.title && (
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                      {banner.title}
                    </h2>
                  )}

                  {banner.description && (
                    <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium line-clamp-2 leading-relaxed drop-shadow-xs">
                      {banner.description}
                    </p>
                  )}

                  <div className="pt-2 md:pt-4">
                    <Link
                      href={banner.link || "/shop"}
                      className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-black text-xs md:text-sm sticker shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {banner.cta_text || "Xem ngay"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous & Next Arrows */}
        {length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Slide trước"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-white hover:text-primary flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 border border-white/20 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Slide kế tiếp"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-white hover:text-primary flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 border border-white/20 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Đi tới banner ${idx + 1}`}
                  aria-current={current === idx ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                    current === idx
                      ? "w-6 md:w-8 bg-primary shadow-xs"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
