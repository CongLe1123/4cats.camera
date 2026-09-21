import { supabase } from "./supabase.js";

const CAMERA_SELECT_QUERY = `
  *,
  brands ( name ),
  series ( name ),
  categories ( name ),
  camera_variants (
    price,
    in_stock,
    conditions ( name ),
    colors ( name )
  ),
  cameras_specialties (
    specialties ( name )
  )
`;

function transformCamera(data) {
  if (!data) return null;

  // Transform variants
  const variants =
    data.camera_variants?.map((v) => ({
      condition: v.conditions?.name,
      color: v.colors?.name,
      price: v.price,
      inStock: v.in_stock,
    })) || [];

  const availableColors = [
    ...new Set(variants.map((v) => v.color).filter(Boolean)),
  ];

  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price).filter(Boolean)) : data.price || 0;

  return {
    ...data,
    brand: data.brands?.name || null,
    series: data.series?.name || null,
    category: data.categories?.name || null,
    camera_type: data.categories?.name || "Mirrorless",
    specialties:
      data.cameras_specialties
        ?.map((cs) => cs.specialties?.name)
        .filter(Boolean) || [],
    variants,
    availableColors,
    minPrice,
    desc:
      data.content && data.content[0]?.type === "text"
        ? data.content[0].value
        : "",
    content: data.content || data.specs?.content || "",
    conditionBadge: "Mới 100% Chính Hãng",
    features: data.features && data.features.length > 0 ? data.features : [],
    link: `/shop/${data.id}`,
  };
}

export async function getCameras() {
  try {
    const { data, error } = await supabase
      .from("cameras")
      .select(CAMERA_SELECT_QUERY)
      .order("id");

    if (!error && data && data.length > 0) {
      return data.map(transformCamera);
    }
  } catch (err) {
    console.warn("Supabase camera fetch error, falling back to structured models:", err);
  }

  const { getAllModels } = await import("./productData.js");
  return getAllModels();
}

export async function getCameraById(id) {
  if (!id) return null;
  const strId = String(id).trim();

  // If numeric ID, attempt Supabase lookup first
  const numId = parseInt(strId, 10);
  if (!isNaN(numId) && String(numId) === strId) {
    try {
      const { data, error } = await supabase
        .from("cameras")
        .select(CAMERA_SELECT_QUERY)
        .eq("id", numId)
        .single();

      if (!error && data) {
        return transformCamera(data);
      }
    } catch (err) {
      console.warn(`Supabase fetch failed for camera ${id}:`, err);
    }
  }

  // Resolve from productData (handles both numeric ID and slug)
  const { getModelByIdOrSlug } = await import("./productData.js");
  const model = getModelByIdOrSlug(strId);
  if (model) return model;

  // Legacy fallback to data.js
  try {
    const { cameras: mockCameras } = await import("./data.js");
    const found = mockCameras.find((c) => String(c.id) === strId);
    if (found) return found;
  } catch {}

  return null;
}

export async function getProductModel(slugOrId) {
  return getCameraById(slugOrId);
}

export async function getInventoryUnit(unitCode) {
  const { getInventoryUnitByCode } = await import("./productData.js");
  return getInventoryUnitByCode(unitCode);
}

export async function getBrands() {
  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
  }

  // Default popular camera brands
  return [
    { name: "Canon", display_order: 1 },
    { name: "Sony", display_order: 2 },
    { name: "Fujifilm", display_order: 3 },
    { name: "Nikon", display_order: 4 },
  ];
}

export async function getFeaturedCameras() {
  try {
    const { data, error } = await supabase
      .from("featured_cameras")
      .select(
        `
        *,
        cameras (
          ${CAMERA_SELECT_QUERY}
        )
      `,
      )
      .order("display_order");

    if (!error && data && data.length > 0) {
      return data.map((item) => {
        const cam = transformCamera(item.cameras);
        return {
          ...cam,
          id: cam.id,
          conditionBadge: "Mới 100% Chính Hãng",
          desc: item.description || cam.desc,
          features:
            item.features && item.features.length > 0
              ? item.features
              : cam.features,
          link: `/shop/${cam.id}`,
        };
      });
    }
  } catch (err) {
    console.warn("Error fetching featured cameras from Supabase, using productData:", err);
  }

  const { getFeaturedProducts } = await import("./productData.js");
  return getFeaturedProducts();
}

// Fetch 3 latest cameras for each specified brand
export async function getBrandSections() {
  const [brands, allCameras] = await Promise.all([getBrands(), getCameras()]);

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

  const preferredOrder = ["Canon", "Sony", "Fujifilm", "Nikon"];
  sections.sort((a, b) => {
    const indexA = preferredOrder.indexOf(a.brandName);
    const indexB = preferredOrder.indexOf(b.brandName);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.brandName.localeCompare(b.brandName);
  });

  return sections;
}

export async function getFilters() {
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
      brands: ["All", ...(brands?.map((b) => b.name) || ["Canon", "Sony", "Fujifilm", "Nikon"])],
      categories: ["All", ...(categories?.map((c) => c.name) || ["Mirrorless", "Compact"])],
      colors: ["All", ...(colors?.map((c) => c.name) || ["White", "Black", "Silver"])],
      useCases: ["All", "Người mới", "Selfie", "Vlog", "Du lịch", "Chụp người", "Film look"],
      specialties: [
        "All",
        ...Array.from(
          new Set([
            ...(specialties?.map((s) => s.name) || []),
            "WiFi",
            "Bluetooth",
            "Màn xoay lật 180°",
            "Có Flash cóc",
            "Chống rung IBIS",
            "Kính ngắm EVF",
          ])
        ),
      ],
    };
  } catch (err) {
    console.warn("Fallback filters:", err);
    return {
      brands: ["All", "Canon", "Sony", "Fujifilm", "Nikon"],
      categories: ["All", "Mirrorless", "Compact"],
      colors: ["All", "White", "Black", "Silver"],
      useCases: ["All", "Người mới", "Selfie", "Vlog", "Du lịch", "Chụp người", "Film look"],
      specialties: ["All", "WiFi", "Bluetooth", "Màn xoay lật 180°", "Có Flash cóc", "Chống rung IBIS", "Kính ngắm EVF"],
    };
  }
}

export async function getBanners() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order");

    if (!error && data && data.length > 0) {
      return data.map((banner) => ({
        ...banner,
        cta_text: banner.cta_text || "Xem ưu đãi",
        link: banner.link || "/shop",
      }));
    }
  } catch (err) {
    console.warn("Error fetching banners from Supabase:", err);
  }

  // Modern new-camera promotional banners
  return [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "ƯU ĐÃI CANON EOS R50",
      description: "Máy ảnh cho người mới & selfie đỉnh cao. Giảm ngay 1.500.000đ kèm quà tặng thẻ nhớ 64GB.",
      cta_text: "Xem ưu đãi ngay",
      link: "/may-anh/canon-eos-r50",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "SONY VLOG & CREATOR WEEK",
      description: "Bộ đôi Sony ZV-1 II & ZV-E10 II chính hãng. Quay video 4K siêu nét, thu âm trong trẻo.",
      cta_text: "Khám phá dòng ZV",
      link: "/shop?intent=Vlog",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "FUJIFILM FILM LOOK VINTAGE",
      description: "Thỏa mãn đam mê màu film hoài cổ với X-T30 II & X-S20 mới 100% nguyên seal.",
      cta_text: "Xem màu Film",
      link: "/shop?intent=Film+look",
    },
  ];
}

export async function getStoreSettings() {
  const defaults = {
    brand_name: "4cats.camera 📸",
    brand_description:
      "Chuyên cung cấp các dòng máy ảnh Mirrorless, Compact chính hãng mới 100% dành cho người mới và creator. Uy tín tạo nên thương hiệu.",
    facebook_url: "https://www.facebook.com/profile.php?id=100093056073018",
    instagram_url: "https://www.instagram.com/4cats.camera/",
    locations: [
      {
        name: "Cơ sở 1 - Cầu Giấy",
        address:
          "Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà Nội",
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
    copyright_text:
      "© 2026 4cats.camera - Máy ảnh mới chính hãng cho người mới 🐱📸",
  };

  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    if (error) {
      return defaults;
    }

    return {
      ...defaults,
      ...data,
      locations: Array.isArray(data.locations)
        ? data.locations
        : defaults.locations,
      support_links: Array.isArray(data.support_links)
        ? data.support_links
        : defaults.support_links,
      contact_phones: Array.isArray(data.contact_phones)
        ? data.contact_phones
        : defaults.contact_phones,
    };
  } catch {
    return defaults;
  }
}
