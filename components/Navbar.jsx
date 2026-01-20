"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Camera, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes or resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const serviceItems = [
    { name: "Chương trình khuyến mãi", href: "/promotions" },
    { name: "Máy ảnh Compact", href: "/shop?category=compact" },
    { name: "Máy ảnh Mirrorless", href: "/shop?category=mirrorless" },
    { name: "Phụ kiện", href: "/shop?category=accessories" },
    { name: "Thuê máy", href: "/rental" },
    { name: "Order máy", href: "/order-camera" },
  ];

  const navItems = [
    { name: "Hệ thống cửa hàng", href: "/he-thong-cua-hang" },
    { name: "Hệ thống fanpage", href: "/contact" },
    { name: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh" },
    { name: "Về 4cats.camera", href: "/about" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full border-b transition-all",
        isDropdownOpen || isMobileMenuOpen 
          ? "bg-background border-primary/20" 
          : "bg-background/95 backdrop-blur-md border-primary/20 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* Left Section: Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50 relative">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Camera className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:block font-black text-2xl tracking-tight text-primary">
            4cats
          </span>
        </Link>

        {/* Center Section: Desktop Navigation (Absolute Centered) */}
        <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
          {/* 1. Danh mục dịch vụ (Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 border border-transparent",
                isDropdownOpen
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/10 hover:border-primary/20"
              )}
            >
              Danh mục dịch vụ
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-300",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={cn(
                "absolute top-full left-0 mt-3 w-72 bg-background border border-primary/20 rounded-3xl shadow-xl p-2 transition-all duration-300 origin-top-left overflow-hidden ring-1 ring-black/5",
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              )}
            >
              <div className="flex flex-col gap-1">
                {serviceItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center justify-between px-5 py-3 rounded-2xl hover:bg-primary/10 text-sm font-bold text-foreground/80 hover:text-primary transition-all group"
                  >
                    {item.name}
                    <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 2-5. Other Buttons */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full border border-transparent hover:border-primary/20 transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Trigger - Right Side */}
        <div className="lg:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-foreground/80 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-20 bottom-0 bg-background border-t border-primary/10 p-6 flex flex-col gap-6 overflow-y-auto transition-all duration-300 ease-in-out z-40",
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <div className="grid gap-2">
          <p className="text-sm font-black text-primary uppercase tracking-widest mb-2">
            Danh mục dịch vụ
          </p>
          <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-primary/10">
            {serviceItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-bold text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-black text-primary uppercase tracking-widest mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              target={item.external ? "_blank" : undefined}
              className="py-3 px-4 rounded-xl bg-secondary/30 hover:bg-primary/10 text-sm font-bold text-foreground hover:text-primary transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto">
             <Link 
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
             >
                <Camera className="h-5 w-5" />
                Mua máy ngay
             </Link>
        </div>
      </div>
    </header>
  );
}
