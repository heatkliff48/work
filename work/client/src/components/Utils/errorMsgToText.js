export const errorMsgToText = (err, fallback = "Произошла ошибка") =>
  err?.response?.data?.message ?? err?.message ?? fallback;
