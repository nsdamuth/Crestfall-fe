/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
      {
        pathname: "/api/media/images/*/file",
        search: "?variant=thumbnail",
      },
      {
        pathname: "/api/studio/image-generation/outputs/*/file",
        search: "?variant=thumbnail",
      },
    ],
  },
};

export default nextConfig;
