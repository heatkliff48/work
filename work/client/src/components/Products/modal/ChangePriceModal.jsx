import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { changeProductPrices } from '#components/redux/actions/productsAction.js';

const groupKey = (tradingMark, density) =>
  `${tradingMark ?? ''}|${Number(density)}`;

// Поле вводится текстом и может содержать запятую ("111,1").
// Пустое поле — null (цену не меняем), некорректное — NaN
const parsePrice = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.');
  if (normalized === '') return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN;
};

// Цена за м³ для всех блоков одной марки и плотности.
// Каждый продукт, у которого цена изменится, получает новую версию
const ChangePriceModal = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const { latestProducts } = useProductsContext();

  // Только то, что ввёл пользователь; остальные поля показывают текущую цену
  const [edits, setEdits] = useState({});

  const groups = useMemo(() => {
    const byKey = new Map();
    (latestProducts ?? []).forEach((product) => {
      const key = groupKey(product.tradingMark, product.density);
      if (!byKey.has(key)) {
        byKey.set(key, {
          key,
          tradingMark: product.tradingMark ?? null,
          density: Number(product.density),
          products: [],
        });
      }
      byKey.get(key).products.push(product);
    });

    return [...byKey.values()]
      .map((group) => {
        const prices = new Set(group.products.map(({ price }) => price));
        return {
          ...group,
          isMixed: prices.size > 1,
          currentPrice: prices.size === 1 ? [...prices][0] : null,
        };
      })
      .sort(
        (a, b) =>
          (a.tradingMark ?? '').localeCompare(b.tradingMark ?? '') ||
          a.density - b.density,
      );
  }, [latestProducts]);

  const hasInvalid = groups.some(
    ({ key }) => key in edits && Number.isNaN(parsePrice(edits[key])),
  );

  const changes = groups.flatMap((group) => {
    if (!(group.key in edits)) return [];

    const price = parsePrice(edits[group.key]);
    if (price === null || Number.isNaN(price)) return [];

    const affected = group.products.filter((p) => p.price !== price).length;
    return affected ? [{ group, price, affected }] : [];
  });
  const changedKeys = new Set(changes.map(({ group }) => group.key));
  const affectedTotal = changes.reduce(
    (sum, { affected }) => sum + affected,
    0,
  );

  const saveHandler = () => {
    const confirmed = window.confirm(
      `Change price for ${affectedTotal} product(s)?\n\n` +
        'Each of them will get a new version.',
    );
    if (!confirmed) return;

    dispatch(
      changeProductPrices(
        changes.map(({ group, price }) => ({
          tradingMark: group.tradingMark,
          density: group.density,
          price,
        })),
      ),
    );
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Change price</ModalHeader>
      <ModalBody>
        <Table size="sm" bordered hover responsive>
          <thead>
            <tr>
              <th>Trademark</th>
              <th>Density, kg/m³</th>
              <th>Price per m³, EURO</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(
              ({ key, tradingMark, density, isMixed, currentPrice }) => (
                <tr
                  key={key}
                  className={changedKeys.has(key) ? 'table-warning' : undefined}
                >
                  <td>{tradingMark || '—'}</td>
                  <td>{density}</td>
                  <td>
                    <Input
                      bsSize="sm"
                      type="text"
                      inputMode="decimal"
                      value={edits[key] ?? currentPrice ?? ''}
                      placeholder={isMixed ? 'Different prices' : ''}
                      invalid={
                        key in edits && Number.isNaN(parsePrice(edits[key]))
                      }
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <span className="me-auto">New versions: {affectedTotal}</span>
        <Button
          color="primary"
          disabled={hasInvalid || affectedTotal === 0}
          onClick={saveHandler}
        >
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangePriceModal;
