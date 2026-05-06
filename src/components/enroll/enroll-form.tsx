"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/ui/phone-input";
import { supabase } from "@/lib/supabase/client";

type EnrollType = "training_internship" | "paid_internship";
type DeliveryMode = "on-site" | "remote" | "hybrid";

function formatNPR(n: number) { return `NPR ${n.toLocaleString()}`; }

export function EnrollForm() {
  const searchParams = useSearchParams();
  const [enrollType, setEnrollType] = useState<EnrollType>("training_internship");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("on-site");
  const [showOther, setShowOther] = useState(false);
  const [countryCode, setCountryCode] = useState("+977");
  const [status, setStatus] = useState<"idle" | "sending" | "success-email" | "success-whatsapp">("idle");
  const [programs, setPrograms] = useState<{ id: string; title: string; price_online: number | null; price_onsite: number | null; price_hybrid: number | null; price: number }[]>([]);
  const [paidRoles, setPaidRoles] = useState<{ id: string; title: string; stipend: string }[]>([]);

  const [formData, setFormData] = useState({
    fullName: "", contactNumber: "", email: "",
    linkedin: "", github: "", cv: "",
    semester: "", program: "", role: "", reason: "", otherReason: "",
  });

  // Pre-fill from URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const programParam = searchParams.get("program");
    const roleParam = searchParams.get("role");
    if (typeParam === "paid_internship") setEnrollType("paid_internship");
    if (programParam) setFormData(p => ({ ...p, program: programParam }));
    if (roleParam) setFormData(p => ({ ...p, role: roleParam }));
  }, [searchParams]);

  // Load programs and paid roles from DB
  useEffect(() => {
    supabase.from("courses").select("id,title,price,price_online,price_onsite,price_hybrid").eq("is_published", true).order("sort_order").then(({ data }) => {
      setPrograms((data ?? []) as typeof programs);
    });
    supabase.from("paid_internships").select("id,title,stipend").eq("is_published", true).order("sort_order").then(({ data }) => {
      setPaidRoles((data ?? []) as typeof paidRoles);
    });
  }, []);

  const selectedProgram = programs.find(p => p.title === formData.program);
  const onlinePrice = selectedProgram?.price_online ?? selectedProgram?.price ?? null;
  const onsitePrice = selectedProgram?.price_onsite ?? selectedProgram?.price ?? null;
  const hybridPrice = selectedProgram?.price_hybrid ?? null;
  const currentPrice = deliveryMode === "on-site" ? onsitePrice : deliveryMode === "hybrid" ? hybridPrice : onlinePrice;

  function validate() {
    const base = formData.fullName && formData.email && formData.contactNumber && formData.semester;
    if (enrollType === "training_internship") return base && formData.program && formData.reason;
    return base && formData.role && formData.linkedin && formData.github && formData.cv && formData.reason;
  }

  function buildMessage() {
    const phone = `${countryCode}-${formData.contactNumber}`;
    const finalReason = formData.reason === "Other" ? (formData.otherReason ? `Other: ${formData.otherReason}` : "Other") : formData.reason;

    if (enrollType === "training_internship") {
      return {
        subject: `Enrollment Application — ${formData.program}`,
        email: `Hello Leafclutch Team,\n\nI would like to enroll in a Training & Internship program.\n\n--- Application ---\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${phone}\nLinkedIn: ${formData.linkedin || "Not provided"}\nSemester: ${formData.semester}\nProgram: ${formData.program}\nDelivery Mode: ${deliveryMode === "on-site" ? "On-site" : deliveryMode === "hybrid" ? "Hybrid" : "Remote/Online"}${currentPrice ? `\nFee: ${formatNPR(currentPrice)}` : ""}\nReason: ${finalReason}\n\nSincerely,\n${formData.fullName}`,
        whatsapp: `*Enrollment Application*\n\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${phone}\nProgram: ${formData.program}\nMode: ${deliveryMode === "on-site" ? "On-site" : deliveryMode === "hybrid" ? "Hybrid" : "Remote"}${currentPrice ? `\nFee: ${formatNPR(currentPrice)}` : ""}\nSemester: ${formData.semester}\nReason: ${finalReason}`,
      };
    } else {
      return {
        subject: `Paid Internship Application — ${formData.role}`,
        email: `Hello Leafclutch Team,\n\nI am applying for the Paid Internship position.\n\n--- Application ---\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${phone}\nRole Applying For: ${formData.role}\nSemester/Level: ${formData.semester}\nLinkedIn: ${formData.linkedin}\nGitHub: ${formData.github}\nCV/Resume: ${formData.cv}\nMotivation: ${finalReason}\n\nSincerely,\n${formData.fullName}`,
        whatsapp: `*Paid Internship Application*\n\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${phone}\nRole: ${formData.role}\nLinkedIn: ${formData.linkedin}\nGitHub: ${formData.github}\nCV: ${formData.cv}\nSemester: ${formData.semester}\nMotivation: ${finalReason}`,
      };
    }
  }

  function sendViaEmail(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const { subject, email } = buildMessage();
    window.location.href = `mailto:hr@leafclutchtech.com.np?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`;
    setStatus("success-email");
  }

  function sendViaWhatsApp(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const { whatsapp } = buildMessage();
    window.open(`https://api.whatsapp.com/send/?phone=9779766715768&text=${encodeURIComponent(whatsapp)}`, "_blank", "noopener,noreferrer");
    setStatus("success-whatsapp");
  }

  if (status === "success-email" || status === "success-whatsapp") {
    const via = status === "success-email" ? "email" : "WhatsApp";
    return (
      <div className="enroll-form-card">
        <div className="contact-success">
          <div className="contact-success-icon"><i className="fas fa-check-circle" /></div>
          <h3>Application Ready!</h3>
          <p>Your application has been opened in {via}. Complete sending it there to reach our team.</p>
          <button onClick={() => { setStatus("idle"); setFormData({ fullName: "", contactNumber: "", email: "", linkedin: "", github: "", cv: "", semester: "", program: "", role: "", reason: "", otherReason: "" }); }} className="contact-reset-btn">
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Step 1 — Application Type Selector */}
      <div className="enroll-type-selector">
        <button
          type="button"
          onClick={() => setEnrollType("training_internship")}
          className={`enroll-type-btn ${enrollType === "training_internship" ? "enroll-type-btn--active" : ""}`}
        >
          <div className="enroll-type-icon"><i className="fas fa-graduation-cap" /></div>
          <div className="enroll-type-info">
            <strong>Training & Internship</strong>
            <span>Learn + intern, fee-based program</span>
          </div>
          {enrollType === "training_internship" && <i className="fas fa-check-circle enroll-type-check" />}
        </button>
        <button
          type="button"
          onClick={() => setEnrollType("paid_internship")}
          className={`enroll-type-btn ${enrollType === "paid_internship" ? "enroll-type-btn--active enroll-type-btn--paid" : ""}`}
        >
          <div className="enroll-type-icon enroll-type-icon--paid"><i className="fas fa-money-bill-wave" /></div>
          <div className="enroll-type-info">
            <strong>Paid Internship</strong>
            <span>Competitive role with internship fee</span>
          </div>
          {enrollType === "paid_internship" && <i className="fas fa-check-circle enroll-type-check enroll-type-check--paid" />}
        </button>
      </div>

      {/* Step 2 — Form */}
      <div className="enroll-form-card">
        <h2>
          <i className={`fas ${enrollType === "training_internship" ? "fa-user-graduate" : "fa-briefcase"}`} />
          {enrollType === "training_internship" ? " Enrollment Application" : " Internship Application"}
        </h2>

        <form onSubmit={e => e.preventDefault()}>
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="required">*</span></label>
            <input type="text" id="fullName" placeholder="Your full name" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number <span className="required">*</span></label>
              <PhoneInput id="contactNumber" required value={formData.contactNumber} countryCode={countryCode} onPhoneChange={val => setFormData({ ...formData, contactNumber: val })} onCountryChange={setCountryCode} placeholder="9800000000" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Professional Gmail <span className="required">*</span></label>
              <input type="email" id="email" placeholder="yourname@gmail.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester">Current Semester / Level <span className="required">*</span></label>
              <select id="semester" required value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                <option value="" disabled>Select your level</option>
                {["1st Semester","2nd Semester","3rd Semester","4th Semester","5th Semester","6th Semester","7th Semester","8th Semester","Graduate","Working Professional","Other"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Conditional main selector */}
            {enrollType === "training_internship" ? (
              <div className="form-group">
                <label htmlFor="program">Program Applying For <span className="required">*</span></label>
                <select id="program" required value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })}>
                  <option value="" disabled>Select a program</option>
                  {programs.length > 0 ? programs.map(p => <option key={p.id} value={p.title}>{p.title}</option>) : (
                    <>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Cybersecurity Fundamentals">Cybersecurity Fundamentals</option>
                      <option value="UI/UX Design Mastery">UI/UX Design Mastery</option>
                      <option value="Graphic Designing Professional">Graphic Designing Professional</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                    </>
                  )}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="role">Role Applying For <span className="required">*</span></label>
                <select id="role" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="" disabled>Select a role</option>
                  {paidRoles.length > 0 ? paidRoles.map(r => <option key={r.id} value={r.title}>{r.title}</option>) : (
                    <option value="General Application">General Application</option>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Delivery Mode — only for Training */}
          {enrollType === "training_internship" && (
            <div className="form-group">
              <label>Delivery Mode <span className="required">*</span></label>
              <div className="delivery-mode-selector">
                <button type="button" onClick={() => setDeliveryMode("on-site")} className={`delivery-mode-btn ${deliveryMode === "on-site" ? "delivery-mode-btn--active" : ""}`}>
                  <i className="fas fa-building" /> On-site
                  {onsitePrice && <span className="delivery-price">{formatNPR(onsitePrice)}</span>}
                </button>
                <button type="button" onClick={() => setDeliveryMode("remote")} className={`delivery-mode-btn ${deliveryMode === "remote" ? "delivery-mode-btn--active" : ""}`}>
                  <i className="fas fa-laptop" /> Remote / Online
                  {onlinePrice && <span className="delivery-price">{formatNPR(onlinePrice)}</span>}
                </button>
                <button type="button" onClick={() => setDeliveryMode("hybrid")} className={`delivery-mode-btn ${deliveryMode === "hybrid" ? "delivery-mode-btn--active" : ""}`}>
                  <i className="fas fa-laptop-house" /> Hybrid
                  {hybridPrice && <span className="delivery-price">{formatNPR(hybridPrice)}</span>}
                </button>
              </div>
              {currentPrice && (
                <p className="delivery-fee-note">
                  <i className="fas fa-tag" /> Selected fee: <strong>{formatNPR(currentPrice)}</strong>. Enroll with a small initial deposit.
                </p>
              )}
            </div>
          )}

          {/* LinkedIn — optional for training, required for paid */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">
                LinkedIn Profile <span className={enrollType === "paid_internship" ? "required" : "optional"}>{enrollType === "paid_internship" ? "*" : "(Optional)"}</span>
              </label>
              <input type="url" id="linkedin" placeholder="https://linkedin.com/in/yourprofile" required={enrollType === "paid_internship"} value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
            {enrollType === "paid_internship" && (
              <div className="form-group">
                <label htmlFor="github">GitHub Profile <span className="required">*</span></label>
                <input type="url" id="github" placeholder="https://github.com/yourusername" required value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} />
              </div>
            )}
          </div>

          {/* CV — only for paid internship */}
          {enrollType === "paid_internship" && (
            <div className="form-group">
              <label htmlFor="cv">CV / Resume Link <span className="required">*</span></label>
              <input type="url" id="cv" placeholder="Google Drive, Notion, or any public link to your CV" required value={formData.cv} onChange={e => setFormData({ ...formData, cv: e.target.value })} />
              <p className="form-hint"><i className="fas fa-info-circle" /> Share a publicly accessible link (Google Drive, Dropbox, etc.)</p>
            </div>
          )}

          {/* Reason */}
          <div className="form-group">
            <label>{enrollType === "paid_internship" ? "Why do you want this role?" : "Why do you want to join?"} <span className="required">*</span></label>
            <div className="radio-group">
              {enrollType === "training_internship" ? (
                <>
                  {["To gain practical experience", "It is mandatory to complete an internship for my college requirements"].map(r => (
                    <label key={r} className="radio-label">
                      <input type="radio" name="reason" value={r} required checked={formData.reason === r} onChange={e => { setFormData({ ...formData, reason: e.target.value }); setShowOther(false); }} /> {r}
                    </label>
                  ))}
                  <label className="radio-label">
                    <input type="radio" name="reason" value="Other" checked={formData.reason === "Other"} onChange={e => { setFormData({ ...formData, reason: e.target.value }); setShowOther(true); }} /> Other:
                  </label>
                </>
              ) : (
                <>
                  {["To gain professional work experience", "To build my portfolio with real projects", "To get professional mentorship", "To get a potential job offer"].map(r => (
                    <label key={r} className="radio-label">
                      <input type="radio" name="reason" value={r} required checked={formData.reason === r} onChange={e => { setFormData({ ...formData, reason: e.target.value }); setShowOther(false); }} /> {r}
                    </label>
                  ))}
                  <label className="radio-label">
                    <input type="radio" name="reason" value="Other" checked={formData.reason === "Other"} onChange={e => { setFormData({ ...formData, reason: e.target.value }); setShowOther(true); }} /> Other:
                  </label>
                </>
              )}
            </div>
            {showOther && (
              <input type="text" placeholder="Please specify..." required value={formData.otherReason} onChange={e => setFormData({ ...formData, otherReason: e.target.value })} style={{ marginTop: "8px" }} />
            )}
          </div>

          <div className="contact-buttons-row" style={{ marginTop: "8px" }}>
            <button type="button" onClick={sendViaEmail} disabled={status === "sending"} className="contact-submit-btn contact-btn-email">
              <i className="fas fa-envelope" /> Send Via Email
            </button>
            <button type="button" onClick={sendViaWhatsApp} disabled={status === "sending"} className="contact-submit-btn contact-btn-whatsapp">
              <i className="fab fa-whatsapp" /> Send Via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
