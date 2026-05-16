import { MetadataRoute } from "next";
import { contentfulClient } from "@/lib/contentful";

const BASE_URL = "https://hamroexam.com";

/* ---------------- SLUG FUNCTION ---------------- */
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, ""); // ✅ allow dot

export const revalidate = 86400;

/* =========================================================
   PRACTICE APIs
========================================================= */

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
      {
        cache: "no-store",
      }
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

/* =========================================================
   CONTENTFUL FETCHERS
========================================================= */

/* ---------------- NOTES ---------------- */
async function getNotes() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: "notes",
      limit: 1000,
    });

    return response.items.map((item: any) => ({
      faculty: item.fields.faculty,
      subject: item.fields.subject,
    }));
  } catch (error) {
    console.error("Notes sitemap error:", error);
    return [];
  }
}

/* ---------------- MODEL QUESTIONS ---------------- */
async function getModelQuestions() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: "modelQuestions",
      limit: 1000,
    });

    return response.items.map((item: any) => ({
      faculty: item.fields.faculty,
      slug: item.fields.slug,
    }));
  } catch (error) {
    console.error("Model Questions sitemap error:", error);
    return [];
  }
}

/* ---------------- SYLLABUS ---------------- */
async function getSyllabus() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: "syllabus",
      limit: 1000,
    });

    return response.items.map((item: any) => ({
      faculty: item.fields.faculty,
    }));
  } catch (error) {
    console.error("Syllabus sitemap error:", error);
    return [];
  }
}

/* =========================================================
   SITEMAP
========================================================= */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* ---------------- STATIC ---------------- */

  const staticPages = [
    "",
    "/practice",
    "/mocktest",
    "/notes",
    "/model-questions",
    "/syllabus",
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

  /* =========================================================
     MOCKTEST
  ========================================================= */

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

  /* =========================================================
     PRACTICE
  ========================================================= */

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

  /* =========================================================
     CONTENTFUL DATA
  ========================================================= */

  const [notes, modelQuestions, syllabus] = await Promise.all([
    getNotes(),
    getModelQuestions(),
    getSyllabus(),
  ]);

  /* ---------------- NOTES ---------------- */

  notes.forEach((note) => {
    dynamicUrls.push({
      url: `${BASE_URL}/notes/${toSlug(note.faculty)}/${toSlug(
  note.subject
)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  /* ---------------- MODEL QUESTIONS ---------------- */

  modelQuestions.forEach((item) => {
    dynamicUrls.push({
      url: `${BASE_URL}/model-questions/${encodeURIComponent(
        item.faculty
      )}/${encodeURIComponent(item.slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  /* ---------------- SYLLABUS ---------------- */

  syllabus.forEach((item) => {
    dynamicUrls.push({
      url: `${BASE_URL}/syllabus/${encodeURIComponent(item.faculty)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return [...staticUrls, ...dynamicUrls];
}