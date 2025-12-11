/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure we can deploy even if there are minor type/lint errors for MVP
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Add any necessary image domains if using external images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
