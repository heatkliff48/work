export const errorToText = (err, fallback = "An error occurred") =>
  err?.response?.data?.error ?? err?.message ?? fallback;
