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
    conditions: [],
    colors: [],
    specialties: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [newValue, setNewValue] = useState("");

  // For series, we need to link to a brand
  const [selectedBrandId, setSelectedBrandId] = useState("");

  // Brand-specific states
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [b, cat, s, cond, col, spec] = await Promise.all([
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("series").select("*").order("name"),
        supabase.from("conditions").select("*").order("name"),
        supabase.from("colors").select("*").order("name"),
        supabase.from("specialties").select("*").order("name"),
      ]);

      setData({
        brands: b.data || [],
        categories: cat.data || [],
        series: s.data || [],
        conditions: cond.data || [],
        colors: col.data || [],
        specialties: spec.data || [],
      });

      if (b.data?.length > 0) setSelectedBrandId(b.data[0].id.toString());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (table) => {
    if (!newValue.trim()) return;

    const payload = { name: newValue.trim() };
    if (table === "series") {
      if (!selectedBrandId) return toast.error("Please select a brand");
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
      toast.success("Added successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (
      !confirm("Are you sure? This might affect cameras linked to this item.")
    )
      return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      setData((prev) => ({
        ...prev,
        [table]: prev[table].filter((item) => item.id !== id),
      }));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed. It might be in use.");
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
          .sort((a, b) => {
            if (table === "brands")
              return (
                (a.display_order || 0) - (b.display_order || 0) ||
                a.name.localeCompare(b.name)
              );
            return a.name.localeCompare(b.name);
          }),
      }));
      setEditingId(null);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBrandImageUpload = async (brandId, file) => {
    setIsUploading(true);
    const brand = data.brands.find((b) => b.id === brandId);
    const oldImageUrl = brand?.image;

    try {
      // 1. Optimize: Image is compressed before upload (800px max, 0.8 quality)
      const compressed = await compressImage(file, {
        maxWidth: 800,
        quality: 0.8,
      });
      const fileName = `brand-${brandId}-${Date.now()}.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressed);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("brands")
        .update({ image: publicUrl })
        .eq("id", brandId);

      if (updateError) throw updateError;

      // 2. Cleanup: Delete old image from storage if it exists
      if (oldImageUrl && oldImageUrl.includes("/products/")) {
        const pathParts = oldImageUrl.split("/products/");
        if (pathParts.length > 1) {
          const oldPath = decodeURIComponent(pathParts[1]);
          await supabase.storage
            .from("products")
            .remove([oldPath])
            .then(({ error }) => {
              if (error) console.error("Error deleting old image:", error);
            });
        }
      }

      setData((prev) => ({
        ...prev,
        brands: prev.brands.map((b) =>
          b.id === brandId ? { ...b, image: publicUrl } : b,
        ),
      }));
      toast.success("Cập nhật ảnh thành công");
    } catch (err) {
      toast.error("Lỗi upload: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">
          Phân loại & Danh mục
        </h1>
        <p className="text-muted-foreground text-sm">
          Quản lý các thông số hệ thống
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 h-12 rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="brands" className="rounded-lg font-bold gap-2">
            <Tag className="w-4 h-4" /> Hãng
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="rounded-lg font-bold gap-2"
          >
            <Folder className="w-4 h-4" /> Loại
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-lg font-bold gap-2">
            <Layers className="w-4 h-4" /> Dòng
          </TabsTrigger>
          <TabsTrigger
            value="conditions"
            className="rounded-lg font-bold gap-2"
          >
            <Sparkles className="w-4 h-4" /> Độ mới
          </TabsTrigger>
          <TabsTrigger value="colors" className="rounded-lg font-bold gap-2">
            <Palette className="w-4 h-4" /> Màu
          </TabsTrigger>
          <TabsTrigger
            value="specialties"
            className="rounded-lg font-bold gap-2"
          >
            <Sparkles className="w-4 h-4" /> Tính năng
          </TabsTrigger>
        </TabsList>

        {Object.keys(data).map((table) => (
          <TabsContent key={table} value={table} className="mt-8 space-y-6">
            <Card className="rounded-2xl border-none shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Thêm mới{" "}
                    {table === "brands"
                      ? "Hãng"
                      : table === "categories"
                        ? "Loại máy"
                        : table === "series"
                          ? "Dòng máy"
                          : table === "conditions"
                            ? "Tình trạng"
                            : table === "specialties"
                              ? "Tính năng"
                              : "Màu sắc"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  {table === "series" && (
                    <div className="space-y-2 w-1/3">
                      <Label>Hãng liên kết</Label>
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {data.brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Label>Tên mới</Label>
                    <Input
                      placeholder="Nhập tên..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd(table)}
                    />
                  </div>
                  <Button onClick={() => handleAdd(table)}>
                    <Plus className="w-4 h-4 mr-2" /> Thêm
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data[table].map((item) => (
                <Card
                  key={item.id}
                  className="rounded-xl border shadow-sm hover:shadow-md transition-all group overflow-hidden"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 flex-1"
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleUpdate(table, item.id)
                          }
                        />
                        {table === "brands" && (
                          <Input
                            type="number"
                            value={editOrder}
                            onChange={(e) => setEditOrder(e.target.value)}
                            className="h-8 w-16"
                            placeholder="Stt"
                          />
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdate(table, item.id)}
                          className="h-8 w-8 text-green-600"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col flex-1">
                          {table === "brands" && (
                            <div className="mb-3 relative group/img aspect-video bg-muted/30 rounded-lg overflow-hidden border">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                                  <ImageIcon className="w-6 h-6 mb-1 opacity-20" />
                                  <span className="text-[10px]">No image</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                <Upload className="w-5 h-5 text-white" />
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) =>
                                    e.target.files?.[0] &&
                                    handleBrandImageUpload(
                                      item.id,
                                      e.target.files[0],
                                    )
                                  }
                                  disabled={isUploading}
                                />
                              </label>
                            </div>
                          )}
                          <span className="font-bold flex items-center gap-2">
                            {item.name}
                            {table === "series" && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4"
                              >
                                {
                                  data.brands.find(
                                    (b) => b.id === item.brand_id,
                                  )?.name
                                }
                              </Badge>
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                            className="h-8 w-8 hover:text-primary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(table, item.id)}
                            className="h-8 w-8 hover:text-destructive text-muted-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {data[table].length === 0 && (
              <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
                Chưa có dữ liệu.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }) {
  const styles = {
    default: "bg-primary text-white",
    outline: "border text-muted-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
