const baseFixture = {
  className: "grid grid-cols-2 gap-3 text-center",
  errorMessage: "",
  metricItems: [
    { id: "characters", value: "14", label: "Characters" },
    { id: "canon", value: "3", label: "Canon" },
    { id: "interactions", value: "1,248", label: "Interactions" },
    { id: "likes", value: "392", label: "Likes" },
    { id: "images", value: "86", label: "Images" },
  ],
};

export const studioAccountMetricsReadyFixture = {
  ...baseFixture,
};

export const studioAccountMetricsEmptyFixture = {
  ...baseFixture,
  metricItems: baseFixture.metricItems.map((item) => ({
    ...item,
    value: "0",
  })),
};

export const studioAccountMetricsErrorFixture = {
  ...baseFixture,
  errorMessage: "Account metrics could not be loaded.",
  metricItems: baseFixture.metricItems.map((item) => ({
    ...item,
    value: "0",
  })),
};

export const studioAccountMetricsLargeValuesFixture = {
  ...baseFixture,
  metricItems: [
    { id: "characters", value: "12,480", label: "Characters" },
    { id: "canon", value: "3,901", label: "Canon" },
    { id: "interactions", value: "98,765,432", label: "Interactions" },
    { id: "likes", value: "4,208,117", label: "Likes" },
    { id: "images", value: "1,000,000", label: "Images" },
  ],
};

export const studioAccountMetricsWideLayoutFixture = {
  ...baseFixture,
  className:
    "grid grid-cols-2 gap-3 text-center sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4",
};
