import Link from "next/link";
import Image from "next/image";
import { createPublicSupabase } from "@/lib/supabase/server";

interface ContactSettings {
  email: string;
  phone: string;
  location: string;
}
interface SocialSettings {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
}

const defaultContact: ContactSettings = {
  email: "info@leafclutchtech.com.np",
  phone: "+977-9766715768",
  location: "Siddharthanagar, Rupandehi, Nepal",
};

export async function Footer() {
  const supabase = createPublicSupabase();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["contact", "social"]);

  const contactRow = rows?.find((r) => r.key === "contact");
  const socialRow = rows?.find((r) => r.key === "social");
  const contact: ContactSettings = contactRow?.value
    ? { ...defaultContact, ...(contactRow.value as unknown as ContactSettings) }
    : defaultContact;
  const social: SocialSettings =
    (socialRow?.value as unknown as SocialSettings) ?? {};

  return (
    <footer className="footer" id="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <Image
                  src="/logo.png"
                  alt="Leafclutch Technologies"
                  width={180}
                  height={50}
                  className="footer-logo-img"
                />
              </Link>
              <p className="footer-brand-desc">
                Empowering innovation through cutting-edge technology solutions,
                training, and digital transformation services.
              </p>
              <div className="footer-contact-info">
                <a
                  href={`mailto:${contact.email}`}
                  className="footer-contact-item"
                >
                  <i className="fas fa-envelope"></i>
                  <span>{contact.email}</span>
                </a>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="footer-contact-item"
                >
                  <i className="fas fa-phone"></i>
                  <span>{contact.phone}</span>
                </a>
                <div className="footer-contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{contact.location}</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <a
                    href="https://leafclutchtech.com.np/services/all-services"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="https://leafclutchtech.com.np/careers/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Programs */}
            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                <li>
                  <Link href="/courses">All Courses</Link>
                </li>
                <li>
                  <Link href="/courses/ai-ml">AI &amp; Machine Learning</Link>
                </li>
                <li>
                  <Link href="/courses/web-dev">Web Development</Link>
                </li>
                <li>
                  <Link href="/courses/cybersecurity">Cybersecurity</Link>
                </li>
                <li>
                  <Link href="/courses/data-science">Data Science</Link>
                </li>
                <li>
                  <Link href="/courses/ui-ux">UI/UX Design</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link href="/blog">Blog &amp; Insights</Link>
                </li>
                <li>
                  <Link href="/enroll">Enroll Now</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
              {/* Social Links */}
              <div className="footer-socials">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                )}
                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                )}
                {social.discord && (
                  <a
                    href={social.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord"
                  >
                    <i className="fab fa-discord"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>
              &copy; {new Date().getFullYear()} Leafclutch Technologies Pvt.
              Ltd. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link href="/privacy">Privacy</Link>
              <span className="footer-dot">·</span>
              <Link href="/terms">Terms</Link>
              <span className="footer-dot">·</span>
              <Link href="/contact">Contact</Link>
              <span className="footer-dot">·</span>
              <a href="/admin" target="_blank" rel="noopener noreferrer">
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
