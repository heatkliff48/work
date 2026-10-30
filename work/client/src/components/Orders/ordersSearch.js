/* ──────────────────────────────────────────────────────────────────
   Поиск на общей странице заказов. Кроме колонок таблицы ищем по
   данным клиента ЭТОГО заказа: сам клиент, его юр. адрес, адрес
   доставки (проект) заказа, основной и дополнительный контакты.
   Другие адреса/контакты клиента, не привязанные к заказу, не берём.
   ────────────────────────────────────────────────────────────────── */

const CLIENT_FIELDS = ['c_name', 'cif_vat'];

const LEGAL_ADDRESS_FIELDS = [
  'street',
  'additional_info',
  'city',
  'zip_code',
  'province',
  'country',
  'phone_office',
  'fax',
  'phone_mobile',
  'web_link',
  'email',
];

const DELIVERY_ADDRESS_FIELDS = [
  'project_name',
  'street',
  'additional_info',
  'city',
  'zip_code',
  'province',
  'country',
  'phone_number',
  'email',
];

const CONTACT_FIELDS = [
  'first_name',
  'last_name',
  'preffered_name',
  'address',
  'formal_position',
  'role_in_the_org',
  'phone_number_office',
  'phone_number_mobile',
  'phone_number_messenger',
  'email',
  'linkedin',
  'social',
];

// Поля, которые пишут по-разному ("600 12 34 56" / "600123456",
// "B-12345678" / "B12345678") — дублируем их без разделителей
const COMPACT_FIELDS = new Set([
  'cif_vat',
  'phone_office',
  'fax',
  'phone_mobile',
  'phone_number',
  'phone_number_office',
  'phone_number_mobile',
  'phone_number_messenger',
]);

// Регистр и диакритика не важны: "malaga" найдёт "Málaga"
export const normalizeSearch = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const compact = (value) => value.replace(/[^\p{L}\p{N}]/gu, '');

function pushFields(parts, entity, fields) {
  if (!entity) return;
  fields.forEach((field) => {
    const value = entity[field];
    if (value === null || value === undefined || value === '') return;
    const text = normalizeSearch(value);
    parts.push(text);
    if (COMPACT_FIELDS.has(field)) parts.push(compact(text));
  });
}

const byId = (list) =>
  new Map((Array.isArray(list) ? list : []).map((item) => [item.id, item]));

/**
 * Map: id заказа → строка для поиска по данным клиента заказа.
 * Связи такие же, как в getCurrentOrderInfoHandler (OrderContext).
 */
export function buildOrdersSearchIndex(
  orders,
  {
    clients,
    legalAddresses,
    deliveryAddresses,
    contactInfos,
    categoryOptions = [],
    priceCategoryOptions = [],
  },
) {
  const index = new Map();
  if (!Array.isArray(orders)) return index;

  const clientsById = byId(clients);
  // юр. адрес хранится с тем же id, что и клиент
  const legalById = byId(legalAddresses);
  const deliveryById = byId(deliveryAddresses);
  const contactsById = byId(contactInfos);

  orders.forEach((order) => {
    const parts = [];
    const client = clientsById.get(order.owner);

    pushFields(parts, client, CLIENT_FIELDS);
    if (client) {
      const category = categoryOptions.find(
        (option) => option.value == client.category,
      )?.label;
      const priceCategory = priceCategoryOptions.find(
        (option) => option.value == client.price_category,
      )?.label;
      pushFields(parts, { category, priceCategory }, [
        'category',
        'priceCategory',
      ]);
    }

    pushFields(parts, legalById.get(order.owner), LEGAL_ADDRESS_FIELDS);

    const deliveryAddress = deliveryById.get(order.del_adr_id);
    if (deliveryAddress?.client_id === order.owner)
      pushFields(parts, deliveryAddress, DELIVERY_ADDRESS_FIELDS);

    const contact = contactsById.get(order.contact_id);
    if (contact?.client_id === order.owner)
      pushFields(parts, contact, CONTACT_FIELDS);

    if (order.secondary_contact)
      pushFields(
        parts,
        contactsById.get(Number(order.secondary_contact)),
        CONTACT_FIELDS,
      );

    index.set(order.id, parts.join('\n'));
  });

  return index;
}

/**
 * globalFilter для react-table: каждое слово запроса должно найтись
 * либо в колонках строки, либо в данных клиента заказа.
 * "garcia madrid" — заказы клиента García с адресом в Madrid.
 */
export function makeOrdersGlobalFilter(searchIndex) {
  return (rows, columnIds, filterValue) => {
    const tokens = normalizeSearch(filterValue).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return rows;

    return rows.filter((row) => {
      const haystack = [
        ...columnIds.map((id) => normalizeSearch(row.values[id])),
        searchIndex.get(row.original.id) || '',
      ].join('\n');
      return tokens.every((token) => {
        if (haystack.includes(token)) return true;
        const compactToken = compact(token);
        return compactToken !== '' && haystack.includes(compactToken);
      });
    });
  };
}
