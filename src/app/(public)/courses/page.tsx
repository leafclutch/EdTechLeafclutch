import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Course } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Courses — AI, Web Dev, Cybersecurity, UI/UX Training in Nepal",
  description:
    "Explore in-demand tech training & internship programs at Leafclutch Technologies: AI & Machine Learning, Full Stack Web Development, Cybersecurity, UI/UX Design, Graphic Design, and Data Science. Best IT courses in Bhairahawa, Butwal & Nepal.",
  keywords: [
    "IT courses Nepal",
    "AI course Bhairahawa",
    "web development training Butwal",
    "cybersecurity course Nepal",
    "UI UX design course Nepal",
    "graphic design training Bhairahawa",
    "data science course Butwal",
    "programming courses Nepal",
    "coding bootcamp Bhairahawa",
    "tech training Rupandehi",
  ],
  openGraph: {
    title: "IT Training Courses — Leafclutch Technologies Nepal",
    description:
      "In-demand tech courses: AI, Web Dev, Cybersecurity, UI/UX, Graphic Design & Data Science. Bhairahawa & Butwal, Nepal.",
    url: "https://leafclutchtech.com.np/courses",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/courses" },
};

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

export default async function CoursesPage() {
  const supabase = createPublicSupabase();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<Course[]>();

  return (
    <>
      <PageHero
        badge="OUR PROGRAMS"
        title="All Courses"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "COURSES" }]}
      />

      <section className="courses-page-section">
        <div className="container">
          <div className="courses-grid">
            {(courses ?? []).map((course) => (
              <div className="course-card" key={course.slug}>
                <div
                  className="course-image"
                  style={{ backgroundImage: `url(${course.image_url})` }}
                >
                  <span className="course-badge">{course.badge}</span>
                </div>
                <div className="course-body">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-meta">
                    <span>
                      <i className="fas fa-clock"></i> {course.duration}
                    </span>
                    <span>
                      <i className="fas fa-signal"></i> {course.level}
                    </span>
                  </div>
                  <div className="course-pricing">
                    <div className="course-pricing-total">
                      {formatNPR(course.price)} <span>Total Fee</span>
                    </div>
                    <div className="course-pricing-enroll">
                      Enroll with just{" "}
                      <strong>{formatNPR(course.initial_fee)}</strong>
                    </div>
                  </div>
                  <div className="course-card-actions">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="btn btn-outline-primary"
                    >
                      View Program
                    </Link>
                    <Link
                      href={`/enroll?course=${encodeURIComponent(course.title)}`}
                      className="btn btn-primary"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course CTA */}
      <section className="course-cta">
        <div className="course-cta-content">
          <h2>Not Sure Which Program Is Right for You?</h2>
          <p>
            Reach out to our team and we&apos;ll help you find the perfect
            program based on your interests and career goals.
          </p>
          <div className="cta-buttons">
            <Link href="/contact" className="btn btn-white">
              Get in Touch
            </Link>
            <a
              href="https://api.whatsapp.com/send/?phone=9779766715768&text=Hi%21+I+need+help+choosing+a+program.&type=phone_number&app_absent=0"
              className="btn btn-outline-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
