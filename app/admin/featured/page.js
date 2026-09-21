"use client";

import { useEffect, useState } from "react";
import {
  adminGetProducts,
  adminSaveProduct
} from "../../../lib/adminApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  ExternalLink,
  Eye,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const HOMEPAGE_SECTIONS = [
  { id: "beginner", name: "Khuyên dùng cho người mới", badge: "Người mới bắt đầu" },
  { id: "featured", name: "Máy được yêu thích (Hot Trend)", badge: "Hot Trend" },
  { id: "deals", name: "Ưu đãi đặc biệt", badge: "Ưu đãi" },
  { id: "new_arrivals", name: "Mới về hàng", badge: "Mới về" }
];

export default function FeaturedProductsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("beginner");
  const [savingId, setSavingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await adminGetProducts();
      setAllProducts(prods);
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Products currently featured in the selected section
  const sectionFeaturedProducts = allProducts
    .filter((p) => p.is_featured && (p.featured_section || "featured") === selectedSection)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));

  // Non-featured or other products available to add
  const availableToAdd = allProducts.filter((p) => {
    const isAlreadyInThisSection = p.is_featured && (p.featured_section || "featured") === selectedSection;
    if (isAlreadyInThisSection) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  const handleAddToSection = async (product) => {
    setSavingId(product.id);
    try {
      const updated = {
        ...product,
        is_featured: true,
        featured_section: selectedSection,
        featured_order: sectionFeaturedProducts.length + 1
      };
      await adminSaveProduct(updated);
      toast.success(`Đã thêm "${product.name}" vào trang chủ! ✨`);
      await loadData();
    } catch (e) {
      toast.error("Lỗi: " + e.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleRemoveFromSection = async (product) => {
    setSavingId(product.id);
    try {
      const updated = {
        ...product,
        is_featured: false,
        featured_section: ""
      };
      await adminSaveProduct(updated);
      toast.success(`Đã xóa "${product.name}" khỏi mục nổi bật!`);
      await loadData();
    } catch (e) {
      toast.error("Lỗi: " + e.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sectionFeaturedProducts.length) return;

    const list = [...sectionFeaturedProducts];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update orders
    try {
      toast.info("Đang cập nhật thứ tự...");
      for (let i = 0; i < list.length; i++) {
        await adminSaveProduct({
          ...list[i],
          featured_order: i + 1
        });
      }
      toast.success("Đã cập nhật thứ tự hiển thị!");
      await loadData();
    } catch (e) {
      toast.error("Lỗi cập nhật thứ tự: " + e.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Sản Phẩm Nổi Bật Trang Chủ ✨
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chọn máy ảnh hiển thị trên trang chủ, sắp xếp thứ tự và xem trước trực tiếp
          </p>
        </div>

        {/* Section Selector */}
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-full sm:w-64 h-9 text-xs rounded-xl font-bold bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOMEPAGE_SECTIONS.map((sec) => (
              <SelectItem key={sec.id} value={sec.id} className="text-xs font-medium">
                {sec.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Currently Featured in Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Đang hiển thị tại: <span className="text-primary font-black">{HOMEPAGE_SECTIONS.find(s => s.id === selectedSection)?.name}</span>
            </h2>
            <Badge variant="outline" className="text-xs font-bold bg-white">
              {sectionFeaturedProducts.length} máy ảnh
            </Badge>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
          ) : sectionFeaturedProducts.length === 0 ? (
            <Card className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground text-xs bg-white">
              Chưa có máy ảnh nào trong mục này. Hãy tìm và bấm &quot;Thêm vào trang chủ&quot; từ danh sách bên phải.
            </Card>
          ) : (
            <div className="space-y-3">
              {sectionFeaturedProducts.map((p, idx) => (
                <Card key={p.id} className="rounded-2xl border shadow-xs overflow-hidden bg-white hover:border-primary/40 transition-colors">
                  <div className="p-3 flex items-center gap-3">
                    {/* Position Number */}
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>

                    {/* Image */}
                    <img
                      src={p.image || "/favicon.ico"}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-xl border bg-muted shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-foreground truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {p.brand} • {(p.use_cases || []).slice(0, 2).join(" • ")}
                      </p>
                      <p className="text-xs font-black text-primary mt-1">
                        {p.minPrice > 0 ? `Từ ${new Intl.NumberFormat("vi-VN").format(p.minPrice)}đ` : "Liên hệ"}
                      </p>
                    </div>

                    {/* Actions: Reorder & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveOrder(idx, -1)}
                        disabled={idx === 0}
                        className="h-7 w-7 rounded-lg"
                        title="Đẩy lên trên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveOrder(idx, 1)}
                        disabled={idx === sectionFeaturedProducts.length - 1}
                        className="h-7 w-7 rounded-lg"
                        title="Hạ xuống dưới"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromSection(p)}
                        className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                        title="Bỏ khỏi trang chủ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Search & Add Products to Homepage (with Live Preview) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Tìm kiếm & Thêm vào mục này
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên máy hoặc hãng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl bg-white"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {availableToAdd.slice(0, 10).map((p) => (
              <div
                key={p.id}
                className="p-3 bg-white rounded-2xl border shadow-2xs flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={p.image || "/favicon.ico"}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-xl border bg-muted shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-foreground truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {p.brand} • {p.minPrice > 0 ? `${new Intl.NumberFormat("vi-VN").format(p.minPrice)}đ` : "Liên hệ"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddToSection(p)}
                  disabled={savingId === p.id}
                  className="h-7 text-xs font-bold rounded-lg shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                </Button>
              </div>
            ))}
          </div>

          {/* Part 18: Card Preview Demonstration */}
          <Card className="rounded-3xl border bg-gradient-to-br from-primary/5 via-white to-secondary/10 p-4 space-y-3">
            <p className="text-[11px] font-black uppercase text-muted-foreground tracking-wider">
              Mô phỏng Card hiển thị trên Storefront
            </p>
            {sectionFeaturedProducts[0] ? (
              <div className="bg-white rounded-2xl border p-3 max-w-[220px] mx-auto shadow-sm space-y-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border">
                  <img
                    src={sectionFeaturedProducts[0].image}
                    alt={sectionFeaturedProducts[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground line-clamp-1">{sectionFeaturedProducts[0].name}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {(sectionFeaturedProducts[0].use_cases || []).join(" • ")}
                  </p>
                  <p className="text-xs font-black text-primary mt-1">
                    {sectionFeaturedProducts[0].minPrice > 0 ? `${new Intl.NumberFormat("vi-VN").format(sectionFeaturedProducts[0].minPrice)}đ` : "Liên hệ"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                Chưa có máy ảnh nào được gán để mô phỏng.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
