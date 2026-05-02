import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/courses",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/courses/:slug",
        destination: "/programs/:slug",
        permanent: true,
      },
      {
        source: "/admin/courses",
        destination: "/admin/programs",
        permanent: true,
      },
      {
        source: "/admin/courses/:path*",
        destination: "/admin/programs/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
