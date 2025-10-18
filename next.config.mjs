/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ allow Google profile pics
  },
  // webpack: (config) => {
  //   // Ignore source map files from node_modules
  //   config.module.rules.push({
  //     test: /\.js\.map$/,
  //     loader: "ignore-loader",
  //   });
  //   return config;
  // },
};

export default nextConfig;
