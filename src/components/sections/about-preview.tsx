import Link from "next/link";

export function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-badge">TRAINING &amp; INTERNSHIP</span>
            <h2 className="section-title">
              Build Skills. Gain Experience. Get Industry-Ready.
            </h2>
            <p className="section-desc">
              Our 3-month Courses &amp; Internship Program is designed to
              transform beginners into industry-ready professionals. Month 1
              focuses on intensive hands-on training with expert mentors,
              followed by 2 months of real-world internship where you work on
              live projects.
            </p>
            <div className="about-benefits-grid">
              <div className="about-benefit-item">
                <i className="fas fa-file-certificate"></i>
                <span>Experience Letter</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-award"></i>
                <span>Completion Certificate</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-certificate"></i>
                <span>Internship Certificate</span>
              </div>
              <div className="about-benefit-item">
                <i className="fab fa-youtube"></i>
                <span>Lifetime Udemy Course</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-headset"></i>
                <span>24/7 Mentor Support</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-file-alt"></i>
                <span>Resume Building</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-envelope-open-text"></i>
                <span>Letter of Recommendation</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-briefcase"></i>
                <span>Job Opportunities</span>
              </div>
              <div className="about-benefit-item">
                <i className="fas fa-code"></i>
                <span>Internal Hackathons</span>
              </div>
            </div>
            <Link href="/enroll" className="btn btn-primary">
              Enroll Now
            </Link>
          </div>
          <div className="about-visual">
            <div className="about-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=500&fit=crop"
                alt="Leafclutch Technologies - Best IT company in Bhairahawa Nepal"
                className="about-main-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
