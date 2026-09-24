import { cache } from "react";
import { supabase } from "./supabase.js";

const CAMERA_SELECT_QUERY = `
  id,
  name,
  image,
  images,
  specs,
  content,
  rental,
  features,
  created_at,
  brands ( id, name, image ),
  series ( id, name ),
  categories ( id, name ),
  camera_variants (
    id,
    price,
    in_stock,
    colors ( name ),
    conditions ( name )
  ),
  cameras_specialties (
    specialties ( name )
  )
`;

export function transformCamera(data) {
  if (!data) return null;

  const specs = (typeof data.specs === "object" && data.specs !== null) ? data.specs : {};
  const slug = data.slug || specs.slug || `camera-${data.id}`;

  // Extract variants from specs.variants (rich admin format) or joined camera_variants
  let variants = [];
  if (Array.isArray(specs.variants) && specs.variants.length > 0) {
    variants = specs.variants.map((v, idx) => ({
      id: v.id || `var-${data.id}-${idx}`,
      sku: v.sku || `SKU-${data.id}-${idx + 1}`,
      color: v.color || "Tiêu chuẩn",
      color_label: v.color_label || v.color || "Tiêu chuẩn",
      color_hex: v.color_hex || "#1F2937",
      kit_type: v.kit_type || "Body only",
      kit_label: v.kit_label || "Thân máy (Body only)",
      included_lens: v.included_lens || "",
      price: Number(v.price) || 0,
      compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
      stock_quantity: v.stock_quantity !== undefined ? Number(v.stock_quantity) : 5,
      branch_stock: v.branch_stock || { "Cầu Giấy": 3, "Thanh Xuân": 2 },
      warranty: v.warranty || "12–24 tháng chính hãng",
      is_in_stock: v.is_in_stock !== false && (v.stock_quantity === undefined || Number(v.stock_quantity) > 0),
      conditionBadge: "Mới 100% Chính Hãng",
    }));
  } else if (Array.isArray(data.camera_variants) && data.camera_variants.length > 0) {
    variants = data.camera_variants.map((v, idx) => ({
      id: v.id || `var-${data.id}-${idx}`,
      sku: v.sku || `SKU-${data.id}-${idx + 1}`,
      color: v.color || v.colors?.name || "Tiêu chuẩn",
      color_label: v.color_label || v.colors?.name || "Tiêu chuẩn",
      color_hex: v.color_hex || "#1F2937",
      kit_type: v.kit_type || "Body only",
      kit_label: v.kit_label || "Thân máy (Body only)",
      included_lens: v.included_lens || "",
      price: Number(v.price) || 0,
      compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
      stock_quantity: v.stock_quantity !== undefined ? Number(v.stock_quantity) : (v.in_stock ? 5 : 0),
      branch_stock: v.branch_stock || { "Cầu Giấy": v.in_stock ? 3 : 0, "Thanh Xuân": v.in_stock ? 2 : 0 },
      warranty: v.warranty || "12 tháng chính hãng",
      is_in_stock: v.in_stock !== false,
      conditionBadge: "Mới 100% Chính Hãng",
    }));
  }

  const validPrices = variants.map((v) => v.price).filter((p) => p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : Number(data.price) || Number(specs.price) || 0;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : minPrice;

  const validComparePrices = variants.map((v) => v.compare_at_price).filter((p) => p && p > 0);
  const minComparePrice = validComparePrices.length > 0 ? Math.min(...validComparePrices) : (Number(specs.compare_at_price) || null);
  const discountPercent =
    minComparePrice && minComparePrice > minPrice
      ? Math.round(((minComparePrice - minPrice) / minComparePrice) * 100)
      : (specs.discountPercent || 0);

  const availableColors = [...new Set(variants.map((v) => v.color_label || v.color).filter(Boolean))];
  const kitTypes = [...new Set(variants.map((v) => v.kit_type).filter(Boolean))];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);

  const brandName = data.brands?.name || specs.brand || "";
  const categoryName = data.categories?.name || specs.camera_type || "Mirrorless";
  const seriesName = data.series?.name || specs.series || "";

  const mainImage = data.image || specs.main_image || specs.image || "/favicon.ico";
  const galleryImages = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : (Array.isArray(specs.images) && specs.images.length > 0 ? specs.images : [mainImage]);

  const useCases = (Array.isArray(specs.use_cases) && specs.use_cases.length > 0)
    ? specs.use_cases
    : (Array.isArray(data.features) && data.features.length > 0 ? data.features : []);

  const specialties = (Array.isArray(data.cameras_specialties) && data.cameras_specialties.length > 0)
    ? data.cameras_specialties.map((cs) => cs.specialties?.name).filter(Boolean)
    : (specs.characteristics || []);

  const desc = specs.beginner_summary || specs.short_description || data.short_description || (
    Array.isArray(data.content) && data.content[0]?.type === "text" ? data.content[0].value : ""
  );

  return {
    id: data.id,
    name: data.name,
    model_name: specs.model_name || data.name,
    brand: brandName,
    brand_id: data.brand_id,
    series: seriesName,
    series_id: data.series_id,
    category: categoryName,
    category_id: data.category_id,
    camera_type: categoryName,
    slug,
    image: mainImage,
    main_image: mainImage,
    images: galleryImages,
    official_images: galleryImages,
    short_description: specs.short_description || data.short_description || "",
    beginner_summary: specs.beginner_summary || data.beginner_summary || "",
    desc,
    content: data.content || specs.content || "",
    features: useCases,
    use_cases: useCases,
    specialties,
    characteristics: specialties,
    strengths: specs.strengths || [],
    limitations: specs.limitations || [],
    technical_specs: specs.technical_specs || specs || {},
    specs: specs.technical_specs || specs || {},
    search_aliases: specs.search_aliases || [],
    compatible_accessories: specs.compatible_accessories || [],
    variants,
    availableColors,
    kitTypes,
    minPrice,
    maxPrice,
    compare_at_price: minComparePrice,
    discountPercent,
    totalStock,
    isAvailable: totalStock > 0 || variants.length === 0,
    warrantySummary: "Bảo hành 12–24 tháng chính hãng · 7 ngày 1 đổi 1",
    conditionBadge: "Mới 100% Chính Hãng",
    is_featured: !!(data.is_featured || specs.is_featured),
    featured_section: data.featured_section || specs.featured_section || "featured",
    featured_order: data.featured_order || specs.featured_order || 0,
    status: data.status || specs.status || "published",
    is_published: data.is_published !== false && specs.is_published !== false,
    link: `/may-anh/${slug}`,
    units: variants.map((v) => ({
      id: v.id,
      unit_code: v.sku,
      color: v.color,
      color_label: v.color_label,
      price: v.price,
      original_price: v.compare_at_price,
      is_kit: v.kit_type !== "Body only",
      stock_status: v.is_in_stock ? "in_stock" : "out_of_stock",
      branch_name: "Cầu Giấy & Thanh Xuân",
      condition_grade: "Mới 100% Chính Hãng",
      condition_percentage: 100,
    })),
  };
}

export const getCameras = cache(async function getCameras() {
  try {
    const { data, error } = await supabase
      .from("cameras")
      .select(CAMERA_SELECT_QUERY)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase getCameras error:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data
      .map(transformCamera)
      .filter((c) => c && c.is_published && c.status !== "archived");
  } catch (err) {
    console.error("Supabase getCameras unexpected error:", err);
    return [];
  }
});

export const getCameraById = cache(async function getCameraById(idOrSlug) {
  if (!idOrSlug) return null;
  const str = String(idOrSlug).trim();
  const lowerStr = str.toLowerCase();

  try {
    // 1. Check in cached cameras list first (avoids extra Supabase round-trip)
    const cameras = await getCameras();
    const found = cameras.find(
      (c) =>
        c.slug?.toLowerCase() === lowerStr ||
        String(c.id) === str ||
        c.model_name?.toLowerCase() === lowerStr
    );
    if (found) return found;

    // 2. If numeric ID and not found among published cameras, lookup specifically
    const numId = parseInt(str, 10);
    if (!isNaN(numId) && String(numId) === str) {
      const { data, error } = await supabase
        .from("cameras")
        .select(CAMERA_SELECT_QUERY)
        .eq("id", numId)
        .single();

      if (!error && data) {
        return transformCamera(data);
      }
    }
  } catch (err) {
    console.error("Supabase getCameraById error:", err);
  }

  return null;
});

export const getProductModel = cache(async function getProductModel(slugOrId) {
  return getCameraById(slugOrId);
});

export const getInventoryUnit = cache(async function getInventoryUnit(unitCode) {
  if (!unitCode) return null;
  const cameras = await getCameras();
  for (const cam of cameras) {
    const v = cam.variants?.find(
      (varItem) => varItem.sku?.toUpperCase() === unitCode.toUpperCase()
    );
    if (v) {
      return {
        ...v,
        unit_code: v.sku,
        model: cam,
      };
    }
  }
  return null;
});

export const getBrands = cache(async function getBrands() {
  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase getBrands error:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching brands from Supabase:", error);
    return [];
  }
});

export const getFeaturedCameras = cache(async function getFeaturedCameras() {
  try {
    // First try: check featured_cameras junction table
    const { data: featData, error: featErr } = await supabase
      .from("featured_cameras")
      .select(`*, cameras (${CAMERA_SELECT_QUERY})`)
      .order("display_order", { ascending: true });

    if (!featErr && featData && featData.length > 0) {
      return featData
        .map((item) => {
          if (!item.cameras) return null;
          const cam = transformCamera(item.cameras);
          return {
            ...cam,
            conditionBadge: "Mới 100% Chính Hãng",
            desc: item.description || cam.desc,
            features: item.features && item.features.length > 0 ? item.features : cam.features,
          };
        })
        .filter(Boolean);
    }

    // Fallback within Supabase: query cameras that have is_featured = true
    const allCams = await getCameras();
    return allCams.filter((c) => c.is_featured);
  } catch (err) {
    console.error("Error fetching featured cameras from Supabase:", err);
    return [];
  }
});

export const getBrandSections = cache(async function getBrandSections() {
  const [brands, allCameras] = await Promise.all([getBrands(), getCameras()]);
  if (!brands || brands.length === 0 || !allCameras || allCameras.length === 0) {
    return [];
  }

  const sections = brands
    .map((brand) => {
      const items = allCameras
        .filter((c) => c.brand?.toLowerCase() === brand.name?.toLowerCase())
        .slice(0, 4);

      if (items.length > 0) {
        return {
          brandName: brand.name,
          items,
        };
      }
      return null;
    })
    .filter(Boolean);

  return sections;
});

export const getFilters = cache(async function getFilters() {
  try {
    const [
      { data: brands },
      { data: categories },
      { data: colors },
      { data: specialties },
    ] = await Promise.all([
      supabase.from("brands").select("name").order("name"),
      supabase.from("categories").select("name").order("name"),
      supabase.from("colors").select("name").order("name"),
      supabase.from("specialties").select("name").order("name"),
    ]);

    return {
      brands: ["All", ...(brands?.map((b) => b.name) || [])],
      categories: ["All", ...(categories?.map((c) => c.name) || [])],
      colors: ["All", ...(colors?.map((c) => c.name) || [])],
      useCases: ["All", "Người mới", "Selfie", "Vlog", "Du lịch", "Chụp người", "Film look"],
      specialties: [
        "All",
        ...Array.from(new Set(specialties?.map((s) => s.name) || [])),
      ],
    };
  } catch (err) {
    console.error("Supabase getFilters error:", err);
    return {
      brands: ["All"],
      categories: ["All"],
      colors: ["All"],
      useCases: ["All"],
      specialties: ["All"],
    };
  }
});

export const getBanners = cache(async function getBanners() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Supabase getBanners error:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data
      .filter((b) => b.is_active !== false)
      .map((banner) => ({
        ...banner,
        cta_text: banner.cta_text || "Xem ngay",
        link: banner.link || "/shop",
      }));
  } catch (err) {
    console.error("Error fetching banners from Supabase:", err);
    return [];
  }
});

export const getStoreSettings = cache(async function getStoreSettings() {
  const defaults = {
    brand_name: "4cats.camera 📸",
    brand_description:
      "Chuyên cung cấp các dòng máy ảnh Mirrorless, Compact chính hãng mới 100% dành cho người mới và creator. Uy tín tạo nên thương hiệu.",
    facebook_url: "https://www.facebook.com/profile.php?id=100093056073018",
    instagram_url: "https://www.instagram.com/4cats.camera/",
    locations: [
      {
        name: "Cơ sở 1 - Cầu Giấy",
        address: "Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà Nội",
      },
      {
        name: "Cơ sở 2 - Thanh Xuân",
        address: "Số 51 Nguyễn Trãi, Ngã tư Sở, Thanh Xuân, Hà Nội",
      },
    ],
    support_links: [
      { label: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh", is_social: false },
      { label: "Chính sách mua hàng", href: "/chinh-sach/mua-hang", is_social: false },
      { label: "Hướng dẫn chọn máy", href: "/huong-dan/chon-may-anh-cho-nguoi-moi", is_social: false },
      {
        label: "@4cats.camera",
        href: "https://www.instagram.com/4cats.camera/",
        is_social: true,
        platform: "Instagram",
      },
      {
        label: "Fanpage 4cats.camera",
        href: "https://www.facebook.com/profile.php?id=100093056073018",
        is_social: true,
        platform: "Facebook",
      },
      {
        label: "Admin: 039 824 9856",
        href: "https://zalo.me/0398249856",
        is_social: true,
        platform: "Zalo",
      },
    ],
    contact_email: "fourcatscamera@gmail.com",
    contact_phones: ["039 824 9856", "093 235 68 69"],
    opening_hours: "Open: 9:00 - 21:00",
    copyright_text: "© 2026 4cats.camera - Máy ảnh mới chính hãng cho người mới 🐱📸",
  };

  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    if (error || !data) {
      return defaults;
    }

    return {
      ...defaults,
      ...data,
      locations: Array.isArray(data.locations) ? data.locations : defaults.locations,
      support_links: Array.isArray(data.support_links) ? data.support_links : defaults.support_links,
      contact_phones: Array.isArray(data.contact_phones) ? data.contact_phones : defaults.contact_phones,
    };
  } catch {
    return defaults;
  }
});
