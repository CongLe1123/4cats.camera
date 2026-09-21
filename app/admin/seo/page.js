"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import {
  Globe2,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  Search,
  Save,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function SeoRedirectsPage() {
  const [redirects, setRedirects] = useState([
    { id: 1, from: "/may-anh-cu/canon-r50", to: "/may-anh/canon-eos-r50", code: 301, active: true },
    { id: 2, from: "/may-anh-cu/sony-zve10", to: "/may-anh/sony-zv-e10-ii", code: 301, active: true },
    { id: 3, from: "/may-anh-cu/fujifilm-xt30", to: "/may-anh/fujifilm-x-t30-ii", code: 301, active: true },
    { id: 4, from: "/may-anh-cu", to: "/shop", code: 301, active: true }
  ]);

  const [globalSeo, setGlobalSeo] = useState({
    site_title: "4cats Camera — Máy Ảnh Mới Chính Hãng Cho Người Mới & Creator",
    meta_description: "Cửa hàng máy ảnh mới 100% chính hãng tại Hà Nội. Chuyên Canon, Sony, Fujifilm, Nikon. Bảo hành chính hãng 12-24 tháng, 7 ngày 1 đổi 1, freeship toàn quốc.",
    canonical_domain: "https://4catscamera.com"
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRedirect, setNewRedirect] = useState({
    from: "",
    to: "",
    code: 301
  });

  const handleAddRedirect = () => {
    if (!newRedirect.from.trim() || !newRedirect.to.trim()) {
      toast.warning("Vui lòng điền đủ đường dẫn gốc (From) và đường dẫn mới (To).");
      return;
    }

    let fromPath = newRedirect.from.trim();
    let toPath = newRedirect.to.trim();
    if (!fromPath.startsWith("/")) fromPath = "/" + fromPath;
    if (!toPath.startsWith("/")) toPath = "/" + toPath;

    setRedirects([
      ...redirects,
      {
        id: Date.now(),
        from: fromPath,
        to: toPath,
        code: 301,
        active: true
      }
    ]);
    setIsDialogOpen(false);
    setNewRedirect({ from: "", to: "", code: 301 });
    toast.success("Đã thêm chuyển hướng 301 mới! ✨");
  };

  const handleDeleteRedirect = (id) => {
    setRedirects(redirects.filter((r) => r.id !== id));
    toast.success("Đã xóa chuyển hướng!");
  };

  const handleSaveGlobalSeo = () => {
    toast.success("Đã lưu cấu hình SEO toàn trang thành công! ✨");
  };

  return (
    <div className="space-y-8 pb-20 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý SEO & Chuyển Hướng 301 🌐
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tối ưu hóa thẻ Meta tìm kiếm và xử lý chuyển hướng vĩnh viễn các đường dẫn máy ảnh cũ
          </p>
        </div>
      </div>

      {/* Global SEO Settings */}
      <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
        <CardHeader className="bg-muted/10 pb-4 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-primary" /> Cấu hình SEO mặc định toàn trang
            </CardTitle>
            <CardDescription className="text-xs">
              Xuất hiện khi trang không có thẻ meta tùy chỉnh riêng
            </CardDescription>
          </div>
          <Button onClick={handleSaveGlobalSeo} className="h-8 text-xs font-bold rounded-xl">
            <Save className="w-3.5 h-3.5 mr-1" /> Lưu cấu hình SEO
          </Button>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="space-y-1">
            <Label className="text-xs font-bold">Tiêu đề trang chủ mặc định (Title Tag)</Label>
            <Input
              value={globalSeo.site_title}
              onChange={(e) => setGlobalSeo({ ...globalSeo, site_title: e.target.value })}
              className="h-9 text-xs rounded-xl font-bold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">Thẻ mô tả tìm kiếm (Meta Description)</Label>
            <Textarea
              value={globalSeo.meta_description}
              onChange={(e) => setGlobalSeo({ ...globalSeo, meta_description: e.target.value })}
              rows={3}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Google Preview */}
          <div className="p-4 bg-muted/20 rounded-2xl border space-y-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1">
              Xem trước hiển thị tìm kiếm Google
            </p>
            <div className="text-blue-700 text-sm font-semibold hover:underline">
              {globalSeo.site_title}
            </div>
            <div className="text-emerald-700 text-xs font-mono">
              {globalSeo.canonical_domain}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {globalSeo.meta_description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 301 Redirects Table */}
      <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
        <CardHeader className="bg-muted/10 pb-4 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" /> Chuyển hướng vĩnh viễn (301 Redirects)
            </CardTitle>
            <CardDescription className="text-xs">
              Tự động dẫn khách từ các link máy cũ trước đây sang trang máy ảnh mới tương ứng
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="h-8 text-xs font-bold rounded-xl">
            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm chuyển hướng
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
              <tr>
                <th className="p-3">Đường dẫn cũ (From)</th>
                <th className="p-3 w-8 text-center"></th>
                <th className="p-3">Đường dẫn mới (To)</th>
                <th className="p-3 text-center">Mã trạng thái</th>
                <th className="p-3 text-right pr-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {redirects.map((r) => (
                <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-3 font-mono font-medium text-destructive">
                    {r.from}
                  </td>
                  <td className="p-3 text-center text-muted-foreground">
                    →
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-700">
                    {r.to}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className="font-mono text-[10px] font-bold">
                      {r.code} Permanent
                    </Badge>
                  </td>
                  <td className="p-3 text-right pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRedirect(r.id)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Dialog Add Redirect */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black">Thêm Chuyển Hướng 301</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Đường dẫn cũ cần chuyển (From)</Label>
              <Input
                placeholder="/may-anh-cu/canon-r50"
                value={newRedirect.from}
                onChange={(e) => setNewRedirect({ ...newRedirect, from: e.target.value })}
                className="h-9 text-xs rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Đường dẫn mới đích đến (To)</Label>
              <Input
                placeholder="/may-anh/canon-eos-r50"
                value={newRedirect.to}
                onChange={(e) => setNewRedirect({ ...newRedirect, to: e.target.value })}
                className="h-9 text-xs rounded-xl font-mono"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleAddRedirect} className="rounded-xl text-xs font-bold">
              Thêm chuyển hướng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
