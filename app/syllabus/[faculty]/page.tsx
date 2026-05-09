import { contentfulClient } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{
    faculty: string;
  }>;
};

async function getSyllabus(slug: string) {
  const response = await contentfulClient.getEntries({
    content_type: "syllabus",
    "fields.slug": slug,
    limit: 1,
  });
  return response.items[0];
}

export async function generateStaticParams() {
  const response = await contentfulClient.getEntries({
    content_type: "syllabus",
  });
  return response.items.map((item: any) => ({
    faculty: item.fields.slug,
  }));
}

export async function generateMetadata({ params }: Params) {
  const { faculty } = await params;
  const syllabus = await getSyllabus(faculty);
  if (!syllabus) return { title: "Syllabus Not Found" };
  return {
    title: `${syllabus.fields.faculty} Entrance Syllabus`,
    description: `${syllabus.fields.faculty} syllabus, marks distribution, topics and entrance exam details.`,
  };
}

function statSVG(label: string) {
  const l = label?.toLowerCase() ?? "";
  if (l.includes("question"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  if (l.includes("mark") || l.includes("score"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  if (l.includes("pass"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (l.includes("duration") || l.includes("time"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  if (l.includes("type") || l.includes("pattern"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>`;
  if (l.includes("negative"))
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;
}

export default async function FacultySyllabusPage({ params }: Params) {
  const { faculty } = await params;
  const syllabus = await getSyllabus(faculty);
  if (!syllabus) notFound();

  const fields: any = syllabus.fields;
  const data = fields.syllabusData || {};

  const overview: any[] = data.overview || [];
  const marksDistribution: any[] = data.marksDistribution || [];
  const sections: any[] = data.sections || [];

  const pdfUrl = fields.pdf?.fields?.file?.url
    ? `https:${fields.pdf.fields.file.url}`
    : null;

  const heroImageUrl = fields.heroImage?.fields?.file?.url
    ? `https:${fields.heroImage.fields.file.url}`
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .syl*{box-sizing:border-box;}
        .syl{font-family:'Inter',sans-serif;background:#f4f6f9;color:#111827;margin:0;}

        /* HERO */
        .syl-hero{background:#fff;border-bottom:1px solid #e5e7eb;}
        .syl-hero-img{width:100%;max-height:300px;object-fit:cover;display:block;}
        .syl-hero-placeholder{width:100%;height:200px;background:linear-gradient(135deg,#1e3a8a,#3b82f6 60%,#06b6d4);display:flex;align-items:center;justify-content:center;}
        .syl-hero-placeholder svg{opacity:.15;}
        .syl-hero-body{max-width:860px;margin:0 auto;padding:28px 20px 32px;}
        .syl-hero-badge{display:inline-flex;align-items:center;gap:5px;background:#eff6ff;color:#1d4ed8;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:6px;border:1px solid #bfdbfe;margin-bottom:12px;}
        .syl-hero-badge svg{flex-shrink:0;}
        .syl-h1{font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700;color:#0f172a;line-height:1.25;margin:0 0 10px;}
        .syl-hero-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;color:#6b7280;margin-bottom:18px;}
        .syl-hero-meta svg{color:#9ca3af;}
        .syl-hero-meta .dot{color:#d1d5db;}
        .syl-ask{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;background:#2563eb;color:#fff;font-size:13.5px;font-weight:600;border-radius:8px;text-decoration:none;border:none;cursor:pointer;transition:background .15s;}
        .syl-ask:hover{background:#1d4ed8;}
        .syl-hero-intro{margin-top:20px;padding-top:18px;border-top:1px solid #f3f4f6;font-size:14px;line-height:1.8;color:#374151;}
        .syl-hero-intro p{margin:0 0 8px;}

        /* STATS */
        .syl-stats{background:#fff;border-bottom:1px solid #e5e7eb;}
        .syl-stats-grid{max-width:860px;margin:0 auto;padding:0 20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));}
        .syl-stat{padding:20px 8px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px;border-right:1px solid #f3f4f6;}
        .syl-stat:last-child{border-right:none;}
        .syl-stat-ico{width:38px;height:38px;border-radius:10px;background:#eff6ff;color:#2563eb;display:flex;align-items:center;justify-content:center;}
        .syl-stat-val{font-size:1.15rem;font-weight:700;color:#0f172a;line-height:1;}
        .syl-stat-lbl{font-size:11px;color:#9ca3af;font-weight:500;text-transform:uppercase;letter-spacing:.05em;text-align:center;}

        /* BODY */
        .syl-body{max-width:860px;margin:0 auto;padding:32px 20px 72px;display:flex;flex-direction:column;gap:24px;}

        /* CARD */
        .syl-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;}
        .syl-card-hd{padding:16px 20px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;gap:10px;}
        .syl-card-ico{width:32px;height:32px;border-radius:8px;background:#eff6ff;color:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .syl-card-title{font-size:.95rem;font-weight:700;color:#0f172a;margin:0;flex:1;}
        .syl-card-bd{padding:20px;}
        .syl-card-bd-flush{padding:0;}

        /* TABLE */
        .syl-tbl{width:100%;border-collapse:collapse;font-size:13.5px;}
        .syl-tbl thead tr{background:#f9fafb;border-bottom:1px solid #e5e7eb;}
        .syl-tbl thead th{padding:11px 18px;text-align:left;font-size:11px;font-weight:600;color:#6b7280;letter-spacing:.06em;text-transform:uppercase;}
        .syl-tbl tbody tr{border-bottom:1px solid #f3f4f6;}
        .syl-tbl tbody tr:last-child{border-bottom:none;}
        .syl-tbl tbody tr:hover{background:#fafafa;}
        .syl-tbl tbody td{padding:12px 18px;color:#374151;vertical-align:middle;}
        .syl-tbl tbody td:first-child{font-weight:500;color:#0f172a;}
        .syl-tbl .sno{color:#9ca3af;font-weight:400!important;width:48px;}
        .syl-tbl .right{text-align:right;}
        .syl-tbl .bold-row td{font-weight:700;color:#0f172a;background:#f9fafb;border-top:2px solid #e5e7eb;}
        .mark-pill{display:inline-flex;align-items:center;justify-content:center;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;font-weight:700;font-size:12.5px;padding:3px 14px;border-radius:99px;min-width:50px;}

        /* SECTION LABEL */
        .syl-sec-hd{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
        .syl-sec-num{width:26px;height:26px;border-radius:7px;background:#2563eb;color:#fff;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .syl-sec-title{font-size:.9rem;font-weight:700;color:#0f172a;margin:0;flex:1;}
        .syl-sec-hd::after{content:'';flex:1;height:1px;background:#e5e7eb;}

        /* TOPIC LIST */
        .syl-topics{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px 16px;}
        .syl-topics li{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:#374151;padding:7px 0;border-bottom:1px dashed #f3f4f6;line-height:1.5;}
        .syl-topics li .n{width:20px;height:20px;border-radius:5px;background:#eff6ff;color:#2563eb;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}

        /* SUBSECTION */
        .syl-sub{margin-top:22px;}
        .syl-sub-title{font-size:14.5px;font-weight:700;color:#0f172a;margin:0 0 12px;display:flex;align-items:center;gap:8px;}
        .syl-sub-mark{font-size:12px;font-weight:500;color:#6b7280;background:#f9fafb;border:1px solid #e5e7eb;padding:2px 10px;border-radius:99px;}
        .syl-sub-table-wrap{overflow-x:auto;border-radius:8px;border:1px solid #e5e7eb;margin-top:12px;}

        /* PDF */
        .syl-pdf-hd{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;flex:1;}
        .syl-pdf-dl{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;background:#2563eb;color:#fff;font-size:13px;font-weight:600;border-radius:8px;text-decoration:none;transition:background .15s;}
        .syl-pdf-dl:hover{background:#1d4ed8;}
        .syl-pdf-embed{width:100%;height:840px;display:block;border:none;}

        @media(max-width:600px){
          .syl-topics{grid-template-columns:1fr;}
          .syl-stats-grid{grid-template-columns:repeat(3,1fr);}
          .syl-stat{border-right:none;border-bottom:1px solid #f3f4f6;padding:16px 4px;}
        }
      `}</style>

      <div className="syl">

        {/* ══ HERO ══ */}
        <div className="syl-hero">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt={`${fields.faculty}`} className="syl-hero-img" />
          ) : (
            <div className="syl-hero-placeholder">
              <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth=".8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
          )}

          <div className="syl-hero-body">
            {fields.program && (
              <div className="syl-hero-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                {fields.program}
              </div>
            )}

            <h1 className="syl-h1">{fields.faculty} Entrance Syllabus</h1>

            <div className="syl-hero-meta">
              {fields.program && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  Program: {fields.program}
                </span>
              )}
              {fields.program && fields.university && <span className="dot">·</span>}
              {fields.university && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  University: {fields.university}
                </span>
              )}
            </div>

            <a href="#ask" className="syl-ask">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Ask a Question
            </a>

            {fields.intro && (
              <div className="syl-hero-intro">
                {documentToReactComponents(fields.intro)}
              </div>
            )}
          </div>
        </div>

        {/* ══ STATS ══ */}
        {overview.length > 0 && (
          <div className="syl-stats">
            <div className="syl-stats-grid">
              {overview.map((item: any, i: number) => (
                <div key={i} className="syl-stat">
                  <div
                    className="syl-stat-ico"
                    dangerouslySetInnerHTML={{ __html: statSVG(item.label) }}
                  />
                  <div className="syl-stat-val">{item.value}</div>
                  <div className="syl-stat-lbl">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ BODY ══ */}
        <div className="syl-body">

          {/* MARKS DISTRIBUTION */}
          {marksDistribution.length > 0 && (
            <div className="syl-card">
              <div className="syl-card-hd">
                <div className="syl-card-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <h2 className="syl-card-title">
                  {fields.faculty} Subject-Wise Marks Distribution
                </h2>
              </div>
              <div className="syl-card-bd-flush">
                <table className="syl-tbl">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="right">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksDistribution.map((item: any, i: number) => (
                      <tr key={i}>
                        <td>{item.subject}</td>
                        <td className="right">
                          <span className="mark-pill">{item.marks}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYLLABUS SECTIONS */}
          {sections.length > 0 && (
            <div className="syl-card">
              <div className="syl-card-hd">
                <div className="syl-card-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <h2 className="syl-card-title">{fields.faculty} Entrance Syllabus</h2>
              </div>

              <div className="syl-card-bd">
                {sections.map((section: any, si: number) => (
                  <div
                    key={si}
                    style={{ marginBottom: si < sections.length - 1 ? "32px" : 0 }}
                  >
                    <div className="syl-sec-hd">
                      <span className="syl-sec-num">{si + 1}</span>
                      <h3 className="syl-sec-title">{section.title}</h3>
                    </div>

                    {/* plain content → numbered topics */}
                    {section.content && (
                      <ul className="syl-topics">
                        {section.content.map((item: string, ii: number) => (
                          <li key={ii}>
                            <span className="n">{ii + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* subsections */}
                    {section.subsections?.map((sub: any, bi: number) => (
                      <div key={bi} className="syl-sub">
                        <h4 className="syl-sub-title">
                          {sub.title}
                          {sub.marks && (
                            <span className="syl-sub-mark">{sub.marks}</span>
                          )}
                        </h4>

                        {sub.topics && (
                          <ul className="syl-topics">
                            {sub.topics.map((t: string, ti: number) => (
                              <li key={ti}>
                                <span className="n">{ti + 1}</span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}

                        {sub.table && (
                          <div className="syl-sub-table-wrap">
                            <table className="syl-tbl">
                              <thead>
                                <tr>
                                  {sub.table.headers.map((h: string, hi: number) => (
                                    <th key={hi}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sub.table.rows.map((row: string[], ri: number) => {
                                  const isTotal =
                                    row[0]?.trim() === "" ||
                                    String(row[1])?.toLowerCase().includes("total");
                                  return (
                                    <tr key={ri} className={isTotal ? "bold-row" : ""}>
                                      {row.map((cell: string, ci: number) => (
                                        <td
                                          key={ci}
                                          className={[
                                            ci === 0 && !isTotal ? "sno" : "",
                                            ci === row.length - 1 ? "right" : "",
                                          ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF */}
          {pdfUrl && (
            <div className="syl-card">
              <div className="syl-card-hd">
                <div className="syl-card-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="syl-pdf-hd">
                  <h2 className="syl-card-title" style={{ margin: 0 }}>
                    Official Syllabus PDF
                  </h2>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="syl-pdf-dl"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </a>
                </div>
              </div>
              <iframe
                src={pdfUrl}
                className="syl-pdf-embed"
                title={`${fields.faculty} Syllabus PDF`}
              />
            </div>
          )}

        </div>
      </div>
    </>
  );
}