export const errorToText = (err, fallback = "Произошла ошибка") =>
  err?.response?.data?.error ?? err?.message ?? fallback;
