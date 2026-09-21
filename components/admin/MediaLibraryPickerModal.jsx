"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Image as ImageIcon, Loader2 } from "lucide-react";

export default function MediaLibraryPickerModal({ isOpen, onClose, onSelect }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    async function loadMedia() {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from("products")
          .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (!error && data) {
          const list = data
            .filter((f) => !f.name.startsWith("."))
            .map((f) => {
              const { data: urlData } = supabase.storage
                .from("products")
                .getPublicUrl(f.name);
              return {
                name: f.name,
                url: urlData.publicUrl,
                created_at: f.created_at,
              };
            });
          setImages(list);
        }
      } catch (err) {
        console.error("Error loading media:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [isOpen]);

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl rounded-3xl border p-6 font-sans">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Chọn ảnh từ Thư viện Media 📁
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tái sử dụng hình ảnh đã tải lên để tránh lưu trữ ảnh trùng lặp
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên tập tin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs rounded-xl h-9"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Đang tải danh sách ảnh từ máy chủ...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-2xl p-6">
            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium">Chưa có ảnh nào trong thư viện hoặc không khớp tìm kiếm.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto p-1">
            {filtered.map((img) => (
              <button
                key={img.name}
                type="button"
                onClick={() => {
                  onSelect(img.url);
                  onClose();
                }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-black/5 bg-muted/40 hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col text-left"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium line-clamp-1 break-all">
                    {img.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t mt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
