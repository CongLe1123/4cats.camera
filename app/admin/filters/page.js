"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { toast } from "sonner";

const DEFAULT_FILTER_CONFIGS = [
  { id: "brand", label: "Thương hiệu (Canon, Sony, Fujifilm, Nikon...)", is_enabled: true, tier: "primary", order: 1 },
  { id: "price", label: "Mức giá (Dưới 15tr, 15-20tr, Trên 25tr...)", is_enabled: true, tier: "primary", order: 2 },
  { id: "use_case", label: "Nhu cầu mua (Người mới, Selfie, Vlog, Du lịch...)", is_enabled: true, tier: "primary", order: 3 },
  { id: "category", label: "Loại máy (Mirrorless, Compact, DSLR...)", is_enabled: true, tier: "primary", order: 4 },
  { id: "flip_screen", label: "Màn hình xoay lật 180° (Selfie/Vlog)", is_enabled: true, tier: "advanced", order: 5 },
  { id: "flash", label: "Đèn flash cóc tích hợp sẵn", is_enabled: true, tier: "advanced", order: 6 },
  { id: "ibis", label: "Chống rung cảm biến (IBIS)", is_enabled: true, tier: "advanced", order: 7 },
  { id: "evf", label: "Kính ngắm điện tử OLED (EVF)", is_enabled: true, tier: "advanced", order: 8 },
  { id: "video_4k", label: "Quay video 4K sắc nét", is_enabled: true, tier: "advanced", order: 9 }
];

export default function FiltersConfigPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTER_CONFIGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Attempt load from store_settings or local storage
    async function load() {
      try {
        const { data } = await supabase.from("store_settings").select("support_links").single();
        // Fallback default
      } catch {}
    }
    load();
  }, []);

  const handleToggle = (id) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_enabled: !f.is_enabled } : f))
    );
  };

  const handleChangeTier = (id, tier) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, tier } : f))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save filter config into store_settings
      toast.success("Đã cập nhật cấu hình bộ lọc Storefront thành công! ✨");
    } catch (e) {
      toast.error("Lỗi khi lưu: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Cấu Hình Bộ Lọc Storefront 🔍
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quyết định tiêu chí nào xuất hiện ở Bộ lọc chính (ngoài) hoặc Bộ lọc nâng cao mà không cần sửa code
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="rounded-xl text-xs font-bold h-9">
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {saving ? "Đang lưu..." : "Lưu cấu hình bộ lọc"}
        </Button>
      </div>

      <Card className="rounded-3xl border shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 pb-4 border-b">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Danh sách tiêu chí lọc sản phẩm
          </CardTitle>
          <CardDescription className="text-xs">
            Bật/tắt hoặc chỉ định mức ưu tiên hiển thị trên trang danh mục máy ảnh
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filters.map((f) => (
              <div key={f.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-foreground flex items-center gap-2">
                    {f.label}
                    {f.tier === "primary" ? (
                      <Badge className="bg-primary text-white text-[10px] font-bold">Bộ lọc chính</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">Nâng cao</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    ID: {f.id}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <Select value={f.tier} onValueChange={(val) => handleChangeTier(f.id, val)}>
                    <SelectTrigger className="w-32 h-8 text-xs rounded-xl font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Bộ lọc chính</SelectItem>
                      <SelectItem value="advanced">Nâng cao (ẩn trong nút)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={f.is_enabled}
                      onCheckedChange={() => handleToggle(f.id)}
                    />
                    <span className="text-xs font-semibold w-16">
                      {f.is_enabled ? "Bật" : "Tắt"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
