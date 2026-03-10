"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { SiteSetting } from "@/lib/supabase/types";

const friendlyLabels: Record<
  string,
  { label: string; description: string; icon: string }
> = {
  site_name: {
    label: "Site Name",
    description: "The name displayed in the browser tab and header",
    icon: "fa-globe",
  },
  site_description: {
    label: "Site Description",
    description: "Brief description for search engines",
    icon: "fa-align-left",
  },
  contact_email: {
    label: "Contact Email",
    description: "Email address shown on the website",
    icon: "fa-envelope",
  },
  contact_phone: {
    label: "Phone Number",
    description: "Phone number shown on the website",
    icon: "fa-phone",
  },
  whatsapp_number: {
    label: "WhatsApp Number",
    description: "WhatsApp contact number for the floating button",
    icon: "fa-whatsapp",
  },
  address: {
    label: "Office Address",
    description: "Physical office location",
    icon: "fa-location-dot",
  },
  social_facebook: {
    label: "Facebook URL",
    description: "Link to your Facebook page",
    icon: "fa-facebook",
  },
  social_instagram: {
    label: "Instagram URL",
    description: "Link to your Instagram profile",
    icon: "fa-instagram",
  },
  social_linkedin: {
    label: "LinkedIn URL",
    description: "Link to your LinkedIn page",
    icon: "fa-linkedin",
  },
  social_youtube: {
    label: "YouTube URL",
    description: "Link to your YouTube channel",
    icon: "fa-youtube",
  },
  social_tiktok: {
    label: "TikTok URL",
    description: "Link to your TikTok profile",
    icon: "fa-tiktok",
  },
};

function getFriendly(key: string) {
  if (friendlyLabels[key]) return friendlyLabels[key];
  const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { label, description: "", icon: "fa-gear" };
}

function isSimpleValue(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    key: string;
  } | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function loadSettings() {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .order("key");
    setSettings((data as SiteSetting[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function startEdit(s: SiteSetting) {
    setEditing(s.id);
    setEditValue(
      isSimpleValue(s.value)
        ? String(s.value)
        : JSON.stringify(s.value, null, 2),
    );
  }

  async function saveEdit(id: string) {
    setSaving(true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(editValue);
    } catch {
      parsed = editValue;
    }
    const { error } = await supabase
      .from("site_settings")
      .update({ value: parsed as import("@/lib/supabase/types").Json })
      .eq("id", id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Setting saved!", type: "success" });
    setSaving(false);
    setEditing(null);
    loadSettings();
  }

  async function addSetting(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(newValue);
    } catch {
      parsed = newValue;
    }
    const { error } = await supabase
      .from("site_settings")
      .insert({
        key: newKey,
        value: parsed as import("@/lib/supabase/types").Json,
      });
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Setting added!", type: "success" });
    setSaving(false);
    setShowNew(false);
    setNewKey("");
    setNewValue("");
    loadSettings();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("site_settings")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) setToast({ message: error.message, type: "error" });
    else setToast({ message: "Setting deleted", type: "success" });
    setDeleteTarget(null);
    loadSettings();
  }

  // Group settings by prefix
  const groups: Record<string, SiteSetting[]> = {};
  settings.forEach((s) => {
    const prefix = s.key.startsWith("social_")
      ? "Social Links"
      : s.key.startsWith("contact_")
        ? "Contact Info"
        : "General";
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(s);
  });

  return (
    <div className="max-w-4xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Setting"
          message={`Remove the setting "${getFriendly(deleteTarget.key).label}"? This may affect the website.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            Site Settings
          </h1>
          <p className="text-(--color-text) text-[14px]">
            Configure your website details and social links
          </p>
        </div>
        {!showNew && (
          <button
            onClick={() => setShowNew(true)}
            className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all shadow-lg shadow-(--color-primary)/20 flex items-center gap-2"
          >
            <i className="fas fa-plus" /> Add Setting
          </button>
        )}
      </div>

      {showNew && (
        <form
          onSubmit={addSetting}
          className="bg-white rounded-xl border border-(--color-border) p-6 mb-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-(--color-text) hover:text-(--color-dark) transition-colors"
            >
              <i className="fas fa-arrow-left text-[13px]" />
            </button>
            <h3 className="font-heading text-[18px] font-bold text-(--color-dark)">
              Add New Setting
            </h3>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              Setting Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. contact_email, social_twitter"
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
            />
            <p className="text-[11px] text-(--color-text-light) mt-1">
              Use lowercase with underscores (e.g. site_name)
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              Value <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              rows={3}
              placeholder="Enter the value for this setting..."
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-plus" /> Add Setting
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="px-6 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-20 animate-pulse border border-(--color-border)"
            />
          ))}
        </div>
      ) : settings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-gear text-[28px] text-gray-300" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-1">
            No settings configured
          </h3>
          <p className="text-[14px] text-(--color-text) mb-4">
            Add your first site setting
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all"
          >
            <i className="fas fa-plus mr-2" /> Add Setting
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <h2 className="font-heading text-[16px] font-bold text-(--color-dark) mb-3 flex items-center gap-2">
                <i
                  className={`fas ${groupName === "Social Links" ? "fa-share-nodes" : groupName === "Contact Info" ? "fa-address-book" : "fa-sliders"} text-(--color-primary) text-[14px]`}
                />
                {groupName}
              </h2>
              <div className="bg-white rounded-xl border border-(--color-border) divide-y divide-(--color-border)">
                {items.map((s) => {
                  const friendly = getFriendly(s.key);
                  const isSocial = s.key.startsWith("social_");
                  return (
                    <div
                      key={s.id}
                      className="p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      {editing === s.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <i
                              className={`${isSocial ? "fab" : "fas"} ${friendly.icon} text-[14px] text-(--color-primary)`}
                            />
                            <h3 className="font-semibold text-[14px] text-(--color-dark)">
                              {friendly.label}
                            </h3>
                          </div>
                          {isSimpleValue(s.value) ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
                            />
                          ) : (
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[12px] font-mono focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y"
                            />
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(s.id)}
                              disabled={saving}
                              className="px-4 py-2 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {saving ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check text-[11px]" />{" "}
                                  Save
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="px-4 py-2 rounded-xl border border-(--color-border) text-[13px] text-(--color-text) hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-(--color-primary)/10 flex items-center justify-center flex-shrink-0">
                              <i
                                className={`${isSocial ? "fab" : "fas"} ${friendly.icon} text-[14px] text-(--color-primary)`}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-[14px] text-(--color-dark)">
                                {friendly.label}
                              </h3>
                              {friendly.description && (
                                <p className="text-[11px] text-(--color-text-light)">
                                  {friendly.description}
                                </p>
                              )}
                              <p className="text-[13px] text-(--color-text) mt-0.5 truncate">
                                {isSimpleValue(s.value)
                                  ? String(s.value)
                                  : JSON.stringify(s.value).substring(0, 80) +
                                    "..."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => startEdit(s)}
                              className="w-9 h-9 rounded-xl border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors"
                            >
                              <i className="fas fa-pen text-[12px]" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({ id: s.id, key: s.key })
                              }
                              className="w-9 h-9 rounded-xl border border-(--color-border) flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                            >
                              <i className="fas fa-trash text-[12px]" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
