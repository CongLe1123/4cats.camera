"use client";

import { useEffect, useState } from "react";
import {
  adminGetInventory,
  adminUpdateSkuStock
} from "../../../lib/adminApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../../components/ui/dialog";
import {
  Loader2,
  Search,
  Boxes,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  History,
  Building2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [savingSku, setSavingSku] = useState(null);

  // Edit Stock State
  const [editingItem, setEditingItem] = useState(null);
  const [editCg, setEditCg] = useState(0);
  const [editTx, setEditTx] = useState(0);
  const [editReason, setEditReason] = useState("Nhập hàng mới");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminGetInventory();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi tải dữ liệu tồn kho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = items.filter((item) => {
    const matchSearch =
      search.trim() === "" ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (stockFilter === "in_stock") return item.totalStock > 0;
    if (stockFilter === "low_stock") return item.totalStock > 0 && item.totalStock <= 3;
    if (stockFilter === "out_of_stock") return item.totalStock === 0;

    return true;
  });

  const openQuickEdit = (item) => {
    setEditingItem(item);
    setEditCg(item.cauGiayStock);
    setEditTx(item.thanhXuanStock);
    setEditReason("Nhập hàng bổ sung");
  };

  const handleSaveStock = async () => {
    if (!editingItem) return;
    setSavingSku(editingItem.sku);
    try {
      await adminUpdateSkuStock(
        editingItem.productId,
        editingItem.sku,
        {
          "Cầu Giấy": Number(editCg) || 0,
          "Thanh Xuân": Number(editTx) || 0
        },
        editReason
      );
      toast.success(`Đã cập nhật tồn kho SKU ${editingItem.sku}!`);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      toast.error("Lỗi cập nhật: " + err.message);
    } finally {
      setSavingSku(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý Tồn Kho Theo Chi Nhánh 🏬
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi và điều chỉnh số lượng máy ảnh theo từng mã SKU tại Cầu Giấy & Thanh Xuân
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="rounded-xl text-xs font-bold h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Làm mới tồn kho
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border shadow-xs p-4">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Tổng SKU quản lý</p>
          <p className="text-2xl font-black text-foreground mt-1">{items.length}</p>
        </Card>

        <Card className="rounded-2xl border shadow-xs p-4 bg-emerald-50/40 border-emerald-200">
          <p className="text-[11px] font-bold text-emerald-800 uppercase">SKU Còn Hàng</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {items.filter((i) => i.totalStock > 0).length}
          </p>
        </Card>

        <Card className="rounded-2xl border shadow-xs p-4 bg-amber-50/40 border-amber-200">
          <p className="text-[11px] font-bold text-amber-800 uppercase">Sắp hết hàng (≤ 3)</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {items.filter((i) => i.totalStock > 0 && i.totalStock <= 3).length}
          </p>
        </Card>

        <Card className="rounded-2xl border shadow-xs p-4 bg-red-50/40 border-red-200">
          <p className="text-[11px] font-bold text-red-800 uppercase">Đã Hết Hàng (0)</p>
          <p className="text-2xl font-black text-red-700 mt-1">
            {items.filter((i) => i.totalStock === 0).length}
          </p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên máy, hãng, mã SKU..."
            className="pl-9 h-9 text-xs rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-44 h-9 text-xs rounded-xl font-medium">
            <SelectValue placeholder="Lọc tồn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Mọi trạng thái</SelectItem>
            <SelectItem value="in_stock">Còn hàng (&gt; 0)</SelectItem>
            <SelectItem value="low_stock">Sắp hết hàng (&le; 3)</SelectItem>
            <SelectItem value="out_of_stock">Hết hàng (0)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-xs text-muted-foreground">Đang tải danh sách tồn kho...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border text-muted-foreground text-xs space-y-3">
          <p>
            {items.length === 0
              ? "Chưa có sản phẩm hoặc mã SKU nào trong hệ thống để quản lý tồn kho."
              : "Không tìm thấy SKU nào phù hợp với bộ lọc."}
          </p>
          {items.length === 0 && (
            <Button asChild size="sm" className="rounded-xl text-xs font-bold mt-2">
              <Link href="/admin/cameras/new">
                + Tạo máy ảnh & mã SKU mới
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
                <tr>
                  <th className="p-3 w-14">Ảnh</th>
                  <th className="p-3">Mã SKU</th>
                  <th className="p-3">Máy ảnh & Phiên bản</th>
                  <th className="p-3">Giá bán</th>
                  <th className="p-3 text-center">CS1: Cầu Giấy</th>
                  <th className="p-3 text-center">CS2: Thanh Xuân</th>
                  <th className="p-3 text-center">Tổng kho</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-right pr-4">Cập nhật kho</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => {
                  const isOutOfStock = item.totalStock === 0;
                  const isLowStock = item.totalStock > 0 && item.totalStock <= 3;

                  return (
                    <tr key={item.sku} className="hover:bg-muted/10 transition-colors">
                      {/* Image */}
                      <td className="p-3">
                        <img
                          src={item.productImage || "/favicon.ico"}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-xl border bg-muted"
                        />
                      </td>

                      {/* SKU */}
                      <td className="p-3">
                        <span className="font-mono font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-md border text-[11px]">
                          {item.sku}
                        </span>
                      </td>

                      {/* Product Name & Details */}
                      <td className="p-3">
                        <div className="font-bold text-foreground">{item.productName}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>{item.color}</span>
                          <span>•</span>
                          <span>{item.kit}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-3 font-black text-primary whitespace-nowrap">
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                      </td>

                      {/* Cau Giay Stock */}
                      <td className="p-3 text-center font-bold text-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-xs">
                          {item.cauGiayStock}
                        </span>
                      </td>

                      {/* Thanh Xuan Stock */}
                      <td className="p-3 text-center font-bold text-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-xs">
                          {item.thanhXuanStock}
                        </span>
                      </td>

                      {/* Total Stock */}
                      <td className="p-3 text-center font-black">
                        <span className="text-sm">{item.totalStock}</span>
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Hết hàng
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Sẵn hàng
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right pr-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuickEdit(item)}
                          className="h-7 text-xs rounded-lg font-bold"
                        >
                          Chỉnh tồn kho
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Edit Stock Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Boxes className="w-4 h-4 text-primary" /> Cập Nhật Tồn Kho
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-muted/20 p-3 rounded-2xl border">
                <p className="font-bold text-foreground">{editingItem.productName}</p>
                <p className="text-muted-foreground text-[11px] font-mono mt-0.5">
                  SKU: {editingItem.sku} • {editingItem.color} • {editingItem.kit}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Cơ sở 1: Cầu Giấy</Label>
                  <Input
                    type="number"
                    value={editCg}
                    onChange={(e) => setEditCg(e.target.value)}
                    className="h-9 text-xs rounded-xl font-bold text-center text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Cơ sở 2: Thanh Xuân</Label>
                  <Input
                    type="number"
                    value={editTx}
                    onChange={(e) => setEditTx(e.target.value)}
                    className="h-9 text-xs rounded-xl font-bold text-center text-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Lý do điều chỉnh (Nhật ký kho)</Label>
                <Select value={editReason} onValueChange={setEditReason}>
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nhập hàng mới">Nhập hàng mới về kho</SelectItem>
                    <SelectItem value="Khách mua hàng">Xuất bán trực tiếp tại cửa hàng</SelectItem>
                    <SelectItem value="Điều chuyển cơ sở">Điều chuyển giữa 2 cơ sở</SelectItem>
                    <SelectItem value="Kiểm kê điều chỉnh">Kiểm kê định kỳ bù trừ</SelectItem>
                    <SelectItem value="Đổi trả bảo hành">Khách đổi trả bảo hành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-xl bg-secondary/15 border text-muted-foreground text-[11px]">
                Tổng tồn kho sau khi lưu: <span className="font-black text-foreground">{Number(editCg || 0) + Number(editTx || 0)} máy</span>. Giao diện Storefront sẽ tự động đồng bộ theo số lượng này.
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingItem(null)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSaveStock}
              disabled={!!savingSku}
              className="rounded-xl text-xs font-bold"
            >
              {savingSku ? "Đang lưu..." : "Lưu tồn kho"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
