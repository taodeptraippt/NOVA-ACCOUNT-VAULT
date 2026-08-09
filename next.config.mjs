/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  // No rewrites needed â€” backend is now Next.js API Routes in the same app.
};

export default nextConfig;

