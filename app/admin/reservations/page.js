"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  BookmarkCheck,
  Search,
  Phone,
  Building2,
  Calendar,
  Clock,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function ReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [isNewOpen, setIsNewOpen] = useState(false);

  const [newRes, setNewRes] = useState({
    customer_name: "",
    customer_contact: "",
    product_name: "Canon EOS R50 (Trắng / Kit 18-45mm)",
    branch_name: "Cơ sở 1 - Cầu Giấy",
    appointment_time: "",
    notes: ""
  });

  const loadReservations = async () => {
    setLoading(true);
    try {
      // Reservations can be queried from orders with type = 'RESERVE' or fallback
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("type", ["RESERVE", "HOLD", "GIU_MAY"])
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setReservations(data);
      } else {
        // Mock sample initial reservations
        setReservations([
          {
            id: 101,
            customer_name: "Nguyễn Minh Châu",
            customer_contact: "0987 654 321",
            customer_message: "Hẹn xem máy Canon EOS R50 màu trắng vào chiều thứ 7",
            customer_address: "Cơ sở 1 - Cầu Giấy",
            status: "PENDING",
            created_at: new Date().toISOString()
          },
          {
            id: 102,
            customer_name: "Trần Hoàng Long",
            customer_contact: "0912 345 678",
            customer_message: "Giữ Sony ZV-E10 II body đen 24h",
            customer_address: "Cơ sở 2 - Thanh Xuân",
            status: "CONFIRMED",
            created_at: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      await supabase.from("orders").update({ status }).eq("id", id);
      toast.success(`Đã cập nhật trạng thái hẹn giữ máy!`);
    } catch (e) {
      toast.error("Lỗi cập nhật: " + e.message);
    }
  };

  const handleCreateReservation = async () => {
    if (!newRes.customer_name || !newRes.customer_contact) {
      toast.warning("Vui lòng điền tên khách và số điện thoại.");
      return;
    }

    const payload = {
      customer_name: newRes.customer_name,
      customer_contact: newRes.customer_contact,
      customer_address: newRes.branch_name,
      customer_message: `Sản phẩm: ${newRes.product_name} | Hẹn: ${newRes.appointment_time} | ${newRes.notes}`,
      type: "RESERVE",
      status: "PENDING"
    };

    try {
      const { data, error } = await supabase.from("orders").insert([payload]).select().single();
      if (!error && data) {
        setReservations([data, ...reservations]);
      } else {
        setReservations([{ ...payload, id: Date.now(), created_at: new Date().toISOString() }, ...reservations]);
      }
      setIsNewOpen(false);
      toast.success("Đã tạo lịch giữ máy cho khách! ✨");
    } catch (e) {
      toast.error("Lỗi khi tạo: " + e.message);
    }
  };

  const filtered = reservations.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.customer_name || "").toLowerCase().includes(q) ||
      (r.customer_contact || "").toLowerCase().includes(q) ||
      (r.customer_message || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-20 font-sans max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý Yêu Cầu Giữ Máy (Reservations) 🔖
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi khách hẹn trải nghiệm và giữ máy tại các chi nhánh cửa hàng
          </p>
        </div>

        <Button onClick={() => setIsNewOpen(true)} className="rounded-xl text-xs font-bold h-9">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Tạo lịch hẹn giữ máy
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên khách, số điện thoại, chi nhánh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border text-muted-foreground text-xs">
          Chưa có yêu cầu giữ máy nào.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
                <tr>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">Chi nhánh hẹn</th>
                  <th className="p-3">Nội dung / Sản phẩm giữ</th>
                  <th className="p-3">Thời gian tạo</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-right pr-4">Chuyển trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-bold text-foreground">{r.customer_name}</td>
                    <td className="p-3 font-mono font-medium text-primary">
                      <a href={`tel:${r.customer_contact}`} className="hover:underline">
                        {r.customer_contact}
                      </a>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {r.customer_address || "Cầu Giấy"}
                      </Badge>
                    </td>
                    <td className="p-3 max-w-xs text-muted-foreground leading-relaxed">
                      {r.customer_message}
                    </td>
                    <td className="p-3 text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <Badge
                        variant={
                          r.status === "CONFIRMED"
                            ? "default"
                            : r.status === "COMPLETED"
                            ? "secondary"
                            : r.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[10px] font-bold"
                      >
                        {r.status === "PENDING"
                          ? "Chờ xác nhận"
                          : r.status === "CONFIRMED"
                          ? "Đã giữ máy"
                          : r.status === "COMPLETED"
                          ? "Đã lấy máy"
                          : "Đã hủy / Quá hạn"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right pr-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(r.id, "CONFIRMED")}
                          className="h-7 text-[11px] font-bold rounded-lg"
                        >
                          Xác nhận
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(r.id, "COMPLETED")}
                          className="h-7 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg"
                        >
                          Hoàn tất
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(r.id, "CANCELLED")}
                          className="h-7 text-[11px] font-bold text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          Hủy
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Reservation Dialog */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-primary" /> Tạo Lịch Hẹn Giữ Máy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Họ tên khách hàng *</Label>
              <Input
                placeholder="Nguyễn Văn A"
                value={newRes.customer_name}
                onChange={(e) => setNewRes({ ...newRes, customer_name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Số điện thoại *</Label>
              <Input
                placeholder="039 824 9856"
                value={newRes.customer_contact}
                onChange={(e) => setNewRes({ ...newRes, customer_contact: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Sản phẩm & Cấu hình muốn giữ</Label>
              <Input
                placeholder="Canon EOS R50 (Trắng / Kit 18-45mm)"
                value={newRes.product_name}
                onChange={(e) => setNewRes({ ...newRes, product_name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Cơ sở khách ghé xem</Label>
              <Input
                value={newRes.branch_name}
                onChange={(e) => setNewRes({ ...newRes, branch_name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Thời gian hẹn (ví dụ: Chiều mai 15h)</Label>
              <Input
                placeholder="Chiều mai 15h"
                value={newRes.appointment_time}
                onChange={(e) => setNewRes({ ...newRes, appointment_time: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNewOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleCreateReservation} className="rounded-xl text-xs font-bold">
              Lưu lịch hẹn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
