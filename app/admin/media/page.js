"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  FolderOpen,
  Upload,
  Copy,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle2,
  Loader2,
  ImageIcon
} from "lucide-react";
import { compressImage } from "../../../lib/utils";
import { validateUploadFile, generateSafeFileName } from "../../../lib/upload-utils";
import { toast } from "sonner";

export default function MediaLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from("products").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (!error && data) {
        const publicUrls = data
          .filter((f) => !f.name.startsWith("."))
          .map((f) => {
            const { data: urlData } = supabase.storage.from("products").getPublicUrl(f.name);
            return {
              name: f.name,
              url: urlData.publicUrl,
              size: f.metadata?.size ? (f.metadata.size / 1024).toFixed(1) + " KB" : "Đã tối ưu",
              created_at: f.created_at || new Date().toISOString()
            };
          });
        setImages(publicUrls);
      }
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi tải thư viện ảnh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      toast.info(`Đang tải lên ${files.length} ảnh...`);
      for (const file of files) {
        const validation = validateUploadFile(file, "image");
        if (!validation.valid) continue;

        const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.8 });
        const fileName = generateSafeFileName(file.name, "media");

        await supabase.storage.from("products").upload(fileName, compressed);
      }
      toast.success("Tải ảnh lên thư viện thành công! ✨");
      await loadMedia();
    } catch (err) {
      toast.error("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép đường dẫn ảnh vào Clipboard!");
  };

  const handleDelete = async (name) => {
    if (!confirm(`Bạn có chắc muốn xóa tập tin "${name}" khỏi bộ nhớ lưu trữ?`)) return;
    try {
      await supabase.storage.from("products").remove([name]);
      toast.success("Đã xóa tập tin!");
      setImages(images.filter((img) => img.name !== name));
    } catch (e) {
      toast.error("Lỗi: " + e.message);
    }
  };

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Thư Viện Hình Ảnh (Media Library) 📁
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý tập trung toàn bộ hình ảnh sản phẩm, banner và logo để tái sử dụng mà không bị trùng lặp
          </p>
        </div>

        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" /> Tải thêm ảnh mới
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Search & Stats */}
      <div className="bg-white p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên tập tin ảnh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Badge variant="outline" className="text-xs font-bold py-1 px-3 bg-muted/40">
          Tổng cộng: {images.length} tập tin
        </Badge>
      </div>

      {/* Media Grid */}
      {loading || uploading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-xs text-muted-foreground">
            {uploading ? "Đang xử lý và tải ảnh lên..." : "Đang mở thư viện ảnh..."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border text-muted-foreground text-xs">
          Chưa có tập tin nào trong thư viện.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <Card key={item.name} className="rounded-2xl border shadow-xs overflow-hidden group bg-white hover:border-primary/40 transition-colors">
              <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleCopyUrl(item.url)}
                    className="h-8 w-8 rounded-xl bg-white shadow-md"
                    title="Sao chép URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-xl bg-white shadow-md inline-flex items-center justify-center text-foreground hover:bg-muted"
                    title="Mở ảnh gốc"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.name)}
                    className="h-8 w-8 rounded-xl shadow-md"
                    title="Xóa tập tin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2.5 text-[11px] space-y-0.5">
                <p className="font-bold text-foreground truncate font-mono" title={item.name}>
                  {item.name}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {item.size}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
