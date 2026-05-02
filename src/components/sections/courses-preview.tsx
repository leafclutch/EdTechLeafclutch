import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Program } from "@/lib/supabase/types";

export async function ProgramsSection() {
  const supabase = createPublicSupabase();
  const { data: programs } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<Program[]>();

  return (
    <section className="programs" id="programs">
      <div className="container">
        <div className="programs-header">
          <div className="programs-header-left">
            <span className="section-badge">OUR PROGRAMS</span>
            <h2 className="section-title">
              Training &amp; Internship Programs
            </h2>
          </div>
          <div className="programs-header-right"></div>
        </div>
        <div className="programs-grid">
          {(programs ?? []).map((program) => (
            <div key={program.slug} className="program-card">
              <div
                className="program-image"
                style={{ backgroundImage: `url('${program.image_url}')` }}
              >
                <div className="program-overlay">
                  <div className="program-category-badge">{program.badge}</div>
                </div>
              </div>
              <div className="program-body">
                <h3 className="program-title">{program.title}</h3>
                <ul className="program-features">
                  {(program.features ?? []).map((f: string) => (
                    <li key={f}>
                      <i className="fas fa-check-circle"></i> {f}
                    </li>
                  ))}
                </ul>
                <div className="program-meta">
                  <span>
                    <i className="fas fa-clock"></i> {program.duration}
                  </span>
                  <span>
                    <i className="fas fa-signal"></i> {program.level}
                  </span>
                </div>
                <Link
                  href={`/programs/${program.slug}`}
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
