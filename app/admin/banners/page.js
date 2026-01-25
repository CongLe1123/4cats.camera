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
  CardFooter,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { compressImage } from "../../../lib/utils";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    cta_text: "",
    link: "",
    display_order: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) console.error(error);
    else setBanners(data || []);
    setLoading(false);
  };

  const handleImageSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        // Optimize: 1920px max width, 0.75 quality (good balance for banners)
        const compressed = await compressImage(file, {
          maxWidth: 1920,
          quality: 0.75,
        });
        setImageFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch (err) {
        console.error("Compression failed", err);
        // Fallback to original
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setFormData({ ...formData, image: "" });
  };

  const deleteImageFromStorage = async (url) => {
    if (!url || !url.includes("products")) return;
    try {
      const oldUrlObj = new URL(url);
      const pathParts = oldUrlObj.pathname.split("/products/");
      if (pathParts.length > 1) {
        let oldPath = decodeURIComponent(pathParts[1]);
        if (oldPath.startsWith("/")) oldPath = oldPath.substring(1);
        await supabase.storage.from("products").remove([oldPath]);
      }
    } catch (e) {
      console.error("Error deleting image from storage", e);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    let finalImageUrl = formData.image;

    try {
      // 1. Upload New Image if selected
      if (imageFile) {
        const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

        if (uploadError)
          throw new Error("Upload failed: " + uploadError.message);

        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(fileName);
        finalImageUrl = publicUrl;

        // 2. Cleanup Old Image if we are replacing it
        if (
          editingBanner &&
          editingBanner.image &&
          editingBanner.image !== finalImageUrl
        ) {
          await deleteImageFromStorage(editingBanner.image);
        }
      }

      const payload = { ...formData, image: finalImageUrl };

      if (editingBanner) {
        const { error } = await supabase
          .from("banners")
          .update(payload)
          .eq("id", editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert([payload]);
        if (error) throw error;
      }

      setOpen(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (err) {
      alert("Error saving banner: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!confirm("Are you sure? This will delete the banner and its image."))
      return;

    // 1. Delete image from storage
    if (banner.image) {
      await deleteImageFromStorage(banner.image);
    }

    // 2. Delete record
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", banner.id);
    if (error) alert("Error deleting: " + error.message);
    else fetchBanners();
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      image: banner.image,
      title: banner.title || "",
      description: banner.description || "",
      cta_text: banner.cta_text || "",
      link: banner.link || "",
      display_order: banner.display_order || 0,
    });
    setPreviewUrl("");
    setImageFile(null);
    setOpen(true);
  };

  const openNew = () => {
    setEditingBanner(null);
    resetForm();
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      description: "",
      cta_text: "",
      link: "",
      display_order: banners.length,
    });
    setImageFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">Carousel Banners</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => openEdit(banner)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(banner)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{banner.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {banner.description}
                </p>
                <div className="mt-2 text-xs flex gap-2">
                  <span className="bg-primary/10 px-2 py-1 rounded text-primary font-mono">
                    Order: {banner.display_order}
                  </span>
                  <span className="bg-secondary px-2 py-1 rounded font-mono">
                    Link: {banner.link}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "New Banner"}
            </DialogTitle>
            <DialogDescription>
              Configure the banner details for the homepage carousel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Left Column: Image */}
            <div className="space-y-2">
              <Label className="font-bold text-lg">Banner Image</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative min-h-[300px] h-full bg-muted/10">
                {previewUrl || formData.image ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border bg-muted group flex items-center justify-center">
                    <img
                      src={previewUrl || formData.image}
                      alt="Preview"
                      className="w-full h-full object-contain max-h-[400px]"
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
                  <div className="py-4 pointer-events-none flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-base font-bold mb-2">
                      Upload Banner Image
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Drag & drop or click to upload. Recommended size:
                      1920x1080
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

            {/* Right Column: Form Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Banner Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Short description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_text: e.target.value })
                    }
                    placeholder="e.g. Shop Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="/shop/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="w-full md:w-auto min-w-[150px]"
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Banner
                </Button>
              </div>
            </div>
          </div>
          {/* Removed DialogFooter since button is now in the grid flow or we can keep it inside content area */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
