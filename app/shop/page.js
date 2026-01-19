"use client";
import { useState, Suspense, use } from "react";
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

import { cameras } from "../../lib/data";

const brands = [
  "All",
  "Fujifilm",
  "Canon",
  "Sony",
  "Nikon",
  "Ricoh",
  "Olympus",
];

const seriesByBrand = {
  All: [],
  Fujifilm: ["X-Series", "GFX", "FinePix"],
  Canon: ["EOS R", "EOS M", "EOS DSLR", "PowerShot"],
  Sony: ["ZV", "Alpha 7", "Alpha 6000", "Cyber-shot"],
  Nikon: ["Z", "D", "Coolpix"],
  Ricoh: ["GR", "Pentax"],
  Olympus: ["Pen", "OM-D"],
};

const conditions = ["All", "Mới 100%", "Like New", "99%", "95%", "Cũ"];
const colors = ["All", "Black", "Silver", "White", "Mint Green", "Pink"];
const specialtyOptions = [
  "All",
  "WiFi",
  "Bluetooth",
  "Touch Screen",
  "Flip Screen",
  "Weather Sealed",
  "Face Tracking",
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "All";
  const initialSeries = searchParams.get("series") || "All";

  const [filterBrand, setFilterBrand] = useState(initialBrand);
  const [filterSeries, setFilterSeries] = useState(initialSeries);
  const [filterCondition, setFilterCondition] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000000]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  const getDisplayPrice = (camera) => {
    const inStockVariants = camera.variants.filter((v) => v.inStock);
    if (inStockVariants.length > 0) {
      return Math.min(...inStockVariants.map((v) => v.price));
    }
    return null; // All out of stock
  };

  const filteredCameras = cameras.filter((camera) => {
    // 1. Basic Filters (Brand, Series, Search, Specialty)
    if (filterBrand !== "All" && camera.brand !== filterBrand) return false;
    if (filterSeries !== "All" && camera.series !== filterSeries) return false;
    if (
      filterSpecialty !== "All" &&
      !camera.specialties.includes(filterSpecialty)
    )
      return false;
    if (
      searchQuery &&
      !camera.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // 2. Variant Filters (Condition, Color)
    const matchingVariants = camera.variants.filter((v) => {
      if (filterCondition !== "All" && v.condition !== filterCondition)
        return false;
      if (filterColor !== "All" && v.color !== filterColor) return false;
      return true;
    });

    if (matchingVariants.length === 0) return false;

    // 3. Price Filter (using the display price or lowest possible matching price)
    const inStockMatching = matchingVariants.filter((v) => v.inStock);
    const minPriceForFilter =
      inStockMatching.length > 0
        ? Math.min(...inStockMatching.map((v) => v.price))
        : Math.min(...matchingVariants.map((v) => v.price));

    if (
      minPriceForFilter < priceRange[0] ||
      minPriceForFilter > priceRange[1]
    ) {
      return false;
    }

    return true;
  });

  const availableSeries =
    filterBrand !== "All" ? seriesByBrand[filterBrand] || [] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Cửa hàng máy ảnh 📸
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Khám phá bộ sưu tập máy ảnh được tuyển chọn kỹ lưỡng, phù hợp cho mọi
          nhu cầu từ người mới đến chuyên nghiệp.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border mb-12">
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
            <Label className="font-bold ml-1">Khoảng giá</Label>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Slider (Left half) */}
              <div className="flex-1 w-full md:pr-4 pt-2">
                <Slider
                  min={0}
                  max={50000000}
                  step={500000}
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
                    value={new Intl.NumberFormat("vi-VN").format(priceRange[0])}
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
                    value={new Intl.NumberFormat("vi-VN").format(priceRange[1])}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            <div className="space-y-2">
              <Label className="font-bold ml-1">Hãng</Label>
              <Select
                value={filterBrand}
                onValueChange={(val) => {
                  setFilterBrand(val);
                  setFilterSeries("All"); // Reset series when brand changes
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
              <Label className="font-bold ml-1">Dòng máy (Series)</Label>
              <Select
                value={filterSeries}
                onValueChange={setFilterSeries}
                disabled={filterBrand === "All"}
              >
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
              <Label className="font-bold ml-1">Độ mới</Label>
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
              <Label className="font-bold ml-1">Màu sắc</Label>
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
              <Label className="font-bold ml-1">Tính năng đặc biệt</Label>
              <Select
                value={filterSpecialty}
                onValueChange={setFilterSpecialty}
              >
                <SelectTrigger className="rounded-xl border-primary/20">
                  <SelectValue placeholder="Tính năng" />
                </SelectTrigger>
                <SelectContent>
                  {specialtyOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "Tất cả" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-in fade-in duration-500">
        {filteredCameras.length > 0 ? (
          filteredCameras.map((camera) => (
            <Card
              key={camera.id}
              className="overflow-hidden flex flex-col group h-full border-none shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
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
                    variant="outline"
                    className="bg-white/90 border-none px-3 py-1 text-[10px] uppercase font-bold text-primary"
                  >
                    {filterCondition !== "All"
                      ? filterCondition
                      : "Đa dạng Tình trạng"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-5">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {camera.name}
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-2 mt-1">
                  {camera.features.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold text-muted-foreground/70 bg-secondary/50 px-2 py-0.5 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-4 flex-grow flex items-end">
                <div className="w-full flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground italic">
                    Giá chỉ từ
                  </span>
                  <span className={`text-xl font-bold text-primary`}>
                    {getDisplayPrice(camera)
                      ? formatPrice(getDisplayPrice(camera))
                      : "Liên hệ để biết giá"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button
                  variant="default"
                  className="w-full sticker h-10 font-bold"
                  asChild
                >
                  <Link href={`/shop/${camera.id}`}>
                    {getDisplayPrice(camera)
                      ? "Xem chi tiết & Mua"
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
            <Button
              variant="link"
              onClick={() => {
                setFilterBrand("All");
                setFilterSeries("All");
                setFilterCondition("All");
                setFilterColor("All");
                setFilterSpecialty("All");
                setSearchQuery("");
                setPriceRange([0, 50000000]);
              }}
              className="text-primary font-bold"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Helper */}
      <div className="text-center mb-12">
        <p className="text-muted-foreground">
          Giá sản phẩm có thể thay đổi tùy thời điểm. <br />
          Vui lòng liên hệ trực tiếp để có giá chính xác nhất hôm nay.
        </p>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
