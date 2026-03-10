import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-preview";
import { CoursesSection } from "@/components/sections/courses-preview";
import { WhyUsSection } from "@/components/sections/why-us";
import { PricingSection } from "@/components/sections/pricing";

export const metadata: Metadata = {
  title:
    "Leafclutch Technologies | Best IT Training & Internship in Nepal | Bhairahawa, Butwal",
  description:
    "Leafclutch Technologies — Nepal's leading IT training, internship & software company in Bhairahawa and Butwal. Learn AI, Web Development, Cybersecurity, UI/UX Design, Graphic Design & Data Science with real-world projects, expert mentorship, and job placement support.",
  keywords: [
    "Leafclutch Technologies",
    "IT training Nepal",
    "internship Nepal",
    "IT company Bhairahawa",
    "software company Butwal",
    "tech internship Nepal",
    "coding bootcamp Nepal",
    "AI training Bhairahawa",
    "web development Butwal",
    "best IT training Nepal",
    "IT company Nepal",
    "job in Nepal",
    "tech job Bhairahawa",
  ],
  alternates: { canonical: "https://leafclutchtech.com.np" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <WhyUsSection />
      <PricingSection />
    </>
  );
}
