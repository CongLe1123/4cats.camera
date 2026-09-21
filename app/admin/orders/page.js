"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Loader2,
  Phone,
  Search,
  ShoppingCart,
  Camera,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Package,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [internalNote, setInternalNote] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrders() {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          camera:cameras(id, name, image, specs)
        `)
        .order("created_at", { ascending: false });

      if (!isCancelled) {
        if (error) console.error(error);
        else setOrders(data || []);
        setLoading(false);
      }
    }

    loadOrders();

    // Realtime subscription
    const channel = supabase
      .channel("public:orders-manage")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          setRefreshIndex((p) => p + 1);
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [refreshIndex]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Đã cập nhật đơn sang trạng thái: ${newStatus}`);
      setRefreshIndex((p) => p + 1);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      toast.error("Lỗi khi đổi trạng thái: " + e.message);
    }
  };

  const handleSaveInternalNote = async () => {
    if (!selectedOrder) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({ customer_message: internalNote })
        .eq("id", selectedOrder.id);
      if (error) throw error;
      toast.success("Đã cập nhật ghi chú nội bộ!");
      setSelectedOrder((prev) => ({ ...prev, customer_message: internalNote }));
      setRefreshIndex((p) => p + 1);
    } catch (e) {
      toast.error("Lỗi: " + e.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(o.id).toLowerCase().includes(q) ||
      (o.customer_name || "").toLowerCase().includes(q) ||
      (o.customer_contact || "").toLowerCase().includes(q) ||
      (o.camera?.name || "").toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-destructive text-white text-[10px] font-bold">Chờ duyệt (NEW)</Badge>;
      case "CONTACTED":
        return <Badge className="bg-blue-500 text-white text-[10px] font-bold">Đã liên hệ</Badge>;
      case "PACKING":
        return <Badge className="bg-purple-500 text-white text-[10px] font-bold">Đang đóng gói</Badge>;
      case "SHIPPED":
        return <Badge className="bg-amber-500 text-white text-[10px] font-bold">Đang giao hàng</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-muted-foreground text-[10px] font-bold">Đã hủy</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  // Helper: parse order details from customer_message or attributes
  const parseOrderDetails = (order) => {
    const message = order.customer_message || "";
    let sku = "";
    let color = "";
    let kit = "";
    let price = null;

    if (message.includes("|")) {
      const parts = message.split("|");
      for (const p of parts) {
        const [k, v] = p.split(":").map(s => s.trim());
        if (!k || !v) continue;
        if (k.toLowerCase().includes("sku")) sku = v;
        if (k.toLowerCase().includes("color") || k.toLowerCase().includes("màu")) color = v;
        if (k.toLowerCase().includes("kit") || k.toLowerCase().includes("cấu hình")) kit = v;
        if (k.toLowerCase().includes("giá") || k.toLowerCase().includes("price")) price = v;
      }
    }

    return { sku, color, kit, price };
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý Đơn Đặt Hàng 🛍️
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xử lý yêu cầu mua máy ảnh, đóng băng giá lịch sử và theo dõi quy trình giao hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-bold shadow-2xs">
            Tổng: {orders.length} đơn
          </Badge>
          <Badge className="bg-destructive text-white px-3 py-1 text-xs font-black animate-pulse">
            {orders.filter((o) => o.status === "NEW").length} Đơn mới
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn, họ tên khách hàng, số điện thoại hoặc tên máy ảnh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs h-9">
            Xóa tìm kiếm
          </Button>
        )}
      </div>

      {/* Tabs by Status */}
      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-white border rounded-2xl gap-1">
          <TabsTrigger value="ALL" className="rounded-xl text-xs font-bold py-2">
            Tất cả ({filteredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="NEW" className="rounded-xl text-xs font-bold py-2 text-destructive">
            Mới ({filteredOrders.filter(o => o.status === "NEW").length})
          </TabsTrigger>
          <TabsTrigger value="CONTACTED" className="rounded-xl text-xs font-bold py-2">
            Đã liên hệ ({filteredOrders.filter(o => o.status === "CONTACTED").length})
          </TabsTrigger>
          <TabsTrigger value="PACKING" className="rounded-xl text-xs font-bold py-2">
            Đóng gói ({filteredOrders.filter(o => o.status === "PACKING").length})
          </TabsTrigger>
          <TabsTrigger value="SHIPPED" className="rounded-xl text-xs font-bold py-2">
            Đang giao ({filteredOrders.filter(o => o.status === "SHIPPED").length})
          </TabsTrigger>
          <TabsTrigger value="COMPLETED" className="rounded-xl text-xs font-bold py-2 text-emerald-700">
            Hoàn tất ({filteredOrders.filter(o => o.status === "COMPLETED").length})
          </TabsTrigger>
        </TabsList>

        {["ALL", "NEW", "CONTACTED", "PACKING", "SHIPPED", "COMPLETED"].map((tabValue) => {
          const list = tabValue === "ALL"
            ? filteredOrders
            : filteredOrders.filter((o) => o.status === tabValue);

          return (
            <TabsContent key={tabValue} value={tabValue} className="mt-4">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
              ) : list.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border text-muted-foreground text-xs">
                  Không có đơn hàng nào trong mục này.
                </div>
              ) : (
                <div className="bg-white rounded-3xl border shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
                        <tr>
                          <th className="p-3">Mã đơn</th>
                          <th className="p-3">Khách hàng & SĐT</th>
                          <th className="p-3">Sản phẩm & Cấu hình</th>
                          <th className="p-3">Địa chỉ giao</th>
                          <th className="p-3">Thời gian</th>
                          <th className="p-3">Trạng thái</th>
                          <th className="p-3 text-right pr-4">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {list.map((order) => {
                          const details = parseOrderDetails(order);

                          return (
                            <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                              {/* Order ID */}
                              <td className="p-3 font-mono font-bold text-primary">
                                #{String(order.id).slice(0, 8)}
                              </td>

                              {/* Customer */}
                              <td className="p-3">
                                <div className="font-bold text-foreground">{order.customer_name}</div>
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-primary" />
                                  <a href={`tel:${order.customer_contact}`} className="hover:underline">
                                    {order.customer_contact}
                                  </a>
                                </div>
                              </td>

                              {/* Product */}
                              <td className="p-3">
                                <div className="font-bold text-foreground">
                                  {order.camera?.name || "Máy ảnh"}
                                </div>
                                {(details.sku || details.color || details.kit) && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                                    {details.sku && <span className="font-bold text-primary">{details.sku}</span>}
                                    {details.color && <span> • {details.color}</span>}
                                    {details.kit && <span> • {details.kit}</span>}
                                  </div>
                                )}
                              </td>

                              {/* Address */}
                              <td className="p-3 max-w-xs truncate text-muted-foreground">
                                {order.customer_address || "Nhận tại cửa hàng"}
                              </td>

                              {/* Date */}
                              <td className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                                {new Date(order.created_at).toLocaleString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </td>

                              {/* Status */}
                              <td className="p-3 whitespace-nowrap">
                                {getStatusBadge(order.status)}
                              </td>

                              {/* Action */}
                              <td className="p-3 text-right pr-4 whitespace-nowrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setInternalNote(order.customer_message || "");
                                  }}
                                  className="h-7 text-xs rounded-lg font-bold"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" /> Chi tiết
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
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center justify-between pr-6">
              <span>Chi tiết đơn hàng #{String(selectedOrder?.id).slice(0, 8)}</span>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2 text-xs">
              {/* Customer Box */}
              <div className="bg-muted/20 p-4 rounded-2xl border space-y-2">
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Thông tin người mua
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Họ và tên:</span>{" "}
                    <span className="font-bold">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Điện thoại:</span>{" "}
                    <a href={`tel:${selectedOrder.customer_contact}`} className="font-bold text-primary underline">
                      {selectedOrder.customer_contact}
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Địa chỉ nhận hàng:</span>{" "}
                  <span className="font-medium">{selectedOrder.customer_address || "Nhận tại cửa hàng"}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-secondary/10 p-4 rounded-2xl border flex items-center gap-3">
                {selectedOrder.camera?.image && (
                  <img
                    src={selectedOrder.camera.image}
                    alt={selectedOrder.camera.name}
                    className="w-14 h-14 object-cover rounded-xl border bg-white shrink-0"
                  />
                )}
                <div>
                  <p className="font-bold text-foreground text-sm">{selectedOrder.camera?.name || "Máy ảnh chính hãng"}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Thời gian đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-1.5 pt-2 border-t">
                <p className="font-bold text-foreground">Chuyển trạng thái đơn:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["NEW", "CONTACTED", "PACKING", "SHIPPED", "COMPLETED", "CANCELLED"].map((st) => (
                    <Button
                      key={st}
                      type="button"
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedOrder.id, st)}
                      className="h-7 text-xs rounded-lg font-bold"
                    >
                      {st === "NEW" ? "Mới" : st === "CONTACTED" ? "Đã liên hệ" : st === "PACKING" ? "Đóng gói" : st === "SHIPPED" ? "Đang giao" : st === "COMPLETED" ? "Hoàn thành" : "Hủy đơn"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5 pt-2 border-t">
                <p className="font-bold text-foreground">Ghi chú nội bộ / Tin nhắn từ khách:</p>
                <Textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Ghi chú nhân viên tiếp nhận, hẹn giờ giao, chi nhánh phục vụ..."
                  rows={3}
                  className="text-xs rounded-xl"
                />
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    onClick={handleSaveInternalNote}
                    className="h-7 text-xs font-bold rounded-lg"
                  >
                    Lưu ghi chú
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)} className="rounded-xl text-xs">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
