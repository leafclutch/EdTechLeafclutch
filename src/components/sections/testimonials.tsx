import { createPublicSupabase } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/supabase/types";

export async function TestimonialsSection() {
  const supabase = createPublicSupabase();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<Testimonial[]>();

  if (!testimonials?.length) return null;

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <span className="section-badge">TESTIMONIALS</span>
          <h2 className="section-title">What Our Students Say</h2>
          <p className="section-desc">
            Hear from students and professionals who have transformed their
            careers through our programs.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p>&ldquo;{t.content}&rdquo;</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.role.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
