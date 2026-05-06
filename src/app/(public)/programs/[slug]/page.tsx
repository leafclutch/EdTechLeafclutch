
import Link from "next/link";
import { notFound } from "next/navigation";
import { CurriculumAccordion } from "@/components/programs/curriculum-accordion";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Program } from "@/lib/supabase/types";

export const revalidate = 60;

interface RequirementSection {
  title: string;
  items: string[];
}
interface CurriculumModule {
  title: string;
  lectures: string[];
}
interface LearningOutcome {
  title: string;
  icon: string;
}

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

async function getProgram(slug: string): Promise<Program | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<Program>();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.title} Program \u2014 IT Training in Bhairahawa & Butwal, Nepal`,
    description: `${program.description} Enroll in our ${program.title} training & internship program at Leafclutch Technologies, Bhairahawa, Nepal. ${program.level} level. Price: ${formatNPR(program.price)}.`,
    keywords: [
      `${program.title} program Nepal`,
      `${program.title} training Bhairahawa`,
      `${program.title} internship Butwal`,
      `learn ${program.title} Nepal`,
      "IT training Nepal",
      "Leafclutch Technologies",
    ],
    openGraph: {
      title: `${program.title} Program | Leafclutch Technologies Nepal`,
      description: program.description,
      url: `https://leafclutchtech.com.np/programs/${program.slug}`,
      images: [
        {
          url: program.image_url,
          width: 700,
          height: 500,
          alt: program.title,
        },
      ],
    },
    alternates: {
      canonical: `https://leafclutchtech.com.np/programs/${program.slug}`,
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const requirements =
    (program.requirements as unknown as RequirementSection[]) ?? [];
  const curriculum = (program.curriculum as unknown as CurriculumModule[]) ?? [];
  const outcomes =
    (program.learning_outcomes as unknown as LearningOutcome[]) ?? [];
  const whatsappText = encodeURIComponent(
    `Hi! I'm interested in the ${program.title} program.`,
  );
  const onlinePrice = program.price_online ?? program.price;
  const onsitePrice = program.price_onsite ?? program.price;
  const hybridPrice = program.price_hybrid ?? null;
  const isPaid = program.program_type === "paid_internship";
  const hasDualPrice = onlinePrice !== onsitePrice || hybridPrice;

  return (
    <>
      {/* Program Hero */}
      <section className="program-page-hero">
        <div className="container">
          <div className="program-hero-grid">
            <div className="program-hero-content">
              <div className="program-hero-badges">
                <span className="section-badge">{program.badge}</span>
                {isPaid && (
                  <span className="program-type-badge program-type-badge--paid">
                    <i className="fas fa-money-bill-wave" /> Paid Internship
                  </span>
                )}
              </div>
              <h1 className="program-hero-title">{program.title}</h1>
              <p className="program-hero-desc">{program.hero_description}</p>
              <div className="program-hero-meta">
                <div className="program-hero-meta-item">
                  <i className="fas fa-clock" /> {program.duration}
                </div>
                <div className="program-hero-meta-item">
                  <i className="fas fa-signal" /> {program.level}
                </div>
                <div className="program-hero-meta-item">
                  <i className="fas fa-laptop-house" /> {program.mode}
                </div>
                <div className="program-hero-meta-item">
                  <i className="fas fa-certificate" /> Certificate Included
                </div>
              </div>
              <div className="program-hero-pricing">
                {hasDualPrice ? (
                  <div className="program-hero-dual-price">
                    <div className="program-hero-price-mode">
                      <span className="price-mode-label"><i className="fas fa-laptop" /> Online</span>
                      <span className="price-mode-value">{formatNPR(onlinePrice)}</span>
                    </div>
                    <div className="price-mode-sep" />
                    <div className="program-hero-price-mode">
                      <span className="price-mode-label"><i className="fas fa-building" /> On-Site</span>
                      <span className="price-mode-value">{formatNPR(onsitePrice)}</span>
                    </div>
                    {hybridPrice && (
                      <>
                        <div className="price-mode-sep" />
                        <div className="program-hero-price-mode">
                          <span className="price-mode-label"><i className="fas fa-laptop-house" /> Hybrid</span>
                          <span className="price-mode-value">{formatNPR(hybridPrice)}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="program-hero-price">
                    {formatNPR(onlinePrice)} <span>Total Fee</span>
                  </div>
                )}
                <div className="program-hero-enroll-price">
                  Enroll with just{" "}
                  <strong>{formatNPR(program.initial_fee)}</strong>
                </div>
                <div className="program-hero-installment">
                  Remaining fee payable in 5 easy installments
                </div>
              </div>
              <div className="program-hero-buttons">
                <Link
                  href={`/enroll?program=${encodeURIComponent(program.title)}`}
                  className="btn btn-primary"
                >
                  Enroll Now <i className="fas fa-arrow-right"></i>
                </Link>
                <a
                  href={`https://api.whatsapp.com/send/?phone=9779766715768&text=${whatsappText}&type=phone_number&app_absent=0`}
                  className="btn btn-outline-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i> Ask on WhatsApp
                </a>
              </div>
            </div>
            <div className="program-hero-image">
              <img
                src={program.image_url}
                alt={`${program.title} program at Leafclutch Technologies`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="program-section">
        <div className="container">
          <div className="program-section-header">
            <span className="section-badge">REQUIREMENTS</span>
            <h2 className="section-title">What You Need to Get Started</h2>
            <p className="section-desc">
              New to this field? No worries — this program is designed for
              beginners.
            </p>
          </div>
          <div className="requirements-grid">
            {requirements.map((req, idx) => (
              <div
                className={`requirements-card${idx === 0 ? " beginner-card" : ""}`}
                key={idx}
              >
                <h3>
                  <i
                    className={`fas ${idx === 0 ? "fa-seedling" : "fa-tools"}`}
                  ></i>{" "}
                  {req.title}
                </h3>
                <ul>
                  {req.items.map((item, i) => (
                    <li key={i}>
                      <i className="fas fa-check"></i> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="program-section">
        <div className="container">
          <div className="program-section-header">
            <span className="section-badge">CURRICULUM</span>
            <h2 className="section-title">Program Content</h2>
            <p className="section-desc">{program.description}</p>
          </div>
          <CurriculumAccordion sections={curriculum} />

          {/* Recommended Udemy Course */}
          {program.udemy_title && (
            <div className="recommended-program-card">
              <div className="recommended-program-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="recommended-program-content">
                <div className="recommended-program-label">
                  Recommended Udemy Course
                </div>
                <div className="recommended-program-title">
                  {program.udemy_title}
                </div>
                <p className="recommended-program-note">
                  We recommend this for our training. If you prefer a
                  different Udemy course, let us know — we&apos;ll provide that
                  one instead.
                </p>
              </div>
              <a
                href={program.udemy_url}
                className="recommended-program-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-external-link-alt"></i> View on Udemy
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="program-section">
        <div className="container">
          <div className="program-section-header">
            <span className="section-badge">OUTCOMES</span>
            <h2 className="section-title">What You&apos;ll Be Able to Do</h2>
          </div>
          <div className="outcomes-grid">
            {outcomes.map((o, i) => (
              <div className="outcome-card" key={i}>
                <div className="outcome-icon">
                  <i className={o.icon}></i>
                </div>
                <h3>{o.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* After Enrollment */}
      <section className="enroll-benefits-section">
        <div className="container">
          <div className="enroll-benefits-header">
            <span className="section-badge">AFTER ENROLLMENT</span>
            <h2 className="section-title">What You&apos;ll Get</h2>
            <p className="section-desc">
              From day one, you&apos;ll have access to resources and support
              that set you up for success.
            </p>
          </div>
          <div className="enroll-benefits-grid">
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fab fa-youtube"></i>
              </div>
              <h3>Lifetime Udemy Course</h3>
              <p>
                Get a premium Udemy course related to your chosen training
                program — yours to keep forever.
              </p>
              <span className="enroll-benefit-highlight">Premium</span>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Dedicated Mentor Support</h3>
              <p>
                Get guidance from experienced industry mentors who&apos;ll help
                you every step of the way.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Company Workflow Experience</h3>
              <p>
                Understand how a real IT company operates — from project
                planning to deployment.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>1 Month Training + 2 Months Internship</h3>
              <p>
                One month of intensive training followed by two months of
                hands-on training and internship opportunity.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Connections &amp; Exposure</h3>
              <p>
                Build your professional network and gain valuable industry
                exposure through real projects.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3>Potential Job Offer</h3>
              <p>
                Best performing candidates can receive a direct job offer from
                Leafclutch Technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* After Completion */}
      <section className="enroll-benefits-section enroll-benefits-section--alt">
        <div className="container">
          <div className="enroll-benefits-header">
            <span className="section-badge">AFTER COMPLETION</span>
            <h2 className="section-title">What You&apos;ll Walk Away With</h2>
            <p className="section-desc">
              Complete the program and leave with tangible skills, credentials,
              and opportunities.
            </p>
          </div>
          <div className="enroll-benefits-grid">
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Completion Certificate</h3>
              <p>
                Receive an official completion certificate from Leafclutch
                Technologies for your portfolio.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Training &amp; Internship Certificates</h3>
              <p>
                Get separate training certificate and internship certificate to
                showcase your experience.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Company &amp; Tools Knowledge</h3>
              <p>
                Gain real understanding of how companies run and hands-on
                experience with industry tools.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Professional Experience</h3>
              <p>
                Add real professional work experience to your resume — not just
                theory, but actual project work.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>Ongoing Team Support</h3>
              <p>
                Our team continues to support you even after the program —
                career advice, referrals, and more.
              </p>
            </div>
            <div className="enroll-benefit-card">
              <div className="enroll-benefit-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <h3>Direct Job Offer</h3>
              <p>
                If a vacancy is available, you can get a direct job offer — no
                interview needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
