"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Search } from "lucide-react";
import { Slider } from "../../components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { MultiSelect } from "../../components/ui/multi-select";

const defaultFilters = {
  brands: ["All"],
  categories: ["All"],
  conditions: ["All"],
  colors: ["All"],
  specialties: ["All"],
  seriesByBrand: { All: [] },
};

function RentalContent({ cameras = [], filters = defaultFilters }) {
  const {
    brands = [],
    categories = [],
    conditions = [],
    colors = [],
    specialties: specialtyOptions = [],
    seriesByBrand = { All: [] },
  } = filters;

  const searchParams = useSearchParams();
  const initialBrandRaw = searchParams.get("brand");
  const initialBrand =
    brands.find((b) => b.toLowerCase() === initialBrandRaw?.toLowerCase()) ||
    "All";

  const initialSeries = searchParams.get("series") || "All";

  const initialCategoryRaw = searchParams.get("category");
  const initialCategory =
    categories.find(
      (c) => c.toLowerCase() === initialCategoryRaw?.toLowerCase(),
    ) || "All";

  // Parse initial features from URL: ?features=Wi-Fi,Bluetooth or ?feature=... or legacy ?specialty=...
  const initialFeatures = useMemo(() => {
    const featuresParam = searchParams.get("features");
    if (featuresParam) {
      return featuresParam
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s.toLowerCase() !== "all" && s.toLowerCase() !== "tất cả");
    }
    const featureList = searchParams.getAll("feature");
    if (featureList && featureList.length > 0) {
      return featureList
        .map((s) => s.trim())
        .filter((s) => s && s.toLowerCase() !== "all" && s.toLowerCase() !== "tất cả");
    }
    const legacySpecialty = searchParams.get("specialty");
    if (
      legacySpecialty &&
      legacySpecialty.toLowerCase() !== "all" &&
      legacySpecialty.toLowerCase() !== "tất cả"
    ) {
      return [legacySpecialty.trim()];
    }
    return [];
  }, [searchParams]);

  const [filterBrand, setFilterBrand] = useState(initialBrand);
  const [filterSeries, setFilterSeries] = useState(initialSeries);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("default");
  const [filterCondition, setFilterCondition] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [filterSpecialties, setFilterSpecialties] = useState(initialFeatures);
  const [searchQuery, setSearchQuery] = useState("");
  // Rental price range is lower, e.g. 0 to 5 million
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  // Synchronize filterSpecialties to URL query state without full reloads
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    const oldFeatures = params.get("features") || "";
    const newFeatures = filterSpecialties.join(",");

    if (newFeatures !== oldFeatures) {
      if (filterSpecialties.length > 0) {
        params.set("features", newFeatures);
        params.delete("specialty");
        params.delete("feature");
      } else {
        params.delete("features");
        params.delete("specialty");
        params.delete("feature");
      }
      const newSearch = params.toString();
      const newPath = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      window.history.replaceState(null, "", newPath);
    }
  }, [filterSpecialties]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const fParam = params.get("features");
      if (fParam) {
        setFilterSpecialties(
          fParam
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s && s.toLowerCase() !== "all" && s.toLowerCase() !== "tất cả")
        );
      } else {
        const list = params.getAll("feature");
        if (list.length > 0) {
          setFilterSpecialties(
            list
              .map((s) => s.trim())
              .filter((s) => s && s.toLowerCase() !== "all" && s.toLowerCase() !== "tất cả")
          );
        } else {
          setFilterSpecialties([]);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Collect all available unique feature options from filters and camera items
  const allAvailableSpecialties = useMemo(() => {
    const set = new Set();
    (specialtyOptions || []).forEach((s) => {
      if (s && s !== "All" && s !== "Tất cả") set.add(s);
    });
    (cameras || []).forEach((c) => {
      (c.specialties || []).forEach((s) => {
        if (s && s !== "All" && s !== "Tất cả") set.add(s);
      });
      (c.features || []).forEach((s) => {
        if (s && s !== "All" && s !== "Tất cả") set.add(s);
      });
    });
    return Array.from(set);
  }, [specialtyOptions, cameras]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  const getRentalPrice = (camera) => {
    if (camera.rental && camera.rental.length > 0) {
      // Return the lowest price (usually the daily price)
      return Math.min(...camera.rental.map((r) => r.price));
    }
    return null;
  };

  const filteredCameras = cameras.filter((camera) => {
    // 1. Basic Filters
    if (filterCategory !== "All" && camera.category !== filterCategory)
      return false;
    if (filterBrand !== "All" && camera.brand !== filterBrand) return false;
    if (filterSeries !== "All" && camera.series !== filterSeries) return false;

    // Multi-feature filter: camera must satisfy ALL selected features (AND logic)
    if (filterSpecialties.length > 0) {
      const camFeatures = [
        ...(camera.specialties || []),
        ...(camera.features || []),
      ].map((s) => (typeof s === "string" ? s.toLowerCase().trim() : ""));

      const satisfiesAll = filterSpecialties.every((f) =>
        camFeatures.includes(f.toLowerCase().trim())
      );
      if (!satisfiesAll) return false;
    }

    if (
      searchQuery &&
      !camera.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // 2. Variant Filters (Condition, Color) - Apply if camera *has* these
    // Even for rental, user might want to check if "White" version exists
    if (!camera.variants) return false;

    const matchingVariants = camera.variants.filter((v) => {
      if (filterCondition !== "All" && v.condition !== filterCondition)
        return false;
      if (filterColor !== "All" && v.color !== filterColor) return false;
      return true;
    });

    if (matchingVariants.length === 0) return false;

    // 3. Price Filter (Rental Price)
    const rentalPrice = getRentalPrice(camera);
    if (rentalPrice === null) return false; // Not rentable?

    if (rentalPrice < priceRange[0] || rentalPrice > priceRange[1]) {
      return false;
    }

    return true;
  });

  const sortedCameras = [...filteredCameras].sort((a, b) => {
    if (sortOrder === "default") return 0;
    const priceA = getRentalPrice(a);
    const priceB = getRentalPrice(b);

    if (priceA === null && priceB !== null) return 1;
    if (priceA !== null && priceB === null) return -1;
    if (priceA === null && priceB === null) return 0;

    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  const availableSeries = seriesByBrand[filterBrand] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Thuê Máy Ảnh 📸
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Dịch vụ cho thuê máy ảnh, ống kính chuyên nghiệp. Thủ tục nhanh gọn,
          giá cả hợp lý.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Filters & Grid */}
        <div className="flex-1 w-full order-2 lg:order-1">
          {/* Filters & Search */}
          <div className="bg-white p-6 rounded-4xl shadow-sm border mb-8">
            <div className="flex flex-col gap-6">
              {/* Row 1: Search */}
              <div className="w-full space-y-2">
                <Label className="font-bold ml-1">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm tên máy..."
                    className="pl-9 rounded-xl border-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Price Range Slider & Inputs */}
              <div className="space-y-4 pt-2 border-t border-primary/5">
                <Label className="font-bold ml-1">
                  Khoảng giá thuê (theo ngày)
                </Label>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Slider (Left half) */}
                  <div className="flex-1 w-full md:pr-4 pt-2">
                    <Slider
                      min={0}
                      max={5000000}
                      step={50000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>

                  {/* Inputs (Right half) */}
                  <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">
                        Từ
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={new Intl.NumberFormat("vi-VN").format(
                          priceRange[0],
                        )}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const val = parseInt(rawValue) || 0;
                          setPriceRange([
                            Math.min(val, priceRange[1]),
                            priceRange[1],
                          ]);
                        }}
                        className="pl-9 h-11 rounded-xl border-primary/20 font-bold"
                      />
                      <span className="absolute right-3 top-3 text-xs font-bold text-muted-foreground">
                        đ
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">
                        Đến
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={new Intl.NumberFormat("vi-VN").format(
                          priceRange[1],
                        )}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const val = parseInt(rawValue) || 0;
                          setPriceRange([
                            priceRange[0],
                            Math.max(val, priceRange[0]),
                          ]);
                        }}
                        className="pl-11 h-11 rounded-xl border-primary/20 font-bold"
                      />
                      <span className="absolute right-3 top-3 text-xs font-bold text-muted-foreground">
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Hãng</Label>
                  <Select
                    value={filterBrand}
                    onValueChange={(val) => {
                      setFilterBrand(val);
                      setFilterSeries("All");
                    }}
                  >
                    <SelectTrigger className="rounded-xl border-primary/20">
                      <SelectValue placeholder="Chọn hãng" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b === "All" ? "Tất cả" : b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold ml-1">Dòng máy</Label>
                  <Select value={filterSeries} onValueChange={setFilterSeries}>
                    <SelectTrigger className="rounded-xl border-primary/20">
                      <SelectValue placeholder="Chọn dòng máy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Tất cả</SelectItem>
                      {availableSeries.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold ml-1">Loại máy</Label>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="rounded-xl border-primary/20">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c === "All" ? "Tất cả" : c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold ml-1">Độ mới (Có sẵn)</Label>
                  <Select
                    value={filterCondition}
                    onValueChange={setFilterCondition}
                  >
                    <SelectTrigger className="rounded-xl border-primary/20">
                      <SelectValue placeholder="Chọn độ mới" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c === "All" ? "Tất cả" : c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Màu sắc (Có sẵn)</Label>
                  <Select value={filterColor} onValueChange={setFilterColor}>
                    <SelectTrigger className="rounded-xl border-primary/20">
                      <SelectValue placeholder="Chọn màu" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c === "All" ? "Tất cả" : c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Tính năng</Label>
                  <MultiSelect
                    id="rental-filter-specialties"
                    options={allAvailableSpecialties}
                    value={filterSpecialties}
                    onChange={setFilterSpecialties}
                    placeholder="Tất cả"
                    searchPlaceholder="Tìm tính năng..."
                    emptyText="Không tìm thấy tính năng"
                    allLabel="Tất cả / Xóa lựa chọn"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Header & Sort */}
          {sortedCameras.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-muted-foreground">
                {sortedCameras.length} kết quả tìm thấy
              </p>
              <div className="flex items-center gap-2">
                <Label className="font-bold whitespace-nowrap">Sắp xếp:</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[180px] rounded-xl border-primary/20">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Mặc định</SelectItem>
                    <SelectItem value="asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="desc">Giá cao đến thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 animate-in fade-in duration-500">
            {sortedCameras.length > 0 ? (
              sortedCameras.map((camera) => (
                <Card
                  key={camera.id}
                  className="overflow-hidden flex flex-col group h-full border-none shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-4/3 relative overflow-hidden bg-muted">
                    <img
                      src={camera.image}
                      alt={camera.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge
                        variant="secondary"
                        className="glass border-none px-3 py-1 text-[10px] uppercase font-bold"
                      >
                        {camera.brand}
                      </Badge>
                      {camera.series && (
                        <Badge
                          variant="secondary"
                          className="glass border-none px-3 py-1 text-[10px] uppercase font-bold bg-primary/20 text-primary-foreground"
                        >
                          {camera.series}
                        </Badge>
                      )}
                      <Badge
                        variant="default"
                        className="bg-primary/90 hover:bg-primary border-none px-3 py-1 text-[10px] uppercase font-bold text-white shadow-md shadow-primary/20"
                      >
                        Cho Thuê
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-5">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {camera.name}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 mt-1">
                      {camera.features &&
                        camera.features.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase font-bold text-muted-foreground/70 bg-secondary/50 px-2 py-0.5 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 grow flex items-end">
                    <div className="w-full flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground italic">
                        Giá thuê từ
                      </span>
                      <span className={`text-xl font-bold text-primary`}>
                        {getRentalPrice(camera)
                          ? formatPrice(getRentalPrice(camera)) + "/ngày"
                          : "Liên hệ"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button
                      variant="default"
                      className="w-full sticker h-10 font-bold"
                      asChild
                    >
                      <Link href={`/rental/${camera.id}`}>
                        {getRentalPrice(camera)
                          ? "Xem chi tiết & Thuê"
                          : "Xem chi tiết"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy sản phẩm nào phù hợp 😿
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {filterSpecialties.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setFilterSpecialties([])}
                      className="rounded-full px-4 text-xs font-bold text-primary border-primary/30 hover:bg-primary/10"
                    >
                      Xóa bộ lọc tính năng ({filterSpecialties.length})
                    </Button>
                  )}
                  <Button
                    variant="link"
                    onClick={() => {
                      setSortOrder("default");
                      setFilterCategory("All");
                      setFilterBrand("All");
                      setFilterSeries("All");
                      setFilterCondition("All");
                      setFilterColor("All");
                      setFilterSpecialties([]);
                      setSearchQuery("");
                      setPriceRange([0, 5000000]);
                    }}
                    className="text-primary font-bold"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Policy Sidebar */}
        <div className="w-full lg:w-[450px] order-1 lg:order-2 space-y-8 shrink-0">
          <div className="lg:sticky lg:top-24 bg-white p-6 rounded-[2.5rem] shadow-xl border border-primary/10">
            <div className="text-center mb-6">
              <Badge
                variant="outline"
                className="mb-3 bg-primary/5 text-primary border-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest"
              >
                Thông tin cần biết
              </Badge>
              <h2 className="text-2xl font-black text-primary mb-2">
                Chính Sách Thuê
              </h2>
              <p className="text-muted-foreground text-sm">
                Đọc kỹ quy định thuê máy tại 4cats nhé! 👇
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem
                value="item-1"
                className="bg-secondary/20 rounded-2xl border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4 text-sm">
                  <span className="text-left font-bold flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    Đặt Lịch Thuê (Booking)
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-9">
                  <ul className="list-disc space-y-1">
                    <li>
                      <strong className="text-foreground">Chọn máy:</strong>{" "}
                      Khoảng 100-150 máy có sẵn.
                    </li>
                    <li>
                      <strong className="text-foreground">Giữ lịch:</strong> Cọc
                      giữ lịch bằng{" "}
                      <strong className="text-primary">
                        tổng chi phí thuê
                      </strong>
                      .
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-secondary/20 rounded-2xl border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4 text-sm">
                  <span className="text-left font-bold flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    3 Hình Thức Cọc (Deposit)
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-9">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-primary/10">
                      <strong className="text-primary block mb-1 text-xs">
                        1. Cọc Tiền (100% Giá trị)
                      </strong>
                      <span className="text-xs">✨ Hỗ trợ ship xa.</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-primary/10">
                      <strong className="text-primary block mb-1 text-xs">
                        2. Cọc Tài Sản
                      </strong>
                      <span className="text-xs">
                        Laptop, Điện thoại, iPad... (Cần định giá trước).
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-primary/10">
                      <strong className="text-primary block mb-1 text-xs">
                        3. Cọc Giấy Tờ
                      </strong>
                      <span className="text-xs">
                        CCCD + Bằng lái/Đăng ký xe.{" "}
                        <b className="text-red-500">Chỉ GD trực tiếp.</b>
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-secondary/20 rounded-2xl border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4 text-sm">
                  <span className="text-left font-bold flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    Yêu Cầu Cọc Giấy Tờ
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-9">
                  <p className="mb-2 font-medium text-red-500 italic text-xs">
                    Yêu cầu FB/Insta chính chủ:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>
                      FB: {">"}5 bài đăng, {">"}200 bạn bè.
                    </li>
                    <li>Insta: {">"}150 followers, công khai.</li>
                    <li>Không khóa bảo vệ trang cá nhân.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-secondary/20 rounded-2xl border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4 text-sm">
                  <span className="text-left font-bold flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    Xử Lý Sự Cố
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-9">
                  <ul className="list-disc space-y-1 text-xs">
                    <li>Báo lỗi trong 1h sau khi nhận.</li>
                    <li>Hư hỏng/Mất: Đền bù 100% chi phí + phí bù lịch.</li>
                    <li>
                      Tuyệt đối <b>KHÔNG</b> tự ý sửa chữa.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-secondary/20 rounded-2xl border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4 text-sm">
                  <span className="text-left font-bold flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                      5
                    </span>
                    Bảo Quản
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-9">
                  <ul className="list-disc space-y-1 text-xs">
                    <li>Tránh nước, cát, va đập.</li>
                    <li>Không chiếu laser vào lens.</li>
                    <li>Tháo pin khi đi máy bay.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Helper */}
      <div className="text-center mb-12">
        <p className="text-muted-foreground">
          Giá thuê có thể thay đổi tùy thuộc vào số ngày thuê và chương trình
          khuyến mãi. <br />
          Vui lòng liên hệ trực tiếp để được tư vấn gói thuê tốt nhất.
        </p>
      </div>
    </div>
  );
}

export default function RentalClient({ cameras, filters }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RentalContent cameras={cameras} filters={filters} />
    </Suspense>
  );
}
