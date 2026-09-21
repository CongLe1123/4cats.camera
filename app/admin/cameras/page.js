"use client";

import { useEffect, useState } from "react";
import {
  adminGetProducts,
  adminDuplicateProduct,
  adminDeleteProduct,
  adminBulkUpdate
} from "../../../lib/adminApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  Package,
  Sparkles,
  Archive,
  Eye,
  EyeOff,
  Filter,
  CheckSquare,
  Square
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await adminGetProducts({
          search,
          brand: filterBrand,
          category: filterCategory,
          stockStatus: filterStock,
          publishStatus: filterStatus
        });
        if (!isCancelled) {
          setCameras(data);
          setLoading(false);
        }
      } catch (e) {
        console.error("Error loading products:", e);
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => {
      isCancelled = true;
    };
  }, [search, filterBrand, filterCategory, filterStock, filterStatus, refreshIndex]);

  const handleDuplicate = async (id, name) => {
    if (!confirm(`Bạn có muốn nhân bản dòng máy "${name}" không?`)) return;
    try {
      toast.info("Đang nhân bản sản phẩm...");
      await adminDuplicateProduct(id);
      toast.success("Nhân bản thành công! Hãy kiểm tra bản sao.");
      setRefreshIndex((p) => p + 1);
    } catch (e) {
      toast.error("Lỗi khi nhân bản: " + e.message);
    }
  };

  const handleArchive = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn chuyển dòng máy "${name}" vào mục lưu trữ (Archive)? Dữ liệu đơn hàng cũ sẽ không bị mất.`)) return;
    try {
      await adminBulkUpdate("archive", [id]);
      toast.success("Đã lưu trữ sản phẩm thành công!");
      setRefreshIndex((p) => p + 1);
    } catch (e) {
      toast.error("Lỗi khi lưu trữ: " + e.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn dòng máy "${name}" không? Thao tác này không thể hoàn tác.`)) return;
    try {
      await adminDeleteProduct(id);
      toast.success("Đã xóa máy ảnh khỏi hệ thống!");
      setRefreshIndex((p) => p + 1);
    } catch (e) {
      toast.error("Lỗi khi xóa: " + e.message);
    }
  };

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedIds.length === cameras.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cameras.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }
    try {
      toast.info("Đang áp dụng thao tác hàng loạt...");
      await adminBulkUpdate(action, selectedIds);
      toast.success("Đã cập nhật hàng loạt thành công!");
      setSelectedIds([]);
      setRefreshIndex((p) => p + 1);
    } catch (e) {
      toast.error("Lỗi thao tác hàng loạt: " + e.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý Sản Phẩm & SKUs 📸
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý dòng máy ảnh chính hãng mới 100%, phiên bản màu sắc, kit ống kính và kho hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/cameras/new">
            <Button className="rounded-xl font-bold text-xs h-9 shadow-xs">
              <Plus className="w-4 h-4 mr-1.5" /> Thêm máy ảnh mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên máy, hãng, slug hoặc mã SKU..."
              className="pl-9 h-9 text-xs rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Brand Filter */}
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-full md:w-36 h-9 text-xs rounded-xl font-medium">
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Mọi hãng</SelectItem>
              <SelectItem value="Canon">Canon</SelectItem>
              <SelectItem value="Sony">Sony</SelectItem>
              <SelectItem value="Fujifilm">Fujifilm</SelectItem>
              <SelectItem value="Nikon">Nikon</SelectItem>
              <SelectItem value="Panasonic">Panasonic</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-36 h-9 text-xs rounded-xl font-medium">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Mọi danh mục</SelectItem>
              <SelectItem value="Mirrorless">Mirrorless</SelectItem>
              <SelectItem value="Compact">Compact</SelectItem>
              <SelectItem value="DSLR">DSLR</SelectItem>
              <SelectItem value="Lens">Ống kính</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select value={filterStock} onValueChange={setFilterStock}>
            <SelectTrigger className="w-full md:w-36 h-9 text-xs rounded-xl font-medium">
              <SelectValue placeholder="Tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Mọi trạng thái kho</SelectItem>
              <SelectItem value="in_stock">Còn hàng (&gt; 0)</SelectItem>
              <SelectItem value="low_stock">Sắp hết (&le; 3)</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng (0)</SelectItem>
            </SelectContent>
          </Select>

          {/* Publish Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-36 h-9 text-xs rounded-xl font-medium">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Mọi trạng thái</SelectItem>
              <SelectItem value="published">Đang bán (Published)</SelectItem>
              <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
              <SelectItem value="archived">Lưu trữ (Archived)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 bg-secondary/15 p-2 rounded-xl text-xs">
            <span className="font-bold text-foreground pl-1">
              Đã chọn: <span className="text-primary">{selectedIds.length}</span> máy ảnh
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg font-bold"
                onClick={() => handleBulkAction("publish")}
              >
                <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Xuất bản
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg font-bold"
                onClick={() => handleBulkAction("unpublish")}
              >
                <EyeOff className="w-3.5 h-3.5 mr-1 text-amber-600" /> Về bản nháp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg font-bold"
                onClick={() => handleBulkAction("set_featured")}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" /> Đặt nổi bật
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg font-bold text-destructive hover:bg-destructive/10"
                onClick={() => handleBulkAction("archive")}
              >
                <Archive className="w-3.5 h-3.5 mr-1" /> Lưu trữ
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Products Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-xs text-muted-foreground font-medium">Đang tải danh sách máy ảnh...</p>
        </div>
      ) : cameras.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border space-y-3">
          <p className="text-muted-foreground text-sm">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setFilterBrand("All");
              setFilterCategory("All");
              setFilterStock("All");
              setFilterStatus("All");
            }}
            className="rounded-xl text-xs"
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b select-none">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      {selectedIds.length === cameras.length && cameras.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 w-16">Ảnh</th>
                  <th className="p-3">Sản phẩm & Model</th>
                  <th className="p-3">Thương hiệu</th>
                  <th className="p-3">Danh mục</th>
                  <th className="p-3">Giá bán từ</th>
                  <th className="p-3 text-center">Biến thể (SKUs)</th>
                  <th className="p-3 text-center">Tổng tồn kho</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-center">Nổi bật</th>
                  <th className="p-3 text-right pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {cameras.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  const isOutOfStock = c.totalStock === 0;
                  const isLowStock = c.totalStock > 0 && c.totalStock <= 3;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-muted/15 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(c.id)}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Product Image */}
                      <td className="p-3">
                        <img
                          src={c.image || "/favicon.ico"}
                          alt={c.name}
                          className="w-12 h-12 object-cover rounded-xl border bg-muted shrink-0 shadow-2xs"
                        />
                      </td>

                      {/* Product Name & Slug */}
                      <td className="p-3 max-w-xs">
                        <div className="font-black text-foreground text-xs leading-snug">
                          {c.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono mt-0.5">
                          <span>/{c.slug}</span>
                          {c.slug && (
                            <Link
                              href={`/may-anh/${c.slug}`}
                              target="_blank"
                              className="hover:text-primary transition-colors"
                              title="Xem trang bán hàng công khai"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="p-3 font-semibold text-foreground">
                        <Badge variant="outline" className="text-[10px] font-bold py-0.5">
                          {c.brand}
                        </Badge>
                      </td>

                      {/* Category */}
                      <td className="p-3 font-medium text-muted-foreground">
                        {c.camera_type}
                      </td>

                      {/* Price Starting From */}
                      <td className="p-3 font-black text-primary whitespace-nowrap">
                        {c.minPrice > 0 ? (
                          <span>Từ {new Intl.NumberFormat("vi-VN").format(c.minPrice)}đ</span>
                        ) : (
                          <span className="text-muted-foreground font-medium italic">Chưa set giá</span>
                        )}
                      </td>

                      {/* Variants Count */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border text-[11px]">
                          <Package className="w-3 h-3" />
                          {c.variants?.length || 0}
                        </span>
                      </td>

                      {/* Total Stock */}
                      <td className="p-3 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Hết hàng (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            Còn {c.totalStock} máy
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {c.totalStock} trong kho
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            c.status === "published"
                              ? "default"
                              : c.status === "draft"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] font-bold"
                        >
                          {c.status === "published"
                            ? "Đang bán"
                            : c.status === "draft"
                            ? "Bản nháp"
                            : c.status}
                        </Badge>
                      </td>

                      {/* Featured */}
                      <td className="p-3 text-center">
                        {c.is_featured ? (
                          <span className="text-amber-500 font-black inline-flex items-center gap-1 text-[11px]" title="Hiển thị tại khu vực nổi bật trang chủ">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> Có
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-7 text-xs font-bold rounded-lg px-2.5"
                          >
                            <Link href={`/admin/cameras/${c.id}`}>
                              <Pencil className="w-3 h-3 mr-1" /> Sửa / SKUs
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={() => handleDuplicate(c.id, c.name)}
                            title="Nhân bản máy ảnh này"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-amber-600 hover:bg-amber-50"
                            onClick={() => handleArchive(c.id, c.name)}
                            title="Lưu trữ (Archive) sản phẩm"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(c.id, c.name)}
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
