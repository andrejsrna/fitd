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
    ],
  }, 
  async redirects() {
    return [
      {
        source: '/:slug', // Pôvodná cesta s dynamickým segmentom
        destination: '/clanky/:slug', // Nová cesta s rovnakým segmentom
        permanent: true, // Nastavenie 301 presmerovania
      },
    ]
  },
  };

export default nextConfig;
