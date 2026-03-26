("use client");

export const runtime = "edge";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/supabase/types";

// ─── Toast Component ────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-[14px] font-medium animate-[slideUp_0.3s_ease] ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
    >
      <i
        className={`fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}
      />
      {message}
    </div>
  );
}

// ─── Common icon options ────────────────────────────────────────────
const iconOptions = [
  { value: "fas fa-brain", label: "Brain (AI)" },
  { value: "fas fa-robot", label: "Robot" },
  { value: "fas fa-code", label: "Code" },
  { value: "fas fa-laptop-code", label: "Laptop Code" },
  { value: "fas fa-shield-alt", label: "Shield (Security)" },
  { value: "fas fa-pen-nib", label: "Pen (Design)" },
  { value: "fas fa-palette", label: "Palette (Art)" },
  { value: "fas fa-chart-bar", label: "Chart (Data)" },
  { value: "fas fa-database", label: "Database" },
  { value: "fas fa-server", label: "Server" },
  { value: "fas fa-mobile-alt", label: "Mobile" },
  { value: "fas fa-cloud", label: "Cloud" },
  { value: "fas fa-cogs", label: "Gears (DevOps)" },
  { value: "fas fa-network-wired", label: "Network" },
  { value: "fas fa-graduation-cap", label: "Graduation Cap" },
  { value: "fas fa-microchip", label: "Microchip" },
  { value: "fas fa-globe", label: "Globe" },
  { value: "fab fa-python", label: "Python" },
  { value: "fab fa-react", label: "React" },
  { value: "fab fa-js-square", label: "JavaScript" },
];

const badgeColorOptions = [
  { value: "primary", label: "Blue (Primary)", color: "#1C46C8" },
  { value: "green", label: "Green", color: "#16A34A" },
  { value: "accent", label: "Purple (Accent)", color: "#B746DF" },
  { value: "#F59E0B", label: "Amber", color: "#F59E0B" },
  { value: "#EF4444", label: "Red", color: "#EF4444" },
];

const levelOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Beginner to Advanced",
  "Beginner to Intermediate",
  "Beginner Friendly",
];
const modeOptions = [
  "Online & On-site",
  "Online Only",
  "On-site Only",
  "Hybrid",
];

// ─── Types for visual editors ───────────────────────────────────────
interface RequirementSection {
  title: string;
  items: string[];
}
interface CurriculumModule {
  title: string;
  lectures: string[];
}
interface LearningOutcome {
  title: string;
  icon: string;
}

const defaultForm = {
  slug: "",
  title: "",
  short_title: "",
  description: "",
  hero_description: "",
  icon: "fas fa-robot",
  badge: "",
  badge_color: "primary",
  image_url: "",
  duration: "3 Months",
  level: "Beginner",
  mode: "Online & On-site",
  price: 6000,
  initial_fee: 1500,
  features: [""],
  sort_order: 0,
  is_featured: false,
  is_published: true,
  udemy_url: "",
  udemy_title: "",
  udemy_instructor: "",
};

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const courseId = isNew ? null : (params.id as string);

  const [form, setForm] = useState(defaultForm);
  const [requirements, setRequirements] = useState<RequirementSection[]>([
    { title: "", items: [""] },
  ]);
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([
    { title: "", lectures: [""] },
  ]);
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([
    { title: "", icon: "fas fa-check-circle" },
  ]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    if (!isNew && courseId) {
      supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()
        .then((res) => {
          const data = res.data as Course | null;
          if (data) {
            setForm({
              slug: data.slug,
              title: data.title,
              short_title: data.short_title,
              description: data.description,
              hero_description: data.hero_description,
              icon: data.icon,
              badge: data.badge,
              badge_color: data.badge_color,
              image_url: data.image_url,
              duration: data.duration,
              level: data.level,
              mode: data.mode,
              price: data.price,
              initial_fee: data.initial_fee,
              features: data.features?.length ? data.features : [""],
              sort_order: data.sort_order,
              is_featured: data.is_featured,
              is_published: data.is_published,
              udemy_url: data.udemy_url,
              udemy_title: data.udemy_title,
              udemy_instructor: data.udemy_instructor,
            });
            // Parse JSON fields into visual structures
            const reqs = data.requirements as RequirementSection[] | null;
            if (reqs?.length) setRequirements(reqs);
            const curr = data.curriculum as CurriculumModule[] | null;
            if (curr?.length) setCurriculum(curr);
            const outs = data.learning_outcomes as LearningOutcome[] | null;
            if (outs?.length) setOutcomes(outs);
          }
          setLoading(false);
        });
    }
  }, [isNew, courseId]);

  function set(key: string, value: string | number | boolean | string[]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  // Auto-generate slug from title
  function handleTitleChange(title: string) {
    set("title", title);
    if (isNew || !form.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      set("slug", slug);
    }
  }

  // ─── Features list helpers ────────────────────────────────────────
  function addFeature() {
    set("features", [...form.features, ""]);
  }
  function updateFeature(i: number, v: string) {
    const f = [...form.features];
    f[i] = v;
    set("features", f);
  }
  function removeFeature(i: number) {
    const f = form.features.filter((_, idx) => idx !== i);
    set("features", f.length ? f : [""]);
  }

  // ─── Requirements helpers ─────────────────────────────────────────
  function addReqSection() {
    setRequirements([...requirements, { title: "", items: [""] }]);
  }
  function removeReqSection(i: number) {
    setRequirements(requirements.filter((_, idx) => idx !== i));
  }
  function updateReqTitle(i: number, v: string) {
    const r = [...requirements];
    r[i] = { ...r[i], title: v };
    setRequirements(r);
  }
  function addReqItem(si: number) {
    const r = [...requirements];
    r[si] = { ...r[si], items: [...r[si].items, ""] };
    setRequirements(r);
  }
  function updateReqItem(si: number, ii: number, v: string) {
    const r = [...requirements];
    r[si] = {
      ...r[si],
      items: r[si].items.map((it, idx) => (idx === ii ? v : it)),
    };
    setRequirements(r);
  }
  function removeReqItem(si: number, ii: number) {
    const r = [...requirements];
    r[si] = { ...r[si], items: r[si].items.filter((_, idx) => idx !== ii) };
    if (r[si].items.length === 0) r[si].items = [""];
    setRequirements(r);
  }

  // ─── Curriculum helpers ───────────────────────────────────────────
  function addModule() {
    setCurriculum([...curriculum, { title: "", lectures: [""] }]);
  }
  function removeModule(i: number) {
    setCurriculum(curriculum.filter((_, idx) => idx !== i));
  }
  function updateModuleTitle(i: number, v: string) {
    const c = [...curriculum];
    c[i] = { ...c[i], title: v };
    setCurriculum(c);
  }
  function addLecture(mi: number) {
    const c = [...curriculum];
    c[mi] = { ...c[mi], lectures: [...c[mi].lectures, ""] };
    setCurriculum(c);
  }
  function updateLecture(mi: number, li: number, v: string) {
    const c = [...curriculum];
    c[mi] = {
      ...c[mi],
      lectures: c[mi].lectures.map((l, idx) => (idx === li ? v : l)),
    };
    setCurriculum(c);
  }
  function removeLecture(mi: number, li: number) {
    const c = [...curriculum];
    c[mi] = {
      ...c[mi],
      lectures: c[mi].lectures.filter((_, idx) => idx !== li),
    };
    if (c[mi].lectures.length === 0) c[mi].lectures = [""];
    setCurriculum(c);
  }
  function moveModule(i: number, dir: -1 | 1) {
    if ((dir === -1 && i === 0) || (dir === 1 && i === curriculum.length - 1))
      return;
    const c = [...curriculum];
    [c[i], c[i + dir]] = [c[i + dir], c[i]];
    setCurriculum(c);
  }

  // ─── Learning Outcomes helpers ────────────────────────────────────
  function addOutcome() {
    setOutcomes([...outcomes, { title: "", icon: "fas fa-check-circle" }]);
  }
  function removeOutcome(i: number) {
    setOutcomes(outcomes.filter((_, idx) => idx !== i));
  }
  function updateOutcome(i: number, key: "title" | "icon", v: string) {
    const o = [...outcomes];
    o[i] = { ...o[i], [key]: v };
    setOutcomes(o);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const record: Partial<Course> = {
      slug: form.slug,
      title: form.title,
      short_title: form.short_title,
      description: form.description,
      hero_description: form.hero_description,
      icon: form.icon,
      badge: form.badge,
      badge_color: form.badge_color,
      image_url: form.image_url,
      duration: form.duration,
      level: form.level,
      mode: form.mode,
      price: Number(form.price),
      initial_fee: Number(form.initial_fee),
      features: form.features.filter(Boolean),
      requirements: requirements.filter((s) =>
        s.title.trim(),
      ) as unknown as Course["requirements"],
      curriculum: curriculum.filter((m) =>
        m.title.trim(),
      ) as unknown as Course["curriculum"],
      learning_outcomes: outcomes.filter((o) =>
        o.title.trim(),
      ) as unknown as Course["learning_outcomes"],
      udemy_url: form.udemy_url,
      udemy_title: form.udemy_title,
      udemy_instructor: form.udemy_instructor,
      sort_order: Number(form.sort_order),
      is_featured: form.is_featured,
      is_published: form.is_published,
    };

    if (isNew) {
      const { error } = await supabase.from("courses").insert(record as Course);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Course created successfully!", type: "success" });
    } else {
      const { error } = await supabase
        .from("courses")
        .update(record)
        .eq("id", courseId!);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Changes saved successfully!", type: "success" });
    }

    setTimeout(() => router.push("/admin/courses"), 1000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-(--color-primary)/20 border-t-(--color-primary) rounded-full animate-spin mx-auto mb-3" />
          <p className="text-(--color-text) text-[14px]">Loading course...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: "fa-info-circle" },
    { id: "content", label: "Description", icon: "fa-align-left" },
    { id: "pricing", label: "Pricing & Details", icon: "fa-tag" },
    { id: "features", label: "Key Features", icon: "fa-list-check" },
    { id: "requirements", label: "Requirements", icon: "fa-clipboard-list" },
    { id: "curriculum", label: "Curriculum", icon: "fa-book-open" },
    { id: "outcomes", label: "Learning Outcomes", icon: "fa-trophy" },
    { id: "udemy", label: "Udemy Link", icon: "fa-link" },
    { id: "settings", label: "Visibility", icon: "fa-eye" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-(--color-border) flex items-center justify-center text-(--color-text) hover:text-(--color-dark) hover:border-(--color-dark)/20 transition-all"
        >
          <i className="fas fa-arrow-left text-[13px]" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            {isNew ? "Create New Course" : "Edit Course"}
          </h1>
          <p className="text-[13px] text-(--color-text-light)">
            {isNew
              ? "Fill in the details to add a new training program"
              : `Editing: ${form.title || "Untitled"}`}
          </p>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Section Tabs (Sidebar Navigation) */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-(--color-border) p-2 lg:sticky lg:top-20">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${activeSection === s.id ? "bg-(--color-primary) text-white shadow-md" : "text-(--color-text) hover:bg-gray-50"}`}
                >
                  <i className={`fas ${s.icon} text-[12px] w-4 text-center`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* ─── Basic Info ──────────────────────────────────────── */}
            {activeSection === "basic" && (
              <SectionCard
                title="Basic Information"
                description="The main details visitors will see about this course"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Course Title"
                    required
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. AI & Machine Learning"
                    hint="The full name of your course"
                  />
                  <Field
                    label="Short Title"
                    required
                    value={form.short_title}
                    onChange={(v) => set("short_title", v)}
                    placeholder="e.g. AI & ML"
                    hint="Abbreviated name for cards"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="URL Path"
                    required
                    value={form.slug}
                    onChange={(v) => set("slug", v)}
                    placeholder="ai-ml"
                    hint="Auto-generated from title. This appears in the web address."
                  />
                  <div>
                    <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                      Course Icon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={form.icon}
                        onChange={(e) => set("icon", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all appearance-none bg-white pr-10"
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                        <i className={`${form.icon} text-(--color-primary)`} />
                        <i className="fas fa-chevron-down text-[10px] text-gray-400" />
                      </div>
                    </div>
                    <p className="text-[11px] text-(--color-text-light) mt-1">
                      Icon displayed on course cards
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field
                    label="Cover Image URL"
                    value={form.image_url}
                    onChange={(v) => set("image_url", v)}
                    placeholder="https://images.unsplash.com/..."
                    hint="Paste an image link"
                  />
                  <Field
                    label="Badge Label"
                    value={form.badge}
                    onChange={(v) => set("badge", v)}
                    placeholder="e.g. Most Popular"
                    hint="A small tag shown on course card"
                  />
                  <div>
                    <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                      Badge Color
                    </label>
                    <div className="flex gap-2">
                      {badgeColorOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set("badge_color", opt.value)}
                          className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center ${form.badge_color === opt.value ? "border-(--color-dark) scale-110 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
                          style={{ background: opt.color }}
                          title={opt.label}
                        >
                          {form.badge_color === opt.value && (
                            <i className="fas fa-check text-white text-[10px]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {form.image_url && (
                  <div className="mt-2">
                    <p className="text-[11px] text-(--color-text-light) mb-1.5">
                      Image Preview:
                    </p>
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-32 rounded-xl object-cover border border-(--color-border)"
                    />
                  </div>
                )}
              </SectionCard>
            )}

            {/* ─── Description ─────────────────────────────────────── */}
            {activeSection === "content" && (
              <SectionCard
                title="Course Description"
                description="Describe what students will learn in this course"
              >
                <TextArea
                  label="Short Description"
                  required
                  value={form.description}
                  onChange={(v) => set("description", v)}
                  rows={3}
                  placeholder="What is this course about? (2-3 sentences)"
                  hint="Shown on the courses listing page"
                />
                <TextArea
                  label="Detailed Description"
                  required
                  value={form.hero_description}
                  onChange={(v) => set("hero_description", v)}
                  rows={4}
                  placeholder="A longer description for the course detail page"
                  hint="Shown at the top of the course page"
                />
              </SectionCard>
            )}

            {/* ─── Pricing & Details ───────────────────────────────── */}
            {activeSection === "pricing" && (
              <SectionCard
                title="Pricing & Course Details"
                description="Set the price, duration, and other details"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field
                    label="Total Fee (NPR)"
                    required
                    value={String(form.price)}
                    onChange={(v) => set("price", Number(v))}
                    type="number"
                    hint="Full course price"
                  />
                  <Field
                    label="Initial Fee (NPR)"
                    value={String(form.initial_fee)}
                    onChange={(v) => set("initial_fee", Number(v))}
                    type="number"
                    hint="Registration fee"
                  />
                  <Field
                    label="Duration"
                    value={form.duration}
                    onChange={(v) => set("duration", v)}
                    placeholder="3 Months"
                    hint="Course length"
                  />
                  <Field
                    label="Display Order"
                    value={String(form.sort_order)}
                    onChange={(v) => set("sort_order", Number(v))}
                    type="number"
                    hint="Lower = appears first"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => set("level", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white"
                    >
                      {levelOptions.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                      Learning Mode
                    </label>
                    <select
                      value={form.mode}
                      onChange={(e) => set("mode", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white"
                    >
                      {modeOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ─── Features ───────────────────────────────────────── */}
            {activeSection === "features" && (
              <SectionCard
                title="Key Features"
                description="Highlight what makes this course special. These appear as bullet points on the course card."
              >
                <div className="space-y-2">
                  {form.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-(--color-primary) flex-shrink-0">
                        <i className="fas fa-check-circle text-[13px]" />
                      </span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        placeholder={`Feature ${i + 1}, e.g. "Hands-on Projects"`}
                        className="flex-1 px-3 py-2 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <i className="fas fa-times text-[12px]" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-3 flex items-center gap-2 text-[13px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium transition-colors"
                >
                  <i className="fas fa-plus-circle" /> Add Feature
                </button>
              </SectionCard>
            )}

            {/* ─── Requirements (Visual Editor) ───────────────────── */}
            {activeSection === "requirements" && (
              <SectionCard
                title="Course Requirements"
                description='Group requirements into sections. For example: "What You Need" with items like "A laptop", "Internet connection"'
              >
                <div className="space-y-5">
                  {requirements.map((section, si) => (
                    <div
                      key={si}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fas fa-folder text-(--color-primary) text-[13px]" />
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateReqTitle(si, e.target.value)}
                          placeholder={`Section name, e.g. "What You'll Need"`}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold focus:border-(--color-primary) outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeReqSection(si)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove section"
                        >
                          <i className="fas fa-trash text-[11px]" />
                        </button>
                      </div>
                      <div className="space-y-2 ml-5">
                        {section.items.map((item, ii) => (
                          <div key={ii} className="flex items-center gap-2">
                            <span className="text-gray-400 text-[10px]">
                              <i className="fas fa-circle" />
                            </span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) =>
                                updateReqItem(si, ii, e.target.value)
                              }
                              placeholder={`e.g. "Laptop with internet access"`}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:border-(--color-primary) outline-none bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeReqItem(si, ii)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <i className="fas fa-times text-[10px]" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addReqItem(si)}
                          className="flex items-center gap-1.5 text-[12px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium ml-4 transition-colors"
                        >
                          <i className="fas fa-plus text-[10px]" /> Add item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addReqSection}
                  className="mt-3 flex items-center gap-2 text-[13px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium transition-colors"
                >
                  <i className="fas fa-plus-circle" /> Add Requirement Section
                </button>
              </SectionCard>
            )}

            {/* ─── Curriculum (Visual Editor) ─────────────────────── */}
            {activeSection === "curriculum" && (
              <SectionCard
                title="Course Curriculum"
                description="Build the course outline module by module. Each module has a title and a list of topics/lectures."
              >
                <div className="space-y-4">
                  {curriculum.map((mod, mi) => (
                    <div
                      key={mi}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-lg bg-(--color-primary) text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          {mi + 1}
                        </span>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) =>
                            updateModuleTitle(mi, e.target.value)
                          }
                          placeholder={`Module title, e.g. "Introduction to Python"`}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold focus:border-(--color-primary) outline-none bg-white"
                        />
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveModule(mi, -1)}
                            disabled={mi === 0}
                            className="text-gray-400 hover:text-(--color-dark) disabled:opacity-20 transition-colors p-1"
                            title="Move up"
                          >
                            <i className="fas fa-chevron-up text-[10px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveModule(mi, 1)}
                            disabled={mi === curriculum.length - 1}
                            className="text-gray-400 hover:text-(--color-dark) disabled:opacity-20 transition-colors p-1"
                            title="Move down"
                          >
                            <i className="fas fa-chevron-down text-[10px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeModule(mi)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1 ml-1"
                            title="Remove module"
                          >
                            <i className="fas fa-trash text-[11px]" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 ml-9">
                        {mod.lectures.map((lecture, li) => (
                          <div key={li} className="flex items-center gap-2">
                            <i className="fas fa-play-circle text-[11px] text-gray-400" />
                            <input
                              type="text"
                              value={lecture}
                              onChange={(e) =>
                                updateLecture(mi, li, e.target.value)
                              }
                              placeholder={`e.g. "Variables, functions & data types"`}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:border-(--color-primary) outline-none bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeLecture(mi, li)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <i className="fas fa-times text-[10px]" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addLecture(mi)}
                          className="flex items-center gap-1.5 text-[12px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium ml-5 transition-colors"
                        >
                          <i className="fas fa-plus text-[10px]" /> Add topic
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addModule}
                  className="mt-3 flex items-center gap-2 text-[13px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium transition-colors"
                >
                  <i className="fas fa-plus-circle" /> Add Module
                </button>
              </SectionCard>
            )}

            {/* ─── Learning Outcomes ──────────────────────────────── */}
            {activeSection === "outcomes" && (
              <SectionCard
                title="Learning Outcomes"
                description="What students will be able to do after completing this course. Shows on the course detail page."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {outcomes.map((out, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200"
                    >
                      <select
                        value={out.icon}
                        onChange={(e) =>
                          updateOutcome(i, "icon", e.target.value)
                        }
                        className="w-12 h-9 rounded-lg border border-gray-200 text-center text-[13px] focus:border-(--color-primary) outline-none bg-white flex-shrink-0 appearance-none"
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <i
                        className={`${out.icon} text-(--color-primary) text-[14px] flex-shrink-0`}
                      />
                      <input
                        type="text"
                        value={out.title}
                        onChange={(e) =>
                          updateOutcome(i, "title", e.target.value)
                        }
                        placeholder={`e.g. "Build ML Models"`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:border-(--color-primary) outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeOutcome(i)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <i className="fas fa-times text-[11px]" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOutcome}
                  className="mt-3 flex items-center gap-2 text-[13px] text-(--color-primary) hover:text-(--color-primary-dark) font-medium transition-colors"
                >
                  <i className="fas fa-plus-circle" /> Add Outcome
                </button>
              </SectionCard>
            )}

            {/* ─── Udemy Link ─────────────────────────────────────── */}
            {activeSection === "udemy" && (
              <SectionCard
                title="Udemy Course Reference"
                description="Optional. Link a related Udemy course for students to reference."
              >
                <Field
                  label="Udemy Course URL"
                  value={form.udemy_url}
                  onChange={(v) => set("udemy_url", v)}
                  placeholder="https://www.udemy.com/course/..."
                  hint="The full Udemy course link"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Udemy Course Title"
                    value={form.udemy_title}
                    onChange={(v) => set("udemy_title", v)}
                    placeholder="Course name on Udemy"
                  />
                  <Field
                    label="Instructor Name"
                    value={form.udemy_instructor}
                    onChange={(v) => set("udemy_instructor", v)}
                    placeholder="e.g. Krish Naik"
                  />
                </div>
              </SectionCard>
            )}

            {/* ─── Visibility ─────────────────────────────────────── */}
            {activeSection === "settings" && (
              <SectionCard
                title="Visibility & Status"
                description="Control whether this course is visible on the website"
              >
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-(--color-primary)/30 transition-colors">
                    <div
                      className={`w-12 h-7 rounded-full relative transition-colors ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.is_published ? "left-5.5" : "left-0.5"}`}
                      />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-(--color-dark)">
                        Published
                      </div>
                      <div className="text-[12px] text-(--color-text-light)">
                        {form.is_published
                          ? "This course is visible to everyone"
                          : "This course is hidden from the website"}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => set("is_published", e.target.checked)}
                      className="sr-only"
                    />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-(--color-primary)/30 transition-colors">
                    <div
                      className={`w-12 h-7 rounded-full relative transition-colors ${form.is_featured ? "bg-amber-500" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.is_featured ? "left-5.5" : "left-0.5"}`}
                      />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-(--color-dark)">
                        Featured
                      </div>
                      <div className="text-[12px] text-(--color-text-light)">
                        {form.is_featured
                          ? "This course is highlighted prominently"
                          : "Standard display position"}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => set("is_featured", e.target.checked)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </SectionCard>
            )}
          </div>

          {/* Submit Bar */}
          <div className="sticky bottom-0 bg-white border-t border-(--color-border) -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 mt-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) transition-all disabled:opacity-50 shadow-lg shadow-(--color-primary)/20 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : isNew ? (
                <>
                  <i className="fas fa-plus" /> Create Course
                </>
              ) : (
                <>
                  <i className="fas fa-check" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reusable components ────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-4">
      <div className="mb-1">
        <h2 className="font-heading text-[17px] font-bold text-(--color-dark)">
          {title}
        </h2>
        <p className="text-[12px] text-(--color-text-light) mt-0.5">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
      />
      {hint && (
        <p className="text-[11px] text-(--color-text-light) mt-1">{hint}</p>
      )}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y"
      />
      {hint && (
        <p className="text-[11px] text-(--color-text-light) mt-1">{hint}</p>
      )}
    </div>
  );
}
