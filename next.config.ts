import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Duplicate pages removed in Phase 0; keep old links and bookmarks working.
  // Temporary (307) rather than permanent so a rollback isn't defeated by browser caches.
  async redirects() {
    return [
      { source: '/dashboard/my-request', destination: '/dashboard/my-requests', permanent: false },
      { source: '/dashboard/my-task', destination: '/dashboard/my-tasks', permanent: false },
      { source: '/dashboard/payslip-income-tax', destination: '/dashboard/payslip-and-income-tax', permanent: false },
    ];
  },
};

export default nextConfig;
