import { cookies } from "next/headers";

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not configured."
    );
  }

  return siteUrl.trim().replace(/\/+$/, "");
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => {
      return `${name}=${value}`;
    })
    .join("; ");
}

export async function feApiRequest({
  path,
  method = "GET",
}) {
  if (
    typeof path !== "string" ||
    !path.startsWith("/api/")
  ) {
    throw new Error(
      "FE API requests must target an /api path."
    );
  }

  const response = await fetch(
    `${getSiteUrl()}${path}`,
    {
      method,
      headers: {
        cookie: await getCookieHeader(),
      },
      cache: "no-store",
    }
  );

  const payload = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        `FE API request failed with status ${response.status}.`
    );

    error.status = response.status;
    error.payload = payload;

    throw error;
  }

  return payload;
}