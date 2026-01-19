"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Package,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md border-primary/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* Left Section: Logo & Links 1-2 */}
        <div className="flex-1 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2.5 rounded-2xl sticker shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden sm:block font-black text-2xl tracking-tight text-primary">
              4cats
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            <Link
              href="/he-thong-cua-hang"
              className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground"
            >
              Hệ thống
            </Link>
            <Link
              href="/contact"
              className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground"
            >
              Gọi mua
            </Link>
          </nav>
        </div>

        {/* Center Section: THE BIG BUTTON HUB */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
          <div className="relative group">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "w-20 h-20 rounded-full bg-primary text-white shadow-2xl flex flex-col items-center justify-center gap-1 transition-all duration-500 scale-110 border-8 border-background hover:scale-125 hover:rotate-6",
                isMenuOpen ? "rotate-12 bg-secondary-foreground shadow-inner" : ""
              )}
            >
              <div className="relative">
                <Camera className="h-7 w-7" />
                {!isMenuOpen && (
                  <Sparkles className="h-4 w-4 absolute -top-2 -right-2 animate-pulse text-yellow-200" />
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter leading-none">
                {isMenuOpen ? "Đóng" : "Dịch vụ"}
              </span>
            </button>

            {/* Hub Menu Items */}
            <div
              className={cn(
                "absolute top-24 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] shadow-2xl p-3 transition-all duration-500 origin-top flex flex-col gap-2 z-50",
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-0 -translate-y-10 pointer-events-none"
              )}
            >
              <div className="px-4 py-2 mb-1 border-b border-primary/5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                  Bạn đang tìm kiếm gì?
                </p>
              </div>

              {/* Primary Action: Buy */}
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-[2rem] bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all group/item"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform group-hover/item:text-primary">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase ">Mua máy ngay</p>
                  <p className="text-[10px] uppercase font-bold opacity-60">Sẵn hàng tại shop</p>
                </div>
              </Link>

              {/* Secondary Actions: Hidden focus */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/order-camera"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-[2rem] border border-primary/5 hover:bg-secondary transition-all"
                >
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase text-center">Order Máy</p>
                </Link>
                <Link
                  href="/rental"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-[2rem] border border-primary/5 hover:bg-secondary transition-all"
                >
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase text-center">Thuê Máy</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Links 3-4 & Actions */}
        <div className="flex-1 flex items-center justify-end gap-8">
          <nav className="hidden xl:flex items-center gap-6">
            <Link
              href="/chinh-sach/bao-hanh"
              className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground"
            >
              Bảo hành
            </Link>
            <Link
              href="/chinh-sach/mua-hang"
              className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground"
            >
              Chính sách
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
}
