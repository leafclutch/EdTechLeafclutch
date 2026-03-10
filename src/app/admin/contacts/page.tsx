"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/supabase/types";

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

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadMessages() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as ContactMessage[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel("admin-contacts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => loadMessages(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function toggleRead(id: string, current: boolean) {
    await supabase
      .from("contact_messages")
      .update({ is_read: !current })
      .eq("id", id);
    setToast({
      message: current ? "Marked as unread" : "Marked as read",
      type: "success",
    });
  }

  async function markAllRead() {
    const unread = messages.filter((m) => !m.is_read);
    if (unread.length === 0) return;
    const ids = unread.map((m) => m.id);
    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .in("id", ids);
    setToast({
      message: `${unread.length} message${unread.length > 1 ? "s" : ""} marked as read`,
      type: "success",
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Message deleted", type: "success" });
    setDeleteTarget(null);
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filtered = messages.filter((m) => {
    if (filterRead === "unread" && m.is_read) return false;
    if (filterRead === "read" && !m.is_read) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.program.toLowerCase().includes(q) ||
      (m.message ?? "").toLowerCase().includes(q)
    );
  });

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
          title="Delete Message"
          message={`Delete the message from "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            Contact Messages
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-(--color-primary) text-white text-[11px] font-bold align-middle">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-(--color-text) text-[14px]">
            Messages from website visitors
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl border border-(--color-border) text-[13px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-check-double text-[11px]" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-[300px]">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(
            [
              ["all", "All"],
              ["unread", "Unread"],
              ["read", "Read"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterRead(key)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all ${filterRead === key ? "bg-(--color-primary) text-white" : "bg-white border border-(--color-border) text-(--color-text) hover:border-(--color-primary)/30"}`}
            >
              {label}
            </button>
          ))}
        </div>
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
            <i className="fas fa-envelope text-[28px] text-gray-300" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-1">
            {search ? "No matching messages" : "No messages yet"}
          </h3>
          <p className="text-[14px] text-(--color-text)">
            {search
              ? "Try adjusting your search"
              : "Visitor messages will appear here"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`bg-white rounded-xl border p-5 transition-all hover:shadow-sm cursor-pointer ${!msg.is_read ? "border-(--color-primary)/30 bg-blue-50/20" : "border-(--color-border)"}`}
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!msg.is_read ? "bg-(--color-primary) text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <i
                          className={`fas ${!msg.is_read ? "fa-envelope" : "fa-envelope-open"} text-[14px]`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-[15px] text-(--color-dark) ${!msg.is_read ? "font-bold" : "font-semibold"}`}
                          >
                            {msg.full_name}
                          </h3>
                          {!msg.is_read && (
                            <span className="text-[10px] font-semibold bg-(--color-primary) text-white px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                          <span className="text-[11px] text-(--color-text-light)">
                            {timeAgo(msg.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-(--color-text-light) mt-0.5">
                          <span>
                            <i className="fas fa-book-open mr-1" />{" "}
                            {msg.program}
                          </span>
                          <span className="truncate max-w-[300px]">
                            {msg.message
                              ? msg.message.substring(0, 80) +
                                (msg.message.length > 80 ? "..." : "")
                              : "No message"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleRead(msg.id, msg.is_read)}
                        className={`text-[12px] px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${msg.is_read ? "border-(--color-border) text-(--color-text) hover:border-(--color-primary)/30" : "border-(--color-primary)/30 text-(--color-primary) hover:bg-(--color-primary)/5"}`}
                      >
                        <i
                          className={`fas ${msg.is_read ? "fa-envelope" : "fa-check"} text-[10px]`}
                        />
                        {msg.is_read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({ id: msg.id, name: msg.full_name })
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Email
                          </span>
                          <p className="text-[13px]">
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-(--color-primary) hover:underline"
                            >
                              {msg.email}
                            </a>
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Phone
                          </span>
                          <p className="text-[13px] text-(--color-dark)">
                            {msg.contact_number}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Interested In
                          </span>
                          <p className="text-[13px] text-(--color-dark) font-medium">
                            {msg.program}
                          </p>
                        </div>
                      </div>
                      {msg.message && (
                        <div>
                          <span className="text-[11px] text-(--color-text-light) font-medium uppercase tracking-wide">
                            Message
                          </span>
                          <p className="mt-1 text-[13px] text-(--color-text) bg-(--color-light-bg) rounded-xl px-4 py-3 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 text-[11px] text-(--color-text-light)">
                        Received on{" "}
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center text-[12px] text-(--color-text-light)">
            Showing {filtered.length} of {messages.length} message
            {messages.length !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
}
