import { supabase } from "./supabase";

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

  // Transform variants first to derive conditions and colors
  const variants =
    data.camera_variants?.map((v) => ({
      condition: v.conditions?.name,
      color: v.colors?.name,
      price: v.price,
      inStock: v.in_stock,
    })) || [];

  const availableConditions = [
    ...new Set(variants.map((v) => v.condition).filter(Boolean)),
  ];
  const availableColors = [
    ...new Set(variants.map((v) => v.color).filter(Boolean)),
  ];

  return {
    ...data,
    brand: data.brands?.name || null,
    series: data.series?.name || null,
    category: data.categories?.name || null,
    specialties:
      data.cameras_specialties
        ?.map((cs) => cs.specialties?.name)
        .filter(Boolean) || [],
    variants,
    availableConditions,
    availableColors,
    // Add compatibility fields for ProductSection component if needed
    desc:
      data.content && data.content[0]?.type === "text"
        ? data.content[0].value
        : "",
    condition:
      availableConditions.length > 0 ? availableConditions[0] : "Available",
    // Fallback features if not present
    features: data.features && data.features.length > 0 ? data.features : [],
    link: `/shop/${data.id}`,
  };
}

export async function getCameras() {
  const { data, error } = await supabase
    .from("cameras")
    .select(CAMERA_SELECT_QUERY)
    .order("id");

  if (error) {
    console.error("Error fetching cameras:", error);
    return [];
  }

  return data.map(transformCamera);
}

export async function getCameraById(id) {
  const { data, error } = await supabase
    .from("cameras")
    .select(CAMERA_SELECT_QUERY)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error(`Error fetching camera ${id}:`, error);
    }
    return null;
  }

  return transformCamera(data);
}

export async function getBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
  return data;
}

export async function getFeaturedCameras() {
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

  if (error) {
    console.error("Error fetching featured cameras:", error);
    return [];
  }

  // Transform into the format expected by the frontend component
  return data.map((item) => {
    const cam = transformCamera(item.cameras);
    return {
      ...cam,
      // Override specific fields if provided in featured_cameras
      id: cam.id, // Ensure we keep the camera ID for linking
      condition: item.label, // Use label as the badge text
      desc: item.description,
      features:
        item.features && item.features.length > 0
          ? item.features
          : cam.features,
      link: `/shop/${cam.id}`,
    };
  });
}

// Fetch 3 latest cameras for each specified brand
export async function getBrandSections() {
  // Optimize: Fetch all data in parallel (2 queries total instead of N+1)
  const [brands, allCameras] = await Promise.all([getBrands(), getCameras()]);

  const sections = brands
    .map((brand) => {
      const items = allCameras
        .filter((c) => c.brand === brand.name)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

      if (items.length > 0) {
        return {
          brandName: brand.name,
          items,
        };
      }
      return null;
    })
    .filter(Boolean);

  const preferredOrder = [
    "Casio",
    "Canon",
    "Sony",
    "Nikon",
    "Fujifilm",
    "Lumix",
  ];
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
  const [
    { data: brands },
    { data: categories },
    { data: conditions },
    { data: colors },
    { data: specialties },
    { data: series },
  ] = await Promise.all([
    supabase.from("brands").select("name").order("name"),
    supabase.from("categories").select("name").order("name"),
    supabase.from("conditions").select("name").order("name"),
    supabase.from("colors").select("name").order("name"),
    supabase.from("specialties").select("name").order("name"),
    supabase.from("series").select("name, brands(name)").order("name"),
  ]);

  // Transform Series into a mapped object: { [BrandName]: [SeriesNames] }
  const seriesByBrand = { All: [] };
  if (series) {
    series.forEach((item) => {
      const brandName = item.brands?.name;

      // Add to All list (avoid duplicates if necessary, but usually unique names per brand)
      if (!seriesByBrand["All"].includes(item.name)) {
        seriesByBrand["All"].push(item.name);
      }

      if (brandName) {
        if (!seriesByBrand[brandName]) {
          seriesByBrand[brandName] = [];
        }
        seriesByBrand[brandName].push(item.name);
      }
    });
    // Sort All list
    seriesByBrand["All"].sort();
  }

  return {
    brands: ["All", ...(brands?.map((b) => b.name) || [])],
    categories: ["All", ...(categories?.map((c) => c.name) || [])],
    conditions: ["All", ...(conditions?.map((c) => c.name) || [])],
    colors: ["All", ...(colors?.map((c) => c.name) || [])],
    specialties: ["All", ...(specialties?.map((s) => s.name) || [])],
    seriesByBrand,
  };
}

export async function getBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("display_order");

  if (error) {
    console.error("Error fetching banners:", error);
    // Fallback mock data for development/demo if DB fails
    return [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        title: "Khám phá thế giới qua ống kính",
        description:
          "Lưu giữ những khoảnh khắc đáng nhớ với bộ sưu tập máy ảnh vintage độc đáo.",
        cta_text: "Mua ngay",
        link: "/shop",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        title: "Chất lượng hình ảnh tuyệt đỉnh",
        description:
          "Trải nghiệm nhiếp ảnh chuyên nghiệp với các dòng máy ảnh mirrorless mới nhất.",
        cta_text: "Xem chi tiết",
        link: "/shop",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1552168324-d612d77725e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        title: "Phong cách Retro",
        description:
          "Tìm lại cảm hứng với những chiếc máy ảnh film cổ điển đầy phong cách.",
        cta_text: "Khám phá",
        link: "/shop",
      },
    ];
  }

  // Return data with fallbacks if columns are missing in DB
  return data.map((banner) => ({
    ...banner,
    cta_text: banner.cta_text || "Xem ngay",
    link: banner.link || "/shop",
  }));
}

export async function getStoreSettings() {
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching store settings:", error);
    }
    // Return hardcoded defaults if DB fails or table not ready
    return {
      brand_name: "4cats.camera 📸",
      brand_description:
        "Chuyên cung cấp các dòng máy ảnh Compact, Mirrorless, DSLR đã qua sử dụng với chất lượng tốt nhất. Uy tín tạo nên thương hiệu.",
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
        { label: "Chính sách bảo hành", href: "#" },
        { label: "Chính sách đổi trả", href: "#" },
        { label: "Hướng dẫn mua hàng", href: "#" },
        { label: "Gửi yêu cầu bảo hành", href: "#" },
      ],
      contact_email: "fourcatscamera@gmail.com",
      contact_phones: ["039 824 9856", "093 235 68 69"],
      opening_hours: "Open: 9:00 - 21:00",
      copyright_text:
        "© 2026 4cats.camera - Người bạn đồng hành cùng đam mê nhiếp ảnh 🐱📸",
    };
  }
  return data;
}
