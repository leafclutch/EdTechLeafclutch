import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — IT Training & Internship Program in Bhairahawa, Butwal",
  description:
    "Leafclutch Technologies is a leading IT company based in Bhairahawa & Butwal, Nepal. We offer a 3-month Training & Internship Program with expert mentorship, real-world projects, certificates, and job placement support in AI, Web Development, Cybersecurity, UI/UX & more.",
  keywords: [
    "about Leafclutch Technologies",
    "IT company Bhairahawa",
    "software company Butwal",
    "tech company Nepal",
    "training program Nepal",
    "internship program Bhairahawa Butwal",
    "IT training Rupandehi",
  ],
  openGraph: {
    title: "About Leafclutch Technologies — IT Training & Internship in Nepal",
    description:
      "3-month Training & Internship Program with expert mentorship, real-world projects, and job placement support in Bhairahawa & Butwal, Nepal.",
    url: "https://leafclutchtech.com.np/about",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="ABOUT US"
        title="Training & Internship Program"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "ABOUT" }]}
      />

      {/* Program Overview */}
      <section className="about-page-section">
        <div className="container">
          <div className="about-page-grid">
            <div className="about-page-content">
              <span className="section-badge">OUR PROGRAM</span>
              <h2 className="section-title">
                A Complete Path to Your Tech Career
              </h2>
              <p>
                Leafclutch Technologies offers an intensive 3-month Training &
                Internship Program designed for students and aspiring
                developers. Whether you&apos;re a complete beginner or looking
                to sharpen your skills, our program provides hands-on training,
                real project experience, and career support.
              </p>
              <p>
                Our programs cover 6 in-demand tech tracks — from AI &amp;
                Machine Learning to Graphic Design. Each track includes 1 month
                of intensive training followed by 2 months of real-world
                internship experience with our team.
              </p>
              <p>
                We believe in learning by doing. That&apos;s why every
                participant works on actual company projects, gets mentored by
                industry professionals, and walks away with real professional
                experience — not just certificates.
              </p>
            </div>
            <div className="about-image-stack">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students collaborating at Leafclutch Technologies"
                className="about-img-main"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=350&h=250&fit=crop"
                alt="Team working on projects"
                className="about-img-float"
              />
              <div className="about-img-accent">
                <div className="about-img-accent-number">3</div>
                <div className="about-img-accent-text">
                  Months to Get
                  <br />
                  Job Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Timeline */}
      <section className="program-timeline-section">
        <div className="container">
          <div className="course-section-header">
            <span className="section-badge">PROGRAM STRUCTURE</span>
            <h2 className="section-title">Your 3-Month Roadmap</h2>
            <p className="section-desc">
              A structured learning journey designed to take you from beginner
              to job-ready professional.
            </p>
          </div>
          <div className="program-timeline">
            <div className="timeline-line"></div>

            <div className="timeline-step">
              <div className="timeline-dot">
                <span>1</span>
              </div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <i className="fas fa-graduation-cap"></i>
                  <div>
                    <h3>Month 1 — Intensive Training</h3>
                    <span className="timeline-tag">Training Phase</span>
                  </div>
                </div>
                <p>
                  Deep-dive into your chosen technology track with structured
                  lessons, hands-on exercises, and a dedicated Udemy course.
                </p>
                <ul className="timeline-highlights">
                  <li>
                    <i className="fas fa-check"></i> Daily lessons &amp;
                    hands-on practice
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Lifetime Udemy course
                    included
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Weekly assessments &amp;
                    feedback
                  </li>
                  <li>
                    <i className="fas fa-check"></i> 1-on-1 mentor sessions
                  </li>
                </ul>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-dot">
                <span>2</span>
              </div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <i className="fas fa-laptop-code"></i>
                  <div>
                    <h3>Month 2 — Real-World Internship</h3>
                    <span className="timeline-tag">Internship Phase</span>
                  </div>
                </div>
                <p>
                  Work on real company projects alongside our development team.
                  Experience actual workflows, deadlines, and team
                  collaboration.
                </p>
                <ul className="timeline-highlights">
                  <li>
                    <i className="fas fa-check"></i> Work on live company
                    projects
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Team collaboration &amp;
                    code reviews
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Git workflow &amp; project
                    management
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Professional work
                    environment
                  </li>
                </ul>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-dot">
                <span>3</span>
              </div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <i className="fas fa-rocket"></i>
                  <div>
                    <h3>Month 3 — Project &amp; Placement</h3>
                    <span className="timeline-tag">Completion Phase</span>
                  </div>
                </div>
                <p>
                  Complete your capstone project, build your portfolio, and
                  prepare for job placement. Top performers may receive a direct
                  job offer.
                </p>
                <ul className="timeline-highlights">
                  <li>
                    <i className="fas fa-check"></i> Build a capstone project
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Portfolio &amp; resume
                    preparation
                  </li>
                  <li>
                    <i className="fas fa-check"></i> 3 certificates awarded
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Job placement support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="about-features-section">
        <div className="container">
          <div className="about-features-header">
            <span className="section-badge">WHY JOIN US</span>
            <h2 className="section-title">Program Benefits</h2>
            <p className="section-desc">
              Everything you need to kickstart your tech career — all in one
              program.
            </p>
          </div>
          <div className="about-features-grid">
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Expert Mentorship</h3>
              <p>
                Learn from experienced industry professionals who guide you
                through every step of your journey.
              </p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fab fa-youtube"></i>
              </div>
              <h3>Lifetime Udemy Course</h3>
              <p>
                Get a premium Udemy course related to your chosen track — yours
                to keep forever.
              </p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>3 Certificates</h3>
              <p>
                Receive Training, Internship, and Completion certificates to
                boost your resume.
              </p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fas fa-project-diagram"></i>
              </div>
              <h3>Real-World Projects</h3>
              <p>
                Work on actual company projects — not toy examples. Build a
                portfolio employers respect.
              </p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>
                Our team is available around the clock to help you with any
                questions or challenges.
              </p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3>Job Placement</h3>
              <p>
                Top performers can receive a direct job offer from Leafclutch
                Technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Tracks */}
      <section className="about-mv-section">
        <div className="container">
          <div className="course-section-header">
            <span className="section-badge">CHOOSE YOUR PATH</span>
            <h2 className="section-title">6 In-Demand Tech Tracks</h2>
            <p className="section-desc">
              Select the program that matches your interest and career goals.
            </p>
          </div>
          <div className="about-features-grid">
            <Link href="/courses/ai-ml" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>AI &amp; Machine Learning</h3>
              <p>
                Python, TensorFlow, deep learning, and real-world AI projects.
              </p>
            </Link>
            <Link href="/courses/web-dev" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Web Development</h3>
              <p>Full-stack MERN development with modern frameworks.</p>
            </Link>
            <Link href="/courses/cybersecurity" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Cybersecurity</h3>
              <p>Ethical hacking, penetration testing, and network security.</p>
            </Link>
            <Link href="/courses/ui-ux" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>UI/UX Design</h3>
              <p>
                User research, Figma mastery, and portfolio-ready case studies.
              </p>
            </Link>
            <Link href="/courses/graphic-design" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <h3>Graphic Designing</h3>
              <p>
                Adobe Photoshop, Illustrator, brand identity, and print design.
              </p>
            </Link>
            <Link href="/courses/data-science" className="track-card">
              <div className="track-card-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Data Science</h3>
              <p>Python, SQL, data visualization, Power BI, and analytics.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Enroll Perks */}
      <section className="enroll-perks-section">
        <div className="container">
          <div className="enroll-perks-grid">
            <div className="enroll-perks-content">
              <span className="section-badge">AFTER ENROLLMENT</span>
              <h2 className="section-title">What You Get When You Enroll</h2>
              <p className="section-desc">
                From day one, you&apos;ll have access to premium resources and
                dedicated support.
              </p>
            </div>
            <div className="enroll-perks-list">
              <div className="perk-item perk-item--highlight">
                <div className="perk-icon">
                  <i className="fab fa-youtube"></i>
                </div>
                <div>
                  <h4>Lifetime Udemy Course</h4>
                  <p>A premium Udemy course for your track — yours forever.</p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h4>Dedicated Mentor</h4>
                  <p>
                    Personal guidance from an experienced industry professional.
                  </p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <h4>Company Workflow</h4>
                  <p>Experience how a real IT company operates day-to-day.</p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div>
                  <h4>1 Month Training + 2 Months Internship</h4>
                  <p>
                    Structured program with training and hands-on experience.
                  </p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">
                  <i className="fas fa-network-wired"></i>
                </div>
                <div>
                  <h4>Connections &amp; Exposure</h4>
                  <p>Build your professional network through real projects.</p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <h4>Potential Job Offer</h4>
                  <p>Best performers can receive a direct job offer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Completion Perks */}
      <section className="completion-perks-section">
        <div className="container">
          <div className="course-section-header">
            <span className="section-badge">AFTER COMPLETION</span>
            <h2 className="section-title">What You Walk Away With</h2>
            <p className="section-desc">
              Complete the program and leave with tangible skills, credentials,
              and opportunities.
            </p>
          </div>
          <div className="completion-perks-grid">
            <div className="completion-card">
              <span className="completion-card-number">01</span>
              <div className="completion-card-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Completion Certificate</h3>
              <p>
                Official certificate from Leafclutch Technologies for your
                portfolio.
              </p>
            </div>
            <div className="completion-card">
              <span className="completion-card-number">02</span>
              <div className="completion-card-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Training &amp; Internship Certificates</h3>
              <p>
                Separate certificates to showcase your training and experience.
              </p>
            </div>
            <div className="completion-card">
              <span className="completion-card-number">03</span>
              <div className="completion-card-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Company &amp; Tools Knowledge</h3>
              <p>
                Real understanding of company operations and industry tools.
              </p>
            </div>
            <div className="completion-card">
              <span className="completion-card-number">04</span>
              <div className="completion-card-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Professional Experience</h3>
              <p>Real work experience for your resume — actual project work.</p>
            </div>
            <div className="completion-card">
              <span className="completion-card-number">05</span>
              <div className="completion-card-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>Ongoing Support</h3>
              <p>Continued career advice, referrals, and team support.</p>
            </div>
            <div className="completion-card">
              <span className="completion-card-number">06</span>
              <div className="completion-card-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <h3>Direct Job Offer</h3>
              <p>
                If a vacancy is available, get a job offer — no interview
                needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            <div>
              <div className="about-stat-number">6+</div>
              <div className="about-stat-label">Tech Tracks</div>
            </div>
            <div>
              <div className="about-stat-number">3</div>
              <div className="about-stat-label">Months Program</div>
            </div>
            <div>
              <div className="about-stat-number">3</div>
              <div className="about-stat-label">Certificates</div>
            </div>
            <div>
              <div className="about-stat-number">24/7</div>
              <div className="about-stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
