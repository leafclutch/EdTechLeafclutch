"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import type { BlogPost } from "@/lib/supabase/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);

  async function loadPosts() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
    const channel = supabase
      .channel("admin-blog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blog_posts" },
        () => loadPosts(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function togglePublish(id: string, current: boolean) {
    await supabase
      .from("blog_posts")
      .update({ is_published: !current })
      .eq("id", id);
    setToast(current ? "Post unpublished" : "Post published");
    setTimeout(() => setToast(null), 2500);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    await supabase.from("blog_posts").delete().eq("id", deleteConfirm.id);
    setDeleteConfirm(null);
    setToast("Blog post deleted");
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl text-[14px] font-medium flex items-center gap-2 animate-[slideUp_0.3s_ease]">
          <i className="fas fa-check-circle" /> {toast}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trash text-red-500 text-[18px]" />
            </div>
            <h3 className="font-heading text-[18px] font-bold text-(--color-dark) text-center mb-2">
              Delete Blog Post?
            </h3>
            <p className="text-[13px] text-(--color-text) text-center mb-5">
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteConfirm.title}&quot;</strong>? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) text-[14px] font-medium text-(--color-text) hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-(--color-dark)">
            Blog Posts
          </h1>
          <p className="text-(--color-text) text-[14px]">
            Manage your articles and news
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[13px] font-semibold hover:bg-(--color-primary-dark) transition-all flex items-center gap-2 shadow-lg shadow-(--color-primary)/20"
        >
          <i className="fas fa-pen-to-square" /> Write New Post
        </Link>
      </div>

      {/* Search */}
      {posts.length > 0 && (
        <div className="mb-5">
          <div className="relative max-w-md">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-(--color-border) text-[13px] focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 outline-none transition-all bg-white"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-20 animate-pulse border border-(--color-border)"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-(--color-border)">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-newspaper text-[28px] text-purple-300" />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-2">
            No blog posts yet
          </h3>
          <p className="text-[14px] text-(--color-text) mb-5">
            Start sharing content by writing your first article.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-[14px] font-semibold hover:bg-(--color-primary-dark) transition-colors"
          >
            <i className="fas fa-pen" /> Write First Post
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-(--color-border)">
          <i className="fas fa-search text-[28px] text-gray-300 mb-3" />
          <p className="text-(--color-text)">
            No posts match &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-(--color-border)">
                  <th className="pl-5 pr-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 py-3.5 text-left text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3.5 text-center text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-right text-[11px] font-bold text-(--color-text-light) uppercase tracking-wider pr-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="pl-5 pr-3 py-4">
                      <div className="font-semibold text-(--color-dark) text-[14px]">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-(--color-text-light) truncate max-w-sm mt-0.5">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-[11px] font-bold bg-(--color-primary)/8 text-(--color-primary) px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-(--color-text) text-[13px]">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() =>
                          togglePublish(post.id, post.is_published)
                        }
                        className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${post.is_published ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        <i
                          className={`fas ${post.is_published ? "fa-eye" : "fa-eye-slash"} mr-1 text-[9px]`}
                        />
                        {post.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-3 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-(--color-primary) hover:bg-(--color-primary)/10 transition-all"
                          title="Edit"
                        >
                          <i className="fas fa-pen-to-square text-[13px]" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteConfirm({ id: post.id, title: post.title })
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Delete"
                        >
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
            Showing {filtered.length} of {posts.length} post
            {posts.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
