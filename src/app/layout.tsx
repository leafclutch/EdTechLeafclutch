import type { Metadata } from "next";
import { Saira, Montserrat } from "next/font/google";
import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://leafclutchtech.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Leafclutch Technologies | Best IT Training & Internship in Nepal | Bhairahawa, Butwal",
    template: "%s | Leafclutch Technologies",
  },
  description:
    "Leafclutch Technologies — Nepal's leading IT training & internship provider in Bhairahawa and Butwal. Learn AI, Web Development, Cybersecurity, UI/UX Design, Graphic Design & Data Science with real-world projects, expert mentorship, and job placement support.",
  keywords: [
    "Leafclutch Technologies",
    "Leafclutch training",
    "IT training Nepal",
    "internship in Nepal",
    "internship in Bhairahawa",
    "internship in Butwal",
    "IT company in Nepal",
    "IT company in Butwal",
    "IT company in Bhairahawa",
    "software company in Nepal",
    "software company in Butwal",
    "software company in Bhairahawa",
    "job in Nepal",
    "tech job Nepal",
    "AI training Nepal",
    "web development course Nepal",
    "cybersecurity training Nepal",
    "UI UX design course Nepal",
    "graphic design training Nepal",
    "data science course Nepal",
    "coding bootcamp Nepal",
    "tech education Rupandehi",
    "IT internship Lumbini",
    "best IT training Bhairahawa",
    "software training Butwal",
    "tech career Nepal",
    "programming course Nepal",
    "computer training Bhairahawa",
    "Nepal tech company",
  ],
  authors: [{ name: "Leafclutch Technologies Pvt. Ltd." }],
  creator: "Leafclutch Technologies Pvt. Ltd.",
  publisher: "Leafclutch Technologies Pvt. Ltd.",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    title:
      "Leafclutch Technologies | IT Training, Internship & Software Company in Nepal",
    description:
      "Industry-focused training and internship programs in AI, Web Development, Cybersecurity, UI/UX, Graphic Design & Data Science. Based in Bhairahawa & Butwal, Nepal.",
    url: SITE_URL,
    type: "website",
    siteName: "Leafclutch Technologies",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leafclutch Technologies — IT Training & Internship in Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leafclutch Technologies | IT Training & Internship in Nepal",
    description:
      "Nepal's leading IT training & internship provider. AI, Web Dev, Cybersecurity, UI/UX, Graphic Design & Data Science courses in Bhairahawa & Butwal.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saira.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
