import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Terms of Service — Leafclutch Technologies",
  description:
    "Terms of Service for Leafclutch Technologies Pvt. Ltd. Read our terms and conditions for using our website, training programs, and services.",
  alternates: { canonical: "https://leafclutchtech.com.np/terms" },
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        badge="LEGAL"
        title="Terms of Service"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "TERMS OF SERVICE" },
        ]}
      />

      <section className="legal-section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-updated">Last updated: March 9, 2026</p>

            <p>
              Welcome to Leafclutch Technologies Pvt. Ltd. (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using our
              website <strong>leafclutchtech.com.np</strong> and enrolling in
              our training and internship programs, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use our services.
            </p>

            <h2>1. Services</h2>
            <p>
              Leafclutch Technologies provides IT training, internship programs,
              and software development services. Our training programs include
              but are not limited to:
            </p>
            <ul>
              <li>AI & Machine Learning</li>
              <li>Full Stack Web Development</li>
              <li>Cybersecurity Fundamentals</li>
              <li>UI/UX Design Mastery</li>
              <li>Graphic Designing Professional</li>
              <li>Data Science & Analytics</li>
            </ul>

            <h2>2. Eligibility</h2>
            <p>
              Our programs are open to individuals aged 16 and above. By
              enrolling, you confirm that you meet the minimum age requirement
              and that the information you provide is accurate and complete.
            </p>

            <h2>3. Enrollment & Payment</h2>
            <ul>
              <li>
                Enrollment is confirmed only after the application has been
                reviewed and accepted by our team.
              </li>
              <li>
                Program fees are as listed on our website at the time of
                enrollment. Prices are subject to change without prior notice
                for future batches.
              </li>
              <li>
                Payment must be made in full before the program begins, unless
                an installment plan has been agreed upon in writing.
              </li>
              <li>
                All fees are in Nepali Rupees (NPR) unless stated otherwise.
              </li>
            </ul>

            <h2>4. Refund Policy</h2>
            <ul>
              <li>
                <strong>Before program start:</strong> A full refund will be
                provided if cancellation is requested at least 7 days before the
                program start date.
              </li>
              <li>
                <strong>Within first week:</strong> A 50% refund may be provided
                if requested within the first 7 days of the program.
              </li>
              <li>
                <strong>After first week:</strong> No refunds will be issued
                after the first week of the program.
              </li>
            </ul>

            <h2>5. Student Responsibilities</h2>
            <p>As a participant in our programs, you agree to:</p>
            <ul>
              <li>
                Attend sessions regularly and complete assigned tasks on time
              </li>
              <li>
                Treat instructors, mentors, and fellow participants with respect
              </li>
              <li>
                Not share, redistribute, or sell course materials without
                written permission
              </li>
              <li>
                Not engage in plagiarism, cheating, or academic dishonesty
              </li>
              <li>
                Follow all rules and guidelines communicated by program
                coordinators
              </li>
            </ul>

            <h2>6. Certificates</h2>
            <p>
              Certificates of completion are awarded upon successful completion
              of the program, subject to:
            </p>
            <ul>
              <li>Minimum attendance requirement (80%)</li>
              <li>Completion of all required assignments and projects</li>
              <li>Passing any assessments or evaluations as applicable</li>
            </ul>
            <p>
              Certificates are issued by Leafclutch Technologies Pvt. Ltd. and
              are not equivalent to formal academic degrees or diplomas.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos,
              images, course materials, and software, is the property of
              Leafclutch Technologies Pvt. Ltd. and is protected by intellectual
              property laws. You may not reproduce, distribute, modify, or
              create derivative works from our content without express written
              permission.
            </p>

            <h2>8. Website Use</h2>
            <p>When using our website, you agree not to:</p>
            <ul>
              <li>Use the website for any unlawful or unauthorized purpose</li>
              <li>
                Attempt to gain unauthorized access to any part of the website
                or its systems
              </li>
              <li>
                Upload or transmit any malicious code, viruses, or harmful
                content
              </li>
              <li>
                Interfere with or disrupt the website&apos;s functionality
              </li>
              <li>
                Scrape, crawl, or collect data from the website without
                permission
              </li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Leafclutch Technologies
              Pvt. Ltd. shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of our website or participation in our programs. Our total
              liability shall not exceed the amount you paid for the specific
              program or service in question.
            </p>

            <h2>10. Disclaimer</h2>
            <p>
              Our training programs are designed to provide practical skills and
              knowledge. However, we do not guarantee employment, internship
              placement, or specific career outcomes upon completion of any
              program. Career success depends on individual effort, market
              conditions, and other factors beyond our control.
            </p>

            <h2>11. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our
              programs or website at any time, without prior notice, if you
              violate these Terms of Service or engage in conduct that is
              harmful to other participants, our instructors, or our
              organization.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of Nepal. Any disputes arising from these
              terms shall be subject to the exclusive jurisdiction of the courts
              in Rupandehi, Nepal.
            </p>

            <h2>13. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Any
              changes will be posted on this page with an updated &ldquo;Last
              updated&rdquo; date. Continued use of our services after changes
              constitutes acceptance of the revised terms.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@leafclutchtech.com.np">
                  info@leafclutchtech.com.np
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+9779766715768">+977-9766715768</a>
              </li>
              <li>
                <strong>Address:</strong> Siddharthanagar, Rupandehi, Nepal
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
