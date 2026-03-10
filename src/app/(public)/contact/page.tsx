import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — IT Training & Internship Inquiries",
  description:
    "Contact Leafclutch Technologies for IT training, internship programs, job inquiries, or partnership opportunities. Visit us in Siddharthanagar, Bhairahawa, Nepal or reach us via phone, email, or WhatsApp.",
  keywords: [
    "contact Leafclutch Technologies",
    "IT company contact Bhairahawa",
    "tech training inquiry Nepal",
    "internship inquiry Butwal",
    "software company contact Nepal",
  ],
  openGraph: {
    title: "Contact Leafclutch Technologies — Bhairahawa, Nepal",
    description:
      "Get in touch for training, internship, and IT service inquiries. Siddharthanagar, Bhairahawa, Nepal.",
    url: "https://leafclutchtech.com.np/contact",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info-side">
              <h2>Contact Information</h2>
              <p className="contact-info-desc">
                Reach out to us through any of these channels and we&apos;ll
                respond promptly.
              </p>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>Email Us</h4>
                  <a href="mailto:info@leafclutchtech.com.np">
                    info@leafclutchtech.com.np
                  </a>
                  <br />
                  <a href="mailto:careers@leafclutchtech.com.np">
                    careers@leafclutchtech.com.np
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Siddharthanagar</p>
                  <p>
                    Rupandehi, Nepal{" "}
                    <span role="img" aria-label="Nepal flag">
                      🇳🇵
                    </span>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4>Call Us</h4>
                  <a href="tel:+9779766715768">+977-9766715768</a>
                  <br />
                  <a href="tel:+9779766715669">+977-9766715669</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
