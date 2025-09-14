/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ allow Google profile pics
  },
};

export default nextConfig;
