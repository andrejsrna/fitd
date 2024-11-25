/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.WORDPRESS_HOSTNAME,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-f4ce0204c4174de68e672172e4a34906.r2.dev", // Allow images from R2 bucket
        port: "",
        pathname: "/**",
      },
    ],
  }, 
  };

export default nextConfig;
