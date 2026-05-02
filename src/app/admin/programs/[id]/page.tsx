"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Program } from "@/lib/supabase/types";
import type { Json } from "@/lib/supabase/types";

const defaultForm = {
  slug: "", title: "", short_title: "", description: "", hero_description: "",
  icon: "fas fa-code", badge: "", badge_color: "#1c46c8", image_url: "",
  duration: "3 Months", level: "Beginner to Advanced", mode: "On-Site",
  price: 8000, initial_fee: 3000, price_online: 8000, price_onsite: 10000,
  program_type: "training_internship", features: "", udemy_url: "",
  udemy_title: "", udemy_instructor: "", sort_order: 0,
  is_featured: false, is_published: true, requirements: "", curriculum: "", learning_outcomes: "",
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

export default function ProgramEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<"basic" | "pricing" | "content" | "meta">("basic");

  useEffect(() => {
    if (!isNew) {
      supabase.from("courses").select("*").eq("id", id).single<Program>().then(({ data }) => {
        if (data) setForm({
          slug: data.slug ?? "", title: data.title ?? "", short_title: data.short_title ?? "",
          description: data.description ?? "", hero_description: data.hero_description ?? "",
          icon: data.icon ?? "fas fa-code", badge: data.badge ?? "", badge_color: data.badge_color ?? "#1c46c8",
          image_url: data.image_url ?? "", duration: data.duration ?? "3 Months",
          level: data.level ?? "Beginner to Advanced", mode: data.mode ?? "On-Site",
          price: data.price ?? 8000, initial_fee: data.initial_fee ?? 3000,
          price_online: data.price_online ?? data.price ?? 8000,
          price_onsite: data.price_onsite ?? (data.price ? data.price + 2000 : 10000),
          program_type: data.program_type ?? "training_internship",
          features: Array.isArray(data.features) ? data.features.join("\n") : "",
          udemy_url: data.udemy_url ?? "", udemy_title: data.udemy_title ?? "",
          udemy_instructor: data.udemy_instructor ?? "", sort_order: data.sort_order ?? 0,
          is_featured: data.is_featured ?? false, is_published: data.is_published ?? true,
          requirements: data.requirements ? JSON.stringify(data.requirements, null, 2) : "",
          curriculum: data.curriculum ? JSON.stringify(data.curriculum, null, 2) : "",
          learning_outcomes: data.learning_outcomes ? JSON.stringify(data.learning_outcomes, null, 2) : "",
        });
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function set(key: keyof FormState, val: FormState[keyof FormState]) { setForm(p => ({ ...p, [key]: val })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setSaving(true);
    let requirements: unknown = [], curriculum: unknown = [], learning_outcomes: unknown = [];
    try { if (form.requirements.trim()) requirements = JSON.parse(form.requirements); } catch { setToast({ message: "Requirements JSON invalid", type: "error" }); setSaving(false); return; }
    try { if (form.curriculum.trim()) curriculum = JSON.parse(form.curriculum); } catch { setToast({ message: "Curriculum JSON invalid", type: "error" }); setSaving(false); return; }
    try { if (form.learning_outcomes.trim()) learning_outcomes = JSON.parse(form.learning_outcomes); } catch { setToast({ message: "Outcomes JSON invalid", type: "error" }); setSaving(false); return; }

    const record = {
      slug: form.slug.trim(), title: form.title.trim(), short_title: form.short_title.trim(),
      description: form.description.trim(), hero_description: form.hero_description.trim(),
      icon: form.icon.trim(), badge: form.badge.trim(), badge_color: form.badge_color,
      image_url: form.image_url.trim(), duration: form.duration.trim(), level: form.level.trim(), mode: form.mode.trim(),
      price: Number(form.price), initial_fee: Number(form.initial_fee),
      price_online: Number(form.price_online), price_onsite: Number(form.price_onsite),
      program_type: form.program_type,
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
      requirements: requirements as Json,
      curriculum: curriculum as Json,
      learning_outcomes: learning_outcomes as Json,
      udemy_url: form.udemy_url.trim(), udemy_title: form.udemy_title.trim(), udemy_instructor: form.udemy_instructor.trim(),
      sort_order: Number(form.sort_order), is_featured: form.is_featured, is_published: form.is_published,
    };

    if (isNew) {
      const { error } = await supabase.from("courses").insert(record);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Program created!", type: "success" });
      setTimeout(() => router.push("/admin/programs"), 1500);
    } else {
      const { error } = await supabase.from("courses").update(record).eq("id", id);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Program saved!", type: "success" });
    }
    setSaving(false);
  }

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-(--color-primary)/20 border-t-(--color-primary) rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push("/admin/programs")} className="flex items-center gap-2 text-[13px] text-(--color-text-light) hover:text-(--color-primary) mb-2">
            <i className="fas fa-arrow-left text-[11px]" /> Back to Programs
          </button>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">{isNew ? "Create New Program" : "Edit Program"}</h1>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className={`w-10 h-6 rounded-full relative transition-colors ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_published ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          <span className="text-[13px] font-medium text-(--color-dark)">{form.is_published ? "Published" : "Draft"}</span>
          <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} className="sr-only" />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {([["basic", "Basic Info", "fa-info-circle"], ["pricing", "Pricing", "fa-money-bill-wave"], ["content", "Curriculum", "fa-book-open"], ["meta", "Meta & Udemy", "fa-cog"]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${tab === key ? "bg-white shadow text-(--color-primary)" : "text-(--color-text-light) hover:text-(--color-dark)"}`}>
            <i className={`fas ${icon} text-[11px]`} /> {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC TAB */}
        {tab === "basic" && (
          <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Title <span className="text-red-500">*</span></label>
                <input required type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Full Stack Web Development" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Short Title <span className="text-red-500">*</span></label>
                <input required type="text" value={form.short_title} onChange={e => set("short_title", e.target.value)} placeholder="Web Dev" className={inp} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">URL Slug <span className="text-red-500">*</span></label>
                <input required type="text" value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="web-development" className={inp} />
                <p className="text-[11px] text-(--color-text-light) mt-1">→ /programs/{form.slug || "slug"}</p></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Program Type</label>
                <select value={form.program_type} onChange={e => set("program_type", e.target.value)} className={inp}>
                  <option value="training_internship">Training & Internship</option>
                  <option value="paid_internship">Paid Internship</option>
                </select></div>
            </div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea required rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="A practical training program..." className={`${inp} resize-y`} /></div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Hero Description <span className="text-red-500">*</span></label>
              <textarea required rows={4} value={form.hero_description} onChange={e => set("hero_description", e.target.value)} placeholder="In this program you will..." className={`${inp} resize-y`} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Duration</label>
                <input type="text" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="3 Months" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Level</label>
                <input type="text" value={form.level} onChange={e => set("level", e.target.value)} placeholder="Beginner to Advanced" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Mode</label>
                <input type="text" value={form.mode} onChange={e => set("mode", e.target.value)} placeholder="On-Site / Online" className={inp} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Badge <span className="text-red-500">*</span></label>
                <input required type="text" value={form.badge} onChange={e => set("badge", e.target.value)} placeholder="Highly in Demand" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Icon</label>
                <input type="text" value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="fas fa-code" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))} className={inp} /></div>
            </div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Image URL <span className="text-red-500">*</span></label>
              <input required type="url" value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." className={inp} />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 w-full h-36 object-cover rounded-lg border border-(--color-border)" />}</div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Key Features <span className="text-red-500">*</span></label>
              <textarea required rows={5} value={form.features} onChange={e => set("features", e.target.value)} placeholder={"Real-world projects\n1-on-1 mentor sessions\nJob placement support"} className={`${inp} resize-y`} />
              <p className="text-[11px] text-(--color-text-light) mt-1">One feature per line</p></div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-6 rounded-full relative transition-colors ${form.is_featured ? "bg-amber-400" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_featured ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <span className="text-[13px] font-medium text-(--color-dark)">Mark as Featured Program</span>
              <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} className="sr-only" />
            </label>
          </div>
        )}

        {/* PRICING TAB */}
        {tab === "pricing" && (
          <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-6">
            <div>
              <h3 className="font-heading text-[16px] font-bold text-(--color-dark) mb-3">Program Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "training_internship", label: "Training & Internship", desc: "Standard fee-based program", icon: "fa-graduation-cap", clr: "blue" },
                  { value: "paid_internship", label: "Paid Internship", desc: "Stipend provided to student", icon: "fa-money-bill-wave", clr: "green" },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => set("program_type", opt.value)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${form.program_type === opt.value ? "border-blue-400 bg-blue-50" : "border-(--color-border) hover:border-gray-300"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${form.program_type === opt.value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <i className={`fas ${opt.icon}`} />
                    </div>
                    <div><div className="font-semibold text-[14px] text-(--color-dark)">{opt.label}</div>
                      <div className="text-[12px] text-(--color-text-light)">{opt.desc}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <hr className="border-(--color-border)" />
            <div>
              <h3 className="font-heading text-[16px] font-bold text-(--color-dark) mb-3">Fee Structure</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3"><i className="fas fa-laptop text-blue-600" /><span className="font-semibold text-[14px] text-blue-800">Online Mode</span></div>
                  <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Total Fee (NPR)</label>
                  <input type="number" value={form.price_online} onChange={e => set("price_online", Number(e.target.value))} className={inp} min={0} />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3"><i className="fas fa-building text-indigo-600" /><span className="font-semibold text-[14px] text-indigo-800">On-Site Mode</span></div>
                  <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Total Fee (NPR)</label>
                  <input type="number" value={form.price_onsite} onChange={e => set("price_onsite", Number(e.target.value))} className={inp} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Display Price (NPR) <span className="text-red-500">*</span></label>
                  <input required type="number" value={form.price} onChange={e => set("price", Number(e.target.value))} className={inp} min={0} />
                  <p className="text-[11px] text-(--color-text-light) mt-1">Shown if online/onsite fields not set</p></div>
                <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Initial Enrollment Fee (NPR) <span className="text-red-500">*</span></label>
                  <input required type="number" value={form.initial_fee} onChange={e => set("initial_fee", Number(e.target.value))} className={inp} min={0} />
                  <p className="text-[11px] text-(--color-text-light) mt-1">Minimum to reserve a seat</p></div>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM TAB */}
        {tab === "content" && (
          <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-800">
              <i className="fas fa-info-circle mr-2" />These fields use <strong>JSON format</strong>.
            </div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Requirements</label>
              <textarea rows={8} value={form.requirements} onChange={e => set("requirements", e.target.value)}
                placeholder={`[\n  {"title": "No Experience Needed", "items": ["Basic computer skills"]}\n]`}
                className={`${inp} resize-y font-mono text-[12px]`} /></div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Curriculum</label>
              <textarea rows={10} value={form.curriculum} onChange={e => set("curriculum", e.target.value)}
                placeholder={`[\n  {"title": "Month 1: Foundations", "lectures": ["Intro", "Setup", "Basics"]}\n]`}
                className={`${inp} resize-y font-mono text-[12px]`} /></div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Learning Outcomes</label>
              <textarea rows={6} value={form.learning_outcomes} onChange={e => set("learning_outcomes", e.target.value)}
                placeholder={`[\n  {"title": "Build Real Projects", "icon": "fas fa-code"}\n]`}
                className={`${inp} resize-y font-mono text-[12px]`} /></div>
          </div>
        )}

        {/* META TAB */}
        {tab === "meta" && (
          <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-5">
            <h3 className="font-heading text-[15px] font-bold text-(--color-dark)">Recommended Udemy Course</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Course Title</label>
                <input type="text" value={form.udemy_title} onChange={e => set("udemy_title", e.target.value)} placeholder="The Complete Python Bootcamp" className={inp} /></div>
              <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Instructor</label>
                <input type="text" value={form.udemy_instructor} onChange={e => set("udemy_instructor", e.target.value)} placeholder="Jose Portilla" className={inp} /></div>
            </div>
            <div><label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Udemy URL</label>
              <input type="url" value={form.udemy_url} onChange={e => set("udemy_url", e.target.value)} placeholder="https://www.udemy.com/course/..." className={inp} /></div>
            <hr className="border-(--color-border)" />
            <h3 className="font-heading text-[15px] font-bold text-(--color-dark)">Badge Color</h3>
            <div className="flex items-center gap-3">
              <input type="color" value={form.badge_color} onChange={e => set("badge_color", e.target.value)} className="w-12 h-10 rounded-lg border border-(--color-border) cursor-pointer" />
              <input type="text" value={form.badge_color} onChange={e => set("badge_color", e.target.value)} className={`${inp} flex-1`} placeholder="#1c46c8" />
              {form.icon && <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary) flex-shrink-0">
                <i className={`${form.icon} text-[18px]`} /></div>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) disabled:opacity-50 shadow-lg shadow-(--color-primary)/20 flex items-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><i className="fas fa-check" /> {isNew ? "Create Program" : "Save Changes"}</>}
          </button>
          <button type="button" onClick={() => router.push("/admin/programs")}
            className="px-6 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
