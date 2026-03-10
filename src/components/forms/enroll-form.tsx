"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "Graduate",
  "Working Professional",
  "Other",
];

const reasons = [
  "To gain practical experience",
  "It is mandatory to complete an internship for my college requirements",
  "Other",
];

interface FormData {
  fullName: string;
  contactNumber: string;
  email: string;
  linkedin: string;
  semester: string;
  course: string;
  reason: string;
  otherReason: string;
}

export function EnrollForm() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    contactNumber: "",
    email: "",
    linkedin: "",
    semester: "",
    course: "",
    reason: "",
    otherReason: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase
      .from("courses")
      .select("title")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const titles = (data ?? []).map((c) => c.title);
        setCourses(titles);
        const courseParam = searchParams.get("course");
        if (courseParam && titles.includes(courseParam)) {
          setForm((p) => ({ ...p, course: courseParam }));
        }
      });
  }, [searchParams]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setShowModal(true);
  }

  const finalReason =
    form.reason === "Other"
      ? form.otherReason
        ? `Other: ${form.otherReason}`
        : "Other (not specified)"
      : form.reason;

  const emailBody = `Hello Leafclutch Team,\n\nMy name is ${form.fullName} and I would like to enroll in a training/internship program.\n\n--- Application Details ---\nFull Name: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.contactNumber}\nLinkedIn: ${form.linkedin || "Not provided"}\nSemester: ${form.semester}\nCourse Interested In: ${form.course}\nReason for Joining: ${finalReason}\n\nI look forward to hearing from you.\n\nSincerely,\n${form.fullName}`;

  const waMessage = `*Enrollment Application*\n\nFull Name: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.contactNumber}\nLinkedIn: ${form.linkedin || "Not provided"}\nSemester: ${form.semester}\nCourse: ${form.course}\nReason: ${finalReason}`;

  const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=${encodeURIComponent("hr@leafclutchtech.com.np")}&su=${encodeURIComponent(`Enrollment Application — ${form.course}`)}&body=${encodeURIComponent(emailBody)}`;
  const waUrl = `https://api.whatsapp.com/send/?phone=9779766715768&text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) =>
              setForm((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
            >
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              required
              value={form.contactNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactNumber: e.target.value }))
              }
              placeholder="9800000000"
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="enrollEmail"
              className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
            >
              Professional Gmail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="enrollEmail"
              required
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="yourname@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="linkedin"
              className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
            >
              LinkedIn Profile{" "}
              <span className="text-(--color-text-light) text-[12px]">
                (Optional)
              </span>
            </label>
            <input
              type="url"
              id="linkedin"
              value={form.linkedin}
              onChange={(e) =>
                setForm((p) => ({ ...p, linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="semester"
              className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
            >
              Current Semester <span className="text-red-500">*</span>
            </label>
            <select
              id="semester"
              required
              value={form.semester}
              onChange={(e) =>
                setForm((p) => ({ ...p, semester: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
            >
              <option value="" disabled>
                Select your semester
              </option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="enrollCourse"
            className="block text-[14px] font-semibold text-(--color-dark) mb-1.5"
          >
            Program You&apos;re Applying For{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            id="enrollCourse"
            required
            value={form.course}
            onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
          >
            <option value="" disabled>
              Select a program
            </option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-(--color-dark) mb-2">
            Why do you want to join this program?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {reasons.map((r) => (
              <label
                key={r}
                className="flex items-center gap-3 cursor-pointer text-[15px] text-(--color-text)"
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  required
                  checked={form.reason === r}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="accent-(--color-primary)"
                />
                {r === "Other" ? "Other:" : r}
              </label>
            ))}
          </div>
          {form.reason === "Other" && (
            <input
              type="text"
              value={form.otherReason}
              onChange={(e) =>
                setForm((p) => ({ ...p, otherReason: e.target.value }))
              }
              placeholder="Please specify your reason..."
              className="w-full mt-2 px-4 py-3 rounded-lg border border-(--color-border) text-[15px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-(--color-primary) text-white font-heading font-semibold text-[15px] hover:bg-(--color-primary-dark) transition-all"
        >
          Submit Application <i className="fas fa-paper-plane ml-1" />
        </button>
      </form>

      {/* Submit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-heading text-[22px] font-bold text-(--color-dark) mb-2">
              Send Your Application
            </h3>
            <p className="text-(--color-text) text-[15px] mb-6">
              Choose how you&apos;d like to send your enrollment details:
            </p>
            <div className="space-y-3 mb-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#25D366] text-white font-heading font-semibold text-[15px] hover:bg-[#20bd5a] transition-all"
              >
                <i className="fab fa-whatsapp text-[18px]" /> Send via WhatsApp
              </a>
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#EA4335] text-white font-heading font-semibold text-[15px] hover:bg-[#d33426] transition-all"
              >
                <i className="fas fa-envelope text-[16px]" /> Send via Email
              </a>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-center text-(--color-text-light) font-semibold text-[14px] hover:text-(--color-dark) transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
