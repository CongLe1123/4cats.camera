"use client";

import Image from "next/image";
import Link from "next/link";

export function CatCameraIcon({ className = "w-10 h-10" }) {
  return (
    <Image
      src="/vercel.svg"
      alt="4CatsCamera Logo"
      width={40}
      height={40}
      className={`${className} object-contain`}
    />
  );
}

export function BrandLogo({
  href = "/",
  size = "md",
  showText = true,
  className = "",
}) {
  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const px = pixelSizes[size] || 48;

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      <div className="relative transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105 flex items-center justify-center">
        <Image
          src="/vercel.svg"
          alt="4CatsCamera Logo"
          width={px}
          height={px}
          priority
          className={`${iconSizes[size] || iconSizes.md} object-contain`}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-genty font-bold tracking-tight text-primary transition-colors ${textSizes[size] || textSizes.md}`}
          >
            4CatsCamera
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-1 hidden sm:block">
            Máy ảnh nhỏ xinh 📸
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="4CatsCamera Trang chủ">
        {content}
      </Link>
    );
  }

  return content;
}
