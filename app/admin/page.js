"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  adminGetProducts,
  adminGetOrders,
  adminGetBanners
} from "../../lib/adminApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ShoppingCart,
  Camera,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  EyeOff,
  ImageOff,
  Tag
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    pendingOrders: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockSkus: [],
    outOfStockSkus: [],
    draftProducts: [],
    missingImages: [],
    recentOrders: [],
    activeBannersCount: 0
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [products, orders, banners] = await Promise.all([
        adminGetProducts(),
        adminGetOrders(),
        adminGetBanners()
      ]);

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      const ordersTodayList = orders.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return t >= startOfToday;
      });

      const pendingOrdersList = orders.filter((o) => o.status === "NEW");

      // Approximate revenue from completed/confirmed orders today
      const revenueToday = ordersTodayList
        .filter((o) => o.status === "COMPLETED" || o.status === "CONTACTED")
        .reduce((sum, o) => {
          // If order has total/price
          return sum + (Number(o.total_price || o.price) || 0);
        }, 0);

      // Analyze SKUs for stock alerts
      const lowStockSkus = [];
      const outOfStockSkus = [];
      const draftProducts = [];
      const missingImages = [];

      for (const p of products) {
        if (!p.is_published || p.status === "draft") {
          draftProducts.push(p);
        }
        if (!p.image || p.image === "/favicon.ico") {
          missingImages.push(p);
        }

        for (const v of p.variants || []) {
          const qty = Number(v.stock_quantity || 0);
          if (qty === 0) {
            outOfStockSkus.push({
              productName: p.name,
              sku: v.sku,
              color: v.color_label || v.color,
              kit: v.kit_label || v.kit_type,
              price: v.price
            });
          } else if (qty <= 2) {
            lowStockSkus.push({
              productName: p.name,
              sku: v.sku,
              color: v.color_label || v.color,
              kit: v.kit_label || v.kit_type,
              stock: qty,
              branchStock: v.branch_stock
            });
          }
        }
      }

      setStats({
        ordersToday: ordersTodayList.length,
        revenueToday,
        pendingOrders: pendingOrdersList.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        lowStockSkus,
        outOfStockSkus,
        draftProducts,
        missingImages,
        recentOrders: orders.slice(0, 5),
        activeBannersCount: banners.filter((b) => b.calculatedStatus === "active").length
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      toast.error("Lỗi khi tải dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Trung Tâm Vận Hành 4cats 🐱📸
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Bảng điều hành thời gian thực — Không cần can thiệp code
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
            className="rounded-xl font-bold text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Link href="/admin/cameras/new">
            <Button size="sm" className="rounded-xl font-bold text-xs h-9 shadow-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts Bar */}
      <div className="bg-white/80 p-3 rounded-2xl border flex flex-wrap items-center gap-2 shadow-2xs">
        <span className="text-xs font-bold text-muted-foreground px-2">Truy cập nhanh:</span>
        <Link href="/admin/cameras/new">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary">
            + Thêm sản phẩm
          </Button>
        </Link>
        <Link href="/admin/banners">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary">
            + Tạo banner
          </Button>
        </Link>
        <Link href="/admin/promotions">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary">
            + Tạo khuyến mãi
          </Button>
        </Link>
        <Link href="/admin/inventory">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary">
            Cập nhật tồn kho
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary">
            Xem đơn hàng ({stats.pendingOrders} chờ)
          </Button>
        </Link>
      </div>

      {/* TODAY'S OPERATIONAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Orders Today */}
        <Link href="/admin/orders">
          <Card className="hover:border-primary/50 transition-all rounded-2xl cursor-pointer shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Đơn hôm nay</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground">{stats.ordersToday}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stats.pendingOrders} đơn mới chờ duyệt
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Low Stock Alert */}
        <Link href="/admin/inventory">
          <Card className={`transition-all rounded-2xl cursor-pointer shadow-xs ${stats.lowStockSkus.length > 0 ? "border-amber-300 bg-amber-50/40" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-amber-800">Sắp hết hàng (≤ 2)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-amber-700">{stats.lowStockSkus.length}</div>
              <p className="text-[11px] text-amber-600/90 mt-0.5">
                Biến thể cần bổ sung kho
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Out of Stock Alert */}
        <Link href="/admin/inventory">
          <Card className={`transition-all rounded-2xl cursor-pointer shadow-xs ${stats.outOfStockSkus.length > 0 ? "border-red-300 bg-red-50/40" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-red-800">Đã hết hàng (0)</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-700">{stats.outOfStockSkus.length}</div>
              <p className="text-[11px] text-red-600/90 mt-0.5">
                Tự động gắn nhãn &quot;Liên hệ&quot;
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Active Products */}
        <Link href="/admin/cameras">
          <Card className="hover:border-primary/50 transition-all rounded-2xl cursor-pointer shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Sản phẩm quản lý</CardTitle>
              <Camera className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground">{stats.totalProducts}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stats.draftProducts.length > 0 ? `${stats.draftProducts.length} bản nháp chưa bán` : "Tất cả đã xuất bản"}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* OPERATIONAL ALERTS & NOTICES */}
      {(stats.lowStockSkus.length > 0 || stats.outOfStockSkus.length > 0 || stats.draftProducts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Stock SKUs list */}
          {stats.lowStockSkus.length > 0 && (
            <Card className="rounded-2xl border-amber-200 bg-amber-50/30 overflow-hidden">
              <CardHeader className="pb-3 border-b border-amber-100 bg-amber-50/80">
                <CardTitle className="text-sm font-black text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Cảnh báo tồn kho thấp ({stats.lowStockSkus.length} SKUs)
                  </span>
                  <Link href="/admin/inventory" className="text-xs text-amber-700 hover:underline">
                    Xem tất cả →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-amber-100">
                {stats.lowStockSkus.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.productName}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {item.color} • {item.kit} • <span className="font-mono text-amber-800">{item.sku}</span>
                      </p>
                    </div>
                    <Badge variant="outline" className="border-amber-400 text-amber-800 bg-amber-100/60 font-black">
                      Còn {item.stock} máy
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Draft or Incomplete Products */}
          {stats.draftProducts.length > 0 && (
            <Card className="rounded-2xl border-border bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-sm font-black text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                    Sản phẩm bản nháp chưa xuất bản ({stats.draftProducts.length})
                  </span>
                  <Link href="/admin/cameras?publishStatus=draft" className="text-xs text-primary hover:underline">
                    Xem danh sách →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {stats.draftProducts.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {item.brand} • {item.camera_type} • {item.variants?.length || 0} biến thể
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="h-7 text-[11px] rounded-lg">
                      <Link href={`/admin/cameras/${item.id}`}>Xuất bản</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* RECENT ORDERS TABLE */}
      <Card className="rounded-3xl overflow-hidden border shadow-xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-muted/10">
          <div>
            <CardTitle className="text-base font-black">Đơn hàng mới nhất</CardTitle>
            <CardDescription className="text-xs">Theo dõi và cập nhật trạng thái đơn hàng thời gian thực</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-xl text-xs font-bold">
            <Link href="/admin/orders">
              Xem toàn bộ đơn hàng <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentOrders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              Chưa có đơn hàng nào được ghi nhận.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold border-b">
                  <tr>
                    <th className="p-3">Mã đơn</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">Số điện thoại</th>
                    <th className="p-3">Máy đặt</th>
                    <th className="p-3">Thời gian</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">
                        #{String(o.id).slice(0, 8)}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        {o.customer_name}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {o.customer_contact}
                      </td>
                      <td className="p-3 font-medium">
                        {o.camera?.name || "Máy ảnh"}
                      </td>
                      <td className="p-3 text-muted-foreground text-[11px]">
                        {new Date(o.created_at).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            o.status === "NEW"
                              ? "destructive"
                              : o.status === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] font-bold"
                        >
                          {o.status === "NEW" ? "Chờ duyệt" : o.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs rounded-lg">
                          <Link href={`/admin/orders`}>Xử lý</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
