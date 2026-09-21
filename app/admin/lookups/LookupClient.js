"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Tag,
  Folder,
  Layers,
  Sparkles,
  Palette,
  Compass,
  Upload,
  ImageIcon,
} from "lucide-react";
import { compressImage } from "../../../lib/utils";
import { toast } from "sonner";

export default function LookupsClient() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("brands");
  const [data, setData] = useState({
    brands: [],
    categories: [],
    series: [],
    use_cases: [
      { id: 1, name: "Người mới" },
      { id: 2, name: "Selfie" },
      { id: 3, name: "Vlog" },
      { id: 4, name: "Du lịch" },
      { id: 5, name: "Chụp người" },
      { id: 6, name: "Film look" },
      { id: 7, name: "Content creator" }
    ],
    colors: [],
    specialties: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [newValue, setNewValue] = useState("");

  // For series, we need to link to a brand
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [b, cat, s, col, spec] = await Promise.all([
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("series").select("*").order("name"),
        supabase.from("colors").select("*").order("name"),
        supabase.from("specialties").select("*").order("name"),
      ]);

      setData((prev) => ({
        ...prev,
        brands: b.data || [],
        categories: cat.data || [],
        series: s.data || [],
        colors: col.data || [],
        specialties: spec.data || [],
      }));

      if (b.data?.length > 0) setSelectedBrandId(b.data[0].id.toString());
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải dữ liệu phân loại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (table) => {
    if (!newValue.trim()) return;

    if (table === "use_cases") {
      const newItem = { id: Date.now(), name: newValue.trim() };
      setData((prev) => ({
        ...prev,
        use_cases: [...prev.use_cases, newItem]
      }));
      setNewValue("");
      toast.success("Đã thêm nhóm nhu cầu mới!");
      return;
    }

    const payload = { name: newValue.trim() };
    if (table === "series") {
      if (!selectedBrandId) return toast.error("Vui lòng chọn hãng liên kết");
      payload.brand_id = parseInt(selectedBrandId);
    }

    try {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setData((prev) => ({
        ...prev,
        [table]: [...prev[table], inserted].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      }));
      setNewValue("");
      toast.success("Thêm mới thành công!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này?")) return;

    if (table === "use_cases") {
      setData((prev) => ({
        ...prev,
        use_cases: prev.use_cases.filter((item) => item.id !== id)
      }));
      toast.success("Đã xóa mục!");
      return;
    }

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      setData((prev) => ({
        ...prev,
        [table]: prev[table].filter((item) => item.id !== id),
      }));
      toast.success("Đã xóa thành công!");
    } catch (err) {
      toast.error("Không thể xóa, mục này có thể đang được máy ảnh liên kết.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.name);
    setEditOrder(item.display_order || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleUpdate = async (table, id) => {
    if (!editValue.trim()) return;

    if (table === "use_cases") {
      setData((prev) => ({
        ...prev,
        use_cases: prev.use_cases.map((item) => (item.id === id ? { ...item, name: editValue.trim() } : item))
      }));
      setEditingId(null);
      toast.success("Cập nhật thành công!");
      return;
    }

    try {
      const payload = { name: editValue.trim() };
      if (table === "brands") {
        payload.display_order = parseInt(editOrder) || 0;
      }

      const { error } = await supabase.from(table).update(payload).eq("id", id);
      if (error) throw error;

      setData((prev) => ({
        ...prev,
        [table]: prev[table]
          .map((item) => (item.id === id ? { ...item, ...payload } : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
      setEditingId(null);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBrandImageUpload = async (brandId, file) => {
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 800, quality: 0.8 });
      const fileName = `brand-${brandId}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressed);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      await supabase.from("brands").update({ image: publicUrl }).eq("id", brandId);

      setData((prev) => ({
        ...prev,
        brands: prev.brands.map((b) => (b.id === brandId ? { ...b, image: publicUrl } : b)),
      }));
      toast.success("Cập nhật logo thành công!");
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const tableLabels = {
    brands: "Thương hiệu (Canon, Sony, Fujifilm, Nikon...)",
    categories: "Loại máy ảnh (Mirrorless, Compact, DSLR...)",
    series: "Dòng máy theo hãng (EOS R, Alpha, X-Series...)",
    use_cases: "Nhu cầu mua người mới (Selfie, Vlog, Du lịch...)",
    specialties: "Tính năng nổi bật (Màn xoay lật, Flash, IBIS, 4K...)",
    colors: "Màu sắc (Đen, Trắng, Bạc...)"
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Phân Loại & Thuộc Tính Danh Mục 🏷️
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Quản lý thương hiệu, dòng máy, loại máy và nhóm nhu cầu người mới
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1.5 bg-white border rounded-2xl gap-1">
          <TabsTrigger value="brands" className="rounded-xl font-bold text-xs py-2">
            <Tag className="w-3.5 h-3.5 mr-1" /> Hãng
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl font-bold text-xs py-2">
            <Folder className="w-3.5 h-3.5 mr-1" /> Loại máy
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-xl font-bold text-xs py-2">
            <Layers className="w-3.5 h-3.5 mr-1" /> Dòng máy
          </TabsTrigger>
          <TabsTrigger value="use_cases" className="rounded-xl font-bold text-xs py-2">
            <Compass className="w-3.5 h-3.5 mr-1" /> Nhu cầu
          </TabsTrigger>
          <TabsTrigger value="specialties" className="rounded-xl font-bold text-xs py-2">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Tính năng
          </TabsTrigger>
          <TabsTrigger value="colors" className="rounded-xl font-bold text-xs py-2">
            <Palette className="w-3.5 h-3.5 mr-1" /> Màu sắc
          </TabsTrigger>
        </TabsList>

        {Object.keys(data).map((table) => (
          <TabsContent key={table} value={table} className="mt-6 space-y-6">
            {/* Add New Card */}
            <Card className="rounded-3xl border shadow-xs bg-white">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-sm font-black">
                  Thêm mới {tableLabels[table]}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                  {table === "series" && (
                    <div className="space-y-1 sm:w-1/3">
                      <Label className="text-xs font-bold">Thuộc hãng</Label>
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className="flex h-9 w-full rounded-xl border bg-white px-3 text-xs"
                      >
                        {data.brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <Label className="text-xs font-bold">Tên mục mới</Label>
                    <Input
                      placeholder="ví dụ: Canon, Mirrorless, Vlog..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd(table)}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <Button onClick={() => handleAdd(table)} className="h-9 rounded-xl text-xs font-bold">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm ngay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List Table Card */}
            <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
                    <tr>
                      <th className="p-3">Tên</th>
                      {table === "brands" && <th className="p-3">Logo</th>}
                      {table === "brands" && <th className="p-3">Thứ tự</th>}
                      <th className="p-3 text-right pr-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data[table]?.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {editingId === item.id ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 text-xs rounded-xl max-w-xs"
                            />
                          ) : (
                            item.name
                          )}
                        </td>

                        {table === "brands" && (
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-7 h-7 object-contain rounded-md border bg-white p-0.5"
                                />
                              ) : null}
                              <label className="cursor-pointer text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                                <Upload className="w-3 h-3" /> Tải logo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleBrandImageUpload(item.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </td>
                        )}

                        {table === "brands" && (
                          <td className="p-3">
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                value={editOrder}
                                onChange={(e) => setEditOrder(e.target.value)}
                                className="h-8 text-xs rounded-xl w-20"
                              />
                            ) : (
                              item.display_order || 0
                            )}
                          </td>
                        )}

                        <td className="p-3 text-right pr-4 whitespace-nowrap">
                          {editingId === item.id ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(table, item.id)}
                                className="h-7 text-xs font-bold rounded-lg"
                              >
                                <Save className="w-3.5 h-3.5 mr-1" /> Lưu
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEdit}
                                className="h-7 text-xs rounded-lg"
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(item)}
                                className="h-7 w-7 rounded-lg"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(table, item.id)}
                                className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
