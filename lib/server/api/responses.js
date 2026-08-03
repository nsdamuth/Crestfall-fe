import { NextResponse } from "next/server";

export function apiOk(data, init) {
  return NextResponse.json(
    {
      data,
      error: null,
    },
    init
  );
}

export function apiError(
  message,
  status = 400,
  code = "BAD_REQUEST",
  details = null
) {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}