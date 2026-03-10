import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Course } from "@/lib/supabase/types";

export async function CoursesSection() {
  const supabase = createPublicSupabase();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<Course[]>();

  return (
    <section className="courses" id="courses">
      <div className="container">
        <div className="courses-header">
          <div className="courses-header-left">
            <span className="section-badge">OUR PROGRAMS</span>
            <h2 className="section-title">
              Training &amp; Internship Programs
            </h2>
          </div>
          <div className="courses-header-right"></div>
        </div>
        <div className="courses-grid">
          {(courses ?? []).map((course) => (
            <div key={course.slug} className="course-card">
              <div
                className="course-image"
                style={{ backgroundImage: `url('${course.image_url}')` }}
              >
                <div className="course-overlay">
                  <div className="course-category-badge">{course.badge}</div>
                </div>
              </div>
              <div className="course-body">
                <h3 className="course-title">{course.title}</h3>
                <ul className="course-features">
                  {(course.features ?? []).map((f: string) => (
                    <li key={f}>
                      <i className="fas fa-check-circle"></i> {f}
                    </li>
                  ))}
                </ul>
                <div className="course-meta">
                  <span>
                    <i className="fas fa-clock"></i> {course.duration}
                  </span>
                  <span>
                    <i className="fas fa-signal"></i> {course.level}
                  </span>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn btn-primary btn-block"
                >
                  View Program <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
