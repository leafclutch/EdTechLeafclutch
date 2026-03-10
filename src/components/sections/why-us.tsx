const features = [
  { icon: "fas fa-chalkboard-teacher", title: "Expert-Led Learning", desc: "Learn from experienced engineers with deep expertise across software, AI, data, and cloud." },
  { icon: "fas fa-project-diagram", title: "Hands-On Projects", desc: "Build and deploy real-world projects that strengthen your portfolio and practical skills." },
  { icon: "fas fa-certificate", title: "Industry Certification", desc: "Earn verified certificates recognized by employers across Nepal and beyond." },
  { icon: "fas fa-laptop-house", title: "Flexible Learning", desc: "On-site training in Bhairahawa/Butwal or join our online internship program from anywhere." },
  { icon: "fas fa-sync-alt", title: "Up-to-Date Curriculum", desc: "Our courses are constantly updated to reflect the latest industry trends and technologies." },
  { icon: "fas fa-handshake", title: "Career & Networking", desc: "Get career guidance, mentorship, and access to our growing community of tech professionals." },
];

export function WhyUsSection() {
  return (
    <section className="why-us" id="why-us">
      <div className="container">
        <div className="why-us-top">
          <div className="why-us-header">
            <span className="section-badge">WHY CHOOSE LEAFCLUTCH</span>
            <h2 className="section-title">The Best IT Training &amp; Internship in Nepal</h2>
            <p className="section-desc">We combine technical excellence with industry-relevant curriculum to prepare you for a successful career in technology.</p>
          </div>
          <div className="why-us-grid">
            {features.map((f) => (
              <div key={f.title} className="why-us-card">
                <div className="why-us-card-inner">
                  <div className="why-us-icon"><i className={f.icon}></i></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
