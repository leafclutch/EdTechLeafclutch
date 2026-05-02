"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PricingPlan } from "@/lib/supabase/types";

const defaultForm = {
  title: "",
  total_fee: 6000,
  initial_fee: 1500,
  courses_included: "",
  is_featured: false,
  sort_order: 0,
  is_published: true,
};

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-[14px] font-medium ${type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}>
      <i className={`fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} /> {message}
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash text-red-600 text-[18px]" />
        </div>
        <h3 className="text-center font-heading text-[18px] font-bold text-(--color-dark) mb-2">{title}</h3>
        <p className="text-center text-[14px] text-(--color-text) mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white";

export default function AdminPricingPlansPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  async function loadPlans() {
    const { data } = await supabase.from("pricing_plans").select("*").order("sort_order", { ascending: true });
    setPlans((data as PricingPlan[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPlans();
    const ch = supabase.channel("admin-pricing").on("postgres_changes", { event: "*", schema: "public", table: "pricing_plans" }, loadPlans).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  function startNew() {
    setForm({ ...defaultForm, sort_order: plans.length });
    setEditing("new");
  }

  function startEdit(p: PricingPlan) {
    setForm({
      title: p.title,
      total_fee: p.total_fee,
      initial_fee: p.initial_fee,
      courses_included: (p.courses_included ?? []).join("\n"),
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      is_published: p.is_published,
    });
    setEditing(p.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const record = {
      title: form.title.trim(),
      total_fee: Number(form.total_fee),
      initial_fee: Number(form.initial_fee),
      courses_included: form.courses_included.split("\n").map(s => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order),
      is_published: form.is_published,
    };
    if (editing === "new") {
      const { error } = await supabase.from("pricing_plans").insert(record);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Plan added!", type: "success" });
    } else {
      const { error } = await supabase.from("pricing_plans").update(record).eq("id", editing!);
      if (error) { setToast({ message: error.message, type: "error" }); setSaving(false); return; }
      setToast({ message: "Plan updated!", type: "success" });
    }
    setSaving(false);
    setEditing(null);
  }

  async function togglePublish(p: PricingPlan) {
    await supabase.from("pricing_plans").update({ is_published: !p.is_published }).eq("id", p.id);
    setToast({ message: p.is_published ? "Plan hidden" : "Plan published", type: "success" });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("pricing_plans").delete().eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Plan deleted", type: "success" });
    setDeleteTarget(null);
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <ConfirmModal title="Delete Plan" message={`Remove "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">Pricing Plans</h1>
          <p className="text-(--color-text) text-[14px]">Manage the &quot;Choose Your Learning Path&quot; section on the home page</p>
        </div>
        {!editing && (
          <button onClick={startNew} className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) shadow-lg shadow-(--color-primary)/20 flex items-center gap-2">
            <i className="fas fa-plus" /> Add Plan
          </button>
        )}
      </div>

      {editing !== null ? (
        /* ── EDIT / CREATE FORM ── */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-(--color-border) p-6 max-w-2xl space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <button type="button" onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-(--color-text) hover:text-(--color-dark)">
              <i className="fas fa-arrow-left text-[13px]" />
            </button>
            <h2 className="font-heading text-[18px] font-bold text-(--color-dark)">{editing === "new" ? "Add New Plan" : "Edit Plan"}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Plan Title <span className="text-red-500">*</span></label>
              <input required type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Data & AI Programs" className={inp} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className={inp} />
              <p className="text-[11px] text-(--color-text-light) mt-1">Lower numbers appear first</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Total Fee (NPR) <span className="text-red-500">*</span></label>
              <input required type="number" value={form.total_fee} onChange={e => setForm(p => ({ ...p, total_fee: Number(e.target.value) }))} className={inp} min={0} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Initial Fee (NPR) <span className="text-red-500">*</span></label>
              <input required type="number" value={form.initial_fee} onChange={e => setForm(p => ({ ...p, initial_fee: Number(e.target.value) }))} className={inp} min={0} />
              <p className="text-[11px] text-(--color-text-light) mt-1">Enrollment deposit</p>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">Programs Included <span className="text-red-500">*</span></label>
            <textarea required rows={6} value={form.courses_included}
              onChange={e => setForm(p => ({ ...p, courses_included: e.target.value }))}
              placeholder={"Python\nC/C++\nJava\nJavaScript"}
              className={`${inp} resize-y`} />
            <p className="text-[11px] text-(--color-text-light) mt-1">One program per line</p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-7 rounded-full relative transition-colors ${form.is_featured ? "bg-amber-400" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-(--color-dark)">Most Popular</div>
                <div className="text-[12px] text-(--color-text-light)">Shows a highlight badge</div>
              </div>
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="sr-only" />
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-7 rounded-full relative transition-colors ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-(--color-dark)">{form.is_published ? "Published" : "Hidden"}</div>
                <div className="text-[12px] text-(--color-text-light)">{form.is_published ? "Visible on site" : "Not shown"}</div>
              </div>
              <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="sr-only" />
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) disabled:opacity-50 shadow-lg shadow-(--color-primary)/20 flex items-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><i className="fas fa-check" /> {editing === "new" ? "Add Plan" : "Save Changes"}</>}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-(--color-border)" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-tags text-[28px] text-blue-400" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-2">No pricing plans yet</h3>
          <p className="text-[14px] text-(--color-text) mb-5">Add your first pricing plan to display on the home page.</p>
          <button onClick={startNew} className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark)">
            <i className="fas fa-plus mr-2" /> Add First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all ${!plan.is_published ? "border-dashed border-gray-300 opacity-70" : plan.is_featured ? "border-amber-300 ring-1 ring-amber-200" : "border-(--color-border)"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[16px] text-(--color-dark)">{plan.title}</h3>
                    {plan.is_featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">MOST POPULAR</span>}
                    {!plan.is_published && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">HIDDEN</span>}
                  </div>
                  <div className="text-[18px] font-bold text-(--color-primary) mt-1">NPR {plan.total_fee.toLocaleString()}</div>
                  <div className="text-[12px] text-(--color-text-light)">Initial: NPR {plan.initial_fee.toLocaleString()} · {plan.courses_included?.length ?? 0} programs</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => togglePublish(plan)} title={plan.is_published ? "Hide" : "Publish"} className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors">
                    <i className={`fas ${plan.is_published ? "fa-eye" : "fa-eye-slash"} text-[11px]`} />
                  </button>
                  <button onClick={() => startEdit(plan)} className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors">
                    <i className="fas fa-pen text-[11px]" />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: plan.id, title: plan.title })} className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                    <i className="fas fa-trash text-[11px]" />
                  </button>
                </div>
              </div>
              <ul className="space-y-1">
                {(plan.courses_included ?? []).slice(0, 4).map((c: string) => (
                  <li key={c} className="flex items-center gap-2 text-[12px] text-(--color-text)">
                    <i className="fas fa-check-circle text-emerald-500 text-[10px]" /> {c}
                  </li>
                ))}
                {(plan.courses_included ?? []).length > 4 && (
                  <li className="text-[11px] text-(--color-text-light)">+{plan.courses_included.length - 4} more</li>
                )}
              </ul>
              <div className="mt-3 pt-3 border-t border-(--color-border) flex items-center justify-between text-[11px] text-(--color-text-light)">
                <span>Sort: #{plan.sort_order}</span>
                <span>{plan.is_published ? "✓ Live on site" : "⊘ Hidden"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Note */}
      {!editing && plans.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-[13px] text-blue-800">
          <i className="fas fa-info-circle mr-2" />
          These plans appear in the <strong>&quot;Choose Your Learning Path&quot;</strong> section on the home page. Changes are live immediately.
        </div>
      )}
    </div>
  );
}
