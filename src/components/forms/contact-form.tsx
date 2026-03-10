"use client";

import { useState, type FormEvent } from "react";
import { PhoneInput } from "@/components/ui/phone-input";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  course: string;
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    course: "",
  });
  const [countryCode, setCountryCode] = useState("+977");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success-email" | "success-whatsapp" | "error"
  >("idle");

  function validateForm() {
    return form.fullName && form.email && form.phone;
  }

  function sendViaEmail(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");

    const subject = form.course
      ? `Course Inquiry: ${form.course}`
      : "New Contact Form Message";
    const body = [
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${countryCode}-${form.phone}`,
      form.course ? `Course Interested In: ${form.course}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.location.href = `mailto:info@leafclutchtech.com.np?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success-email");
  }

  function sendViaWhatsApp(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");

    const lines = [
      `*New Contact Form Message*`,
      ``,
      `*Name:* ${form.fullName}`,
      `*Email:* ${form.email}`,
      form.phone ? `*Phone:* ${countryCode}-${form.phone}` : null,
      form.course ? `*Course Interested In:* ${form.course}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=9779766715768&text=${encodeURIComponent(lines)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setStatus("success-whatsapp");
  }

  if (status === "success-email" || status === "success-whatsapp") {
    const via = status === "success-email" ? "email" : "WhatsApp";
    return (
      <div className="contact-success">
        <div className="contact-success-icon">
          <i className="fas fa-check-circle" />
        </div>
        <h3>Message Ready!</h3>
        <p>
          Your message has been opened in {via}. Complete sending it there to
          reach our team.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ fullName: "", email: "", phone: "", course: "" });
          }}
          className="contact-reset-btn"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="contact-form-fields">
      <div className="contact-form-row">
        <div className="contact-form-group">
          <label htmlFor="fullName">FULL NAME *</label>
          <input
            type="text"
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) =>
              setForm((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder="John Doe"
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="email">EMAIL ADDRESS *</label>
          <input
            type="email"
            id="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="contact-form-group">
        <label htmlFor="phone">PHONE NUMBER *</label>
        <PhoneInput
          id="phone"
          required
          value={form.phone}
          countryCode={countryCode}
          onPhoneChange={(val) => setForm((p) => ({ ...p, phone: val }))}
          onCountryChange={setCountryCode}
          placeholder="9766715768"
        />
      </div>

      <div className="contact-form-group">
        <label htmlFor="course">COURSE INTERESTED IN</label>
        <select
          id="course"
          value={form.course}
          onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
        >
          <option value="">Select a course</option>
          <option value="AI & Machine Learning">AI & Machine Learning</option>
          <option value="Web Development">Web Development</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Graphic Designing">Graphic Designing</option>
          <option value="Data Science">Data Science</option>
        </select>
      </div>

      <div className="contact-buttons-row">
        <button
          type="button"
          onClick={sendViaEmail}
          disabled={status === "sending"}
          className="contact-submit-btn contact-btn-email"
        >
          <i className="fas fa-envelope" /> Send Via Email
        </button>
        <button
          type="button"
          onClick={sendViaWhatsApp}
          disabled={status === "sending"}
          className="contact-submit-btn contact-btn-whatsapp"
        >
          <i className="fab fa-whatsapp" /> Send Via WhatsApp
        </button>
      </div>
    </form>
  );
}
