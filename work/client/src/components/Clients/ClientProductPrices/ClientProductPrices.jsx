import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '#components/Table/Table.jsx';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import {
  addClientProductPrice,
  deleteClientProductPrice,
} from '#components/redux/actions/clientProductPricesAction.js';
import './ClientProductPrices.css';

const productLabel = (product) => {
  if (!product) return '';
  const article = product.article || '';
  const description = product.description || product.tradingMark || '';
  return [article, description].filter(Boolean).join(' — ');
};

export default function ClientProductPrices() {
  const dispatch = useDispatch();
  const { latestProducts } = useProductsContext();
  const { user, roles, checkUserAccess } = useUsersContext();
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const rows = useSelector((state) => state.clientProductPrices);
  const access = checkUserAccess(user, roles, 'client_product_prices');

  const [productId, setProductId] = useState('');
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [price, setPrice] = useState('');

  const products = useMemo(
    () =>
      [...(latestProducts || [])].sort((a, b) =>
        String(a.article || '').localeCompare(String(b.article || '')),
      ),
    [latestProducts],
  );
  const clientList = useMemo(
    () =>
      [...(clients || [])].sort((a, b) =>
        String(a.c_name || '').localeCompare(String(b.c_name || '')),
      ),
    [clients],
  );
  const projects = useMemo(
    () =>
      (deliveryAddresses || []).filter(
        (address) => String(address.client_id) === String(clientId),
      ),
    [deliveryAddresses, clientId],
  );

  const productById = useMemo(() => {
    const map = new Map();
    (latestProducts || []).forEach((product) => map.set(product.id, product));
    return map;
  }, [latestProducts]);
  const clientById = useMemo(() => {
    const map = new Map();
    (clients || []).forEach((client) => map.set(client.id, client));
    return map;
  }, [clients]);
  const projectById = useMemo(() => {
    const map = new Map();
    (deliveryAddresses || []).forEach((address) => map.set(address.id, address));
    return map;
  }, [deliveryAddresses]);

  const tableRows = useMemo(
    () =>
      [...(rows || [])]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .map((row) => ({
          ...row,
          product: productLabel(productById.get(row.product_id)),
          client: clientById.get(row.client_id)?.c_name || '',
          project: row.delivery_address_id
            ? projectById.get(row.delivery_address_id)?.project_name || ''
            : '',
        })),
    [rows, productById, clientById, projectById],
  );

  const columns = useMemo(
    () => [
      { Header: 'Product', accessor: 'product' },
      { Header: 'Client', accessor: 'client' },
      { Header: 'Project', accessor: 'project' },
      { Header: 'Price', accessor: 'price' },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }) =>
          access.canWrite ? (
            <button
              type="button"
              className="table_button"
              onClick={(event) => {
                event.stopPropagation();
                dispatch(deleteClientProductPrice(value));
              }}
            >
              Delete
            </button>
          ) : null,
      },
    ],
    [access.canWrite, dispatch],
  );

  const onClientChange = (value) => {
    setClientId(value);
    setProjectId('');
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const priceNumber = Number(String(price).replace(',', '.'));
    if (!productId || !clientId || !Number.isFinite(priceNumber) || priceNumber < 0) {
      return;
    }
    dispatch(
      addClientProductPrice({
        product_id: Number(productId),
        client_id: Number(clientId),
        delivery_address_id: projectId ? Number(projectId) : null,
        price: priceNumber,
      }),
    );
    setPrice('');
  };

  return (
    <>
      {access.canWrite && (
        <form className="cpp-form" onSubmit={onSubmit}>
          <div className="cpp-field">
            <label htmlFor="cpp-product">Product</label>
            <select
              id="cpp-product"
              value={productId}
              required
              onChange={(event) => setProductId(event.target.value)}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {productLabel(product)}
                </option>
              ))}
            </select>
          </div>
          <div className="cpp-field">
            <label htmlFor="cpp-client">Client</label>
            <select
              id="cpp-client"
              value={clientId}
              required
              onChange={(event) => onClientChange(event.target.value)}
            >
              <option value="">Select client</option>
              {clientList.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.c_name}
                </option>
              ))}
            </select>
          </div>
          <div className="cpp-field">
            <label htmlFor="cpp-project">Project</label>
            <select
              id="cpp-project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={!clientId}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.project_name || project.street || project.id}
                </option>
              ))}
            </select>
          </div>
          <div className="cpp-field">
            <label htmlFor="cpp-price">Price</label>
            <input
              id="cpp-price"
              type="text"
              inputMode="decimal"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <button className="table_button cpp-submit" type="submit">
            Add
          </button>
        </form>
      )}
      <Table
        COLUMN_DATA={columns}
        dataOfTable={tableRows}
        tableName="Client product prices"
        userAccess={access}
      />
    </>
  );
}
