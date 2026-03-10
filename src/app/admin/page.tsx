"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

interface Stats {
  courses: number;
  blogPosts: number;
  enrollments: number;
  contacts: number;
  testimonials: number;
  unreadContacts: number;
  pendingEnrollments: number;
}

interface RecentEnrollment {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
}

interface RecentMessage {
  id: string;
  full_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<
    RecentEnrollment[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  useEffect(() => {
    async function loadData() {
      const [
        courses,
        blog,
        enrollments,
        contacts,
        testimonials,
        unread,
        pending,
      ] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase
          .from("blog_posts")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      setStats({
        courses: courses.count ?? 0,
        blogPosts: blog.count ?? 0,
        enrollments: enrollments.count ?? 0,
        contacts: contacts.count ?? 0,
        testimonials: testimonials.count ?? 0,
        unreadContacts: unread.count ?? 0,
        pendingEnrollments: pending.count ?? 0,
      });

      // Load recent data
      const [recentE, recentM] = await Promise.all([
        supabase
          .from("enrollments")
          .select("id,full_name,email,status,created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("contact_messages")
          .select("id,full_name,message,is_read,created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setRecentEnrollments((recentE.data as RecentEnrollment[]) ?? []);
      setRecentMessages((recentM.data as RecentMessage[]) ?? []);
    }
    loadData();

    const channels = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrollments" },
        () => loadData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => loadData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Courses",
          value: stats.courses,
          icon: "fa-graduation-cap",
          color: "from-blue-500 to-blue-600",
          lightBg: "bg-blue-50",
          lightText: "text-blue-600",
          href: "/admin/courses",
          description: "Training programs available",
        },
        {
          label: "Blog Posts",
          value: stats.blogPosts,
          icon: "fa-newspaper",
          color: "from-purple-500 to-purple-600",
          lightBg: "bg-purple-50",
          lightText: "text-purple-600",
          href: "/admin/blog",
          description: "Published articles",
        },
        {
          label: "Enrollments",
          value: stats.enrollments,
          icon: "fa-user-plus",
          color: "from-emerald-500 to-emerald-600",
          lightBg: "bg-emerald-50",
          lightText: "text-emerald-600",
          href: "/admin/enrollments",
          description: "Student applications",
          badge:
            stats.pendingEnrollments > 0
              ? `${stats.pendingEnrollments} need review`
              : undefined,
        },
        {
          label: "Messages",
          value: stats.contacts,
          icon: "fa-envelope",
          color: "from-amber-500 to-amber-600",
          lightBg: "bg-amber-50",
          lightText: "text-amber-600",
          href: "/admin/contacts",
          description: "Contact inquiries",
          badge:
            stats.unreadContacts > 0
              ? `${stats.unreadContacts} unread`
              : undefined,
        },
        {
          label: "Testimonials",
          value: stats.testimonials,
          icon: "fa-quote-left",
          color: "from-pink-500 to-pink-600",
          lightBg: "bg-pink-50",
          lightText: "text-pink-600",
          href: "/admin/testimonials",
          description: "Student reviews",
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-heading text-[28px] font-bold text-(--color-dark)">
          {getGreeting()} <span className="text-(--color-primary)">!</span>
        </h1>
        <p className="text-(--color-text) text-[15px] mt-1">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      {!stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 h-[120px] animate-pulse border border-(--color-border)"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl p-5 border border-(--color-border) hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`${card.lightBg} w-10 h-10 rounded-xl flex items-center justify-center ${card.lightText} group-hover:scale-110 transition-transform`}
                >
                  <i className={`fas ${card.icon} text-[16px]`} />
                </div>
                <i className="fas fa-arrow-right text-[11px] text-gray-300 group-hover:text-(--color-primary) group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[28px] font-bold text-(--color-dark) font-heading leading-none">
                {card.value}
              </p>
              <p className="text-[12px] text-(--color-text-light) font-medium mt-1">
                {card.label}
              </p>
              {card.badge && (
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  {card.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-heading text-[18px] font-bold text-(--color-dark) mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Add New Course",
              href: "/admin/courses/new",
              icon: "fa-plus-circle",
              description: "Create a training program",
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Write Blog Post",
              href: "/admin/blog/new",
              icon: "fa-pen-to-square",
              description: "Publish an article",
              color: "text-purple-600 bg-purple-50",
            },
            {
              label: "Review Enrollments",
              href: "/admin/enrollments",
              icon: "fa-clipboard-check",
              description: "Check pending applications",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Site Settings",
              href: "/admin/settings",
              icon: "fa-sliders",
              description: "Update site configuration",
              color: "text-gray-600 bg-gray-100",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3.5 bg-white rounded-xl px-4 py-4 border border-(--color-border) hover:border-(--color-primary)/30 hover:shadow-md transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform flex-shrink-0`}
              >
                <i className={`fas ${action.icon} text-[15px]`} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-(--color-dark) group-hover:text-(--color-primary) transition-colors">
                  {action.label}
                </div>
                <div className="text-[11px] text-(--color-text-light)">
                  {action.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-(--color-border)">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <i className="fas fa-user-plus text-[13px]" />
              </div>
              <h3 className="font-heading text-[15px] font-bold text-(--color-dark)">
                Recent Enrollments
              </h3>
            </div>
            <Link
              href="/admin/enrollments"
              className="text-[12px] text-(--color-primary) hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <div className="p-8 text-center text-(--color-text-light) text-[13px]">
              No enrollments yet
            </div>
          ) : (
            <div className="divide-y divide-(--color-border)">
              {recentEnrollments.map((e) => (
                <div
                  key={e.id}
                  className="px-5 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-(--color-dark) truncate">
                        {e.full_name}
                      </div>
                      <div className="text-[11px] text-(--color-text-light) truncate">
                        {e.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusStyles[e.status] || "bg-gray-100 text-gray-500"}`}
                      >
                        {e.status}
                      </span>
                      <span className="text-[10px] text-(--color-text-light)">
                        {timeAgo(e.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-(--color-border)">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <i className="fas fa-envelope text-[13px]" />
              </div>
              <h3 className="font-heading text-[15px] font-bold text-(--color-dark)">
                Recent Messages
              </h3>
            </div>
            <Link
              href="/admin/contacts"
              className="text-[12px] text-(--color-primary) hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-(--color-text-light) text-[13px]">
              No messages yet
            </div>
          ) : (
            <div className="divide-y divide-(--color-border)">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  className={`px-5 py-3 hover:bg-gray-50/50 transition-colors ${!m.is_read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-(--color-dark)">
                          {m.full_name}
                        </span>
                        {!m.is_read && (
                          <span className="w-2 h-2 bg-(--color-primary) rounded-full" />
                        )}
                      </div>
                      <div className="text-[11px] text-(--color-text-light) truncate">
                        {m.message || "No message"}
                      </div>
                    </div>
                    <span className="text-[10px] text-(--color-text-light) flex-shrink-0 ml-3">
                      {timeAgo(m.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
