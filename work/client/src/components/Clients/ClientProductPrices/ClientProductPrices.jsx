import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiSearch,
  FiInfo,
  FiAlertTriangle,
  FiX,
  FiRotateCcw,
} from 'react-icons/fi';
import Table from '#components/Table/Table.jsx';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import {
  addClientProductPrice,
  updateClientProductPrice,
  deleteClientProductPrice,
} from '#components/redux/actions/clientProductPricesAction.js';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import './ClientProductPrices.css';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 8,
    borderColor: state.isFocused ? '#bc1212' : '#dee1e6',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(188, 18, 18, 0.1)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#bc1212' : '#c4c8d0',
    },
  }),
};

const formatMoney = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parsePrice = (value) => {
  const num = Number(String(value ?? '').replace(',', '.').trim());
  return Number.isFinite(num) ? num : null;
};

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

  // Filters state
  const [clientFilter, setClientFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all' | 'base' | 'project'

  // Modal dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);

  // Create form state
  const [createProductId, setCreateProductId] = useState('');
  const [createClientId, setCreateClientId] = useState('');
  const [createScope, setCreateScope] = useState('base'); // 'base' | 'project'
  const [createProjectId, setCreateProjectId] = useState('');
  const [createPrice, setCreatePrice] = useState('');
  const [createError, setCreateError] = useState('');

  // Edit form state
  const [editPrice, setEditPrice] = useState('');
  const [editError, setEditError] = useState('');

  // Lookup maps
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

  // Options lists
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

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: product.id,
        label: productLabel(product),
      })),
    [products],
  );

  const clientOptions = useMemo(
    () =>
      clientList.map((client) => ({
        value: client.id,
        label: client.c_name || String(client.id),
      })),
    [clientList],
  );

  // Projects of the selected client in Create Modal
  const projectsForCreateClient = useMemo(() => {
    if (!createClientId) return [];
    return (deliveryAddresses || []).filter(
      (address) => String(address.client_id) === String(createClientId),
    );
  }, [deliveryAddresses, createClientId]);

  const projectOptionsForCreate = useMemo(
    () =>
      projectsForCreateClient.map((project) => ({
        value: project.id,
        label: project.project_name || project.street || `Project #${project.id}`,
      })),
    [projectsForCreateClient],
  );

  // Base price lookup for the selected product & client in Create Modal
  const createBasePriceRow = useMemo(() => {
    if (!createProductId || !createClientId) return null;
    return (rows || []).find(
      (row) =>
        Number(row.product_id) === Number(createProductId) &&
        Number(row.client_id) === Number(createClientId) &&
        row.delivery_address_id == null,
    );
  }, [rows, createProductId, createClientId]);

  // When scope is switched to project, ensure base price is present
  useEffect(() => {
    if (createScope === 'project' && !createBasePriceRow) {
      setCreateProjectId('');
    }
  }, [createScope, createBasePriceRow]);

  // Check if a rule already exists for this exact combination in Create Modal
  const existingRuleInCreate = useMemo(() => {
    if (!createProductId || !createClientId) return null;
    const targetProject =
      createScope === 'project' && createProjectId ? Number(createProjectId) : null;
    return (rows || []).find(
      (row) =>
        Number(row.product_id) === Number(createProductId) &&
        Number(row.client_id) === Number(createClientId) &&
        (targetProject == null
          ? row.delivery_address_id == null
          : Number(row.delivery_address_id) === targetProject),
    );
  }, [rows, createProductId, createClientId, createScope, createProjectId]);

  // Helper to check dependent project prices for a base price row
  const getDependentProjects = (row) => {
    if (row.delivery_address_id != null) return [];
    return (rows || []).filter(
      (r) =>
        Number(r.product_id) === Number(row.product_id) &&
        Number(r.client_id) === Number(row.client_id) &&
        r.delivery_address_id != null,
    );
  };

  // Find base price for a given row (used to calculate project delivery delta)
  const getBasePriceForRow = (row) => {
    if (row.delivery_address_id == null) return null;
    const base = (rows || []).find(
      (r) =>
        Number(r.product_id) === Number(row.product_id) &&
        Number(r.client_id) === Number(row.client_id) &&
        r.delivery_address_id == null,
    );
    return base ? Number(base.price) : null;
  };

  // Table rows enriched with metadata
  const tableRows = useMemo(() => {
    return [...(rows || [])]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((row) => {
        const product = productById.get(row.product_id);
        const client = clientById.get(row.client_id);
        const project = row.delivery_address_id
          ? projectById.get(row.delivery_address_id)
          : null;
        const catalogPrice = product?.price != null ? Number(product.price) : null;
        const basePrice = getBasePriceForRow(row);
        const deliveryDelta =
          basePrice != null ? Number(row.price) - basePrice : null;
        const dependentCount = getDependentProjects(row).length;

        return {
          ...row,
          productData: product,
          clientData: client,
          projectData: project,
          productLabel: productLabel(product),
          clientName: client?.c_name || `Client #${row.client_id}`,
          projectName: project?.project_name || (row.delivery_address_id ? `Project #${row.delivery_address_id}` : ''),
          catalogPrice,
          basePrice,
          deliveryDelta,
          dependentCount,
        };
      });
  }, [rows, productById, clientById, projectById]);

  // Filtered rows based on toolbar filters
  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      if (clientFilter && String(row.client_id) !== String(clientFilter)) {
        return false;
      }
      if (productFilter && String(row.product_id) !== String(productFilter)) {
        return false;
      }
      if (scopeFilter === 'base' && row.delivery_address_id != null) {
        return false;
      }
      if (scopeFilter === 'project' && row.delivery_address_id == null) {
        return false;
      }
      return true;
    });
  }, [tableRows, clientFilter, productFilter, scopeFilter]);

  // KPI statistics
  const stats = useMemo(() => {
    const total = (rows || []).length;
    const clientIds = new Set((rows || []).map((r) => r.client_id));
    const productIds = new Set((rows || []).map((r) => r.product_id));
    const projectPricesCount = (rows || []).filter(
      (r) => r.delivery_address_id != null,
    ).length;

    return {
      total,
      clientsCount: clientIds.size,
      productsCount: productIds.size,
      projectPricesCount,
    };
  }, [rows]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: 'Product',
        accessor: 'productLabel',
        Cell: ({ row }) => {
          const { productData } = row.original;
          return (
            <div className="cpp-cell-product">
              <span className="cpp-art">{productData?.article || '—'}</span>
              <span className="cpp-desc">
                {productData?.description || productData?.tradingMark || '—'}
              </span>
            </div>
          );
        },
      },
      {
        Header: 'Client',
        accessor: 'clientName',
        Cell: ({ row }) => {
          const { clientData, clientName } = row.original;
          return (
            <div className="cpp-cell-client">
              <span className="cpp-client-name">{clientName}</span>
              {clientData?.cif_vat && (
                <span className="cpp-sub">CIF/VAT: {clientData.cif_vat}</span>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Scope / Project',
        accessor: 'projectName',
        Cell: ({ row }) => {
          const { delivery_address_id, projectData } = row.original;
          if (delivery_address_id == null) {
            return (
              <span className="cpp-badge cpp-badge--base">
                Base price (all orders)
              </span>
            );
          }
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span className="cpp-badge cpp-badge--project">
                <FiMapPin size={12} />
                {projectData?.project_name || `Project #${delivery_address_id}`}
              </span>
              {(projectData?.street || projectData?.city) && (
                <span className="cpp-sub">
                  {[projectData.street, projectData.city].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Catalog price',
        accessor: 'catalogPrice',
        Cell: ({ value }) => (
          <span className="cpp-catalog-price">
            {value != null ? `${formatMoney(value)} €/m²` : '—'}
          </span>
        ),
      },
      {
        Header: 'Special price',
        accessor: 'price',
        Cell: ({ row }) => {
          const { price, catalogPrice, deliveryDelta, delivery_address_id } =
            row.original;
          const isProject = delivery_address_id != null;

          return (
            <div className="cpp-cell-price">
              <span className="cpp-price-val">{formatMoney(price)} €/m²</span>

              {isProject && deliveryDelta != null && (
                <span
                  className={`cpp-pill ${
                    deliveryDelta >= 0 ? 'cpp-pill--delivery' : 'cpp-pill--discount'
                  }`}
                  title="Included delivery price difference over base client price"
                >
                  {deliveryDelta >= 0 ? `+${formatMoney(deliveryDelta)}` : formatMoney(deliveryDelta)}{' '}
                  €/m² delivery
                </span>
              )}

              {!isProject && catalogPrice != null && catalogPrice > 0 && (
                (() => {
                  const diff = ((price - catalogPrice) / catalogPrice) * 100;
                  if (Math.abs(diff) < 0.1) return null;
                  const isDiscount = diff < 0;
                  return (
                    <span
                      className={`cpp-pill ${
                        isDiscount ? 'cpp-pill--discount' : 'cpp-pill--markup'
                      }`}
                      title="Difference compared to standard catalog price"
                    >
                      {isDiscount ? `${diff.toFixed(1)}%` : `+${diff.toFixed(1)}%`}
                    </span>
                  );
                })()
              )}
            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) => {
          if (!access.canWrite) return null;
          const { dependentCount } = row.original;
          const hasDependents = dependentCount > 0;

          return (
            <div className="cpp-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="cpp-btn-action cpp-btn-action--edit"
                title="Edit special price"
                onClick={() => {
                  setEditingRow(row.original);
                  setEditPrice(String(row.original.price));
                  setEditError('');
                }}
              >
                <FiEdit2 size={14} />
              </button>
              <button
                type="button"
                className="cpp-btn-action cpp-btn-action--delete"
                disabled={hasDependents}
                title={
                  hasDependents
                    ? `Cannot delete: ${dependentCount} project price(s) depend on this base price. Remove project prices first.`
                    : 'Delete special price'
                }
                onClick={() => {
                  if (!hasDependents) {
                    setDeletingRow(row.original);
                  }
                }}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          );
        },
      },
    ],
    [access.canWrite],
  );

  // Open Create Modal
  const handleOpenCreate = () => {
    setCreateProductId(productFilter || '');
    setCreateClientId(clientFilter || '');
    setCreateScope('base');
    setCreateProjectId('');
    setCreatePrice('');
    setCreateError('');
    setIsCreateOpen(true);
  };

  // Close Create Modal
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setCreateError('');
  };

  // Submit Create Modal
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setCreateError('');

    const priceNum = parsePrice(createPrice);
    if (!createProductId) {
      setCreateError('Please select a product');
      return;
    }
    if (!createClientId) {
      setCreateError('Please select a client');
      return;
    }
    if (priceNum == null || priceNum < 0) {
      setCreateError('Please enter a valid price (greater than or equal to 0)');
      return;
    }
    if (createScope === 'project') {
      if (!createBasePriceRow) {
        setCreateError(
          'A base price for this client and product without a project is required first',
        );
        return;
      }
      if (!createProjectId) {
        setCreateError('Please select a project/delivery address');
        return;
      }
    }

    const projectIdNum =
      createScope === 'project' && createProjectId
        ? Number(createProjectId)
        : null;

    if (existingRuleInCreate) {
      dispatch(
        updateClientProductPrice({
          id: existingRuleInCreate.id,
          price: priceNum,
        }),
      );
    } else {
      dispatch(
        addClientProductPrice({
          product_id: Number(createProductId),
          client_id: Number(createClientId),
          delivery_address_id: projectIdNum,
          price: priceNum,
        }),
      );
    }

    handleCloseCreate();
  };

  // Submit Edit Modal
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingRow) return;
    setEditError('');

    const priceNum = parsePrice(editPrice);
    if (priceNum == null || priceNum < 0) {
      setEditError('Please enter a valid price (greater than or equal to 0)');
      return;
    }

    dispatch(
      updateClientProductPrice({
        id: editingRow.id,
        price: priceNum,
      }),
    );
    setEditingRow(null);
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (!deletingRow) return;
    dispatch(deleteClientProductPrice(deletingRow.id));
    setDeletingRow(null);
  };

  // Calculation helpers for Create Modal preview
  const selectedCreateProduct = productById.get(Number(createProductId));
  const selectedCreateCatalogPrice =
    selectedCreateProduct?.price != null ? Number(selectedCreateProduct.price) : null;
  const numericCreatePrice = parsePrice(createPrice);

  return (
    <div className="cl-page cpp-page">
      {/* Header & KPI Bar */}
      <div className="cl-page__head">
        <div>
          <div className="cl-page__eyebrow">Sales · Pricing</div>
          <h1 className="cl-page__title">Client product prices</h1>
        </div>

        <div className="cpp-stats">
          <div className="cpp-stat-item">
            <div className="cpp-stat-item__num">{stats.total}</div>
            <div className="cpp-stat-item__label">Total rules</div>
          </div>
          <div className="cpp-stat-divider" />
          <div className="cpp-stat-item">
            <div className="cpp-stat-item__num">{stats.clientsCount}</div>
            <div className="cpp-stat-item__label">Clients</div>
          </div>
          <div className="cpp-stat-divider" />
          <div className="cpp-stat-item">
            <div className="cpp-stat-item__num">{stats.productsCount}</div>
            <div className="cpp-stat-item__label">Products</div>
          </div>
          <div className="cpp-stat-divider" />
          <div className="cpp-stat-item">
            <div className="cpp-stat-item__num">{stats.projectPricesCount}</div>
            <div className="cpp-stat-item__label">Projects</div>
          </div>
        </div>
      </div>

      {/* Main Table with Custom Toolbar */}
      <Table
        COLUMN_DATA={columns}
        dataOfTable={filteredRows}
        tableName="Client product prices"
        userAccess={access}
        variant="card"
        hideTitle
        emptyTitle="No special prices match your search or filters"
        emptySubtitle="Try selecting another client, product, or clearing the search query."
        renderToolbar={({ globalFilter, setGlobalFilter }) => {
          const hasActiveFilters =
            Boolean(globalFilter) ||
            Boolean(clientFilter) ||
            Boolean(productFilter) ||
            scopeFilter !== 'all';

          return (
            <div className="cpp-toolbar">
              <div className="cpp-search">
                <FiSearch className="cpp-search__ic" size={17} />
                <input
                  type="text"
                  className="cpp-search__input"
                  placeholder="Search product, client, project..."
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                />
                {globalFilter && (
                  <button
                    type="button"
                    className="cpp-search-clear"
                    onClick={() => setGlobalFilter(undefined)}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                className="cpp-select"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                title="Filter by client"
              >
                <option value="">All clients ({clientList.length})</option>
                {clientList.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.c_name || `Client #${client.id}`}
                  </option>
                ))}
              </select>

              <select
                className="cpp-select"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                title="Filter by product"
              >
                <option value="">All products ({products.length})</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.article} — {product.description || product.tradingMark}
                  </option>
                ))}
              </select>

              <select
                className="cpp-select"
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                title="Filter by price type"
              >
                <option value="all">All price types</option>
                <option value="base">Base prices only</option>
                <option value="project">Project prices only</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="cpp-reset-btn"
                  onClick={() => {
                    setGlobalFilter(undefined);
                    setClientFilter('');
                    setProductFilter('');
                    setScopeFilter('all');
                  }}
                  title="Reset all filters"
                >
                  <FiRotateCcw size={13} />
                  Reset
                </button>
              )}

              <div className="cl-toolbar__spacer" />

              {access.canWrite && (
                <button
                  type="button"
                  className="cl-btn cl-btn--primary cl-btn--new"
                  onClick={handleOpenCreate}
                >
                  <FiPlus size={16} />
                  New special price
                </button>
              )}
            </div>
          );
        }}
      />

      {/* CREATE SPECIAL PRICE MODAL */}
      <Modal
        show={isCreateOpen}
        onHide={handleCloseCreate}
        centered
        size="lg"
        className="cpp-modal"
      >
        <div className="cpp-modal-header">
          <div>
            <h3 className="cpp-modal-title">Create special price</h3>
            <div className="cpp-modal-subtitle">
              Set customized price per m² for a client and product
            </div>
          </div>
          <button
            type="button"
            className="cpp-btn-action"
            onClick={handleCloseCreate}
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit}>
          <div className="cpp-modal-body">
            {/* Client selection */}
            <div className="cpp-form-group">
              <label className="cpp-form-label" htmlFor="create-client-select">
                <span>Client <strong style={{ color: '#bc1212' }}>*</strong></span>
              </label>
              <Select
                inputId="create-client-select"
                options={clientOptions}
                value={
                  clientOptions.find(
                    (opt) => String(opt.value) === String(createClientId),
                  ) || null
                }
                onChange={(opt) => {
                  setCreateClientId(opt?.value || '');
                  setCreateProjectId('');
                }}
                placeholder="Search and select client..."
                isSearchable
                isClearable
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
            </div>

            {/* Product selection */}
            <div className="cpp-form-group">
              <label className="cpp-form-label" htmlFor="create-product-select">
                <span>Product <strong style={{ color: '#bc1212' }}>*</strong></span>
                {selectedCreateCatalogPrice != null && (
                  <span className="cpp-form-hint">
                    Catalog list price: <strong>{formatMoney(selectedCreateCatalogPrice)} €/m²</strong>
                  </span>
                )}
              </label>
              <Select
                inputId="create-product-select"
                options={productOptions}
                value={
                  productOptions.find(
                    (opt) => String(opt.value) === String(createProductId),
                  ) || null
                }
                onChange={(opt) => setCreateProductId(opt?.value || '')}
                placeholder="Search and select product..."
                isSearchable
                isClearable
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
            </div>

            {/* Scope / Destination toggle */}
            <div className="cpp-form-group">
              <label className="cpp-form-label">
                <span>Price Scope <strong style={{ color: '#bc1212' }}>*</strong></span>
              </label>
              <div className="cpp-scope-toggle">
                <button
                  type="button"
                  className={`cpp-scope-btn ${
                    createScope === 'base' ? 'active' : ''
                  }`}
                  onClick={() => setCreateScope('base')}
                >
                  Base price (all orders)
                </button>
                <button
                  type="button"
                  className={`cpp-scope-btn ${
                    createScope === 'project' ? 'active' : ''
                  }`}
                  onClick={() => setCreateScope('project')}
                >
                  <FiMapPin size={13} />
                  Specific project / delivery address
                </button>
              </div>

              {/* If project scope is selected */}
              {createScope === 'project' && (
                <>
                  {!createBasePriceRow ? (
                    <div className="cpp-alert cpp-alert--warning">
                      <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Base price required:</strong> Before adding a project price,
                        a base price without project must be created for this client and product.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="cpp-alert cpp-alert--info" style={{ marginBottom: 10 }}>
                        <FiInfo size={16} style={{ flexShrink: 0 }} />
                        <div>
                          Existing client base price:{' '}
                          <strong>{formatMoney(createBasePriceRow.price)} €/m²</strong>.
                          Project price will include delivery markup.
                        </div>
                      </div>

                      <Select
                        options={projectOptionsForCreate}
                        value={
                          projectOptionsForCreate.find(
                            (opt) => String(opt.value) === String(createProjectId),
                          ) || null
                        }
                        onChange={(opt) => setCreateProjectId(opt?.value || '')}
                        placeholder={
                          projectsForCreateClient.length === 0
                            ? 'No projects registered for this client'
                            : 'Select delivery address / project...'
                        }
                        isSearchable
                        isClearable
                        isDisabled={projectsForCreateClient.length === 0}
                        menuPortalTarget={document.body}
                        styles={selectStyles}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Price input */}
            <div className="cpp-form-group">
              <label className="cpp-form-label" htmlFor="create-price-input">
                <span>Special price <strong style={{ color: '#bc1212' }}>*</strong></span>
                <span className="cpp-form-hint">Price in EURO per m²</span>
              </label>
              <div className="cpp-input-addon-wrap">
                <input
                  id="create-price-input"
                  className="cpp-modal-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={createPrice}
                  onChange={(e) => setCreatePrice(e.target.value)}
                  required
                />
                <span className="cpp-addon">€ / m²</span>
              </div>

              {/* Live preview calculation */}
              {numericCreatePrice != null && numericCreatePrice > 0 && (
                <div className="cpp-calc-box">
                  {createScope === 'base' && selectedCreateCatalogPrice != null && (
                    <div className="cpp-calc-row">
                      <span className="cpp-calc-label">Catalog price difference:</span>
                      <span
                        className="cpp-calc-val"
                        style={{
                          color:
                            numericCreatePrice <= selectedCreateCatalogPrice
                              ? '#16753a'
                              : '#bc1212',
                        }}
                      >
                        {numericCreatePrice <= selectedCreateCatalogPrice
                          ? `Discount: -${(
                              ((selectedCreateCatalogPrice - numericCreatePrice) /
                                selectedCreateCatalogPrice) *
                              100
                            ).toFixed(1)}% (-${formatMoney(
                              selectedCreateCatalogPrice - numericCreatePrice,
                            )} €/m²)`
                          : `Markup: +${(
                              ((numericCreatePrice - selectedCreateCatalogPrice) /
                                selectedCreateCatalogPrice) *
                              100
                            ).toFixed(1)}% (+${formatMoney(
                              numericCreatePrice - selectedCreateCatalogPrice,
                            )} €/m²)`}
                      </span>
                    </div>
                  )}

                  {createScope === 'project' && createBasePriceRow && (
                    <div className="cpp-calc-row">
                      <span className="cpp-calc-label">Included delivery markup:</span>
                      <span
                        className="cpp-calc-val"
                        style={{
                          color:
                            numericCreatePrice >= Number(createBasePriceRow.price)
                              ? '#a0630b'
                              : '#bc1212',
                        }}
                      >
                        {numericCreatePrice >= Number(createBasePriceRow.price)
                          ? `+${formatMoney(
                              numericCreatePrice - Number(createBasePriceRow.price),
                            )} €/m² delivery`
                          : `${formatMoney(
                              numericCreatePrice - Number(createBasePriceRow.price),
                            )} €/m² (below base price)`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Existing rule notice */}
              {existingRuleInCreate && (
                <div className="cpp-alert cpp-alert--info">
                  <FiInfo size={16} style={{ flexShrink: 0 }} />
                  <div>
                    A special price rule for this selection already exists (current:{' '}
                    <strong>{formatMoney(existingRuleInCreate.price)} €/m²</strong>).
                    Saving will update the price.
                  </div>
                </div>
              )}

              {/* Error banner */}
              {createError && (
                <div className="cpp-alert cpp-alert--danger">
                  <FiAlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <div>{createError}</div>
                </div>
              )}
            </div>
          </div>

          <div className="cpp-modal-footer">
            <button
              type="button"
              className="cl-btn cl-btn--ghost"
              onClick={handleCloseCreate}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cl-btn cl-btn--primary"
              disabled={createScope === 'project' && !createBasePriceRow}
            >
              {existingRuleInCreate ? 'Update price' : 'Create price'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SPECIAL PRICE MODAL */}
      <Modal
        show={Boolean(editingRow)}
        onHide={() => setEditingRow(null)}
        centered
        className="cpp-modal"
      >
        <div className="cpp-modal-header">
          <div>
            <h3 className="cpp-modal-title">Edit special price</h3>
            <div className="cpp-modal-subtitle">Update price per m²</div>
          </div>
          <button
            type="button"
            className="cpp-btn-action"
            onClick={() => setEditingRow(null)}
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {editingRow && (
          <form onSubmit={handleEditSubmit}>
            <div className="cpp-modal-body">
              {/* Summary card */}
              <div className="cpp-summary-card">
                <div className="cpp-summary-item">
                  <span className="cpp-summary-label">Client:</span>
                  <span className="cpp-summary-val">{editingRow.clientName}</span>
                </div>
                <div className="cpp-summary-item">
                  <span className="cpp-summary-label">Product:</span>
                  <span className="cpp-summary-val">{editingRow.productLabel}</span>
                </div>
                <div className="cpp-summary-item">
                  <span className="cpp-summary-label">Scope:</span>
                  <span className="cpp-summary-val">
                    {editingRow.delivery_address_id == null
                      ? 'Base price (all orders)'
                      : editingRow.projectName || `Project #${editingRow.delivery_address_id}`}
                  </span>
                </div>
                <div className="cpp-summary-item">
                  <span className="cpp-summary-label">Current price:</span>
                  <span className="cpp-summary-val">
                    {formatMoney(editingRow.price)} €/m²
                  </span>
                </div>
              </div>

              {/* Price input */}
              <div className="cpp-form-group">
                <label className="cpp-form-label" htmlFor="edit-price-input">
                  <span>New price <strong style={{ color: '#bc1212' }}>*</strong></span>
                  <span className="cpp-form-hint">Price in EURO per m²</span>
                </label>
                <div className="cpp-input-addon-wrap">
                  <input
                    id="edit-price-input"
                    className="cpp-modal-input"
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    placeholder="0.00"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                  />
                  <span className="cpp-addon">€ / m²</span>
                </div>

                {/* Live delta preview */}
                {parsePrice(editPrice) != null && (
                  <div className="cpp-calc-box">
                    <div className="cpp-calc-row">
                      <span className="cpp-calc-label">Price change:</span>
                      <span
                        className="cpp-calc-val"
                        style={{
                          color:
                            parsePrice(editPrice) >= Number(editingRow.price)
                              ? '#bc1212'
                              : '#16753a',
                        }}
                      >
                        {parsePrice(editPrice) >= Number(editingRow.price)
                          ? `+${formatMoney(
                              parsePrice(editPrice) - Number(editingRow.price),
                            )} €/m²`
                          : `-${formatMoney(
                              Number(editingRow.price) - parsePrice(editPrice),
                            )} €/m²`}
                      </span>
                    </div>
                  </div>
                )}

                {editError && (
                  <div className="cpp-alert cpp-alert--danger">
                    <FiAlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <div>{editError}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="cpp-modal-footer">
              <button
                type="button"
                className="cl-btn cl-btn--ghost"
                onClick={() => setEditingRow(null)}
              >
                Cancel
              </button>
              <button type="submit" className="cl-btn cl-btn--primary">
                Save changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        show={Boolean(deletingRow)}
        onHide={() => setDeletingRow(null)}
        centered
        className="cpp-modal"
      >
        <div className="cpp-modal-header">
          <div>
            <h3 className="cpp-modal-title">Delete special price</h3>
            <div className="cpp-modal-subtitle">
              Are you sure you want to remove this price rule?
            </div>
          </div>
          <button
            type="button"
            className="cpp-btn-action"
            onClick={() => setDeletingRow(null)}
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {deletingRow && (
          <div className="cpp-modal-body">
            <div className="cpp-summary-card">
              <div className="cpp-summary-item">
                <span className="cpp-summary-label">Client:</span>
                <span className="cpp-summary-val">{deletingRow.clientName}</span>
              </div>
              <div className="cpp-summary-item">
                <span className="cpp-summary-label">Product:</span>
                <span className="cpp-summary-val">{deletingRow.productLabel}</span>
              </div>
              <div className="cpp-summary-item">
                <span className="cpp-summary-label">Scope:</span>
                <span className="cpp-summary-val">
                  {deletingRow.delivery_address_id == null
                    ? 'Base price (all orders)'
                    : deletingRow.projectName || `Project #${deletingRow.delivery_address_id}`}
                </span>
              </div>
              <div className="cpp-summary-item">
                <span className="cpp-summary-label">Price:</span>
                <span className="cpp-summary-val">
                  {formatMoney(deletingRow.price)} €/m²
                </span>
              </div>
            </div>

            <div className="cpp-alert cpp-alert--danger">
              <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                This action is irreversible. In future orders for this client, this
                product will revert to the standard category or catalog price.
              </div>
            </div>
          </div>
        )}

        <div className="cpp-modal-footer">
          <button
            type="button"
            className="cl-btn cl-btn--ghost"
            onClick={() => setDeletingRow(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cl-btn cl-btn--primary"
            style={{ background: '#bc1212' }}
            onClick={handleDeleteConfirm}
          >
            Delete price
          </button>
        </div>
      </Modal>
    </div>
  );
}
