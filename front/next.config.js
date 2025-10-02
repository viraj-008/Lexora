/**
 * Next.js rewrites: proxy /api/* to backend during local development so cookies are same-origin
 */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};
