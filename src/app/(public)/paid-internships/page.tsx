
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { PaidInternship } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Paid Internships — Real-World Experience with Industry Mentorship | Leafclutch Technologies",
  description: "Apply for paid internship roles at Leafclutch Technologies in Bhairahawa, Nepal. Frontend, Backend, AI/ML, Design, and more — affordable fees for real-world project experience.",
  keywords: ["paid internship Nepal", "tech internship Bhairahawa", "tech internship Butwal", "paid internship 2024 Nepal", "IT internship Nepal"],
  openGraph: { title: "Paid Internships | Leafclutch Technologies", description: "Open paid internship roles in IT & Design. Apply now.", url: "https://leafclutchtech.com.np/paid-internships" },
  alternates: { canonical: "https://leafclutchtech.com.np/paid-internships" },
};

const modeColors: Record<string, { bg: string; color: string; icon: string }> = {
  "On-site": { bg: "#dbeafe", color: "#1d4ed8", icon: "fa-building" },
  "Remote":  { bg: "#ede9fe", color: "#7c3aed", icon: "fa-laptop" },
  "Hybrid":  { bg: "#ccfbf1", color: "#0d9488", icon: "fa-network-wired" },
};

function RoleCard({ role }: { role: PaidInternship }) {
  const m = modeColors[role.mode] ?? modeColors["On-site"];
  return (
    <div className="pi-card">
      <div className="pi-card-accent" />
      {/* Fee badge */}
      <div className="pi-card-fee">
        <span className="pi-fee-label">Internship Fee</span>
        <span className="pi-fee-amount">{role.stipend}</span>
      </div>
      {/* Title + meta */}
      <div className="pi-card-header">
        <div className="pi-card-icon"><i className="fas fa-briefcase" /></div>
        <h3 className="pi-card-title">{role.title}</h3>
      </div>
      <div className="pi-card-metas">
        <span className="pi-meta"><i className="fas fa-clock" /> {role.duration}</span>
        <span className="pi-meta pi-meta-mode" style={{ background: m.bg, color: m.color }}>
          <i className={`fas ${m.icon}`} /> {role.mode}
        </span>
        <span className="pi-meta"><i className="fas fa-users" /> {role.openings}</span>
      </div>
      {/* Description */}
      <p className="pi-card-desc">{role.description}</p>
      {/* Skills */}
      <div className="pi-card-skills">
        {role.skills_required?.slice(0, 4).map(s => (
          <span key={s} className="pi-skill">{s}</span>
        ))}
        {(role.skills_required?.length ?? 0) > 4 && (
          <span className="pi-skill-more">+{(role.skills_required?.length ?? 0) - 4}</span>
        )}
      </div>
      {/* Actions */}
      <div className="pi-card-actions">
        <Link href={`/paid-internships/${role.slug}`} className="pi-btn pi-btn-outline">
          View Details
        </Link>
        <Link href={`/enroll?type=paid_internship&role=${encodeURIComponent(role.title)}`} className="pi-btn pi-btn-primary">
          Apply Now <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  );
}

export default async function PaidInternshipsPage() {
  const supabase = createPublicSupabase();
  const { data: roles } = await supabase
    .from("paid_internships")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .returns<PaidInternship[]>();

  return (
    <>
      <PageHero
        badge="PAID INTERNSHIPS"
        title="Open Paid Internship Roles"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "PAID INTERNSHIPS" }]}
      />

      <section className="pi-section">
        <div className="container">
          {/* Intro banner */}
          <div className="pi-intro">
            <div className="pi-intro-icon"><i className="fas fa-briefcase" /></div>
            <p>These are competitive paid internship roles where you work on real company projects alongside experienced developers. An internship fee applies — and you walk away with professional experience, a certificate, and potential job offers.</p>
          </div>

          {/* Roles */}
          {!roles || roles.length === 0 ? (
            <div className="pi-empty">
              <div className="pi-empty-icon"><i className="fas fa-briefcase" /></div>
              <h3>No open roles right now</h3>
              <p>Check back soon or follow us on social media for updates on new openings.</p>
              <Link href="/contact" className="pi-btn pi-btn-primary">Get Notified</Link>
            </div>
          ) : (
            <div className="pi-roles-grid">
              {roles.map(role => <RoleCard key={role.slug} role={role} />)}
            </div>
          )}

          {/* Comparison */}
          <div className="pi-compare">
            <h3 className="pi-compare-title">
              <i className="fas fa-info-circle" /> How are Paid Internships different from Training & Internship?
            </h3>
            <div className="pi-compare-grid">
              <div className="pi-compare-item">
                <div className="pi-compare-icon pi-compare-icon--training"><i className="fas fa-graduation-cap" /></div>
                <div>
                  <strong>Training & Internship</strong>
                  <p>You pay a course fee, get trained intensively for 1 month, then complete a 2-month internship. Certificate + possible job offer.</p>
                  <Link href="/programs">View Programs →</Link>
                </div>
              </div>
              <div className="pi-compare-item">
                <div className="pi-compare-icon pi-compare-icon--paid"><i className="fas fa-briefcase" /></div>
                <div>
                  <strong>Paid Internship</strong>
                  <p>Competitive selection based on skills. Selected interns pay an internship fee and work on live projects with mentorship.</p>
                  <Link href="/enroll?type=paid_internship">Apply Now →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
