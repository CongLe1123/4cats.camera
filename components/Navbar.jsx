"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { BrandLogo, CatCameraIcon } from "./BrandLogo";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes or resizing to desktop or pressing Escape
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const serviceItems = [
    { name: "Tất cả máy ảnh", href: "/shop" },
    { name: "Máy cho người mới 🌱", href: "/shop?intent=Người+mới" },
    { name: "Máy Selfie & Vlog 🤳", href: "/shop?intent=Selfie" },
    { name: "Máy Mirrorless", href: "/shop?category=Mirrorless" },
    { name: "Máy Compact nhỏ gọn", href: "/shop?category=Compact" },
    { name: "Tông màu Film hoài cổ 🎞️", href: "/shop?intent=Film+look" },
    { name: "Thuê máy ảnh", href: "/rental" },
  ];

  const navItems = [
    { name: "Hướng dẫn", href: "/huong-dan/chon-may-anh-cho-nguoi-moi" },
    { name: "Cửa hàng", href: "/he-thong-cua-hang" },
    { name: "Bảo hành", href: "/chinh-sach/bao-hanh" },
    { name: "Chính sách", href: "/chinh-sach/mua-hang" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300",
        isDropdownOpen || isMobileMenuOpen
          ? "bg-background border-primary/20 shadow-md"
          : "bg-background/95 backdrop-blur-md border-primary/15 shadow-xs",
      )}
    >
      <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center justify-between relative">
        {/* Left Section: Logo */}
        <div className="z-50 relative">
          <BrandLogo size="md" />
        </div>

        {/* Center Section: Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-1.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          aria-label="Chính"
        >
          {/* Dropdown Services */}
          <div
            className="relative group"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              id="category-menu-button"
              className={cn(
                "flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border leading-tight text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer select-none",
                isDropdownOpen
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "text-foreground/80 border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary/20 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20",
              )}
            >
              Danh mục máy
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300 ml-1 group-hover:rotate-180",
                  isDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Menu - Anchored cleanly below the navbar */}
            <div
              role="menu"
              aria-labelledby="category-menu-button"
              className={cn(
                "absolute top-[calc(100%+2rem)] left-0 w-64 bg-white border border-primary/20 rounded-2xl shadow-xl p-2 transition-all duration-200 origin-top-left overflow-hidden ring-1 ring-black/5 z-50 before:absolute before:-top-8 before:left-0 before:right-0 before:h-8 before:content-['']",
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto",
              )}
            >
              <div className="flex flex-col gap-1">
                {serviceItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-primary/10 text-xs sm:text-sm font-semibold text-foreground/85 hover:text-primary transition-all duration-200 group"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/20 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Section: Shop CTA */}
        <div className="hidden xl:flex items-center gap-3">
          <Link
            href="/shop"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md shadow-primary/25 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Mua máy ngay
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="xl:hidden z-50 flex items-center gap-2">
          <Link
            href="/shop"
            className="sm:hidden flex items-center justify-center p-2 rounded-full bg-primary/10 text-primary"
            aria-label="Cửa hàng"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 -mr-2 text-foreground/80 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            {isMobileMenuOpen ? (
              <X className="h-7 w-7 text-primary" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "xl:hidden fixed inset-x-0 top-20 sm:top-24 bottom-0 bg-white border-t border-primary/15 p-6 flex flex-col gap-6 overflow-y-auto transition-all duration-300 ease-in-out z-50 shadow-2xl",
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
        )}
      >
        <div className="grid gap-2">
          <p className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Danh mục máy ảnh
          </p>
          <div className="grid grid-cols-1 gap-1.5 pl-3 border-l-2 border-primary/20">
            {serviceItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl text-sm font-bold text-foreground/85 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">
            Thông tin & Hỗ trợ
          </p>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-2xl bg-secondary/40 hover:bg-primary/10 text-xs font-bold text-foreground hover:text-primary transition-all text-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <CatCameraIcon className="w-5 h-5 text-white" />
            Xem tất cả máy ảnh
          </Link>
        </div>
      </div>
    </header>
  );
}
