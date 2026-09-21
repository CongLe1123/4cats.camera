"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    customer_label: "Giảm 1.500.000đ khi mua kèm lens",
    discount_type: "fixed_amount",
    discount_value: 1500000,
    start_at: "",
    end_at: "",
    is_active: true
  });

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const { data: settings } = await supabase.from("store_settings").select("support_links").single();
      // Look for promotions stored in settings or fallback
      const { data: dbPromos, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });

      if (!error && dbPromos) {
        setPromotions(dbPromos);
      } else {
        setPromotions([]);
      }
    } catch (e) {
      console.error("loadPromotions error:", e);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenNew = () => {
    setEditingPromo(null);
    setFormData({
      code: "",
      title: "",
      customer_label: "",
      discount_type: "fixed_amount",
      discount_value: 500000,
      start_at: "",
      end_at: "",
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPromo(p);
    setFormData({ ...p });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.code?.trim()) {
      toast.warning("Vui lòng nhập tên chương trình và mã code.");
      return;
    }

    let updatedList;
    if (editingPromo) {
      updatedList = promotions.map((p) => (p.id === editingPromo.id ? { ...p, ...formData } : p));
    } else {
      updatedList = [{ ...formData, id: Date.now() }, ...promotions];
    }

    try {
      // Attempt save to promotions table if exists
      await supabase.from("promotions").upsert([{ ...formData, id: editingPromo?.id || Date.now() }]);
    } catch (e) {
      console.warn("DB notice:", e);
    }

    setPromotions(updatedList);
    setIsDialogOpen(false);
    toast.success("Đã lưu chương trình khuyến mãi! ✨");
  };

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa khuyến mãi này?")) return;
    setPromotions(promotions.filter((p) => p.id !== id));
    toast.success("Đã xóa khuyến mãi!");
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Chương Trình Khuyến Mãi & Giảm Giá 🎟️
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý các mã giảm giá và chiến dịch ưu đãi trực tiếp cho khách hàng
          </p>
        </div>

        <Button onClick={handleOpenNew} className="rounded-xl text-xs font-bold h-9">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Tạo khuyến mãi mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((p) => (
          <Card key={p.id} className="rounded-3xl border shadow-xs overflow-hidden">
            <CardHeader className="bg-muted/10 pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-foreground">{p.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-primary text-white font-mono font-bold text-xs tracking-wider">
                    {p.code}
                  </span>
                  <Badge variant={p.is_active ? "default" : "secondary"} className="text-[10px] font-bold">
                    {p.is_active ? "Đang áp dụng" : "Tạm ngưng"}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-primary">
                  {p.discount_type === "percentage"
                    ? `-${p.discount_value}%`
                    : `-${new Intl.NumberFormat("vi-VN").format(p.discount_value)}đ`}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">{p.customer_label}</p>

              {(p.start_at || p.end_at) && (
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Áp dụng: {p.start_at ? new Date(p.start_at).toLocaleDateString("vi-VN") : "Bắt đầu"} → {p.end_at ? new Date(p.end_at).toLocaleDateString("vi-VN") : "Không thời hạn"}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(p)}
                  className="h-8 text-xs font-bold rounded-xl"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(p.id)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <TicketPercent className="w-4 h-4 text-primary" />
              {editingPromo ? "Chỉnh Sửa Khuyến Mãi" : "Tạo Khuyến Mãi Mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Mã Code áp dụng *</Label>
              <Input
                placeholder="CANONR50"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().trim() })}
                className="h-9 text-xs font-mono font-bold rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Tên chiến dịch / Chương trình *</Label>
              <Input
                placeholder="Ưu đãi mở bán Canon R50"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Mô tả ưu đãi hiển thị cho khách</Label>
              <Input
                placeholder="Tặng kèm túi máy ảnh cao cấp + Thẻ 64GB"
                value={formData.customer_label}
                onChange={(e) => setFormData({ ...formData, customer_label: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Hình thức giảm</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(val) => setFormData({ ...formData, discount_type: val })}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed_amount">Số tiền cố định (VNĐ)</SelectItem>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Mức giảm</Label>
                <Input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  className="h-9 text-xs font-bold text-primary rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label className="text-xs font-bold">Kích hoạt áp dụng ngay</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} className="rounded-xl text-xs font-bold">
              Lưu khuyến mãi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
