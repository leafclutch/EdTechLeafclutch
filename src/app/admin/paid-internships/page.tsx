"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import type { PaidInternship } from "@/lib/supabase/types";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-[14px] font-medium ${type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}>
      <i className={`fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} /> {message}
    </div>
  );
}

const modeColor: Record<string, string> = {
  "On-site": "bg-blue-100 text-blue-700",
  "Remote": "bg-purple-100 text-purple-700",
  "Hybrid": "bg-teal-100 text-teal-700",
};

export default function AdminPaidInternshipsPage() {
  const [roles, setRoles] = useState<PaidInternship[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  async function load() {
    const { data } = await supabase.from("paid_internships").select("*").order("sort_order");
    setRoles((data as PaidInternship[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-paid-internships").on("postgres_changes", { event: "*", schema: "public", table: "paid_internships" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function togglePublish(r: PaidInternship) {
    await supabase.from("paid_internships").update({ is_published: !r.is_published }).eq("id", r.id);
    setToast({ message: r.is_published ? "Role hidden" : "Role published", type: "success" });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("paid_internships").delete().eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Role deleted", type: "success" });
    setDeleteTarget(null);
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><i className="fas fa-trash text-red-600 text-[18px]" /></div>
            <h3 className="text-center font-heading text-[18px] font-bold text-(--color-dark) mb-2">Delete Role?</h3>
            <p className="text-center text-[14px] text-(--color-text) mb-6">Remove &quot;{deleteTarget.title}&quot;? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">Paid Internships</h1>
          <p className="text-(--color-text) text-[14px]">Manage open paid internship roles shown on the website</p>
        </div>
        <Link href="/admin/paid-internships/new" className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) shadow-lg shadow-(--color-primary)/20 flex items-center gap-2">
          <i className="fas fa-plus" /> Add Role
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse border border-(--color-border)" />)}</div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4"><i className="fas fa-money-bill-wave text-[28px] text-green-400" /></div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-2">No paid internship roles yet</h3>
          <p className="text-[14px] text-(--color-text) mb-5">Add open internship roles that students can apply for.</p>
          <Link href="/admin/paid-internships/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark)">
            <i className="fas fa-plus" /> Add First Role
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-(--color-border)">
                  <th className="pl-5 pr-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Role / Title</th>
                  <th className="px-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Internship Fee</th>
                  <th className="px-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Mode</th>
                  <th className="px-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Openings</th>
                  <th className="px-3 py-3.5 text-center text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3.5 text-right pr-5 text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                {roles.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="pl-5 pr-3 py-4">
                      <div className="font-semibold text-(--color-dark)">{r.title}</div>
                      <div className="text-[11px] text-(--color-text-light)">{r.duration} · {r.skills_required?.slice(0, 3).join(", ")}{(r.skills_required?.length ?? 0) > 3 ? "..." : ""}</div>
                    </td>
                    <td className="px-3 py-4 font-semibold text-(--color-primary)">{r.stipend}</td>
                    <td className="px-3 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${modeColor[r.mode] ?? "bg-gray-100 text-gray-600"}`}>{r.mode}</span>
                    </td>
                    <td className="px-3 py-4 text-(--color-text)">{r.openings} open</td>
                    <td className="px-3 py-4 text-center">
                      <button onClick={() => togglePublish(r)} className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${r.is_published ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                        <i className={`fas ${r.is_published ? "fa-eye" : "fa-eye-slash"} mr-1 text-[9px]`} />{r.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-3 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/paid-internships/${r.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--color-primary) hover:bg-(--color-primary)/10 transition-all" title="Edit">
                          <i className="fas fa-pen-to-square text-[13px]" />
                        </Link>
                        <button onClick={() => setDeleteTarget({ id: r.id, title: r.title })} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Delete">
                          <i className="fas fa-trash text-[13px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-(--color-border) bg-gray-50/50 text-[12px] text-(--color-text-light)">
            {roles.length} role{roles.length !== 1 ? "s" : ""} · {roles.filter(r => r.is_published).length} published
          </div>
        </div>
      )}
    </div>
  );
}
