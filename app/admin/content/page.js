"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import {
  FileQuestion,
  Star,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  EyeOff,
  Eye,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export default function ContentAndFaqPage() {
  const [activeTab, setActiveTab] = useState("faqs");

  // FAQs State
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "Máy ảnh tại 4cats Camera là hàng mới hay hàng cũ?",
      answer: "100% máy ảnh tại 4cats Camera hiện nay là hàng MỚI NGUYÊN SEAL, chính hãng phân phối tại Việt Nam, có đầy đủ tem bảo hành điện tử chính hãng từ 12 đến 24 tháng.",
      display_order: 1,
      is_active: true
    },
    {
      id: 2,
      question: "Người mới bắt đầu chưa biết chụp có dùng được không?",
      answer: "Rất dễ dàng! Tất cả máy ảnh tại 4cats đều có giao diện tiếng Việt, chế độ chụp tự động thông minh (Auto) và màn hình cảm ứng như điện thoại. Đội ngũ 4cats luôn hướng dẫn cài đặt và chia sẻ công thức màu tận tình.",
      display_order: 2,
      is_active: true
    },
    {
      id: 3,
      question: "Có kèm theo lens và phụ kiện khi mua không?",
      answer: "Tùy phiên bản bạn chọn: Phiên bản Kit đã bao gồm ống kính zoom chuẩn mua về là chụp được ngay. Phiên bản Body chỉ gồm thân máy. Tất cả đều fullbox đầy đủ pin zin, cáp sạc, dây đeo chính hãng.",
      display_order: 3,
      is_active: true
    },
    {
      id: 4,
      question: "Chính sách bảo hành và đổi trả thế nào?",
      answer: "Bảo hành chính hãng 12-24 tháng toàn quốc. Đặc biệt, 4cats hỗ trợ 7 ngày đầu tiên 1 đổi 1 máy mới 100% nếu phát sinh lỗi kỹ thuật từ nhà sản xuất.",
      display_order: 4,
      is_active: true
    }
  ]);

  // Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 101,
      customer_name: "Thùy Trang",
      product_name: "Canon EOS R50 (Trắng / Kit 18-45mm)",
      rating: 5,
      comment: "Máy xinh lắm luôn ạ, màu trắng ngọc trai nhìn sang dã man! Shop tư vấn nhiệt tình, ship hỏa tốc 2h là nhận được rồi.",
      created_at: "2026-09-18T10:30:00Z",
      status: "approved"
    },
    {
      id: 102,
      customer_name: "Huy Hoàng",
      product_name: "Sony ZV-E10 II (Đen)",
      rating: 5,
      comment: "Quay 4K siêu nét, micro thu âm trong trẻo. Rất đáng tiền cho bạn nào làm vlog hoặc TikTok.",
      created_at: "2026-09-15T14:20:00Z",
      status: "approved"
    }
  ]);

  // Dialog State for FAQs
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    display_order: 1,
    is_active: true
  });

  const handleOpenNewFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      display_order: faqs.length + 1,
      is_active: true
    });
    setIsFaqOpen(true);
  };

  const handleOpenEditFaq = (f) => {
    setEditingFaq(f);
    setFaqForm({ ...f });
    setIsFaqOpen(true);
  };

  const handleSaveFaq = () => {
    if (!faqForm.question?.trim() || !faqForm.answer?.trim()) {
      toast.warning("Vui lòng nhập câu hỏi và câu trả lời.");
      return;
    }

    if (editingFaq) {
      setFaqs(faqs.map((f) => (f.id === editingFaq.id ? { ...f, ...faqForm } : f)));
      toast.success("Cập nhật câu hỏi thành công! ✨");
    } else {
      setFaqs([...faqs, { ...faqForm, id: Date.now() }]);
      toast.success("Đã thêm câu hỏi mới! ✨");
    }
    setIsFaqOpen(false);
  };

  const handleDeleteFaq = (id) => {
    if (!confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    setFaqs(faqs.filter((f) => f.id !== id));
    toast.success("Đã xóa câu hỏi!");
  };

  const handleReviewStatus = (id, newStatus) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Đã cập nhật trạng thái đánh giá: ${newStatus}`);
  };

  const handleDeleteReview = (id) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Đã xóa đánh giá!");
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Quản Lý Câu Hỏi (FAQ) & Đánh Giá 💬
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản trị các câu hỏi thường gặp của khách hàng và kiểm duyệt đánh giá thực tế
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-xs h-10 p-1 bg-white border rounded-2xl">
          <TabsTrigger value="faqs" className="rounded-xl font-bold text-xs">
            <FileQuestion className="w-3.5 h-3.5 mr-1" /> Câu hỏi FAQ ({faqs.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-xl font-bold text-xs">
            <Star className="w-3.5 h-3.5 mr-1" /> Đánh giá ({reviews.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB FAQs */}
        <TabsContent value="faqs" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground">
              Các câu hỏi xuất hiện trên trang chi tiết máy và chân trang
            </span>
            <Button onClick={handleOpenNewFaq} className="h-8 text-xs font-bold rounded-xl">
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm câu hỏi
            </Button>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <Card key={f.id} className="rounded-2xl border shadow-xs bg-white overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    {f.question}
                  </CardTitle>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditFaq(f)}
                      className="h-7 w-7 rounded-lg"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFaq(f.id)}
                      className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-muted-foreground leading-relaxed">
                  {f.answer}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB REVIEWS */}
        <TabsContent value="reviews" className="mt-4 space-y-4">
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="rounded-2xl border shadow-xs bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{r.customer_name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {r.product_name}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  &quot;{r.comment}&quot;
                </p>

                <div className="pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{new Date(r.created_at).toLocaleDateString("vi-VN")}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={r.status === "approved" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {r.status === "approved" ? "Đã duyệt hiển thị" : "Đang ẩn"}
                    </Badge>

                    {r.status === "approved" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewStatus(r.id, "hidden")}
                        className="h-6 text-[10px] rounded-lg"
                      >
                        <EyeOff className="w-3 h-3 mr-1" /> Ẩn
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewStatus(r.id, "approved")}
                        className="h-6 text-[10px] rounded-lg"
                      >
                        <Eye className="w-3 h-3 mr-1" /> Duyệt
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReview(r.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAQ Dialog */}
      <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black">
              {editingFaq ? "Sửa Câu Hỏi FAQ" : "Thêm Câu Hỏi Mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Câu hỏi *</Label>
              <Input
                placeholder="ví dụ: Máy này có phù hợp cho người mới không?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Câu trả lời giải đáp chi tiết *</Label>
              <Textarea
                placeholder="Nội dung giải đáp thắc mắc của khách..."
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                rows={4}
                className="text-xs rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFaqOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleSaveFaq} className="rounded-xl text-xs font-bold">
              Lưu câu hỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
