"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/supabase/types";

const defaultForm = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  avatar_url: "",
  is_published: true,
  sort_order: 0,
};

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
      />{" "}
      {message}
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash text-red-600 text-[18px]" />
        </div>
        <h3 className="text-center font-heading text-[18px] font-bold text-(--color-dark) mb-2">
          {title}
        </h3>
        <p className="text-center text-[14px] text-(--color-text) mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  async function loadTestimonials() {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setTestimonials((data as Testimonial[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTestimonials();
    const channel = supabase
      .channel("admin-testimonials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        () => loadTestimonials(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function startEdit(t: Testimonial) {
    setForm({
      name: t.name,
      role: t.role,
      content: t.content,
      rating: t.rating,
      avatar_url: t.avatar_url ?? "",
      is_published: t.is_published,
      sort_order: t.sort_order,
    });
    setEditing(t.id);
  }

  function startNew() {
    setForm({ ...defaultForm, sort_order: testimonials.length });
    setEditing("new");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const record = {
      name: form.name,
      role: form.role,
      content: form.content,
      rating: Number(form.rating),
      avatar_url: form.avatar_url || null,
      is_published: form.is_published,
      sort_order: Number(form.sort_order),
    };

    if (editing === "new") {
      const { error } = await supabase.from("testimonials").insert(record);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Testimonial added!", type: "success" });
    } else {
      const { error } = await supabase
        .from("testimonials")
        .update(record)
        .eq("id", editing!);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Testimonial updated!", type: "success" });
    }

    setSaving(false);
    setEditing(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Testimonial deleted", type: "success" });
    setDeleteTarget(null);
  }

  async function togglePublish(t: Testimonial) {
    await supabase
      .from("testimonials")
      .update({ is_published: !t.is_published })
      .eq("id", t.id);
    setToast({
      message: t.is_published ? "Testimonial hidden" : "Testimonial published",
      type: "success",
    });
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Testimonial"
          message={`Remove the testimonial from "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            Testimonials
          </h1>
          <p className="text-(--color-text) text-[14px]">
            Manage what students say about you
          </p>
        </div>
        {!editing && (
          <button
            onClick={startNew}
            className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all shadow-lg shadow-(--color-primary)/20 flex items-center gap-2"
          >
            <i className="fas fa-plus" /> Add Testimonial
          </button>
        )}
      </div>

      {editing !== null ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-(--color-border) p-6 max-w-2xl space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-(--color-text) hover:text-(--color-dark) transition-colors"
            >
              <i className="fas fa-arrow-left text-[13px]" />
            </button>
            <h2 className="font-heading text-[18px] font-bold text-(--color-dark)">
              {editing === "new" ? "Add New Testimonial" : "Edit Testimonial"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Role / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="e.g. AI/ML Course Graduate"
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
              <p className="text-[11px] text-(--color-text-light) mt-1">
                Their course or job title
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              What They Said <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows={4}
              placeholder="Write their testimonial here..."
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: r }))}
                    className={`text-[22px] transition-colors ${r <= form.rating ? "text-amber-400" : "text-gray-200"} hover:text-amber-400`}
                  >
                    <i className="fas fa-star" />
                  </button>
                ))}
                <span className="text-[12px] text-(--color-text-light) ml-2">
                  {form.rating}/5
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Photo URL
              </label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatar_url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
              <p className="text-[11px] text-(--color-text-light) mt-1">
                Optional profile photo
              </p>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
              <p className="text-[11px] text-(--color-text-light) mt-1">
                Lower numbers show first
              </p>
            </div>
          </div>

          {form.avatar_url && (
            <div>
              <p className="text-[11px] text-(--color-text-light) mb-1.5">
                Photo preview:
              </p>
              <img
                src={form.avatar_url}
                alt="Avatar preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-(--color-border)"
              />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-12 h-7 rounded-full relative transition-colors ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.is_published ? "left-5.5" : "left-0.5"}`}
              />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-(--color-dark)">
                {form.is_published ? "Published" : "Hidden"}
              </div>
              <div className="text-[12px] text-(--color-text-light)">
                {form.is_published
                  ? "Visible on the website"
                  : "Saved but not shown"}
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_published: e.target.checked }))
              }
              className="sr-only"
            />
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) transition-all disabled:opacity-50 shadow-lg shadow-(--color-primary)/20 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : editing === "new" ? (
                <>
                  <i className="fas fa-plus" /> Add Testimonial
                </>
              ) : (
                <>
                  <i className="fas fa-check" /> Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-6 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-40 animate-pulse border border-(--color-border)"
            />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-star text-[28px] text-amber-400" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-1">
            No testimonials yet
          </h3>
          <p className="text-[14px] text-(--color-text) mb-4">
            Add your first student testimonial
          </p>
          <button
            onClick={startNew}
            className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all"
          >
            <i className="fas fa-plus mr-2" /> Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all ${!t.is_published ? "border-dashed border-gray-300 opacity-70" : "border-(--color-border)"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-(--color-border)"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                      <span className="text-(--color-primary) font-bold text-[15px]">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-[15px] text-(--color-dark)">
                      {t.name}
                    </h3>
                    <p className="text-[12px] text-(--color-text-light)">
                      {t.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {!t.is_published && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold mr-1">
                      Hidden
                    </span>
                  )}
                  <button
                    onClick={() => togglePublish(t)}
                    title={t.is_published ? "Hide" : "Publish"}
                    className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors"
                  >
                    <i
                      className={`fas ${t.is_published ? "fa-eye" : "fa-eye-slash"} text-[11px]`}
                    />
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors"
                  >
                    <i className="fas fa-pen text-[11px]" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
                    className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <i className="fas fa-trash text-[11px]" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-(--color-text) line-clamp-3 mb-3 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star text-[11px] ${i < t.rating ? "text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-(--color-text-light)">
                  Order: {t.sort_order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
