export default function manifest() {
  return {
    name: "Crestfall",
    short_name: "Crestfall",
    description:
      "A creator platform for persistent interactive fiction, story rooms, characters, lore, and reusable narrative systems.",
    start_url: "/studio",
    scope: "/",
    display: "standalone",
    background_color: "#080706",
    theme_color: "#d6b86f",
    icons: [
      {
        src: "/assets/branding/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/branding/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/assets/branding/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}