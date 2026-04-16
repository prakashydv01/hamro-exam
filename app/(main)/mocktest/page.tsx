import { MetadataRoute } from "next";

const BASE_URL = "https://hamroexam.com";

/* ---------------- SLUGIFY FUNCTION ---------------- */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/* ---------------- FETCH FACULTIES ---------------- */
async function getFaculties(): Promise<string[]> {
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

/* ---------------- SITEMAP ---------------- */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* ---------------- STATIC PAGES ---------------- */
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

  /* ---------------- DYNAMIC PAGES ---------------- */
  const faculties = await getFaculties();

  const dynamicUrls: MetadataRoute.Sitemap = [];

  for (const faculty of faculties) {
    const facultySlug = slugify(faculty);

    /* ---------------- MOCKTEST ---------------- */
    dynamicUrls.push({
      url: `${BASE_URL}/mocktest/${facultySlug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    /* ---------------- PRACTICE SUBJECTS ---------------- */
    const subjects = await getSubjects(faculty);

    for (const subject of subjects) {
      const subjectSlug = slugify(subject);

      dynamicUrls.push({
        url: `${BASE_URL}/practice/${facultySlug}/${subjectSlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return [...staticUrls, ...dynamicUrls];
}