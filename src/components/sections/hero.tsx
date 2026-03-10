import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";

interface HeroSettings {
  badge: string;
  title: string;
  description: string;
}

const defaults: HeroSettings = {
  badge: "LEAFCLUTCH TECHNOLOGIES PVT. LTD.",
  title: "Empowering Nepal's Future with Technology & Innovation",
  description:
    "Industry-focused training and internship programs in AI, Web Development, Cybersecurity, UI/UX, and more. Learn from experts, build real projects, and launch your tech career from Bhairahawa, Butwal, or anywhere online.",
};

export async function HeroSection() {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero")
    .single();
  const hero: HeroSettings = data?.value
    ? { ...defaults, ...(data.value as unknown as HeroSettings) }
    : defaults;

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="section-badge">{hero.badge}</span>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-desc">{hero.description}</p>
            <div className="hero-buttons">
              <Link href="/courses" className="btn btn-primary">
                Explore Programs
              </Link>
              <Link href="/contact" className="btn btn-outline-dark">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <div className="hero-img-grid">
              <div className="hero-img-item">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop"
                  alt="Students learning AI and technology at Leafclutch Technologies Nepal"
                />
              </div>
              <div className="hero-img-item">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop"
                  alt="Web development internship training in Bhairahawa"
                />
              </div>
              <div className="hero-img-item">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop"
                  alt="Technology training and mentorship in Butwal Nepal"
                />
              </div>
              <div className="hero-img-item">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop"
                  alt="Online internship program at best IT company in Nepal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
