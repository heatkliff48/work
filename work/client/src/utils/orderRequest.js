// Номер заказа присваивает сервер, клиент передаёт только свою дату (ДДММГГ),
// чтобы номер совпадал с днём пользователя, а не с часовым поясом сервера
export const getArticleDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

// Ключ попытки создания заказа: при повторной отправке сервер вернёт уже
// созданный заказ. crypto.randomUUID есть не везде (только HTTPS/localhost)
export const createClientRequestId = () =>
  window.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
