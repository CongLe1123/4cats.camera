"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../../../lib/supabase";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { CreatableSelect } from "../../../../components/ui/creatable-select";
import { Switch } from "../../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { compressImage, cn } from "../../../../lib/utils";
import { toast } from "sonner";
import { validateUploadFile, generateSafeFileName } from "../../../../lib/upload-utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded-xl p-4 bg-muted/10 group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 p-1 cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground transition-colors z-20"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

export default function EditCameraPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [camera, setCamera] = useState(null);
  const [variants, setVariants] = useState([]);

  // Option Lists
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]); // This will now hold only filtered series for UI
  const [allSeries, setAllSeries] = useState([]); // Database source for series
  const [conditions, setConditions] = useState([]);
  const [colors, setColors] = useState([]);
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
  const [newSpecialtyName, setNewSpecialtyName] = useState("");

  // Form State for main camera
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    brand_id: "",
    category_id: "",
    series_id: "",
    images: [],
    content: [],
    rental: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Gallery State
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateUploadFile(file, "image");
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      try {
        const compressed = await compressImage(file);
        setImageFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch (err) {
        console.error("Compression failed", err);
        toast.error("Không thể nén ảnh, vui lòng thử lại");
      }
    }
  };

  const handleGallerySelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = [];
      for (const f of files) {
        const validation = validateUploadFile(f, "image");
        if (!validation.valid) {
          toast.error(`${f.name}: ${validation.error}`);
        } else {
          validFiles.push(f);
        }
      }
      if (validFiles.length === 0) return;

      setIsUploading(true);
      try {
        const compressedFiles = await Promise.all(validFiles.map(compressImage));

        setGalleryFiles((prev) => [...prev, ...compressedFiles]);

        const newPreviews = compressedFiles.map((file) =>
          URL.createObjectURL(file),
        );
        setGalleryPreviews((prev) => [...prev, ...newPreviews]);
      } catch (err) {
        console.error("Gallery compression failed", err);
        toast.error("Không thể nén một số hình ảnh");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveGalleryExisting = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleRemoveGalleryNew = (indexToRemove) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setGalleryPreviews((prev) => {
      // Revoke the URL to release memory
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  // --- Content Builder Handlers ---
  const handleAddContentBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        { id: `temp-${Date.now()}`, type, value: "", caption: "" }, // Default structure with ID
      ],
    }));
  };

  const handleRemoveContentBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleContentChange = (index, field, value) => {
    setFormData((prev) => {
      const newContent = [...prev.content];
      newContent[index] = { ...newContent[index], [field]: value };
      return { ...prev, content: newContent };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.content.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prev.content.findIndex((item) => item.id === over.id);
        return {
          ...prev,
          content: arrayMove(prev.content, oldIndex, newIndex),
        };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleContentFileChange = async (index, e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, type === "video" ? "video" : "image");
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      let fileToStore = file;
      let preview = URL.createObjectURL(file);

      if (type === "image") {
        try {
          const compressed = await compressImage(file);
          fileToStore = compressed;
          preview = URL.createObjectURL(compressed);
        } catch (err) {
          console.error("Image compression failed, using original", err);
        }
      }

      setFormData((prev) => {
        const newContent = [...prev.content];
        newContent[index] = {
          ...newContent[index],
          value: preview,
          file: fileToStore, // Store file for upload later
        };
        return { ...prev, content: newContent };
      });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xử lý tập tin");
    }
  };

  const handleAddRentalOption = () => {
    setFormData((prev) => ({
      ...prev,
      rental: [...(prev.rental || []), { duration: "", price: "" }],
    }));
  };

  const handleRemoveRentalOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      rental: prev.rental.filter((_, i) => i !== index),
    }));
  };

  const handleRentalChange = (index, field, value) => {
    setFormData((prev) => {
      const newRental = [...(prev.rental || [])];
      newRental[index] = { ...newRental[index], [field]: value };
      return { ...prev, rental: newRental };
    });
  };

  // New Variant State
  const [isVariantOpen, setIsVariantOpen] = useState(false);
  const [newVariant, setNewVariant] = useState({
    condition_id: "",
    color_id: "",
    price: "",
    in_stock: true,
  });

  useEffect(() => {
    fetchOptions();
    if (id && id !== "new") fetchCamera();
    else if (id === "new") {
      setLoading(false);
      setCamera({ name: "New Camera" }); // Placeholder
    }
  }, [id]);

  const fetchOptions = async () => {
    const fetchData = async (table) => {
      const { data } = await supabase.from(table).select("*").order("name");
      return (data || []).map((item) => ({
        value: item.id.toString(),
        label: item.name,
      }));
    };

    const [b, c, s, cond, col, spec] = await Promise.all([
      fetchData("brands"),
      fetchData("categories"),
      // Special fetch for series to include brand_id
      (async () => {
        const { data } = await supabase
          .from("series")
          .select("*")
          .order("name");
        return (data || []).map((item) => ({
          value: item.id.toString(),
          label: item.name,
          brand_id: item.brand_id ? item.brand_id.toString() : null,
        }));
      })(),
      fetchData("conditions"),
      fetchData("colors"),
      fetchData("specialties"),
    ]);

    setBrands(b);
    setCategories(c);
    setAllSeries(s);
    setConditions(cond);
    setColors(col);
    setSpecialtiesOptions(spec);
  };

  const fetchCamera = async () => {
    setLoading(true);
    // 1. Fetch Camera
    const { data: camData, error: camError } = await supabase
      .from("cameras")
      .select("*")
      .eq("id", id)
      .single();

    if (camError) {
      console.error(camError);
    } else {
      setCamera(camData);
      setFormData({
        name: camData.name,
        image: camData.image || "",
        brand_id: camData.brand_id?.toString() || "",
        category_id: camData.category_id?.toString() || "",
        series_id: camData.series_id?.toString() || "",
        images: camData.images || [],
        content: (camData.content || []).map((c) => ({
          ...c,
          id: c.id || `loaded-${Math.random().toString(36).substr(2, 9)}`,
        })),
        rental: camData.rental || [],
      });

      // 1.1 Fetch Assigned Specialties/Features
      const { data: specData } = await supabase
        .from("cameras_specialties")
        .select("specialty_id")
        .eq("camera_id", id);

      let assignedSpecialtyIds = (specData || []).map((item) =>
        item.specialty_id.toString(),
      );

      // Fallback matching from features array if junction table was empty
      if (
        camData.features &&
        Array.isArray(camData.features) &&
        assignedSpecialtyIds.length === 0
      ) {
        const { data: matchedSpecs } = await supabase
          .from("specialties")
          .select("id, name")
          .in("name", camData.features);
        if (matchedSpecs && matchedSpecs.length > 0) {
          assignedSpecialtyIds = matchedSpecs.map((s) => s.id.toString());
        }
      }

      setSelectedSpecialtyIds(assignedSpecialtyIds);
    }

    // 2. Fetch Variants
    const { data: varData } = await supabase
      .from("camera_variants")
      .select(`*, condition:conditions(name), color:colors(name)`)
      .eq("camera_id", id);

    setVariants(varData || []);
    setLoading(false);
  };

  // --- Specialty Handlers ---

  const handleToggleSpecialty = (specialtyId) => {
    setSelectedSpecialtyIds((prev) =>
      prev.includes(specialtyId)
        ? prev.filter((item) => item !== specialtyId)
        : [...prev, specialtyId],
    );
  };

  const handleCreateNewSpecialty = async () => {
    const trimmed = newSpecialtyName.trim();
    if (!trimmed) {
      toast.warning("Vui lòng nhập tên tính năng mới");
      return;
    }

    const existing = specialtiesOptions.find(
      (opt) => opt.label.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      if (!selectedSpecialtyIds.includes(existing.value)) {
        setSelectedSpecialtyIds((prev) => [...prev, existing.value]);
        toast.info(`Đã chọn tính năng "${existing.label}"`);
      } else {
        toast.info(`Tính năng "${existing.label}" đã được chọn trước đó`);
      }
      setNewSpecialtyName("");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("specialties")
        .insert([{ name: trimmed }])
        .select()
        .single();

      if (error) {
        toast.error("Lỗi khi tạo tính năng: " + error.message);
        return;
      }

      const newOption = { value: data.id.toString(), label: data.name };
      setSpecialtiesOptions((prev) =>
        [...prev, newOption].sort((a, b) => a.label.localeCompare(b.label)),
      );
      setSelectedSpecialtyIds((prev) => [...prev, newOption.value]);
      setNewSpecialtyName("");
      toast.success(`Đã thêm tính năng "${data.name}"! ✨`);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo tính năng");
    }
  };

  // --- Create Handlers ---

  const handleCreateOption = async (table, name, setter) => {
    const { data, error } = await supabase
      .from(table)
      .insert([{ name }])
      .select()
      .single();
    if (error) {
      toast.error(`Lỗi tạo ${table}: ` + error.message);
      return null;
    }
    toast.success("Đã thêm lựa chọn thành công!");
    const newOption = { value: data.id.toString(), label: data.name };
    setter((prev) =>
      [...prev, newOption].sort((a, b) => a.label.localeCompare(b.label)),
    );
    return data.id.toString();
  };

  // --- Derived State & Effects ---

  // Filter series whenever brand or allSeries changes
  useEffect(() => {
    if (!formData.brand_id) {
      setSeries([]);
    } else {
      const filtered = allSeries.filter(
        (s) => s.brand_id === formData.brand_id,
      );
      setSeries(filtered);
    }
  }, [formData.brand_id, allSeries]);

  // --- Create Handlers ---

  // --- Main Save Handler ---

  const handleSaveCamera = async () => {
    if (!formData.name?.trim()) {
      toast.error("Vui lòng nhập tên máy ảnh");
      return;
    }

    setIsUploading(true);
    let finalImageUrl = formData.image;

    // 1. Handle Image Upload if new file selected
    if (imageFile) {
      const validation = validateUploadFile(imageFile, "image");
      if (!validation.valid) {
        toast.error(validation.error);
        setIsUploading(false);
        return;
      }
      const fileName = generateSafeFileName(imageFile.name, "main");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Tải ảnh chính thất bại: " + uploadError.message);
        setIsUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    // 2. Delete OLD Image if it existed AND was changed (Removed or Replaced)
    if (
      camera?.image &&
      camera.image.includes("products") &&
      camera.image !== finalImageUrl
    ) {
      try {
        const oldUrlObj = new URL(camera.image);
        const pathParts = oldUrlObj.pathname.split("/products/");
        if (pathParts.length > 1) {
          let oldPath = decodeURIComponent(pathParts[1]);
          if (oldPath.startsWith("/")) oldPath = oldPath.substring(1);

          await supabase.storage.from("products").remove([oldPath]);
        }
      } catch (e) {
        console.error("Error parsing old image URL", e);
      }
    }

    // 3. Handle Gallery Images (Upload & Cleanup)
    const newGalleryUrls = [];

    // Upload new gallery files
    if (galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        const validation = validateUploadFile(file, "image");
        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.error}`);
          continue;
        }
        const fileName = generateSafeFileName(file.name, "gallery");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Gallery upload failed", uploadError);
          toast.error(`Tải ảnh ${file.name} thất bại: ${uploadError.message}`);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(fileName);
        newGalleryUrls.push(publicUrl);
      }
    }

    // Combine existing (kept) images with new ones
    const finalGalleryImages = [...(formData.images || []), ...newGalleryUrls];

    // Cleanup: Delete removed gallery images from storage
    if (camera?.images && Array.isArray(camera.images)) {
      const removedImages = camera.images.filter(
        (img) => !finalGalleryImages.includes(img) && img.includes("products"),
      );

      for (const removedUrl of removedImages) {
        try {
          const oldUrlObj = new URL(removedUrl);
          const pathParts = oldUrlObj.pathname.split("/products/");
          if (pathParts.length > 1) {
            let oldPath = decodeURIComponent(pathParts[1]);
            if (oldPath.startsWith("/")) oldPath = oldPath.substring(1);
            await supabase.storage.from("products").remove([oldPath]);
          }
        } catch (e) {
          console.error("Error cleaning up gallery image", e);
        }
      }
    }

    // 4. Handle Content Images (Upload inside blocks)
    let finalContent = [];
    if (formData.content && formData.content.length > 0) {
      for (const block of formData.content) {
        if ((block.type === "image" || block.type === "video") && block.file) {
          const expectedType = block.type === "video" ? "video" : "image";
          const validation = validateUploadFile(block.file, expectedType);
          if (!validation.valid) {
            toast.error(validation.error);
            finalContent.push({ ...block, file: undefined, value: "" });
            continue;
          }
          const fileName = generateSafeFileName(block.file.name, `content-${block.type}`);

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, block.file);

          if (uploadError) {
            toast.error(`Tải tập tin nội dung thất bại (${block.type}).`);
            finalContent.push({ ...block, file: undefined, value: "" });
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("products").getPublicUrl(fileName);
            // Remove 'file' prop, update 'value'
            const { file, ...rest } = block;
            finalContent.push({ ...rest, value: publicUrl });
          }
        } else {
          // Keep as is (remove file prop if purely existing)
          const { file, ...rest } = block;
          finalContent.push(rest);
        }
      }
    }

    // --- Cleanup Removed Content Images/Videos ---
    // If we are editing an existing camera, check for content blocks that were removed or changed
    if (camera?.content && Array.isArray(camera.content)) {
      const keptUrls = finalContent
        .filter((b) => (b.type === "image" || b.type === "video") && b.value)
        .map((b) => b.value);

      const removedContentBlocks = camera.content.filter(
        (oldBlock) =>
          (oldBlock.type === "image" || oldBlock.type === "video") &&
          oldBlock.value &&
          oldBlock.value.includes("products") &&
          !keptUrls.includes(oldBlock.value),
      );

      for (const removedBlock of removedContentBlocks) {
        try {
          const oldUrlObj = new URL(removedBlock.value);
          const pathParts = oldUrlObj.pathname.split("/products/");
          if (pathParts.length > 1) {
            let oldPath = decodeURIComponent(pathParts[1]);
            if (oldPath.startsWith("/")) oldPath = oldPath.substring(1);
            await supabase.storage.from("products").remove([oldPath]);
          }
        } catch (e) {
          console.error("Error cleaning up content file", e);
        }
      }
    }

    const selectedFeatureNames = specialtiesOptions
      .filter((opt) => selectedSpecialtyIds.includes(opt.value))
      .map((opt) => opt.label);

    const payload = {
      name: formData.name,
      image: finalImageUrl,
      images: finalGalleryImages,
      brand_id: formData.brand_id || null,
      category_id: formData.category_id || null,
      series_id: formData.series_id || null,
      content: finalContent,
      rental: formData.rental || [],
      features: selectedFeatureNames,
    };

    let error;
    let newId = id;

    if (id === "new") {
      const { data: insertedData, error: insertError } = await supabase
        .from("cameras")
        .insert([payload])
        .select("id")
        .single();

      if (insertError) {
        // Fallback: in case sequence default is not configured on column
        const safeIntId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("cameras")
          .insert([{ ...payload, id: safeIntId }])
          .select("id")
          .single();
        if (fallbackError) {
          error = fallbackError;
        } else {
          newId = fallbackData?.id || safeIntId;
        }
      } else {
        newId = insertedData?.id;
      }
    } else {
      const { error: updateError } = await supabase
        .from("cameras")
        .update(payload)
        .eq("id", id);
      error = updateError;
    }

    // Sync cameras_specialties junction table
    if (!error && newId) {
      try {
        await supabase
          .from("cameras_specialties")
          .delete()
          .eq("camera_id", newId);

        if (selectedSpecialtyIds.length > 0) {
          const specialtyRows = selectedSpecialtyIds.map((specId) => ({
            camera_id: newId,
            specialty_id: parseInt(specId, 10),
          }));
          const { error: specError } = await supabase
            .from("cameras_specialties")
            .insert(specialtyRows);
          if (specError) {
            console.error("Error inserting cameras_specialties:", specError);
          }
        }
      } catch (specEx) {
        console.error("Exception syncing cameras_specialties:", specEx);
      }
    }

    setIsUploading(false);

    if (error) {
      toast.error("Lỗi khi lưu: " + error.message);
    } else {
      toast.success("Lưu thông tin máy ảnh thành công! ✨");
      if (id === "new") {
        router.push(`/admin/cameras/${newId}`);
      } else {
        // Reset local state to prevent re-uploading the same file
        setImageFile(null);
        setPreviewUrl("");
        setGalleryFiles([]);
        setGalleryPreviews([]);
        // Update the current camera state so subsequent saves see the new image as "existing"
        setCamera((prev) => ({ ...prev, ...payload }));
        setFormData((prev) => ({ ...prev, image: finalImageUrl }));
      }
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.condition_id || !newVariant.color_id || !newVariant.price) {
      toast.warning("Vui lòng điền đầy đủ thông tin biến thể");
      return;
    }

    if (id === "new") {
      toast.warning("Vui lòng lưu máy ảnh trước khi thêm biến thể.");
      return;
    }

    const { error } = await supabase.from("camera_variants").insert([
      {
        camera_id: id,
        condition_id: newVariant.condition_id,
        color_id: newVariant.color_id,
        price: parseFloat(newVariant.price),
        in_stock: newVariant.in_stock,
      },
    ]);

    if (error) {
      toast.error("Lỗi khi thêm biến thể: " + error.message);
    } else {
      toast.success("Đã thêm biến thể mới!");
      setIsVariantOpen(false);
      setNewVariant({
        condition_id: "",
        color_id: "",
        price: "",
        in_stock: true,
      });
      fetchCamera();
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
    const { error } = await supabase
      .from("camera_variants")
      .delete()
      .eq("id", variantId);
    if (error) {
      toast.error("Lỗi khi xóa biến thể: " + error.message);
    } else {
      toast.success("Đã xóa biến thể!");
      fetchCamera();
    }
  };

  const handleToggleStock = async (variantId, currentStatus) => {
    // Optimistic update
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId ? { ...v, in_stock: !currentStatus } : v,
      ),
    );

    const { error } = await supabase
      .from("camera_variants")
      .update({ in_stock: !currentStatus })
      .eq("id", variantId);

    if (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái tồn kho thất bại");
      fetchCamera(); // Revert
    } else {
      toast.success("Đã cập nhật trạng thái kho!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setImageFile(null);
    setPreviewUrl("");
    setFormData({ ...formData, image: "" });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/cameras">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black text-primary">
          {id === "new" ? "New Camera" : `Edit Camera: ${camera?.name}`}
        </h1>
      </div>

      {/* Main Info */}
      <div className="bg-card p-6 rounded-xl border space-y-4 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Camera Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Camera Image</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative min-h-[200px]">
              {previewUrl || formData.image ? (
                <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border bg-muted group">
                  <img
                    src={previewUrl || formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90 transition-all z-10"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {imageFile && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                      New File
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Click or Drag to upload image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, WebP (Optimized automatically)
                  </p>
                </div>
              )}

              {!previewUrl && !formData.image && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageSelect}
                  disabled={isUploading}
                />
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing Images */}
              {formData.images?.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative aspect-video rounded-lg overflow-hidden border bg-muted group"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveGalleryExisting(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90 transition-all z-10"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* New Previews */}
              {galleryPreviews.map((url, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative aspect-video rounded-lg overflow-hidden border bg-muted group ring-2 ring-primary/50"
                >
                  <img
                    src={url}
                    alt={`New ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded-sm backdrop-blur-sm">
                    New
                  </div>
                  <button
                    onClick={() => handleRemoveGalleryNew(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90 transition-all z-10"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              <div className="border-2 border-dashed border-border rounded-xl aspect-video flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Add Images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleGallerySelect}
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          {/* Linked Data Selects */}
          <div className="space-y-2">
            <Label>Brand</Label>
            <CreatableSelect
              options={brands}
              value={formData.brand_id}
              onChange={(val) => setFormData({ ...formData, brand_id: val })}
              onCreate={async (name) => {
                const newId = await handleCreateOption(
                  "brands",
                  name,
                  setBrands,
                );
                if (newId)
                  setFormData((prev) => ({ ...prev, brand_id: newId }));
              }}
              placeholder="Select Brand..."
              createLabel="Create Brand"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Series {formData.brand_id ? "" : "(Select Brand first)"}
            </Label>
            <CreatableSelect
              options={series}
              value={formData.series_id}
              onChange={(val) => setFormData({ ...formData, series_id: val })}
              isDisabled={!formData.brand_id}
              onCreate={async (name) => {
                if (!formData.brand_id) {
                  toast.warning("Vui lòng chọn thương hiệu trước!");
                  return;
                }
                const { data, error } = await supabase
                  .from("series")
                  .insert([
                    {
                      name,
                      brand_id: formData.brand_id, // Link to selected brand
                    },
                  ])
                  .select()
                  .single();

                if (error) {
                  toast.error(error.message);
                  return;
                }

                const newOption = {
                  value: data.id.toString(),
                  label: data.name,
                  brand_id: data.brand_id.toString(),
                };

                // Update both All list and filtering will auto-update UI via effect
                setAllSeries((prev) => [...prev, newOption]);
                setFormData((prev) => ({
                  ...prev,
                  series_id: data.id.toString(),
                }));
              }}
              placeholder={
                formData.brand_id ? "Select Series..." : "Select Brand first..."
              }
              createLabel="Create Series"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <CreatableSelect
              options={categories}
              value={formData.category_id}
              onChange={(val) => setFormData({ ...formData, category_id: val })}
              onCreate={async (name) => {
                const newId = await handleCreateOption(
                  "categories",
                  name,
                  setCategories,
                );
                if (newId)
                  setFormData((prev) => ({ ...prev, category_id: newId }));
              }}
              placeholder="Select Category..."
              createLabel="Create Category"
            />
          </div>
        </div>

        {/* Features / Specialties (Tính năng nổi bật) */}
        <div className="space-y-3 p-5 rounded-2xl bg-secondary/30 border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <Label className="text-base font-bold text-foreground flex items-center gap-1.5">
                ✨ Tính năng nổi bật (Features / Specialties)
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bấm để chọn tính năng cho máy ảnh. Khách hàng có thể lọc và xem thông số này trên website.
              </p>
            </div>
            {selectedSpecialtyIds.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary self-start sm:self-auto">
                Đã chọn: {selectedSpecialtyIds.length} tính năng
              </span>
            )}
          </div>

          {/* List of existing specialties to toggle */}
          <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
            {specialtiesOptions.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Chưa có tính năng nào trong hệ thống. Hãy thêm tính năng mới bên dưới!
              </p>
            ) : (
              specialtiesOptions.map((spec) => {
                const isSelected = selectedSpecialtyIds.includes(spec.value);
                return (
                  <button
                    key={spec.value}
                    type="button"
                    onClick={() => handleToggleSpecialty(spec.value)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer active:scale-95 select-none",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-white text-muted-foreground hover:text-foreground hover:bg-primary/10 border-primary/20",
                    )}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    <span>{spec.label}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick add new specialty */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-primary/10">
            <Input
              placeholder="Nhập tính năng mới (ví dụ: WiFi, Bluetooth, Màn hình lật, Quay 4K...)"
              value={newSpecialtyName}
              onChange={(e) => setNewSpecialtyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateNewSpecialty();
                }
              }}
              className="h-9 text-xs rounded-xl bg-white max-w-md"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCreateNewSpecialty}
              className="h-9 px-4 text-xs rounded-xl border-primary/30 hover:bg-primary/10 text-primary font-bold shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm tính năng mới
            </Button>
          </div>
        </div>

        {/* Content Builder */}
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-lg font-bold">Product Story / Content</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddContentBlock("text")}
              >
                + Text
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddContentBlock("image")}
              >
                + Image
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddContentBlock("video")}
              >
                + Video
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.content?.map((c) => c.id) || []}
                strategy={verticalListSortingStrategy}
              >
                {formData.content?.map((block, idx) => (
                  <SortableItem key={block.id} id={block.id}>
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveContentBlock(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors z-30"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="mb-2 uppercase text-[10px] font-bold text-muted-foreground tracking-wider">
                      Block {idx + 1}: {block.type}
                    </div>

                    {block.type === "text" && (
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                        value={block.value}
                        onChange={(e) =>
                          handleContentChange(idx, "value", e.target.value)
                        }
                        placeholder="Write your story here..."
                      />
                    )}

                    {block.type === "image" && (
                      <div className="space-y-3">
                        <div className="flex gap-4 items-start">
                          <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border relative">
                            {block.value ? (
                              <img
                                src={block.value}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleContentFileChange(idx, e, "image")
                              }
                            />
                            <Input
                              placeholder="Caption (optional)"
                              value={block.caption || ""}
                              onChange={(e) =>
                                handleContentChange(
                                  idx,
                                  "caption",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "video" && (
                      <div className="space-y-3">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                          {block.value ? (
                            <video
                              src={block.value}
                              controls
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <p className="text-xs">No Video Selected</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleContentFileChange(idx, e, "video")
                            }
                          />
                          <Input
                            placeholder="Caption (optional)"
                            value={block.caption || ""}
                            onChange={(e) =>
                              handleContentChange(
                                idx,
                                "caption",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>

            {formData.content?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                No content blocks yet. Add one to tell the product story!
              </div>
            )}
          </div>
        </div>

        {/* Rental Pricing */}
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-lg font-bold">Rental Options</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddRentalOption}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Rental Option
            </Button>
          </div>

          <div className="space-y-4">
            {formData.rental && formData.rental.length > 0 ? (
              formData.rental.map((option, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl relative group border"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">
                      Duration (e.g. 1 Ngày, 1 Tuần)
                    </Label>
                    <Input
                      placeholder="1 Ngày"
                      value={option.duration}
                      onChange={(e) =>
                        handleRentalChange(idx, "duration", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Price (VND)</Label>
                    <Input
                      type="number"
                      placeholder="350000"
                      value={option.price}
                      onChange={(e) =>
                        handleRentalChange(idx, "price", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveRentalOption(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                No rental options set. Add options to enable rental status for
                this camera.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveCamera} disabled={loading || isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Variants (Only for existing cameras) */}
      {id !== "new" && (
        <div className="bg-card p-6 rounded-xl border space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">Variants (Prices & Stock)</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsVariantOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Variant
            </Button>

            <Dialog open={isVariantOpen} onOpenChange={setIsVariantOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Variant</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <CreatableSelect
                      options={conditions}
                      value={newVariant.condition_id}
                      onChange={(val) =>
                        setNewVariant({ ...newVariant, condition_id: val })
                      }
                      onCreate={async (name) => {
                        const newId = await handleCreateOption(
                          "conditions",
                          name,
                          setConditions,
                        );
                        if (newId)
                          setNewVariant((prev) => ({
                            ...prev,
                            condition_id: newId,
                          }));
                      }}
                      placeholder="Select Condition..."
                      createLabel="Create Condition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <CreatableSelect
                      options={colors}
                      value={newVariant.color_id}
                      onChange={(val) =>
                        setNewVariant({ ...newVariant, color_id: val })
                      }
                      onCreate={async (name) => {
                        // Colors usually need hex code too, we'll just insert name for now
                        const newId = await handleCreateOption(
                          "colors",
                          name,
                          setColors,
                        );
                        if (newId)
                          setNewVariant((prev) => ({
                            ...prev,
                            color_id: newId,
                          }));
                      }}
                      placeholder="Select Color..."
                      createLabel="Create Color"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (VND)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5000000"
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="stock-mode"
                      checked={newVariant.in_stock}
                      onCheckedChange={(checked) =>
                        setNewVariant({ ...newVariant, in_stock: checked })
                      }
                    />
                    <Label htmlFor="stock-mode">In Stock</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddVariant}>Create Variant</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border"
              >
                <div>
                  <div className="font-bold flex gap-2">
                    <span>
                      {variant.condition?.name || "Unknown Condition"}
                    </span>
                    <span>•</span>
                    <span>{variant.color?.name || "Unknown Color"}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price:{" "}
                    {new Intl.NumberFormat("vi-VN").format(variant.price)}đ
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={variant.in_stock}
                      onCheckedChange={() =>
                        handleToggleStock(variant.id, variant.in_stock)
                      }
                    />
                    <span
                      className={`text-sm font-medium ${variant.in_stock ? "text-green-600" : "text-red-500"}`}
                    >
                      {variant.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {variants.length === 0 && (
              <div className="text-muted-foreground text-center py-4">
                No variants found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
