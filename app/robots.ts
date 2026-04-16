import { MetadataRoute } from "next";

const BASE_URL = "https://hamroexam.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}