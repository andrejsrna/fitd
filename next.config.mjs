/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.WORDPRESS_HOSTNAME,
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:slug([a-zA-Z0-9-]+)/', // Prispôsobte regex podľa potreby
        destination: '/clanky/:slug/',
        permanent: true,
      },
      // Ďalšie redirecty
    ]
  },
};

export default nextConfig;
