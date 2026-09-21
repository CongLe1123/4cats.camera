"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check
} from "lucide-react";
import { CatCameraIcon } from "../../components/BrandLogo";
import { removeVietnameseTones } from "../../lib/productData";

const BUDGET_PRESETS = [
  { label: "Dưới 15 triệu", min: 0, max: 15000000 },
  { label: "15 – 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 – 25 triệu", min: 20000000, max: 25000000 },
  { label: "Trên 25 triệu", min: 25000000, max: 100000000 }
];

const INTENT_PRESETS = [
  { label: "Người mới 🌱", value: "Người mới" },
  { label: "Selfie / Tự sướng 🤳", value: "Selfie" },
  { label: "Vlog / Video 🎥", value: "Vlog" },
  { label: "Du lịch nhỏ nhẹ ✈️", value: "Du lịch" },
  { label: "Chụp người OOTD 👗", value: "Chụp người" },
  { label: "Màu Film Vintage 🎞️", value: "Film look" }
];

function ShopContent({ cameras = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial params
  const initialQuery = searchParams.get("q") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialIntent = searchParams.get("intent") || "";
  const initialMinPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice"), 10) : null;
  const initialMaxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice"), 10) : null;

  // Filter States (Empty string or null means no filter applied)
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filterBrand, setFilterBrand] = useState(initialBrand);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterIntent, setFilterIntent] = useState(initialIntent);
  const [selectedBudget, setSelectedBudget] = useState(() => {
    if (initialMaxPrice !== null) {
      const match = BUDGET_PRESETS.find(
        (b) => b.max === initialMaxPrice && (initialMinPrice === null || b.min === initialMinPrice)
      );
      if (match) return match.label;
    }
    return "";
  });

  // Advanced feature checkboxes (compact)
  const [filterFlipScreen, setFilterFlipScreen] = useState(false);
  const [filterFlash, setFilterFlash] = useState(false);
  const [filterIBIS, setFilterIBIS] = useState(false);
  const [filterEVF, setFilterEVF] = useState(false);

  // Sorting
  const [sortOrder, setSortOrder] = useState("default");

  // Mobile Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion state for advanced filters in sidebar
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Available brands and categories
  const availableBrands = useMemo(() => {
    const set = new Set(cameras.map((c) => c.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [cameras]);

  const availableCategories = useMemo(() => {
    const set = new Set(cameras.map((c) => c.camera_type || c.category).filter(Boolean));
    return Array.from(set).sort();
  }, [cameras]);

  // Format currency
  const formatPrice = (val) => {
    if (!val) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(val) + "đ";
  };

  // Active filters list for chips display
  const activeFilters = useMemo(() => {
    const list = [];
    if (searchQuery) list.push({ type: "search", label: `Tìm: "${searchQuery}"` });
    if (filterBrand) list.push({ type: "brand", label: filterBrand });
    if (filterCategory) list.push({ type: "category", label: filterCategory });
    if (filterIntent) list.push({ type: "intent", label: filterIntent });
    if (selectedBudget) list.push({ type: "budget", label: selectedBudget });
    if (filterFlipScreen) list.push({ type: "flip", label: "Màn hình xoay lật" });
    if (filterFlash) list.push({ type: "flash", label: "Có flash cóc" });
    if (filterIBIS) list.push({ type: "ibis", label: "Chống rung IBIS" });
    if (filterEVF) list.push({ type: "evf", label: "Có kính ngắm EVF" });
    return list;
  }, [
    searchQuery,
    filterBrand,
    filterCategory,
    filterIntent,
    selectedBudget,
    filterFlipScreen,
    filterFlash,
    filterIBIS,
    filterEVF
  ]);

  const removeFilter = (type) => {
    switch (type) {
      case "search":
        setSearchQuery("");
        break;
      case "brand":
        setFilterBrand("");
        break;
      case "category":
        setFilterCategory("");
        break;
      case "intent":
        setFilterIntent("");
        break;
      case "budget":
        setSelectedBudget("");
        break;
      case "flip":
        setFilterFlipScreen(false);
        break;
      case "flash":
        setFilterFlash(false);
        break;
      case "ibis":
        setFilterIBIS(false);
        break;
      case "evf":
        setFilterEVF(false);
        break;
      default:
        break;
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setFilterBrand("");
    setFilterCategory("");
    setFilterIntent("");
    setSelectedBudget("");
    setFilterFlipScreen(false);
    setFilterFlash(false);
    setFilterIBIS(false);
    setFilterEVF(false);
    setSortOrder("default");
    router.replace("/shop");
  };

  // Filter & Search Logic
  const filteredCameras = useMemo(() => {
    let result = [...cameras];

    // 1. Text Search (smart tokenized, alias-aware)
    if (searchQuery.trim()) {
      const qNorm = removeVietnameseTones(searchQuery);
      const tokens = qNorm.split(/\s+/).filter(Boolean);

      const isSelfie = qNorm.includes("selfie");
      const isVlog = qNorm.includes("vlog");
      const isBeginner = qNorm.includes("nguoi moi") || qNorm.includes("moi tap") || qNorm.includes("de dung");
      const isTravel = qNorm.includes("du lich") || qNorm.includes("nho nhe");
      const isFilm = qNorm.includes("film") || qNorm.includes("vintage");
      const isWhite = qNorm.includes("trang") || qNorm.includes("white");

      result = result.filter((cam) => {
        const fullText = removeVietnameseTones(
          `${cam.brand} ${cam.model_name || cam.name} ${cam.series} ${cam.camera_type || cam.category} ${cam.short_description} ${(cam.use_cases || cam.features || []).join(" ")} ${(cam.availableColors || []).join(" ")}`
        );

        const tokenMatch = tokens.every((token) => fullText.includes(token));
        if (tokenMatch) return true;

        if (isSelfie && (cam.use_cases?.includes("Selfie") || cam.features?.includes("Selfie"))) return true;
        if (isVlog && (cam.use_cases?.includes("Vlog") || cam.features?.includes("Vlogging"))) return true;
        if (isBeginner && (cam.use_cases?.includes("Người mới") || cam.features?.includes("Người mới"))) return true;
        if (isTravel && (cam.use_cases?.includes("Du lịch") || cam.features?.includes("Compact"))) return true;
        if (isFilm && (cam.use_cases?.includes("Film look") || cam.features?.includes("Film Simulation"))) return true;
        if (isWhite && cam.availableColors?.some((c) => c.toLowerCase() === "white" || c.toLowerCase().includes("trắng"))) return true;

        return false;
      });
    }

    // 2. Brand Filter
    if (filterBrand) {
      result = result.filter(
        (cam) => cam.brand?.toLowerCase() === filterBrand.toLowerCase()
      );
    }

    // 3. Category Filter
    if (filterCategory) {
      result = result.filter(
        (cam) =>
          (cam.camera_type || cam.category)?.toLowerCase() ===
          filterCategory.toLowerCase()
      );
    }

    // 4. Intent Filter
    if (filterIntent) {
      result = result.filter(
        (cam) =>
          cam.use_cases?.includes(filterIntent) ||
          cam.features?.includes(filterIntent)
      );
    }

    // 5. Budget Filter
    if (selectedBudget) {
      const budgetObj = BUDGET_PRESETS.find((b) => b.label === selectedBudget);
      if (budgetObj) {
        result = result.filter((cam) => {
          const price = cam.minPrice || cam.price || cam.variants?.[0]?.price;
          if (!price) return false;
          return price >= budgetObj.min && price <= budgetObj.max;
        });
      }
    }

    // 6. Advanced Features
    if (filterFlipScreen) {
      result = result.filter(
        (cam) =>
          cam.screen_type?.toLowerCase().includes("xoay lật") ||
          cam.screen_type?.toLowerCase().includes("vari-angle") ||
          cam.screen_type?.toLowerCase().includes("lật 180")
      );
    }

    if (filterFlash) {
      result = result.filter((cam) => cam.built_in_flash === true);
    }

    if (filterIBIS) {
      result = result.filter((cam) => cam.ibis === true);
    }

    if (filterEVF) {
      result = result.filter(
        (cam) =>
          cam.viewfinder &&
          !cam.viewfinder.toLowerCase().includes("không trang bị")
      );
    }

    // 7. Sorting
    if (sortOrder === "price-asc") {
      result.sort((a, b) => (a.minPrice || a.price || 0) - (b.minPrice || b.price || 0));
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => (b.minPrice || b.price || 0) - (a.minPrice || a.price || 0));
    } else if (sortOrder === "newest") {
      result.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
    } else if (sortOrder === "beginner") {
      result.sort((a, b) => {
        const aBeg = a.use_cases?.includes("Người mới") ? 1 : 0;
        const bBeg = b.use_cases?.includes("Người mới") ? 1 : 0;
        return bBeg - aBeg;
      });
    }

    return result;
  }, [
    cameras,
    searchQuery,
    filterBrand,
    filterCategory,
    filterIntent,
    selectedBudget,
    filterFlipScreen,
    filterFlash,
    filterIBIS,
    filterEVF,
    sortOrder
  ]);

  // Render Sidebar Filter Controls (shared between Desktop Sidebar and Mobile Drawer)
  const renderFilterControls = () => (
    <div className="space-y-6 text-xs">
      {/* 1. Brand Filter */}
      <div className="space-y-2">
        <span className="font-black text-foreground uppercase tracking-wider text-[11px] block">
          Thương hiệu
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableBrands.map((b) => {
            const isSelected = filterBrand === b;
            return (
              <button
                key={b}
                onClick={() => setFilterBrand(isSelected ? "" : b)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Budget Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <span className="font-black text-foreground uppercase tracking-wider text-[11px] block">
          Khoảng giá
        </span>
        <div className="flex flex-col gap-1.5">
          {BUDGET_PRESETS.map((b) => {
            const isSelected = selectedBudget === b.label;
            return (
              <button
                key={b.label}
                onClick={() => setSelectedBudget(isSelected ? "" : b.label)}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between border ${
                  isSelected
                    ? "bg-secondary/30 text-primary border-primary/40 font-bold"
                    : "bg-white text-muted-foreground hover:bg-gray-50 border-gray-200"
                }`}
              >
                <span>{b.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Camera Type */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <span className="font-black text-foreground uppercase tracking-wider text-[11px] block">
          Dòng máy
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableCategories.map((c) => {
            const isSelected = filterCategory === c;
            return (
              <button
                key={c}
                onClick={() => setFilterCategory(isSelected ? "" : c)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Use-case / Intent */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <span className="font-black text-foreground uppercase tracking-wider text-[11px] block">
          Phù hợp với nhu cầu
        </span>
        <div className="flex flex-wrap gap-1.5">
          {INTENT_PRESETS.map((intent) => {
            const isSelected = filterIntent === intent.value;
            return (
              <button
                key={intent.value}
                onClick={() => setFilterIntent(isSelected ? "" : intent.value)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {intent.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Advanced Filters (Progressively Disclosed) */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between text-[11px] font-black uppercase text-muted-foreground hover:text-primary transition-colors py-1"
        >
          <span>Bộ lọc nâng cao</span>
          {isAdvancedOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="space-y-2 pt-1 pl-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterFlipScreen}
                onChange={(e) => setFilterFlipScreen(e.target.checked)}
                className="w-4 h-4 rounded-md accent-primary"
              />
              <span>Màn hình lật xoay 180°</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterFlash}
                onChange={(e) => setFilterFlash(e.target.checked)}
                className="w-4 h-4 rounded-md accent-primary"
              />
              <span>Có đèn Flash cóc</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterIBIS}
                onChange={(e) => setFilterIBIS(e.target.checked)}
                className="w-4 h-4 rounded-md accent-primary"
              />
              <span>Chống rung trong máy (IBIS)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterEVF}
                onChange={(e) => setFilterEVF(e.target.checked)}
                className="w-4 h-4 rounded-md accent-primary"
              />
              <span>Có kính ngắm điện tử EVF</span>
            </label>
          </div>
        )}
      </div>

      {/* Reset button inside sidebar */}
      {activeFilters.length > 0 && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="w-full text-xs font-bold text-muted-foreground hover:text-primary gap-1.5 h-8"
          >
            <RotateCcw className="w-3 h-3" /> Đặt lại bộ lọc
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* 1. COMPACT SHOP HEADER (Above the fold, clean & proportional) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/10 pb-5">
        <div>
          <span className="text-[11px] font-black uppercase text-primary tracking-widest block">
            Cửa hàng chính hãng 4cats
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Máy Ảnh Mới Chính Hãng 📸
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            Khám phá các dòng máy ảnh Mirrorless & Compact mới 100% nguyên seal, bảo hành chính hãng 12–24 tháng.
          </p>
        </div>

        {/* Search Bar + Sort on Desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative grow sm:w-72 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm máy, hãng, nhu cầu..."
              className="h-10 pl-9 pr-8 rounded-2xl border-primary/25 bg-white text-xs font-medium focus-visible:ring-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-44 h-10 rounded-2xl border-gray-200 text-xs font-bold bg-white shadow-2xs">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="text-xs font-medium">
                4cats Gợi ý ✨
              </SelectItem>
              <SelectItem value="price-asc" className="text-xs font-medium">
                Giá: Thấp → Cao
              </SelectItem>
              <SelectItem value="price-desc" className="text-xs font-medium">
                Giá: Cao → Thấp
              </SelectItem>
              <SelectItem value="newest" className="text-xs font-medium">
                Đời máy mới nhất
              </SelectItem>
              <SelectItem value="beginner" className="text-xs font-medium">
                Phù hợp cho người mới
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button (Visible only on mobile/tablet) */}
          <Button
            variant="outline"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden h-10 rounded-2xl border-primary/30 text-primary font-bold text-xs gap-1.5 shrink-0 bg-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc</span>
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-black">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* 2. QUICK HORIZONTAL CHIPS (One clean scrollable row for fast navigation) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-muted-foreground font-semibold text-[11px] shrink-0 mr-1 hidden sm:inline">
          Phù hợp với:
        </span>
        {INTENT_PRESETS.map((item) => {
          const isSelected = filterIntent === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setFilterIntent(isSelected ? "" : item.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isSelected
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white hover:bg-primary/10 border-primary/15 text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE FILTERS ROW (Only shown when filters exist) */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-secondary/15 p-2.5 rounded-2xl border border-primary/10">
          <span className="text-muted-foreground font-bold text-[11px]">Đang lọc:</span>
          {activeFilters.map((f, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-primary/20 text-foreground font-bold text-[11px] shadow-2xs"
            >
              <span>{f.label}</span>
              <button
                onClick={() => removeFilter(f.type)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-[11px] font-bold text-primary hover:underline ml-2"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* 4. MAIN LAYOUT: SIDEBAR (Desktop) + PRODUCT CATALOG GRID (Both start at same vertical position) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar (3 cols on lg) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white rounded-3xl p-5 border border-primary/15 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-black text-foreground text-sm uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Bộ lọc sản phẩm
            </h3>
            {activeFilters.length > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Đặt lại
              </button>
            )}
          </div>

          {renderFilterControls()}
        </aside>

        {/* Products Grid Section (9 cols on lg) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Results Summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Tìm thấy <strong className="text-foreground">{filteredCameras.length}</strong> dòng máy ảnh phù hợp
            </span>
          </div>

          {/* Product Grid */}
          {filteredCameras.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCameras.map((camera) => {
                const targetLink = camera.slug ? `/may-anh/${camera.slug}` : `/shop/${camera.id}`;
                const displayPrice = camera.minPrice || camera.price || camera.variants?.[0]?.price;
                const comparePrice = camera.compare_at_price || camera.original_price;
                const hasDiscount = comparePrice && comparePrice > displayPrice;
                const discountPercent = camera.discountPercent || (hasDiscount ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0);

                return (
                  <Card
                    key={camera.id || camera.slug}
                    className="overflow-hidden flex flex-col group h-full border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white hover:-translate-y-1"
                  >
                    {/* Image & Badges */}
                    <div className="aspect-4/3 relative overflow-hidden bg-secondary/15">
                      <Link href={targetLink} className="block w-full h-full">
                        <img
                          src={camera.image || camera.main_image}
                          alt={camera.name}
                          loading="lazy"
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                        />
                      </Link>

                      {/* Top-left Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <Badge
                          variant="secondary"
                          className="border-none px-2.5 py-0.5 text-[10px] uppercase font-black bg-white text-primary shadow-xs"
                        >
                          {camera.brand}
                        </Badge>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Mới 100%
                        </span>
                      </div>

                      {/* Top-right Discount */}
                      {hasDiscount && discountPercent > 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <CardHeader className="p-4 pb-1 space-y-1.5">
                      <Link href={targetLink}>
                        <CardTitle className="text-base md:text-lg font-black text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                          {camera.brand && camera.model_name ? `${camera.brand} ${camera.model_name}` : camera.name}
                        </CardTitle>
                      </Link>

                      {/* Purpose Tags */}
                      <div className="flex flex-wrap gap-1">
                        {(camera.use_cases || camera.features || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 py-2 grow flex flex-col justify-end space-y-2">
                      {/* Colors indicator */}
                      {camera.availableColors && camera.availableColors.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className="font-semibold">Màu:</span>
                          <span>{camera.availableColors.slice(0, 3).join(", ")}</span>
                        </div>
                      )}

                      {/* Price Display */}
                      <div className="pt-1">
                        <div className="text-[11px] font-semibold text-muted-foreground">
                          {camera.variants && camera.variants.length > 1 ? "Giá từ:" : "Giá chính hãng:"}
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl font-black text-primary">
                            {formatPrice(displayPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer CTAs */}
                    <CardFooter className="p-4 pt-1 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-9"
                        asChild
                      >
                        <Link href={targetLink}>
                          Chi tiết
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-xl sticker font-bold text-xs h-9 shadow-xs"
                        asChild
                      >
                        <Link href={`${targetLink}#dat-mua`}>
                          Mua ngay
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-4xl border border-dashed border-primary/20 p-8 space-y-4">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-secondary/30 rounded-3xl shadow-xs text-primary">
                <CatCameraIcon className="w-10 h-10" />
              </div>
              <p className="text-xl font-bold text-foreground">
                Không tìm thấy máy ảnh nào phù hợp 😿
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Bạn thử tìm với từ khóa như <em>&ldquo;Canon R50&rdquo;</em>, <em>&ldquo;máy selfie&rdquo;</em>, hoặc đặt lại bộ lọc để xem toàn bộ danh mục nhé!
              </p>
              <Button
                onClick={resetAllFilters}
                className="rounded-full px-6 font-bold sticker text-xs"
              >
                Xem tất cả máy ảnh
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 5. MOBILE FILTER DRAWER (Slide-over Modal for mobile) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-foreground text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Bộ lọc sản phẩm
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterControls()}
            </div>

            <div className="pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <Button
                className="w-full sticker font-black text-xs h-11 uppercase"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Xem {filteredCameras.length} máy phù hợp
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopClient({ cameras }) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">
            Đang tải danh sách máy ảnh 📸...
          </p>
        </div>
      }
    >
      <ShopContent cameras={cameras} />
    </Suspense>
  );
}
