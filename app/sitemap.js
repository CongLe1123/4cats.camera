import { getAllModels } from "../lib/productData";

export default async function sitemap() {
  const baseUrl = "https://4catscamera.com";
  const models = getAllModels();

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/huong-dan/chon-may-anh-cho-nguoi-moi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/he-thong-cua-hang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chinh-sach/bao-hanh`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chinh-sach/mua-hang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Model canonical URLs for new camera storefront
  const modelRoutes = models.map((m) => ({
    url: `${baseUrl}/may-anh/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...modelRoutes];
}
