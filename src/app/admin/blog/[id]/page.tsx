export const runtime = "edge";
("use client");

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";

const categoryOptions = [
  "AI & ML",
  "Web Development",
  "Cybersecurity",
  "UI/UX Design",
  "Graphic Design",
  "Data Science",
  "Career",
  "Technology",
  "Programming",
  "Other",
];

const defaultForm = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  author: "Leafclutch Technologies",
  is_published: true,
  published_at: new Date().toISOString().split("T")[0],
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

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const postId = isNew ? null : (params.id as string);

  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isNew && postId) {
      supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single()
        .then((res) => {
          const data = res.data as BlogPost | null;
          if (data) {
            setForm({
              slug: data.slug,
              title: data.title,
              excerpt: data.excerpt,
              content: data.content,
              cover_image: data.cover_image,
              category: data.category,
              author: data.author,
              is_published: data.is_published,
              published_at: data.published_at.split("T")[0],
            });
          }
          setLoading(false);
        });
    }
  }, [isNew, postId]);

  function set(key: string, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
  }

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const record = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image,
      category: form.category,
      author: form.author,
      is_published: form.is_published,
      published_at: form.published_at,
    };

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(record);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Blog post published!", type: "success" });
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update(record)
        .eq("id", postId!);
      if (error) {
        setToast({ message: error.message, type: "error" });
        setSaving(false);
        return;
      }
      setToast({ message: "Changes saved!", type: "success" });
    }

    setTimeout(() => router.push("/admin/blog"), 1000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-(--color-primary)/20 border-t-(--color-primary) rounded-full animate-spin mx-auto mb-3" />
          <p className="text-(--color-text) text-[14px]">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-(--color-border) flex items-center justify-center text-(--color-text) hover:text-(--color-dark) hover:border-(--color-dark)/20 transition-all"
        >
          <i className="fas fa-arrow-left text-[13px]" />
        </button>
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            {isNew ? "Write New Blog Post" : "Edit Blog Post"}
          </h1>
          <p className="text-[13px] text-(--color-text-light)">
            {isNew
              ? "Create and publish a new article"
              : `Editing: ${form.title || "Untitled"}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How AI is Transforming Education in Nepal"
              className="w-full px-4 py-3 rounded-xl border border-(--color-border) text-[15px] font-medium focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              URL Path <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-(--color-text-light)">
                /blog/
              </span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="auto-generated-from-title"
                className="flex-1 px-3 py-2 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-(--color-text-light) mt-1">
              Auto-generated from the title. This is the web address for this
              post.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              Short Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              placeholder="A brief 1-2 sentence preview that appears on the blog listing page..."
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y"
            />
            <p className="text-[11px] text-(--color-text-light) mt-1">
              Shown as a preview in the blog cards
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-semibold text-(--color-dark)">
                Article Content <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-(--color-text-light) bg-gray-100 px-2 py-0.5 rounded">
                Supports HTML tags
              </span>
            </div>
            <textarea
              required
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={20}
              placeholder="Write your article content here...&#10;&#10;You can use HTML tags like:&#10;<h2>Section Heading</h2>&#10;<p>Paragraph text</p>&#10;<ul><li>List item</li></ul>&#10;<strong>Bold text</strong>"
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all resize-y font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Meta & Image */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6 space-y-4">
          <h3 className="font-heading text-[15px] font-bold text-(--color-dark)">
            Post Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white"
              >
                <option value="">Select category...</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => set("published_at", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-(--color-dark) mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={form.cover_image}
              onChange={(e) => set("cover_image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all"
            />
            <p className="text-[11px] text-(--color-text-light) mt-1">
              Paste a link to an image for the blog post banner
            </p>
          </div>
          {form.cover_image && (
            <div>
              <p className="text-[11px] text-(--color-text-light) mb-1.5">
                Preview:
              </p>
              <img
                src={form.cover_image}
                alt="Cover preview"
                className="h-32 rounded-xl object-cover border border-(--color-border)"
              />
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl border border-(--color-border) p-6">
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
                {form.is_published ? "Published" : "Draft"}
              </div>
              <div className="text-[12px] text-(--color-text-light)">
                {form.is_published
                  ? "This post is visible to everyone"
                  : "This post is saved but hidden from the website"}
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-(--color-border) p-4">
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
                <i className="fas fa-paper-plane" /> Publish Post
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
  );
}
