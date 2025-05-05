/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurer les en-têtes pour Shopify
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 