export const formatInvoiceDate = (date = new Date()) =>
  date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const formatInvoiceAmount = (value, fractionDigits = 2) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '0,00';

  return number.toLocaleString('es-ES', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatInvoiceUnitPrice = (value) => formatInvoiceAmount(value, 5);

export const formatClientAddressLines = (address = {}) => {
  const streetLine = [address.street, address.additional_info].filter(Boolean).join(', ');

  return [
    streetLine ? `Dirección: ${streetLine}` : 'Dirección:',
    [address.zip_code, address.city].filter(Boolean).join(', '),
    [address.province, address.country].filter(Boolean).join(', '),
  ];
};

export const formatClientAddress = (address = {}) =>
  formatClientAddressLines(address).filter(Boolean).join('\n');
