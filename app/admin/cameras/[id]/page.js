"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  adminGetProductById,
  adminSaveProduct,
  adminDeleteProduct
} from "../../../../lib/adminApi";
import { supabase } from "../../../../lib/supabase";
import { compressImage } from "../../../../lib/utils";
import { validateUploadFile, generateSafeFileName } from "../../../../lib/upload-utils";
import RichContentEditor from "../../../../components/admin/RichContentEditor";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Switch } from "../../../../components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../../components/ui/select";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Upload,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  Package,
  Boxes,
  HelpCircle,
  FileText,
  AlertTriangle,
  Globe2,
  CheckCircle2,
  Copy,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

// Predefined beginner-friendly tags
const BEGINNER_USE_CASES = [
  "Người mới",
  "Selfie",
  "Vlog",
  "Du lịch",
  "Chụp người",
  "Film look",
  "Gia đình",
  "Content creator"
];

// Specification templates
const CAMERA_SPEC_TEMPLATE = [
  { key: "Cảm biến (Sensor)", label: "Cảm biến (Sensor)", placeholder: "APS-C CMOS 24.2 MP" },
  { key: "Độ phân giải", label: "Độ phân giải", placeholder: "24.2 Megapixels" },
  { key: "Ngàm ống kính", label: "Ngàm ống kính (Mount)", placeholder: "Canon RF / RF-S" },
  { key: "Quay Video", label: "Quay Video", placeholder: "4K 30p không crop, FHD 120p" },
  { key: "Màn hình", label: "Màn hình LCD", placeholder: "Cảm ứng xoay lật 180°" },
  { key: "Trọng lượng", label: "Trọng lượng", placeholder: "375g (kèm pin & thẻ)" },
  { key: "Kính ngắm EVF", label: "Kính ngắm EVF", placeholder: "OLED 2.36 triệu điểm ảnh" },
  { key: "Chống rung (IBIS)", label: "Chống rung", placeholder: "Điện tử Movie Digital IS" },
  { key: "Đèn Flash cóc", label: "Đèn flash cóc", placeholder: "Tích hợp sẵn trên body" },
  { key: "Kết nối không dây", label: "Wi-Fi & Bluetooth", placeholder: "Có (Truyền ảnh nhanh qua app)" },
  { key: "Cổng Mic 3.5mm", label: "Cổng Micro ngoài", placeholder: "Có (3.5mm)" },
  { key: "Pin sử dụng", label: "Pin chuẩn", placeholder: "LP-E17 (~370 tấm)" }
];

export default function EditCameraPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Main Form Data
  const [product, setProduct] = useState({
    id: id === "new" ? "" : id,
    name: "",
    model_name: "",
    brand: "Canon",
    series: "EOS R",
    camera_type: "Mirrorless",
    slug: "",
    image: "",
    images: [],
    short_description: "",
    beginner_summary: "",
    content: "",
    strengths: [],
    limitations: [],
    use_cases: ["Người mới", "Selfie"],
    characteristics: [],
    technical_specs: {},
    search_aliases: [],
    compatible_accessories: [],
    variants: [],
    status: "published",
    is_published: true,
    is_featured: false,
    featured_section: "featured",
    featured_order: 0,
    seo_title: "",
    seo_description: ""
  });

  // Bulk Variant Generator Dialog State
  const [isBulkGenOpen, setIsBulkGenOpen] = useState(false);
  const [bulkColors, setBulkColors] = useState("Đen, Trắng");
  const [bulkKits, setBulkKits] = useState("Body only, Kit 18-45mm");
  const [bulkBasePrice, setBulkBasePrice] = useState("14990000");

  // Single Variant Add Dialog State
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [newVar, setNewVar] = useState({
    color_label: "Đen Cổ Điển",
    color: "Black",
    color_hex: "#1F2937",
    kit_type: "Body only",
    kit_label: "Thân máy (Body only)",
    included_lens: "",
    sku: "",
    price: "14990000",
    compare_at_price: "",
    cauGiayStock: 5,
    thanhXuanStock: 3,
    warranty: "12 tháng chính hãng"
  });

  // Temporary input state for bullet points
  const [newStrength, setNewStrength] = useState("");
  const [newLimitation, setNewLimitation] = useState("");
  const [newAlias, setNewAlias] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (id !== "new") {
        try {
          const data = await adminGetProductById(id);
          if (data) {
            setProduct(data);
          } else {
            toast.error("Không tìm thấy máy ảnh.");
          }
        } catch (e) {
          console.error(e);
          toast.error("Lỗi khi tải thông tin sản phẩm.");
        }
      } else {
        // Initialize default new product
        setProduct({
          id: "",
          name: "",
          model_name: "",
          brand: "Canon",
          series: "EOS R",
          camera_type: "Mirrorless",
          slug: "",
          image: "",
          images: [],
          short_description: "",
          beginner_summary: "",
          content: "",
          strengths: ["Lấy nét tự động cực nhanh nhận diện mắt", "Màn hình cảm ứng xoay lật 180° selfie dễ dàng", "Nhẹ gọn, mang theo cả ngày không mỏi"],
          limitations: ["Thân máy không có chống rung IBIS cơ học"],
          use_cases: ["Người mới", "Selfie", "Du lịch"],
          characteristics: ["Nhỏ nhẹ", "Màu da đẹp", "Màn xoay lật"],
          technical_specs: {},
          search_aliases: [],
          compatible_accessories: ["Pin dự phòng", "Thẻ nhớ tốc độ cao 64GB"],
          variants: [
            {
              id: `var-init-1`,
              sku: "CAM-BODY-BLK",
              color: "Black",
              color_label: "Đen Cổ Điển",
              color_hex: "#1F2937",
              kit_type: "Body only",
              kit_label: "Thân máy (Body only)",
              included_lens: "",
              price: 14990000,
              compare_at_price: 16490000,
              stock_quantity: 5,
              branch_stock: { "Cầu Giấy": 3, "Thanh Xuân": 2 },
              warranty: "12 tháng chính hãng",
              is_in_stock: true
            }
          ],
          status: "published",
          is_published: true,
          is_featured: false,
          featured_section: "featured",
          featured_order: 0,
          seo_title: "",
          seo_description: ""
        });
      }
      setLoading(false);
      setHasUnsavedChanges(false);
    }
    load();
  }, [id]);

  // Handle Unsaved Changes Browser Exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Update product helper
  const updateProduct = (fields) => {
    setProduct((prev) => ({ ...prev, ...fields }));
    setHasUnsavedChanges(true);
  };

  // Auto generate slug from name
  const handleGenerateSlug = () => {
    if (!product.name) return;
    const baseSlug = product.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    updateProduct({ slug: baseSlug });
  };

  // Main Image Upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, "image");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      toast.info("Đang nén và tải ảnh lên...");
      const compressed = await compressImage(file, { maxWidth: 1200, quality: 0.8 });
      const fileName = generateSafeFileName(file.name, "product-main");

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressed);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      updateProduct({ image: publicUrl });
      toast.success("Tải ảnh đại diện thành công!");
    } catch (err) {
      toast.error("Lỗi khi tải ảnh: " + err.message);
    }
  };

  // Gallery Image Upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      toast.info(`Đang xử lý ${files.length} hình ảnh...`);
      const newUrls = [];

      for (const file of files) {
        const validation = validateUploadFile(file, "image");
        if (!validation.valid) continue;

        const compressed = await compressImage(file, { maxWidth: 1200, quality: 0.8 });
        const fileName = generateSafeFileName(file.name, "gallery");

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, compressed);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);
          newUrls.push(publicUrl);
        }
      }

      updateProduct({ images: [...(product.images || []), ...newUrls] });
      toast.success(`Đã thêm ${newUrls.length} ảnh vào thư viện!`);
    } catch (err) {
      toast.error("Lỗi tải ảnh thư viện: " + err.message);
    }
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (idx) => {
    const updated = (product.images || []).filter((_, i) => i !== idx);
    updateProduct({ images: updated });
  };

  // Bulk Variant Generation Handler
  const handleRunBulkVariantGenerator = () => {
    const colorItems = bulkColors.split(",").map((s) => s.trim()).filter(Boolean);
    const kitItems = bulkKits.split(",").map((s) => s.trim()).filter(Boolean);
    const baseP = Number(bulkBasePrice) || 15000000;

    if (colorItems.length === 0 || kitItems.length === 0) {
      toast.warning("Vui lòng nhập danh sách màu sắc và cấu hình.");
      return;
    }

    const generated = [];
    const baseCode = (product.model_name || product.name || "CAM")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    for (const c of colorItems) {
      for (const k of kitItems) {
        const isKit = k.toLowerCase().includes("kit");
        const cCode = c.toUpperCase().slice(0, 3);
        const kCode = isKit ? "KIT" : "BODY";
        const sku = `${baseCode}-${kCode}-${cCode}`;
        const price = isKit ? baseP + 2500000 : baseP;
        const compareAt = price + 1500000;

        generated.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          sku,
          color: c,
          color_label: c,
          color_hex: c.toLowerCase().includes("trắng") || c.toLowerCase().includes("white") ? "#F8F9FA" : "#1F2937",
          kit_type: isKit ? k : "Body only",
          kit_label: k,
          included_lens: isKit ? "Lens zoom tiêu chuẩn" : "",
          price,
          compare_at_price: compareAt,
          stock_quantity: 5,
          branch_stock: { "Cầu Giấy": 3, "Thanh Xuân": 2 },
          warranty: "12 tháng chính hãng",
          is_in_stock: true
        });
      }
    }

    updateProduct({ variants: [...product.variants, ...generated] });
    setIsBulkGenOpen(false);
    toast.success(`Đã tự động tạo ${generated.length} biến thể SKU! ✨`);
  };

  // Single Variant Add Handler
  const handleAddSingleVariant = () => {
    const priceNum = Number(newVar.price) || 0;
    const compareAtNum = newVar.compare_at_price ? Number(newVar.compare_at_price) : null;
    const cg = Number(newVar.cauGiayStock) || 0;
    const tx = Number(newVar.thanhXuanStock) || 0;
    const total = cg + tx;

    let autoSku = newVar.sku.trim();
    if (!autoSku) {
      const baseCode = (product.model_name || product.name || "CAM").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const kCode = newVar.kit_type.toLowerCase().includes("kit") ? "KIT" : "BODY";
      const cCode = newVar.color.toUpperCase().slice(0, 3);
      autoSku = `${baseCode}-${kCode}-${cCode}-${Math.floor(Math.random() * 90 + 10)}`;
    }

    const created = {
      id: `var-${Date.now()}`,
      sku: autoSku,
      color: newVar.color,
      color_label: newVar.color_label || newVar.color,
      color_hex: newVar.color_hex || "#1F2937",
      kit_type: newVar.kit_type,
      kit_label: newVar.kit_label || newVar.kit_type,
      included_lens: newVar.included_lens || "",
      price: priceNum,
      compare_at_price: compareAtNum,
      stock_quantity: total,
      branch_stock: { "Cầu Giấy": cg, "Thanh Xuân": tx },
      warranty: newVar.warranty || "12 tháng chính hãng",
      is_in_stock: total > 0
    };

    updateProduct({ variants: [...product.variants, created] });
    setIsAddVariantOpen(false);
    toast.success("Đã thêm biến thể mới!");
  };

  // Delete Variant
  const handleRemoveVariant = (indexToRemove) => {
    if (product.variants.length <= 1) {
      toast.error("Máy ảnh cần có ít nhất 1 phiên bản.");
      return;
    }
    const updated = product.variants.filter((_, i) => i !== indexToRemove);
    updateProduct({ variants: updated });
  };

  // Inline Variant Update
  const handleUpdateVariantField = (idx, field, val) => {
    const updated = [...product.variants];
    updated[idx] = { ...updated[idx], [field]: val };

    if (field === "cauGiay" || field === "thanhXuan") {
      const cg = field === "cauGiay" ? Number(val) || 0 : Number(updated[idx].branch_stock?.["Cầu Giấy"] || 0);
      const tx = field === "thanhXuan" ? Number(val) || 0 : Number(updated[idx].branch_stock?.["Thanh Xuân"] || 0);
      updated[idx].branch_stock = { "Cầu Giấy": cg, "Thanh Xuân": tx };
      updated[idx].stock_quantity = cg + tx;
      updated[idx].is_in_stock = cg + tx > 0;
    }

    updateProduct({ variants: updated });
  };

  // Toggle Beginner Use Case
  const handleToggleUseCase = (tag) => {
    const current = product.use_cases || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    updateProduct({ use_cases: updated });
  };

  // Add Bullet Point
  const handleAddStrength = () => {
    if (!newStrength.trim()) return;
    updateProduct({ strengths: [...(product.strengths || []), newStrength.trim()] });
    setNewStrength("");
  };

  const handleRemoveStrength = (idx) => {
    updateProduct({ strengths: product.strengths.filter((_, i) => i !== idx) });
  };

  const handleAddLimitation = () => {
    if (!newLimitation.trim()) return;
    updateProduct({ limitations: [...(product.limitations || []), newLimitation.trim()] });
    setNewLimitation("");
  };

  const handleRemoveLimitation = (idx) => {
    updateProduct({ limitations: product.limitations.filter((_, i) => i !== idx) });
  };

  const handleAddAlias = () => {
    if (!newAlias.trim()) return;
    updateProduct({ search_aliases: [...(product.search_aliases || []), newAlias.trim()] });
    setNewAlias("");
  };

  const handleRemoveAlias = (idx) => {
    updateProduct({ search_aliases: product.search_aliases.filter((_, i) => i !== idx) });
  };

  // Save Product
  const handleSave = async () => {
    if (!product.name?.trim()) {
      toast.error("Vui lòng điền tên máy ảnh.");
      setActiveTab("basic");
      return;
    }
    if (!product.slug?.trim()) {
      toast.error("Vui lòng điền slug URL cho máy ảnh.");
      setActiveTab("basic");
      return;
    }
    if (product.variants.length === 0) {
      toast.error("Máy ảnh cần có ít nhất 1 biến thể SKU.");
      setActiveTab("variants");
      return;
    }

    setSaving(true);
    try {
      const res = await adminSaveProduct(product);
      setHasUnsavedChanges(false);
      toast.success("Lưu máy ảnh thành công! ✨");
      if (id === "new" && res.id) {
        router.push(`/admin/cameras/${res.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu sản phẩm: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-xs text-muted-foreground font-medium">Đang tải thông tin máy ảnh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href="/admin/cameras">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              {id === "new" ? "Thêm Máy Ảnh Mới" : product.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {id === "new" ? "Khởi tạo dòng máy ảnh mới chính hãng" : `Cập nhật thông số & kho hàng (ID: ${id})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {product.slug && (
            <Button variant="outline" size="sm" asChild className="rounded-xl text-xs font-bold h-9">
              <Link href={`/may-anh/${product.slug}`} target="_blank">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Xem Storefront
              </Link>
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl font-bold text-xs h-9 shadow-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1.5 bg-white border rounded-2xl gap-1">
          <TabsTrigger value="basic" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            1. Cơ bản
          </TabsTrigger>
          <TabsTrigger value="article" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            📝 Bài viết chi tiết
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            2. Hình ảnh
          </TabsTrigger>
          <TabsTrigger value="variants" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            3. Biến thể / SKUs ({product.variants?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="beginner" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            4. Hướng dẫn & Nhu cầu
          </TabsTrigger>
          <TabsTrigger value="specs" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            5. Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger value="search" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            6. Bộ lọc & Tìm kiếm
          </TabsTrigger>
          <TabsTrigger value="related" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            7. Phụ kiện đi kèm
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            8. Tối ưu SEO
          </TabsTrigger>
          <TabsTrigger value="publishing" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            9. Trạng thái xuất bản
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: THÔNG TIN CƠ BẢN */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="basic" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Thông tin chung máy ảnh</CardTitle>
              <CardDescription className="text-xs">Tên hiển thị, thương hiệu, phân loại và đường dẫn URL thân thiện</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Tên sản phẩm đầy đủ *</Label>
                  <Input
                    placeholder="ví dụ: Canon EOS R50"
                    value={product.name}
                    onChange={(e) => updateProduct({ name: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Tên Model</Label>
                  <Input
                    placeholder="ví dụ: EOS R50"
                    value={product.model_name}
                    onChange={(e) => updateProduct({ model_name: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Thương hiệu *</Label>
                  <Select
                    value={product.brand}
                    onValueChange={(val) => updateProduct({ brand: val })}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canon">Canon</SelectItem>
                      <SelectItem value="Sony">Sony</SelectItem>
                      <SelectItem value="Fujifilm">Fujifilm</SelectItem>
                      <SelectItem value="Nikon">Nikon</SelectItem>
                      <SelectItem value="Panasonic">Panasonic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Danh mục sản phẩm *</Label>
                  <Select
                    value={product.camera_type}
                    onValueChange={(val) => updateProduct({ camera_type: val })}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mirrorless">Mirrorless</SelectItem>
                      <SelectItem value="Compact">Compact</SelectItem>
                      <SelectItem value="DSLR">DSLR</SelectItem>
                      <SelectItem value="Lens">Ống kính</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Dòng máy (Series)</Label>
                  <Input
                    placeholder="ví dụ: EOS R, Alpha, X-Series..."
                    value={product.series}
                    onChange={(e) => updateProduct({ series: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                {/* Slug Generator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Đường dẫn URL (Slug) *</Label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Tự sinh từ tên
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">/may-anh/</span>
                    <Input
                      placeholder="canon-eos-r50"
                      value={product.slug}
                      onChange={(e) => updateProduct({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      className="h-10 text-xs rounded-xl font-mono flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Short & Beginner Description */}
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-bold">Mô tả ngắn gọn (Xuất hiện dưới tiêu đề & card)</Label>
                <Textarea
                  placeholder="Mô tả tóm tắt tính năng và điểm nổi bật nhất của chiếc máy ảnh này..."
                  value={product.short_description}
                  onChange={(e) => updateProduct({ short_description: e.target.value })}
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tóm tắt dành cho người mới (Beginner Summary)</Label>
                <Textarea
                  placeholder="ví dụ: Lựa chọn số 1 cho người mới bắt đầu: chụp chân dung, selfie du lịch, quay TikTok/Vlog cực kỳ đơn giản..."
                  value={product.beginner_summary}
                  onChange={(e) => updateProduct({ beginner_summary: e.target.value })}
                  rows={2}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Jump to Rich Article Editor Banner */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                <div>
                  <h4 className="text-xs font-black text-primary flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Soạn thảo bài viết đánh giá chi tiết (Google Docs Style)
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Chèn ảnh minh họa, video clip thực tế và video YouTube trực quan không cần biết code HTML
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setActiveTab("article")}
                  className="rounded-xl text-xs font-bold shrink-0 shadow-xs"
                >
                  Mở trình soạn thảo bài viết ↗
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB: BÀI VIẾT CHI TIẾT (GOOGLE DOCS WYSIWYG) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="article" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-black flex items-center gap-2 text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Bài Viết & Đánh Giá Chi Tiết Máy Ảnh (Google Docs Style)
                </CardTitle>
                <CardDescription className="text-xs">
                  Gõ văn bản tự nhiên, kéo thả ảnh, chèn video YouTube 16:9 sắc nét và clip thực tế mà không cần hiểu code
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <RichContentEditor
                value={product.content || ""}
                onChange={(newContent) => {
                  updateProduct({ content: newContent });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: HÌNH ẢNH & MEDIA */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="media" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Ảnh đại diện & Thư viện ảnh sản phẩm</CardTitle>
              <CardDescription className="text-xs">Tải lên ảnh sắc nét, định dạng WebP/JPEG được tự động tối ưu hóa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Primary Image */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Ảnh đại diện chính (Primary Image) *</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-36 h-36 rounded-2xl border bg-muted flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {product.image ? (
                      <img src={product.image} alt="Main Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="text-xs h-10 rounded-xl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Hoặc dán trực tiếp đường dẫn URL ảnh bên dưới:
                    </p>
                    <Input
                      placeholder="https://..."
                      value={product.image}
                      onChange={(e) => updateProduct({ image: e.target.value })}
                      className="h-9 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Album ảnh chi tiết (Gallery Images)</Label>
                  <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                    <Plus className="w-3.5 h-3.5" /> Thêm nhiều ảnh
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {product.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border bg-muted group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Xóa ảnh này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Image Card */}
                  <label className="border-2 border-dashed border-border hover:border-primary/50 aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/10 hover:bg-primary/5 p-2 text-center">
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-[11px] font-bold text-muted-foreground">Tải ảnh lên</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: BIẾN THỂ, SKUS, GIÁ & TỒN KHO THEO CHI NHÁNH */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="variants" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Danh sách Phiên bản / SKUs & Tồn kho Chi Nhánh
                </CardTitle>
                <CardDescription className="text-xs">
                  Quản lý giá bán, giá so sánh (sale), tồn kho tại Cầu Giấy & Thanh Xuân
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkGenOpen(true)}
                  className="rounded-xl text-xs font-bold h-8 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1" /> Sinh biến thể hàng loạt
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsAddVariantOpen(true)}
                  className="rounded-xl text-xs font-bold h-8"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm biến thể
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {product.variants?.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
                  <p>Chưa có biến thể nào. Vui lòng bấm &quot;Sinh biến thể hàng loạt&quot; hoặc &quot;Thêm biến thể&quot;.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-black border-b">
                      <tr>
                        <th className="p-3">Mã SKU</th>
                        <th className="p-3">Màu sắc</th>
                        <th className="p-3">Cấu hình / Kit</th>
                        <th className="p-3">Giá bán (VNĐ)</th>
                        <th className="p-3">Giá niêm yết (Compare)</th>
                        <th className="p-3 text-center">Kho Cầu Giấy</th>
                        <th className="p-3 text-center">Kho Thanh Xuân</th>
                        <th className="p-3 text-center">Tổng tồn</th>
                        <th className="p-3 text-right pr-4">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {product.variants.map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-muted/10 transition-colors">
                          {/* SKU */}
                          <td className="p-3">
                            <Input
                              value={v.sku}
                              onChange={(e) => handleUpdateVariantField(idx, "sku", e.target.value)}
                              className="h-8 text-xs font-mono font-bold w-32 rounded-lg"
                            />
                          </td>

                          {/* Color */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border shrink-0"
                                style={{ backgroundColor: v.color_hex || "#1F2937" }}
                              />
                              <Input
                                value={v.color_label || v.color}
                                onChange={(e) => handleUpdateVariantField(idx, "color_label", e.target.value)}
                                className="h-8 text-xs font-medium w-28 rounded-lg"
                              />
                            </div>
                          </td>

                          {/* Configuration / Kit */}
                          <td className="p-3">
                            <Input
                              value={v.kit_label || v.kit_type}
                              onChange={(e) => handleUpdateVariantField(idx, "kit_label", e.target.value)}
                              className="h-8 text-xs font-medium w-36 rounded-lg"
                            />
                          </td>

                          {/* Price */}
                          <td className="p-3">
                            <Input
                              type="number"
                              value={v.price}
                              onChange={(e) => handleUpdateVariantField(idx, "price", Number(e.target.value))}
                              className="h-8 text-xs font-bold text-primary w-28 rounded-lg"
                            />
                          </td>

                          {/* Compare At Price */}
                          <td className="p-3">
                            <Input
                              type="number"
                              placeholder="Không có"
                              value={v.compare_at_price || ""}
                              onChange={(e) => handleUpdateVariantField(idx, "compare_at_price", e.target.value ? Number(e.target.value) : null)}
                              className="h-8 text-xs text-muted-foreground w-28 rounded-lg"
                            />
                          </td>

                          {/* Cau Giay Stock */}
                          <td className="p-3 text-center">
                            <Input
                              type="number"
                              value={v.branch_stock?.["Cầu Giấy"] ?? 0}
                              onChange={(e) => handleUpdateVariantField(idx, "cauGiay", e.target.value)}
                              className="h-8 text-xs text-center font-bold w-16 mx-auto rounded-lg"
                            />
                          </td>

                          {/* Thanh Xuan Stock */}
                          <td className="p-3 text-center">
                            <Input
                              type="number"
                              value={v.branch_stock?.["Thanh Xuân"] ?? 0}
                              onChange={(e) => handleUpdateVariantField(idx, "thanhXuan", e.target.value)}
                              className="h-8 text-xs text-center font-bold w-16 mx-auto rounded-lg"
                            />
                          </td>

                          {/* Total Stock Badge */}
                          <td className="p-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                              v.stock_quantity > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                            }`}>
                              {v.stock_quantity > 0 ? `${v.stock_quantity} máy` : "Hết hàng"}
                            </span>
                          </td>

                          {/* Remove */}
                          <td className="p-3 text-right pr-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveVariant(idx)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                              title="Xóa biến thể"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: HƯỚNG DẪN NGƯỜI MỚI & NHU CẦU */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="beginner" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Định vị & Hướng dẫn dành cho người mới</CardTitle>
              <CardDescription className="text-xs">
                Giúp khách hàng trẻ, sinh viên và người mới chọn đúng máy ảnh theo nhu cầu thực tế
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Phù hợp với */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Phù hợp với nhu cầu nào? (Chọn các nhãn phù hợp)</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {BEGINNER_USE_CASES.map((tag) => {
                    const isSelected = (product.use_cases || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleUseCase(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-white text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Điểm mạnh (Strengths) */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-xs font-bold">Điểm mạnh nổi bật (Hiển thị dạng gạch đầu dòng trung thực)</Label>
                <div className="space-y-2">
                  {(product.strengths || []).map((st, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <Input
                        value={st}
                        onChange={(e) => {
                          const updated = [...product.strengths];
                          updated[idx] = e.target.value;
                          updateProduct({ strengths: updated });
                        }}
                        className="h-8 text-xs rounded-xl flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStrength(idx)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Nhập thêm điểm mạnh (ví dụ: Lấy nét mắt cực nhạy, Màu da đẹp...)"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStrength();
                      }
                    }}
                    className="h-8 text-xs rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStrength}
                    className="h-8 text-xs rounded-xl font-bold shrink-0"
                  >
                    + Thêm
                  </Button>
                </div>
              </div>

              {/* Hạn chế (Limitations) */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-xs font-bold">Hạn chế cần lưu ý (Nêu trung thực để khách tin cậy)</Label>
                <div className="space-y-2">
                  {(product.limitations || []).map((lim, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <Input
                        value={lim}
                        onChange={(e) => {
                          const updated = [...product.limitations];
                          updated[idx] = e.target.value;
                          updateProduct({ limitations: updated });
                        }}
                        className="h-8 text-xs rounded-xl flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLimitation(idx)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Nhập điểm cần lưu ý (ví dụ: Không có chống rung cảm biến IBIS, nên chọn lens có IS...)"
                    value={newLimitation}
                    onChange={(e) => setNewLimitation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLimitation();
                      }
                    }}
                    className="h-8 text-xs rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLimitation}
                    className="h-8 text-xs rounded-xl font-bold shrink-0"
                  >
                    + Thêm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: THÔNG SỐ KỸ THUẬT CHUẨN HÓA */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="specs" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Thông số kỹ thuật chuẩn hóa</CardTitle>
              <CardDescription className="text-xs">
                Dữ liệu có cấu trúc phục vụ bảng so sánh máy ảnh và bộ lọc thông minh trên Storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CAMERA_SPEC_TEMPLATE.map((item) => (
                  <div key={item.key} className="space-y-1">
                    <Label className="text-xs font-bold text-foreground">{item.label}</Label>
                    <Input
                      placeholder={item.placeholder}
                      value={product.technical_specs?.[item.key] || ""}
                      onChange={(e) => {
                        const updated = {
                          ...(product.technical_specs || {}),
                          [item.key]: e.target.value
                        };
                        updateProduct({ technical_specs: updated });
                      }}
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: BỘ LỌC & TÌM KIẾM (ALIASES) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="search" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Thuộc tính bộ lọc & Từ khóa tìm kiếm</CardTitle>
              <CardDescription className="text-xs">
                Cấu hình các từ khóa đồng nghĩa (aliases) để khách gõ tắt vẫn tìm ra máy chính xác
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Từ khóa tìm kiếm đồng nghĩa (Search Aliases)</Label>
                <div className="flex flex-wrap gap-2">
                  {(product.search_aliases || []).map((alias, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted text-xs font-mono font-bold"
                    >
                      {alias}
                      <button
                        type="button"
                        onClick={() => handleRemoveAlias(idx)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="ví dụ: r50, canon r 50, may anh selfie..."
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAlias();
                      }
                    }}
                    className="h-8 text-xs rounded-xl max-w-sm font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAlias}
                    className="h-8 text-xs rounded-xl font-bold"
                  >
                    + Thêm alias
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: PHỤ KIỆN TƯƠNG THÍCH */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="related" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Phụ kiện & Ống kính tương thích</CardTitle>
              <CardDescription className="text-xs">Gợi ý sản phẩm mua kèm phù hợp với hệ ngàm của máy</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Ống kính gợi ý</Label>
                <Input
                  placeholder="ví dụ: RF-S 18-45mm IS STM, RF 50mm F1.8 STM..."
                  value={product.lens_note || ""}
                  onChange={(e) => updateProduct({ lens_note: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Phụ kiện mua kèm khuyên dùng</Label>
                <Input
                  placeholder="ví dụ: Thẻ nhớ SanDisk 64GB, Pin dự phòng LP-E17, Túi Canvas..."
                  value={Array.isArray(product.compatible_accessories) ? product.compatible_accessories.join(", ") : ""}
                  onChange={(e) => updateProduct({ compatible_accessories: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: TỐI ƯU HÓA SEO & XEM TRƯỚC GOOGLE */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="seo" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Cấu hình SEO & Xem trước Google</CardTitle>
              <CardDescription className="text-xs">Tối ưu hóa thẻ tiêu đề và mô tả xuất hiện trên công cụ tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">SEO Title</Label>
                <Input
                  placeholder="Canon EOS R50 Chính Hãng — 4cats Camera"
                  value={product.seo_title}
                  onChange={(e) => updateProduct({ seo_title: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">SEO Meta Description</Label>
                <Textarea
                  placeholder="Mua máy ảnh Canon EOS R50 mới 100% chính hãng tại 4cats Camera..."
                  value={product.seo_description}
                  onChange={(e) => updateProduct({ seo_description: e.target.value })}
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Live SERP Preview */}
              <div className="p-4 bg-muted/20 rounded-2xl border space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-1">
                  Xem trước kết quả tìm kiếm Google (SERP Preview)
                </p>
                <div className="text-blue-700 text-sm font-semibold hover:underline cursor-pointer">
                  {product.seo_title || `${product.name || "Tên máy ảnh"} Chính Hãng — 4cats Camera`}
                </div>
                <div className="text-emerald-700 text-xs font-mono">
                  https://4catscamera.com/may-anh/{product.slug || "duong-dan-san-pham"}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {product.seo_description || product.short_description || "Mô tả sản phẩm sẽ hiển thị tại đây khi khách hàng tìm kiếm trên Google."}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: TRẠNG THÁI XUẤT BẢN & NỔI BẬT */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="publishing" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-black">Trạng thái phát hành & Tiếp thị</CardTitle>
              <CardDescription className="text-xs">Điều khiển việc xuất bản và vị trí hiển thị trên Storefront</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Trạng thái sản phẩm</Label>
                  <Select
                    value={product.status}
                    onValueChange={(val) => updateProduct({ status: val, is_published: val === "published" })}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Đang bán (Published)</SelectItem>
                      <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                      <SelectItem value="hidden">Ẩn tạm thời (Hidden)</SelectItem>
                      <SelectItem value="discontinued">Ngừng kinh doanh (Discontinued)</SelectItem>
                      <SelectItem value="archived">Lưu trữ (Archived)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Thứ tự ưu tiên hiển thị (Sort Order)</Label>
                  <Input
                    type="number"
                    value={product.featured_order || 0}
                    onChange={(e) => updateProduct({ featured_order: Number(e.target.value) || 0 })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/15 border">
                <div>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> Hiển thị tại mục Nổi bật Trang Chủ
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Đưa sản phẩm vào các khối khuyên dùng, ưu đãi hoặc xu hướng trên trang chủ
                  </p>
                </div>
                <Switch
                  checked={product.is_featured}
                  onCheckedChange={(val) => updateProduct({ is_featured: val })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-4 left-4 right-4 md:left-72 md:right-8 bg-white/95 backdrop-blur-md border p-3.5 rounded-2xl shadow-lg flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Có thay đổi chưa lưu
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã lưu đồng bộ
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl text-xs font-bold h-9"
          >
            <Link href="/admin/cameras">Hủy / Quay lại</Link>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl font-bold text-xs h-9 shadow-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Đang lưu..." : "Lưu Máy Ảnh"}
          </Button>
        </div>
      </div>

      {/* Bulk Variant Generator Modal */}
      <Dialog open={isBulkGenOpen} onOpenChange={setIsBulkGenOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" /> Sinh Biến Thể Tự Động
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <p className="text-muted-foreground">
              Hệ thống sẽ lấy các Màu Sắc kết hợp với các Cấu Hình để tạo ra toàn bộ biến thể tương ứng trong 1 click.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Các màu sắc (cách nhau bằng dấu phẩy)</Label>
              <Input
                value={bulkColors}
                onChange={(e) => setBulkColors(e.target.value)}
                placeholder="ví dụ: Đen, Trắng, Bạc"
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Các cấu hình (cách nhau bằng dấu phẩy)</Label>
              <Input
                value={bulkKits}
                onChange={(e) => setBulkKits(e.target.value)}
                placeholder="ví dụ: Body only, Kit 18-45mm"
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Giá bán cơ sở cho Body (VNĐ)</Label>
              <Input
                type="number"
                value={bulkBasePrice}
                onChange={(e) => setBulkBasePrice(e.target.value)}
                className="h-9 text-xs rounded-xl font-bold text-primary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsBulkGenOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleRunBulkVariantGenerator} className="rounded-xl text-xs font-bold">
              Sinh biến thể ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Single Variant Modal */}
      <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Thêm Biến Thể Mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tên màu hiển thị</Label>
                <Input
                  value={newVar.color_label}
                  onChange={(e) => setNewVar({ ...newVar, color_label: e.target.value, color: e.target.value })}
                  placeholder="Đen Cổ Điển"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Cấu hình</Label>
                <Input
                  value={newVar.kit_label}
                  onChange={(e) => setNewVar({ ...newVar, kit_label: e.target.value, kit_type: e.target.value })}
                  placeholder="Body only / Kit..."
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Giá bán (VNĐ)</Label>
                <Input
                  type="number"
                  value={newVar.price}
                  onChange={(e) => setNewVar({ ...newVar, price: e.target.value })}
                  className="h-9 text-xs font-bold text-primary rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Giá niêm yết cũ (Compare)</Label>
                <Input
                  type="number"
                  placeholder="Tùy chọn"
                  value={newVar.compare_at_price}
                  onChange={(e) => setNewVar({ ...newVar, compare_at_price: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tồn kho Cầu Giấy</Label>
                <Input
                  type="number"
                  value={newVar.cauGiayStock}
                  onChange={(e) => setNewVar({ ...newVar, cauGiayStock: e.target.value })}
                  className="h-9 text-xs rounded-xl text-center font-bold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Tồn kho Thanh Xuân</Label>
                <Input
                  type="number"
                  value={newVar.thanhXuanStock}
                  onChange={(e) => setNewVar({ ...newVar, thanhXuanStock: e.target.value })}
                  className="h-9 text-xs rounded-xl text-center font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Mã SKU (để trống sẽ tự sinh)</Label>
              <Input
                placeholder="R50-BODY-BLK"
                value={newVar.sku}
                onChange={(e) => setNewVar({ ...newVar, sku: e.target.value })}
                className="h-9 text-xs font-mono rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddVariantOpen(false)} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleAddSingleVariant} className="rounded-xl text-xs font-bold">
              Thêm biến thể
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
