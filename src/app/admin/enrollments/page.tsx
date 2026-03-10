"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Enrollment, Course } from "@/lib/supabase/types";

const statusConfig: Record<
  string,
  { bg: string; icon: string; label: string }
> = {
  pending: {
    bg: "bg-amber-100 text-amber-700",
    icon: "fa-clock",
    label: "Pending Review",
  },
  approved: {
    bg: "bg-emerald-100 text-emerald-700",
    icon: "fa-check-circle",
    label: "Approved",
  },
  rejected: {
    bg: "bg-red-100 text-red-700",
    icon: "fa-times-circle",
    label: "Rejected",
  },
  completed: {
    bg: "bg-blue-100 text-blue-700",
    icon: "fa-graduation-cap",
    label: "Completed",
  },
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

function StatusModal({
  currentStatus,
  onConfirm,
  onCancel,
}: {
  currentStatus: string;
  onConfirm: (status: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-1">
          Change Status
        </h3>
        <p className="text-[13px] text-(--color-text) mb-5">
          Select the new status for this enrollment:
        </p>
        <div className="space-y-2">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => onConfirm(key)}
              disabled={key === currentStatus}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${key === currentStatus ? "border-(--color-primary) bg-(--color-primary)/5 text-(--color-primary)" : "border-(--color-border) hover:border-(--color-primary)/30 hover:bg-gray-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}
              >
                <i className={`fas ${cfg.icon} text-[12px]`} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-(--color-dark)">
                  {cfg.label}
                </div>
              </div>
              {key === currentStatus && (
                <i className="fas fa-check ml-auto text-(--color-primary)" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="w-full mt-4 px-4 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [statusTarget, setStatusTarget] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    let query = supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setEnrollments((data as Enrollment[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data ?? []).forEach((c: { id: string; title: string }) => {
          map[c.id] = c.title;
        });
        setCourses(map);
      });
  }, []);

  useEffect(() => {
    loadEnrollments();
    const channel = supabase
      .channel("admin-enrollments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrollments" },
        () => loadEnrollments(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadEnrollments]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("enrollments")
      .update({ status })
      .eq("id", id);
    if (error) {
      setToast({ message: error.message, type: "error" });
    } else {
      setToast({
        message: `Status changed to ${statusConfig[status]?.label ?? status}`,
        type: "success",
      });
    }
    setStatusTarget(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Enrollment deleted", type: "success" });
    setDeleteTarget(null);
  }

  const filtered = enrollments.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.full_name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (courses[e.course_id] ?? "").toLowerCase().includes(q)
    );
  });

  const counts = enrollments.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString();
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
          title="Delete Enrollment"
          message={`Are you sure you want to remove the enrollment for "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {statusTarget && (
        <StatusModal
          currentStatus={statusTarget.status}
          onConfirm={(s) => updateStatus(statusTarget.id, s)}
          onCancel={() => setStatusTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            Enrollments
          </h1>
          <p className="text-(--color-text) text-[14px]">
            Review and manage student applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-(--color-border) text-[13px] w-[260px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { key: "all", label: "All", icon: "fa-list" },
          { key: "pending", label: "Pending", icon: "fa-clock" },
          { key: "approved", label: "Approved", icon: "fa-check-circle" },
          { key: "rejected", label: "Rejected", icon: "fa-times-circle" },
          { key: "completed", label: "Completed", icon: "fa-graduation-cap" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setLoading(true);
              setFilter(s.key);
            }}
            className={`flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${filter === s.key ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20" : "bg-white border border-(--color-border) text-(--color-text) hover:border-(--color-primary)/30"}`}
          >
            <i className={`fas ${s.icon} text-[11px]`} />
            {s.label}
            {s.key !== "all" && counts[s.key] ? (
              <span
                className={`text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${filter === s.key ? "bg-white/20" : "bg-gray-100"}`}
              >
                {counts[s.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-24 animate-pulse border border-(--color-border)"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-plus text-[28px] text-gray-300" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-1">
            {search ? "No matching enrollments" : "No enrollments yet"}
          </h3>
          <p className="text-[14px] text-(--color-text)">
            {search
              ? "Try adjusting your search query"
              : "Student applications will appear here"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((enroll) => {
              const cfg = statusConfig[enroll.status] ?? {
                bg: "bg-gray-100 text-gray-500",
                icon: "fa-question",
                label: enroll.status,
              };
              const isExpanded = expandedId === enroll.id;
              return (
                <div
                  key={enroll.id}
                  className={`bg-white rounded-xl border p-5 transition-all hover:shadow-sm cursor-pointer ${enroll.status === "pending" ? "border-amber-200 bg-amber-50/30" : "border-(--color-border)"}`}
                  onClick={() => setExpandedId(isExpanded ? null : enroll.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-(--color-primary) font-bold text-[15px]">
                          {enroll.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-[15px] text-(--color-dark)">
                            {enroll.full_name}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${cfg.bg}`}
                          >
                            <i className={`fas ${cfg.icon} text-[8px]`} />{" "}
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-(--color-text-light) mt-0.5">
                          <span>
                            <i className="fas fa-book-open mr-1" />{" "}
                            {courses[enroll.course_id] ?? "Unknown Course"}
                          </span>
                          <span>
                            <i className="fas fa-clock mr-1" />{" "}
                            {timeAgo(enroll.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setStatusTarget({
                            id: enroll.id,
                            status: enroll.status,
                          })
                        }
                        className="text-[12px] px-3 py-2 rounded-xl border border-(--color-border) hover:border-(--color-primary)/30 transition-all flex items-center gap-1.5 text-(--color-text) hover:text-(--color-primary)"
                      >
                        <i className="fas fa-exchange-alt text-[10px]" /> Change
                        Status
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: enroll.id,
                            name: enroll.full_name,
                          })
                        }
                        className="w-9 h-9 rounded-xl border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <i className="fas fa-trash text-[12px]" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="mt-4 pt-4 border-t border-(--color-border) animate-[fadeIn_0.2s_ease]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Email
                          </span>
                          <p className="text-[13px] text-(--color-dark)">
                            <a
                              href={`mailto:${enroll.email}`}
                              className="text-(--color-primary) hover:underline"
                            >
                              {enroll.email}
                            </a>
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Phone
                          </span>
                          <p className="text-[13px] text-(--color-dark)">
                            {enroll.contact_number}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Semester
                          </span>
                          <p className="text-[13px] text-(--color-dark)">
                            {enroll.semester}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Course
                          </span>
                          <p className="text-[13px] text-(--color-dark) font-medium">
                            {courses[enroll.course_id] ?? "Unknown"}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Applied On
                          </span>
                          <p className="text-[13px] text-(--color-dark)">
                            {new Date(enroll.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        {enroll.linkedin_url && (
                          <div className="space-y-0.5">
                            <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                              LinkedIn
                            </span>
                            <p className="text-[13px]">
                              <a
                                href={enroll.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-(--color-primary) hover:underline flex items-center gap-1"
                              >
                                <i className="fab fa-linkedin text-[12px]" />{" "}
                                View Profile
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                      {enroll.reason && (
                        <div className="mt-4">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Why they want to enroll
                          </span>
                          <p className="mt-1 text-[13px] text-(--color-text) bg-(--color-light-bg) rounded-xl px-4 py-3">
                            {enroll.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center text-[12px] text-(--color-text-light)">
            Showing {filtered.length} of {enrollments.length} enrollment
            {enrollments.length !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
}
