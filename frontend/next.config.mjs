/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Mandatory for Static Site deployment
  images: {
    unoptimized: true, // Required if using next/image with static export
  },
};

export default nextConfig;