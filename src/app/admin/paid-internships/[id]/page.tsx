"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { PaidInternship } from "@/lib/supabase/types";

const defaultForm = {
  slug: "", title: "", description: "",
  duration: "2 Months", stipend: "NPR 5,000",
  mode: "On-site", requirements: "", skills_required: "",
  openings: 1, sort_order: 0, is_published: true,
};
type FormState = typeof defaultForm;

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-[14px] font-medium ${type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}>
      <i className={`fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} /> {message}
    </div>
  );
}

const inp = "w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white";

export default function PaidInternshipEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isNew) {
      supabase.from("paid_internships").select("*").eq("id", id).single<PaidInternship>().then(({ data }) => {
        if (data) setForm({
          slug: data.slug ?? "", title: data.title ?? "", description: data.description ?? "",
          duration: data.duration ?? "2 Months", stipend: data.stipend ?? "NPR 5,000",
          mode: data.mode ?? "On-site",
          requirements: (data.requirements ?? []).join("\n"),
          skills_required: (data.skills_required ?? []).join("\n"),
          openings: data.openings ?? 1, sort_order: data.sort_order ?? 0,
          is_published: data.is_published ?? true,
        });
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function set(k: keyof FormState, v: FormState[keyof FormState]) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setSaving(true);
    const record = {
      slug: form.slug.trim(), title: form.title.trim(), description: form.description.trim(),
      duration: form.duration.trim(), stipend: form.stipend.trim(), mode: form.mode,
      requirements: form.requirements.split("\n").map(s => s.trim()).filter(Boolean),
      skills_required: form.skills_required.split("\n").map(s => s.trim()).filter(Boolean),
      openings: Number(form.openings), sort_order: Number(form.sort_order),
      is_published: form.is_published,
    };
    if (isNew) {
      const { error } = await supabase.from("paid_internships").insert(record);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Role created!", type: "success" });
      setTimeout(() => router.push("/admin/paid-internships"), 1500);
    } else {
      const { error } = await supabase.from("paid_internships").update(record).eq("id", id);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Role saved!", type: "success" });
    }
    setSaving(false);
  }

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-(--color-primary)/20 border-t-(--color-primary) rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push("/admin/paid-internships")} className="flex items-center gap-2 text-[13px] text-(--color-text-light) hover:text-(--color-primary) mb-2">
            <i className="fas fa-arrow-left text-[11px]" /> Back to Paid Internships
          </button>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">{isNew ? "Add New Internship Role" : "Edit Role"}</h1>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className={`w-10 h-6 rounded-full relative transition-colors ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_published ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          <span className="text-[13px] font-medium text-(--color-dark)">{form.is_published ? "Published" : "Draft"}</span>
          <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} className="sr-only" />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-5">
          <h2 className="font-heading text-[16px] font-bold text-(--color-dark)">Role Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Role Title <span className="text-red-500">*</span></label>
              <input required type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Frontend Developer Intern" className={inp} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">URL Slug <span className="text-red-500">*</span></label>
              <input required type="text" value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="frontend-dev-intern" className={inp} />
              <p className="text-[11px] text-(--color-text-light) mt-1">→ /paid-internships/{form.slug || "slug"}</p>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea required rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the internship role, what the intern will do, who it's for..." className={`${inp} resize-y`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Duration</label>
              <input type="text" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="2 Months" className={inp} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Internship Fee</label>
              <input type="text" value={form.stipend} onChange={e => set("stipend", e.target.value)} placeholder="NPR 5,000 or NPR 8,000" className={inp} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Open Positions</label>
              <input type="number" value={form.openings} onChange={e => set("openings", Number(e.target.value))} min={1} className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Mode</label>
              <select value={form.mode} onChange={e => set("mode", e.target.value)} className={inp}>
                <option value="On-site">On-site (Office)</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))} className={inp} />
            </div>
          </div>
        </div>

        {/* Requirements & Skills */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-5">
          <h2 className="font-heading text-[16px] font-bold text-(--color-dark)">Requirements & Skills</h2>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Requirements</label>
            <textarea rows={5} value={form.requirements} onChange={e => set("requirements", e.target.value)}
              placeholder={"Basic knowledge of HTML/CSS/JS\nFamiliarity with React is a plus\nGood communication skills\nAvailable for 2 months"}
              className={`${inp} resize-y`} />
            <p className="text-[11px] text-(--color-text-light) mt-1">One requirement per line</p>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Skills Required</label>
            <textarea rows={4} value={form.skills_required} onChange={e => set("skills_required", e.target.value)}
              placeholder={"React\nTailwind CSS\nGit\nJavaScript"}
              className={`${inp} resize-y`} />
            <p className="text-[11px] text-(--color-text-light) mt-1">One skill per line — shown as tags</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) disabled:opacity-50 shadow-lg shadow-(--color-primary)/20 flex items-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><i className="fas fa-check" /> {isNew ? "Create Role" : "Save Changes"}</>}
          </button>
          <button type="button" onClick={() => router.push("/admin/paid-internships")} className="px-6 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
