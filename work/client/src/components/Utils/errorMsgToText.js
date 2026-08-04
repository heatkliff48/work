export const errorMsgToText = (err, fallback = "An error occurred") =>
  err?.response?.data?.message ?? err?.message ?? fallback;
