import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy — Leafclutch Technologies",
  description:
    "Privacy Policy of Leafclutch Technologies Pvt. Ltd. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://leafclutchtech.com.np/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        badge="LEGAL"
        title="Privacy Policy"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "PRIVACY POLICY" },
        ]}
      />

      <section className="legal-section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-updated">Last updated: March 9, 2026</p>

            <p>
              Leafclutch Technologies Pvt. Ltd. (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting
              the privacy of our website visitors, students, and users. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website{" "}
              <strong>leafclutchtech.com.np</strong> or enroll in our programs.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>
              When you enroll in our programs, contact us, or interact with our
              website, we may collect:
            </p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>LinkedIn profile URL (optional)</li>
              <li>Current semester / educational status</li>
              <li>Course preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain
              information, including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website or source</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Process your enrollment and training applications</li>
              <li>
                Communicate with you about programs, schedules, and updates
              </li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send relevant educational content and announcements</li>
              <li>Improve our website, programs, and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal
              information to third parties. We may share your information only
              in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> With trusted third-party
                services (e.g., email, hosting, analytics) that help us operate
                our website and programs, under strict confidentiality
                agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court
                order, or governmental regulation.
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly agree to
                share your information for a specific purpose.
              </li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites (e.g.,
              LinkedIn, WhatsApp, Udemy). We are not responsible for the privacy
              practices or content of these external sites. We encourage you to
              review their privacy policies before providing any personal
              information.
            </p>

            <h2>6. Cookies</h2>
            <p>
              Our website may use cookies and similar tracking technologies to
              enhance your browsing experience. You can control cookie
              preferences through your browser settings. Disabling cookies may
              affect certain features of the website.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:info@leafclutchtech.com.np">
                info@leafclutchtech.com.np
              </a>
              .
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16.
              We do not knowingly collect personal information from children. If
              we learn that we have collected personal information from a child
              under 16, we will take steps to delete that information.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated &ldquo;Last
              updated&rdquo; date. We encourage you to review this policy
              periodically.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
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
