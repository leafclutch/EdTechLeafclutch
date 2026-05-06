import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { PaidInternship } from "@/lib/supabase/types";
import { PageHero } from "@/components/ui/page-hero";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicSupabase();
  const { data } = await supabase.from("paid_internships").select("title,description").eq("slug", slug).single<PaidInternship>();
  if (!data) return { title: "Role Not Found" };
  return {
    title: `${data.title} — Paid Internship | Leafclutch Technologies`,
    description: data.description?.slice(0, 160),
  };
}

const modeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  "On-site": { color: "#1d4ed8", bg: "#dbeafe", icon: "fa-building" },
  "Remote":  { color: "#7c3aed", bg: "#ede9fe", icon: "fa-laptop" },
  "Hybrid":  { color: "#0d9488", bg: "#ccfbf1", icon: "fa-network-wired" },
};

export default async function PaidInternshipDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createPublicSupabase();
  const { data: role } = await supabase
    .from("paid_internships")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<PaidInternship>();

  if (!role) notFound();

  const mode = modeConfig[role.mode] ?? modeConfig["On-site"];
  const hasActiveOffer = role.offer_label && (!role.offer_deadline || new Date(role.offer_deadline) >= new Date());

  return (
    <>
      <PageHero
        badge="PAID INTERNSHIP"
        title={role.title}
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "PAID INTERNSHIPS", href: "/paid-internships" },
          { label: role.title.toUpperCase() },
        ]}
      />

      <section style={{ padding: "64px 0 96px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
            {/* ===== Main Content ===== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Meta badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 18px", borderRadius: "24px", fontSize: "13px", fontWeight: 700, background: mode.bg, color: mode.color }}>
                  <i className={`fas ${mode.icon}`} /> {role.mode}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 18px", borderRadius: "24px", fontSize: "13px", fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>
                  <i className="fas fa-clock" /> {role.duration}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 18px", borderRadius: "24px", fontSize: "13px", fontWeight: 700, background: "#d1fae5", color: "#065f46" }}>
                  <i className="fas fa-users" /> {role.openings} Opening{role.openings !== 1 ? "s" : ""}
                </span>
              </div>

              {/* About */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px 36px" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--dark)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    <i className="fas fa-info-circle" />
                  </span>
                  About This Role
                </h2>
                <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.8 }}>{role.description}</p>
              </div>

              {/* Requirements */}
              {role.requirements && role.requirements.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px 36px" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #047857)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      <i className="fas fa-clipboard-check" />
                    </span>
                    Requirements
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {role.requirements.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "var(--text)", lineHeight: 1.65 }}>
                        <span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>
                          <i className="fas fa-check" />
                        </span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {role.skills_required && role.skills_required.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px 36px" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #4338ca)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      <i className="fas fa-code" />
                    </span>
                    Skills Required
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {role.skills_required.map(s => (
                      <span key={s} style={{ fontSize: "13px", fontWeight: 600, background: "linear-gradient(135deg, #f0f4ff, #e8eeff)", color: "var(--primary)", padding: "8px 18px", borderRadius: "24px", border: "1px solid #c7d2fe" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== Sidebar ===== */}
            <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Apply Card */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                {/* Fee Header */}
                <div style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "#fff", padding: "28px 28px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.75, marginBottom: "6px" }}>Internship Fee</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800 }}>{role.stipend}</div>
                </div>

                {/* Info rows */}
                <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-light)" }}>
                      <i className="fas fa-clock" style={{ width: "16px", color: "var(--primary)" }} /> Duration
                    </span>
                    <strong style={{ color: "var(--dark)" }}>{role.duration}</strong>
                  </div>
                  <div style={{ height: "1px", background: "#f1f5f9" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-light)" }}>
                      <i className={`fas ${mode.icon}`} style={{ width: "16px", color: "var(--primary)" }} /> Mode
                    </span>
                    <strong style={{ color: "var(--dark)" }}>{role.mode}</strong>
                  </div>
                  <div style={{ height: "1px", background: "#f1f5f9" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-light)" }}>
                      <i className="fas fa-users" style={{ width: "16px", color: "var(--primary)" }} /> Openings
                    </span>
                    <strong style={{ color: "var(--dark)" }}>{role.openings}</strong>
                  </div>
                </div>

                {/* Offer strip */}
                {hasActiveOffer && (
                  <div style={{ margin: "0 24px 16px", background: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "1.5px solid #fbbf24", borderRadius: "12px", padding: "12px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "13px", color: "#78350f" }}>
                    <i className="fas fa-fire" style={{ color: "#f59e0b" }} />
                    <span style={{ fontWeight: 700 }}>{role.offer_label}</span>
                    {role.offer_discount_percent ? <span style={{ background: "#f59e0b", color: "#fff", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 700 }}>{role.offer_discount_percent}% off</span> : null}
                    {role.offer_discount_flat ? <span style={{ background: "#f59e0b", color: "#fff", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 700 }}>NPR {role.offer_discount_flat.toLocaleString()} off</span> : null}
                    {role.offer_deadline ? <span style={{ color: "#b45309", fontWeight: 600, fontSize: "12px" }}>· Valid until {new Date(role.offer_deadline).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</span> : null}
                  </div>
                )}

                {/* Apply button */}
                <div style={{ padding: "0 24px 24px" }}>
                  <Link
                    href={`/enroll?type=paid_internship&role=${encodeURIComponent(role.title)}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 24px", borderRadius: "14px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "#fff", fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 24px rgba(28,70,200,0.25)", transition: "all 0.3s" }}
                  >
                    <i className="fas fa-paper-plane" /> Apply Now
                  </Link>
                  <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "14px", display: "flex", alignItems: "flex-start", gap: "6px", lineHeight: 1.5 }}>
                    <i className="fas fa-info-circle" style={{ color: "var(--primary)", marginTop: "2px", fontSize: "11px", flexShrink: 0 }} />
                    You&apos;ll need your LinkedIn, GitHub profile, and CV link to apply.
                  </p>
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/paid-internships"
                style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}
              >
                <i className="fas fa-arrow-left" /> View All Open Roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .container > div[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
