"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const courseDropdown = [
  { href: "/courses", label: "All Courses" },
  { href: "/courses/ai-ml", label: "AI & Machine Learning" },
  { href: "/courses/web-dev", label: "Web Development" },
  { href: "/courses/cybersecurity", label: "Cybersecurity" },
  { href: "/courses/ui-ux", label: "UI/UX Design" },
  { href: "/courses/graphic-design", label: "Graphic Designing" },
  { href: "/courses/data-science", label: "Data Science" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses", dropdown: courseDropdown },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdown(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="logo">
          <Image
            src="/logo.png"
            alt="Leafclutch Technologies"
            width={160}
            height={45}
            className="logo-img"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <ul className="nav-menu">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={link.dropdown ? "has-dropdown" : ""}
              >
                <Link
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                >
                  {link.label}
                  {link.dropdown && (
                    <i className="fas fa-chevron-down nav-arrow" />
                  )}
                </Link>
                {link.dropdown && (
                  <ul className="dropdown">
                    {link.dropdown.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/contact" className="btn btn-login">
            Get in Touch
          </Link>
          <Link href="/courses" className="btn btn-signup">
            Explore Courses
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${mobileOpen ? "is-active" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`mobile-backdrop ${mobileOpen ? "is-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "is-open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="logo" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.png"
              alt="Leafclutch Technologies"
              width={140}
              height={40}
              className="logo-img"
            />
          </Link>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <div key={link.href} className="mobile-nav-item">
              {link.dropdown ? (
                <>
                  <button
                    className={`mobile-nav-link ${isActive(link.href) ? "active" : ""}`}
                    onClick={() => setMobileDropdown(!mobileDropdown)}
                  >
                    {link.label}
                    <i
                      className={`fas fa-chevron-down mobile-nav-arrow ${mobileDropdown ? "rotated" : ""}`}
                    />
                  </button>
                  <div
                    className={`mobile-dropdown ${mobileDropdown ? "is-open" : ""}`}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`mobile-dropdown-link ${isActive(item.href) ? "active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <i className="fas fa-chevron-right" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`mobile-nav-link ${isActive(link.href) ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="mobile-drawer-actions">
          <Link
            href="/contact"
            className="btn btn-outline-dark btn-block"
            onClick={() => setMobileOpen(false)}
          >
            Get in Touch
          </Link>
          <Link
            href="/courses"
            className="btn btn-primary btn-block"
            onClick={() => setMobileOpen(false)}
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </header>
  );
}
