"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navGroups = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "fa-house",
        description: "Overview & stats",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Courses",
        href: "/admin/courses",
        icon: "fa-graduation-cap",
        description: "Training programs",
      },
      {
        label: "Blog Posts",
        href: "/admin/blog",
        icon: "fa-newspaper",
        description: "Articles & news",
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: "fa-quote-left",
        description: "Student reviews",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        label: "Enrollments",
        href: "/admin/enrollments",
        icon: "fa-user-plus",
        description: "Student applications",
        badgeKey: "pendingEnrollments" as const,
      },
      {
        label: "Messages",
        href: "/admin/contacts",
        icon: "fa-envelope",
        description: "Contact inquiries",
        badgeKey: "unreadContacts" as const,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: "fa-sliders",
        description: "Site configuration",
      },
    ],
  },
];

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labels: Record<string, string> = {
    admin: "Dashboard",
    courses: "Courses",
    blog: "Blog Posts",
    enrollments: "Enrollments",
    contacts: "Messages",
    testimonials: "Testimonials",
    settings: "Settings",
    login: "Login",
    new: "Create New",
  };

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    if (segment === "admin") {
      crumbs.push({ label: "Dashboard", href: "/admin" });
    } else {
      const label = labels[segment] || (segment.length > 8 ? "Edit" : segment);
      crumbs.push({ label, href: path });
    }
  }
  return crumbs;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState({
    pendingEnrollments: 0,
    unreadContacts: 0,
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!session?.user) {
          router.replace("/admin/login");
        } else {
          setUser(session.user);
          setLoading(false);
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Load badge counts
  useEffect(() => {
    async function loadBadges() {
      const [unread, pending] = await Promise.all([
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      setBadges({
        unreadContacts: unread.count ?? 0,
        pendingEnrollments: pending.count ?? 0,
      });
    }
    if (!loading) loadBadges();

    const channel = supabase
      .channel("admin-layout-badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrollments" },
        () => loadBadges(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => loadBadges(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-light-bg)">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-(--color-primary)/20 border-t-(--color-primary) rounded-full animate-spin mx-auto mb-4" />
          <p className="text-(--color-text) text-[15px] font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const breadcrumbs = getBreadcrumbs(pathname);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";
  const userInitial = user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-(--color-light-bg) flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-(--color-dark) text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <Link
            href="/admin"
            className="flex items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Leafclutch Technologies"
              width={130}
              height={36}
            />
            <span className="text-[11px] bg-(--color-primary) text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1">
              <div className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const badgeCount =
                  "badgeKey" in item ? badges[item.badgeKey] : 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${isActive ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <i
                      className={`fas ${item.icon} w-5 text-center text-[14px]`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-(--color-primary) flex items-center justify-center text-white font-bold text-[13px]">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-white font-medium truncate">
                {user?.email}
              </div>
              <div className="text-[10px] text-gray-500">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-[12px] text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all rounded-lg py-2"
          >
            <i className="fas fa-right-from-bracket" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-(--color-border) px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-(--color-dark) text-[20px] hover:text-(--color-primary) transition-colors"
            >
              <i className="fas fa-bars" />
            </button>
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-[13px]">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <i className="fas fa-chevron-right text-[9px] text-gray-300" />
                  )}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-(--color-dark) font-semibold">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-(--color-text-light) hover:text-(--color-primary) transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
            <h2 className="sm:hidden text-[16px] font-bold text-(--color-dark) font-heading">
              {pageTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-[12px] text-(--color-text) hover:text-(--color-primary) transition-colors flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              <i className="fas fa-external-link text-[10px]" /> View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
