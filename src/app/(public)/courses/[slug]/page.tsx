export const runtime = "edge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CurriculumAccordion } from "@/components/courses/curriculum-accordion";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Course } from "@/lib/supabase/types";

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

async function getCourse(slug: string): Promise<Course | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<Course>();
  return data;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} Course \u2014 IT Training in Bhairahawa & Butwal, Nepal`,
    description: `${course.description} Enroll in our ${course.title} training & internship program at Leafclutch Technologies, Bhairahawa, Nepal. ${course.level} level. Price: ${formatNPR(course.price)}.`,
    keywords: [
      `${course.title} course Nepal`,
      `${course.title} training Bhairahawa`,
      `${course.title} internship Butwal`,
      `learn ${course.title} Nepal`,
      "IT training Nepal",
      "Leafclutch Technologies",
    ],
    openGraph: {
      title: `${course.title} Course | Leafclutch Technologies Nepal`,
      description: course.description,
      url: `https://leafclutchtech.com.np/courses/${course.slug}`,
      images: [
        {
          url: course.image_url,
          width: 700,
          height: 500,
          alt: course.title,
        },
      ],
    },
    alternates: {
      canonical: `https://leafclutchtech.com.np/courses/${course.slug}`,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const requirements =
    (course.requirements as unknown as RequirementSection[]) ?? [];
  const curriculum = (course.curriculum as unknown as CurriculumModule[]) ?? [];
  const outcomes =
    (course.learning_outcomes as unknown as LearningOutcome[]) ?? [];
  const whatsappText = encodeURIComponent(
    `Hi! I'm interested in the ${course.title} course.`,
  );

  return (
    <>
      {/* Course Hero */}
      <section className="course-page-hero">
        <div className="container">
          <div className="course-hero-grid">
            <div className="course-hero-content">
              <span className="section-badge">{course.badge}</span>
              <h1 className="course-hero-title">{course.title}</h1>
              <p className="course-hero-desc">{course.hero_description}</p>
              <div className="course-hero-meta">
                <div className="course-hero-meta-item">
                  <i className="fas fa-clock"></i> {course.duration}
                </div>
                <div className="course-hero-meta-item">
                  <i className="fas fa-signal"></i> {course.level}
                </div>
                <div className="course-hero-meta-item">
                  <i className="fas fa-laptop-house"></i> {course.mode}
                </div>
                <div className="course-hero-meta-item">
                  <i className="fas fa-certificate"></i> Certificate Included
                </div>
              </div>
              <div className="course-hero-pricing">
                <div className="course-hero-price">
                  {formatNPR(course.price)} <span>Total Fee</span>
                </div>
                <div className="course-hero-enroll-price">
                  Enroll with just{" "}
                  <strong>{formatNPR(course.initial_fee)}</strong>
                </div>
                <div className="course-hero-installment">
                  Remaining fee payable in 5 easy installments
                </div>
              </div>
              <div className="course-hero-buttons">
                <Link
                  href={`/enroll?course=${encodeURIComponent(course.title)}`}
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
            <div className="course-hero-image">
              <img
                src={course.image_url}
                alt={`${course.title} course at Leafclutch Technologies`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="course-section">
        <div className="container">
          <div className="course-section-header">
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
      <section className="course-section">
        <div className="container">
          <div className="course-section-header">
            <span className="section-badge">CURRICULUM</span>
            <h2 className="section-title">Course Content</h2>
            <p className="section-desc">{course.description}</p>
          </div>
          <CurriculumAccordion sections={curriculum} />

          {/* Recommended Udemy Course */}
          {course.udemy_title && (
            <div className="recommended-course-card">
              <div className="recommended-course-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="recommended-course-content">
                <div className="recommended-course-label">
                  Recommended Udemy Course
                </div>
                <div className="recommended-course-title">
                  {course.udemy_title}
                </div>
                <p className="recommended-course-note">
                  We recommend this course for our training. If you prefer a
                  different Udemy course, let us know — we&apos;ll provide that
                  one instead.
                </p>
              </div>
              <a
                href={course.udemy_url}
                className="recommended-course-link"
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
      <section className="course-section">
        <div className="container">
          <div className="course-section-header">
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
