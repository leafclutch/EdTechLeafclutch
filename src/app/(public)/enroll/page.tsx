import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { EnrollForm } from "@/components/enroll/enroll-form";

export const metadata: Metadata = {
  title: "Enroll Now — Apply for IT Training & Internship in Nepal",
  description:
    "Apply for Leafclutch Technologies training and internship programs in Bhairahawa & Butwal, Nepal. Enroll in AI, Web Development, Cybersecurity, UI/UX Design, Graphic Design, or Data Science courses. No prior experience needed.",
  keywords: [
    "enroll IT training Nepal",
    "apply internship Bhairahawa",
    "tech course registration Butwal",
    "IT training enrollment Nepal",
    "Leafclutch enrollment",
    "coding course apply Nepal",
    "internship application Bhairahawa",
  ],
  openGraph: {
    title: "Enroll in IT Training & Internship — Leafclutch Technologies",
    description:
      "Apply for industry-focused tech training programs in Bhairahawa & Butwal, Nepal. No prior experience needed.",
    url: "https://leafclutchtech.com.np/enroll",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/enroll" },
};

export default function EnrollPage() {
  return (
    <>
      <PageHero
        badge="ENROLLMENT"
        title="Enroll in a Program"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "COURSES", href: "/courses" },
          { label: "ENROLL" },
        ]}
      />

      <section className="enroll-section">
        <div className="container">
          <div className="enroll-grid">
            <Suspense
              fallback={
                <div className="enroll-form-card">
                  <p>Loading form...</p>
                </div>
              }
            >
              <EnrollForm />
            </Suspense>

            {/* Info Sidebar */}
            <div className="enroll-info">
              <div className="enroll-info-card">
                <div className="enroll-info-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Quick Response</h3>
                <p>
                  We review applications within 24 hours and get back to you
                  with next steps.
                </p>
              </div>
              <div className="enroll-info-card">
                <div className="enroll-info-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Beginner Friendly</h3>
                <p>
                  No prior experience needed. Our programs are designed for
                  absolute beginners.
                </p>
              </div>
              <div className="enroll-info-card">
                <div className="enroll-info-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3>Certificate Included</h3>
                <p>
                  Get an industry-recognized certificate upon successful
                  completion.
                </p>
              </div>
              <div className="enroll-info-card">
                <div className="enroll-info-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h3>Need Help?</h3>
                <p>
                  Contact us at{" "}
                  <a href="mailto:careers@leafclutchtech.com.np">
                    careers@leafclutchtech.com.np
                  </a>{" "}
                  or call <a href="tel:+9779766715768">+977-9766715768</a>
                </p>
              </div>
            </div>
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
              <span className="enroll-benefit-highlight">Highlight</span>
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
