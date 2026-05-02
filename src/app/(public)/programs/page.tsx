import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Program } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Programs — AI, Web Dev, Cybersecurity, UI/UX Training in Nepal",
  description:
    "Explore in-demand tech training & internship programs at Leafclutch Technologies: AI & Machine Learning, Full Stack Web Development, Cybersecurity, UI/UX Design, Graphic Design, and Data Science. Best IT programs in Bhairahawa, Butwal & Nepal.",
  keywords: [
    "IT programs Nepal", "AI program Bhairahawa", "web development training Butwal",
    "cybersecurity program Nepal", "UI UX design program Nepal",
    "graphic design training Bhairahawa", "data science program Butwal",
    "programming programs Nepal", "coding bootcamp Bhairahawa", "tech training Rupandehi",
  ],
  openGraph: {
    title: "IT Training Programs — Leafclutch Technologies Nepal",
    description: "In-demand tech programs: AI, Web Dev, Cybersecurity, UI/UX, Graphic Design & Data Science. Bhairahawa & Butwal, Nepal.",
    url: "https://leafclutchtech.com.np/programs",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/programs" },
};

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

export default async function ProgramsPage() {
  const supabase = createPublicSupabase();
  const { data: programs } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<Program[]>();

  return (
    <>
      <PageHero
        badge="OUR PROGRAMS"
        title="All Programs"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "PROGRAMS" }]}
      />

      <section className="programs-page-section">
        <div className="container">
          <div className="programs-grid">
            {(programs ?? []).map((program) => {
              const onlinePrice = program.price_online ?? program.price;
              const onsitePrice = program.price_onsite ?? program.price;
              const isPaid = program.program_type === "paid_internship";
              const hasDualPrice = onlinePrice !== onsitePrice;

              return (
                <div className="program-card" key={program.slug}>
                  <div
                    className="program-image"
                    style={{ backgroundImage: `url(${program.image_url})` }}
                  >
                    <span className="program-badge">{program.badge}</span>
                    {isPaid && (
                      <span className="program-paid-badge">
                        <i className="fas fa-money-bill-wave" /> Paid Internship
                      </span>
                    )}
                  </div>
                  <div className="program-body">
                    <h3 className="program-title">{program.title}</h3>
                    <p className="program-desc">{program.description}</p>
                    <div className="program-meta">
                      <span><i className="fas fa-clock" /> {program.duration}</span>
                      <span><i className="fas fa-signal" /> {program.level}</span>
                    </div>
                    <div className="program-pricing">
                      {hasDualPrice ? (
                        <div className="program-pricing-dual">
                          <div className="program-pricing-mode">
                            <span className="mode-label"><i className="fas fa-laptop" /> Online</span>
                            <span className="mode-price">{formatNPR(onlinePrice)}</span>
                          </div>
                          <div className="program-pricing-divider" />
                          <div className="program-pricing-mode">
                            <span className="mode-label"><i className="fas fa-building" /> On-Site</span>
                            <span className="mode-price">{formatNPR(onsitePrice)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="program-pricing-total">
                          {formatNPR(onlinePrice)} <span>Total Fee</span>
                        </div>
                      )}
                      <div className="program-pricing-enroll">
                        Enroll with just{" "}
                        <strong>{formatNPR(program.initial_fee)}</strong>
                      </div>
                    </div>
                    <div className="program-card-actions">
                      <Link href={`/programs/${program.slug}`} className="btn btn-outline-primary">
                        View Program
                      </Link>
                      <Link
                        href={`/enroll?program=${encodeURIComponent(program.title)}`}
                        className="btn btn-primary"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="program-cta">
        <div className="program-cta-content">
          <h2>Not Sure Which Program Is Right for You?</h2>
          <p>
            Reach out to our team and we&apos;ll help you find the perfect
            program based on your interests and career goals.
          </p>
          <div className="cta-buttons">
            <Link href="/contact" className="btn btn-white">Get in Touch</Link>
            <a
              href="https://api.whatsapp.com/send/?phone=9779766715768&text=Hi%21+I+need+help+choosing+a+program.&type=phone_number&app_absent=0"
              className="btn btn-outline-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
