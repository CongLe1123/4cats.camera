"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import { MapPin, Plus, Pencil, Trash2, Phone, Clock, Building2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BranchesAdminPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    address: "",
    phone: "",
    zalo: "",
    facebook: "",
    opening_hours: "09:00 - 21:00 (Tất cả các ngày trong tuần)",
    is_active: true
  });

  const loadBranches = async () => {
    setLoading(true);
    try {
      // 1. Try store_settings locations
      const { data: settings } = await supabase.from("store_settings").select("locations").single();
      if (settings && Array.isArray(settings.locations) && settings.locations.length > 0) {
        setBranches(settings.locations.map((loc, idx) => ({
          id: idx + 1,
          name: loc.name || `Cơ sở ${idx + 1}`,
          short_name: loc.short_name || loc.name?.split("-")[1]?.trim() || `CS ${idx + 1}`,
          address: loc.address || "",
          phone: loc.phone || "",
          zalo: loc.zalo || "",
          facebook: loc.facebook || "",
          opening_hours: loc.opening_hours || "09:00 - 21:00",
          is_active: loc.is_active !== false
        })));
      } else {
        // Default branches
        setBranches([
          {
            id: 1,
            name: "Cơ sở 1 - Cầu Giấy",
            short_name: "Cầu Giấy",
            address: "Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà Nội",
            phone: "039 824 9856",
            zalo: "https://zalo.me/0398249856",
            opening_hours: "09:00 - 21:00",
            is_active: true
          },
          {
            id: 2,
            name: "Cơ sở 2 - Thanh Xuân",
            short_name: "Thanh Xuân",
            address: "Số 51 Nguyễn Trãi, Ngã tư Sở, Thanh Xuân, Hà Nội",
            phone: "093 235 68 69",
            zalo: "https://zalo.me/0932356869",
            opening_hours: "09:00 - 21:00",
            is_active: true
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
    loadBranches();
  }, []);

  const handleOpenNew = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      short_name: "",
      address: "",
      phone: "",
      zalo: "",
      facebook: "",
      opening_hours: "09:00 - 21:00",
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.address?.trim()) {
      toast.warning("Vui lòng điền tên cơ sở và địa chỉ.");
      return;
    }

    let updatedList;
    if (editingBranch) {
      updatedList = branches.map((b) => (b.id === editingBranch.id ? { ...b, ...formData } : b));
    } else {
      const newId = Date.now();
      updatedList = [...branches, { ...formData, id: newId }];
    }

    try {
      // Save back to store_settings
      await supabase.from("store_settings").update({ locations: updatedList }).eq("id", 1);
      setBranches(updatedList);
      setIsDialogOpen(false);
      toast.success("Đã cập nhật hệ thống chi nhánh! ✨");
    } catch (err) {
      toast.error("Lỗi khi lưu: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này không?")) return;
    const updated = branches.filter((b) => b.id !== id);
    try {
      await supabase.from("store_settings").update({ locations: updated }).eq("id", 1);
      setBranches(updated);
      toast.success("Đã xóa chi nhánh!");
    } catch (err) {
      toast.error("Lỗi khi xóa: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Hệ Thống Chi Nhánh Cửa Hàng 🏬
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý địa chỉ, hotline và kênh hỗ trợ của các cơ sở trực tiếp
          </p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl text-xs font-bold h-9">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm cơ sở mới
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => (
            <Card key={b.id} className="rounded-3xl border shadow-xs overflow-hidden">
              <CardHeader className="bg-muted/10 pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-black flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    {b.name}
                  </CardTitle>
                  <Badge variant={b.is_active ? "default" : "secondary"} className="text-[10px] font-bold">
                    {b.is_active ? "Đang mở cửa" : "Tạm ngưng"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium leading-relaxed">{b.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-bold text-foreground">{b.phone || "Chưa có hotline"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span>{b.opening_hours}</span>
                </div>

                <div className="pt-3 border-t flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(b)}
                    className="h-8 text-xs font-bold rounded-xl"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Sửa cơ sở
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(b.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / New Branch Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black">
              {editingBranch ? "Chỉnh Sửa Chi Nhánh" : "Thêm Chi Nhánh Mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Tên cơ sở hiển thị *</Label>
              <Input
                placeholder="ví dụ: Cơ sở 1 - Cầu Giấy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Tên ngắn gọn (Ví dụ: Cầu Giấy)</Label>
              <Input
                placeholder="Cầu Giấy"
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Địa chỉ chi tiết *</Label>
              <Input
                placeholder="Số nhà, ngõ, đường, quận, thành phố..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Số điện thoại</Label>
                <Input
                  placeholder="039 824 9856"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Link Zalo</Label>
                <Input
                  placeholder="https://zalo.me/..."
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  className="h-9 text-xs rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Giờ mở cửa</Label>
              <Input
                placeholder="09:00 - 21:00"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} className="rounded-xl text-xs font-bold">
              Lưu chi nhánh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
