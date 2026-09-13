/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // The share-card image route reads app/theme.css and its vendored
  // font files at request time (fe/share-og brief 1); the standalone
  // build has to carry both.
  outputFileTracingIncludes: {
    "/api/share-card/[id]": ["./app/theme.css", "./lib/server/share-card/fonts/*.woff"],
  },
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
