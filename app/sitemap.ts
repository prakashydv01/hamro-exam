import { MetadataRoute } from "next";

const BASE_URL = "http://localhost:3000"; // 🔥 UPDATE THIS TO YOUR PRODUCTION URL

/* ---------------- SLUG FUNCTION ---------------- */
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, ""); // ✅ allow dot

/* ---------------- FETCH PRACTICE FACULTIES ---------------- */
async function getPracticeFaculties(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/practice`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/* ---------------- FETCH SUBJECTS ---------------- */
async function getSubjects(faculty: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/practice?faculty=${encodeURIComponent(faculty)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/* ---------------- FETCH MOCKTEST FACULTIES ---------------- */
async function getMocktestFaculties(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/practice`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/* ---------------- SITEMAP ---------------- */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* -------- STATIC -------- */
  const staticPages = [
    "",
    "/practice",
    "/mocktest",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const dynamicUrls: MetadataRoute.Sitemap = [];

  /* -------- MOCKTEST (FROM mocktest-config API) -------- */
  const mocktestFaculties = await getMocktestFaculties();

  for (const faculty of mocktestFaculties) {
    const slug = toSlug(faculty);

    dynamicUrls.push({
      url: `${BASE_URL}/mocktest/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  /* -------- PRACTICE (FROM practice API) -------- */
  const practiceFaculties = await getPracticeFaculties();

  for (const faculty of practiceFaculties) {
    const subjects = await getSubjects(faculty);

    for (const subject of subjects) {
      dynamicUrls.push({
        url: `${BASE_URL}/practice/${encodeURIComponent(
          faculty
        )}/${encodeURIComponent(subject)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return [...staticUrls, ...dynamicUrls];
}