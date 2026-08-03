const previewBannerSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#100d0a" />
        <stop offset="0.55" stop-color="#3a2a17" />
        <stop offset="1" stop-color="#9b7940" />
      </linearGradient>
    </defs>
    <rect width="1200" height="420" fill="url(#sky)" />
    <circle cx="930" cy="105" r="58" fill="#d8bd7a" opacity="0.9" />
    <path d="M0 330L180 190l130 100 190-170 170 145 150-105 180 170 200-90v180H0z" fill="#17130f" opacity="0.9" />
    <path d="M0 365l220-110 150 90 210-125 170 85 190-95 260 155v55H0z" fill="#090807" opacity="0.95" />
  </svg>
`);

export const profileBannerImageFixture = {
  bannerUrl: `data:image/svg+xml,${previewBannerSvg}`,
  title: "Aria Vale profile banner",
  compact: false,
};

export const profileBannerCompactImageFixture = {
  bannerUrl: `data:image/svg+xml,${previewBannerSvg}`,
  title: "Compact creator profile banner",
  compact: true,
};

export const profileBannerEmptyFixture = {
  bannerUrl: null,
  title: "Profile Banner",
  compact: false,
};

export const profileBannerCompactEmptyFixture = {
  bannerUrl: null,
  title: "Profile Banner",
  compact: true,
};

export const profileBannerLongTitleFixture = {
  bannerUrl: `data:image/svg+xml,${previewBannerSvg}`,
  title:
    "A deliberately long accessible profile-banner title used to verify image alternative text",
  compact: false,
};
