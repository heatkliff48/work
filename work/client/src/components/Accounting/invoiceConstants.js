export const COMPANY_INFO = {
  nameLines: ['BAUBLOCK MATERIALES AVANZADOS DE', 'CONSTRUCCION SL, B16868028'],
  addressLines: [
    'Dirección: CALLE ALBERT EINSTEIN, NUM. 21',
    '11500, EL PUERTO DE SANTA MARÍA, Cádiz',
    'España',
  ],
  nif: 'NIF: B16868028',
  tel: 'Tel: 661195206',
  email: ' E-Mail: contabilidad@baublock.com',
  iban: 'IBAN: ES37 0182 3240 0002 0189 7538',
};

export const INVOICE_DEFAULTS = {
  paymentForm: 'Confirming 120 dias',
  bankFooter:
    'Bank: Banco Bilbao Vizcaya Argentaria, S.a.; SWIFT: BBVAESMMXXX, IBAN: ES3701823240000201897538',
  payerNote: 'El pagador es responsable de todas las comisiones bancarias',
  envRegister: '"Nº de Registro de productor ENV/2025/000053772"',
  currency: 'EUR',
  observacionesComment: 'Nº de Registro de productor ENV/2025/000053772',
};

export const ID_TYPE_OPTIONS = [
  { label: 'CIF', value: 'CIF' },
  { label: 'NIE', value: 'NIE' },
  { label: 'NIF', value: 'NIF' },
  { label: 'VAT', value: 'VAT' },
  { label: 'DNI', value: 'DNI' },
];

const ID_FIELD_MAP = {
  CIF: ['cif', 'cif_vat', 'tin'],
  NIE: ['nie'],
  NIF: ['nif'],
  VAT: ['cif_vat', 'vat'],
  DNI: ['dni'],
};

export const resolveOwnerIdValue = (owner, idType) => {
  if (!owner) return '';

  const keys = ID_FIELD_MAP[idType] || [];
  for (const key of keys) {
    if (owner[key]) return owner[key];
  }

  return owner.cif_vat || owner.cif || owner.tin || '';
};

export const getDefaultIdType = (owner) => {
  for (const option of ID_TYPE_OPTIONS) {
    if (resolveOwnerIdValue(owner, option.value)) {
      return option.value;
    }
  }

  return 'CIF';
};
