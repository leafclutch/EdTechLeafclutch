"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/ui/phone-input";

export function EnrollForm() {
  const searchParams = useSearchParams();
  const [showOther, setShowOther] = useState(false);
  const [countryCode, setCountryCode] = useState("+977");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success-email" | "success-whatsapp"
  >("idle");

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    linkedin: "",
    semester: "",
    course: "",
    reason: "",
    otherReason: "",
  });

  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam) {
      setFormData((prev) => ({ ...prev, course: courseParam }));
    }
  }, [searchParams]);

  function validateForm() {
    return (
      formData.fullName &&
      formData.email &&
      formData.contactNumber &&
      formData.semester &&
      formData.course &&
      formData.reason
    );
  }

  function getFormDetails() {
    const {
      fullName,
      contactNumber,
      email,
      linkedin,
      semester,
      course,
      reason,
      otherReason,
    } = formData;
    const finalReason =
      reason === "Other"
        ? otherReason
          ? `Other: ${otherReason}`
          : "Other (not specified)"
        : reason;
    const linkedinVal = linkedin || "Not provided";
    const phone = `${countryCode}-${contactNumber}`;
    return {
      fullName,
      phone,
      email,
      linkedinVal,
      semester,
      course,
      finalReason,
    };
  }

  function sendViaEmail(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");
    const {
      fullName,
      phone,
      email,
      linkedinVal,
      semester,
      course,
      finalReason,
    } = getFormDetails();

    const emailBody = `Hello Leafclutch Team,\n\nMy name is ${fullName} and I would like to enroll in a training/internship program.\n\n--- Application Details ---\nFull Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nLinkedIn: ${linkedinVal}\nSemester: ${semester}\nCourse Interested In: ${course}\nReason for Joining: ${finalReason}\n\nI look forward to hearing from you.\n\nSincerely,\n${fullName}`;

    window.location.href = `mailto:hr@leafclutchtech.com.np?subject=${encodeURIComponent(`Enrollment Application — ${course}`)}&body=${encodeURIComponent(emailBody)}`;
    setStatus("success-email");
  }

  function sendViaWhatsApp(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");
    const {
      fullName,
      phone,
      email,
      linkedinVal,
      semester,
      course,
      finalReason,
    } = getFormDetails();

    const waMessage = `*Enrollment Application*\n\nFull Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nLinkedIn: ${linkedinVal}\nSemester: ${semester}\nCourse: ${course}\nReason: ${finalReason}`;

    window.open(
      `https://api.whatsapp.com/send/?phone=9779766715768&text=${encodeURIComponent(waMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("success-whatsapp");
  }

  if (status === "success-email" || status === "success-whatsapp") {
    const via = status === "success-email" ? "email" : "WhatsApp";
    return (
      <div className="enroll-form-card">
        <div className="contact-success">
          <div className="contact-success-icon">
            <i className="fas fa-check-circle" />
          </div>
          <h3>Application Ready!</h3>
          <p>
            Your application has been opened in {via}. Complete sending it there
            to reach our team.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setFormData({
                fullName: "",
                contactNumber: "",
                email: "",
                linkedin: "",
                semester: "",
                course: "",
                reason: "",
                otherReason: "",
              });
            }}
            className="contact-reset-btn"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="enroll-form-card">
        <h2>
          <i className="fas fa-user-graduate"></i> Application Form
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Your full name"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNumber">
                Contact Number <span className="required">*</span>
              </label>
              <PhoneInput
                id="contactNumber"
                required
                value={formData.contactNumber}
                countryCode={countryCode}
                onPhoneChange={(val) =>
                  setFormData({ ...formData, contactNumber: val })
                }
                onCountryChange={setCountryCode}
                placeholder="9800000000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Professional Gmail <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="yourname@gmail.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">
                LinkedIn Profile <span className="optional">(Optional)</span>
              </label>
              <input
                type="url"
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="semester">
                Current Semester <span className="required">*</span>
              </label>
              <select
                id="semester"
                required
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              >
                <option value="" disabled>
                  Select your semester
                </option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
                <option value="Graduate">Graduate</option>
                <option value="Working Professional">
                  Working Professional
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="course">
              Program You&apos;re Applying For{" "}
              <span className="required">*</span>
            </label>
            <select
              id="course"
              required
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
            >
              <option value="" disabled>
                Select a program
              </option>
              <option value="AI & Machine Learning">
                AI &amp; Machine Learning
              </option>
              <option value="Full Stack Web Development">
                Full Stack Web Development
              </option>
              <option value="Cybersecurity Fundamentals">
                Cybersecurity Fundamentals
              </option>
              <option value="UI/UX Design Mastery">UI/UX Design Mastery</option>
              <option value="Graphic Designing Professional">
                Graphic Designing Professional
              </option>
              <option value="Data Science & Analytics">
                Data Science &amp; Analytics
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Why do you want to join this program?{" "}
              <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="To gain practical experience"
                  required
                  checked={formData.reason === "To gain practical experience"}
                  onChange={(e) => {
                    setFormData({ ...formData, reason: e.target.value });
                    setShowOther(false);
                  }}
                />
                To gain practical experience
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="It is mandatory to complete an internship for my college requirements"
                  checked={
                    formData.reason ===
                    "It is mandatory to complete an internship for my college requirements"
                  }
                  onChange={(e) => {
                    setFormData({ ...formData, reason: e.target.value });
                    setShowOther(false);
                  }}
                />
                It is mandatory to complete an internship for my college
                requirements
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Other"
                  checked={formData.reason === "Other"}
                  onChange={(e) => {
                    setFormData({ ...formData, reason: e.target.value });
                    setShowOther(true);
                  }}
                />
                Other:
              </label>
            </div>
            {showOther && (
              <input
                type="text"
                placeholder="Please specify your reason..."
                required
                value={formData.otherReason}
                onChange={(e) =>
                  setFormData({ ...formData, otherReason: e.target.value })
                }
                style={{ marginTop: "8px" }}
              />
            )}
          </div>

          <div className="contact-buttons-row" style={{ marginTop: "8px" }}>
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
      </div>
    </>
  );
}
