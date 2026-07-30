import React, { useEffect, useMemo, useCallback, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { updAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import FilesMain from '#components/FileUpload/Order/FilesMain.jsx';
import { useUsersContext } from '#components/contexts/UserContext.js';
import AccountingInvoiceModal from './AccountingInvoiceModal.jsx';
import { makeStatusPillCell } from '#components/Orders/ordersCells';

import '#components/Styles/order-card.css';
import '#components/Orders/ordersView.css';
import './accountingView.css';

function ProductCategoryTable({ title, rows, qtyField, priceField }) {
  return (
    <div className="ord-prod-card">
      <div className="ord-prod-card__head">
        <span className="ord-prod-card__title">{title}</span>
      </div>
      <table className="ord-prod-table">
        <thead>
          <tr>
            <th>Article</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row?.id || row?.product_article}>
                <td>
                  <span className="ord-mono">{row.product_article}</span>
                </td>
                <td>{row[qtyField]}</td>
                <td>{row[priceField]}</td>
                <td>{row.final_price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="ord-empty-products">
                No items in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const AccountngOrderCard = React.memo(() => {
  const {
    storedData,
    setStoredData,
    orderCartData,
    list_of_orders,
    setOrderCartData,
    getAccountingStatus,
    accountingStatusList,
    status_list,
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
    filterKeysOrder,
  } = useOrderContext();
  const { displayNames } = useProjectContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestRelatedMaterials, latestAnchors, latestTools } =
    useProductsTypeJournalContext();
  const { userAccess } = useUsersContext();
  const productListOrder = useSelector((state) => state.productsOfOrders);
  const dispatch = useDispatch();

  const [vatValue, setVatValue] = useState({
    vat_procent: 21,
    vat_euro: 0,
    vat_result: 0,
  });

  const [status, setStatus] = useState();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [productLists, setProductLists] = useState({
    products: [],
    dryMixes: [],
    anchors: [],
    tools: [],
    related_materials: [],
  });

  const getCorrectProductId = (arrName) => {
    switch (arrName) {
      case 'products':
        return 'product_id';

      case 'dryMixes':
        return 'dry_mixed_id';

      case 'anchors':
        return 'anchor_id';

      case 'tools':
        return 'tool_id';

      case 'related_materials':
        return 'rel_mat_id';

      default:
        break;
    }
  };

  const filterAndMapData = useCallback(
    (data, filterKeysOrder) =>
      Object.entries(data || {})
        .filter(([key]) => !filterKeysOrder.includes(key))
        .map(([key, value]) => {
          if (!key || key == 'warehouse_id') return <></>;
          return (
            <div className="data-text" key={key}>
              <p>
                {displayNames[key] || key}: {value}
              </p>
            </div>
          );
        }),
    [orderCartData],
  );

  const addProductArticleToOrderList = useCallback(
    (productsOfOrders, productsTable, arrayName) => {
      if (
        !productsOfOrders ||
        !productsTable ||
        !arrayName ||
        !orderCartData?.id
      )
        return [];

      const updatedOrderProducts = productsOfOrders
        .filter((el) => el.order_id == orderCartData.id)
        .map((orderProduct) => {
          const id = getCorrectProductId(arrayName);

          const product = productsTable.find(
            (p) => p.id === orderProduct?.[id],
          );

          return product
            ? { product_article: product.article, ...orderProduct }
            : { ...orderProduct, product_article: 'Unknown' };
        });

      return updatedOrderProducts;
    },
    [orderCartData?.id],
  );

  const updatedProductListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      productListOrder,
      latestProducts,
      'products',
    );
  }, [productListOrder, latestProducts, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedProductListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        products: updatedProductListOrder,
      }));
    }
  }, [updatedProductListOrder]);

  const updatedDryMixesListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      dryMixedProductsOfOrders,
      latestDryMix,
      'dryMixes',
    );
  }, [dryMixedProductsOfOrders, latestDryMix, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedDryMixesListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        dryMixes: updatedDryMixesListOrder,
      }));
    }
  }, [updatedDryMixesListOrder]);

  const updatedAnchorsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      anchorProductsOfOrders,
      latestAnchors,
      'anchors',
    );
  }, [anchorProductsOfOrders, latestAnchors, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedAnchorsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        anchors: updatedAnchorsListOrder,
      }));
    }
  }, [updatedAnchorsListOrder]);

  const updatedToolsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      toolProductsOfOrders,
      latestTools,
      'tools',
    );
  }, [toolProductsOfOrders, latestTools, addProductArticleToOrderList]);

  useEffect(() => {
    if (updatedToolsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        tools: updatedToolsListOrder,
      }));
    }
  }, [updatedToolsListOrder]);

  const updatedRelatedMaterialsListOrder = useMemo(() => {
    return addProductArticleToOrderList(
      relMatProductsOfOrders,
      latestRelatedMaterials,
      'related_materials',
    );
  }, [
    relMatProductsOfOrders,
    latestRelatedMaterials,
    addProductArticleToOrderList,
  ]);

  useEffect(() => {
    if (updatedRelatedMaterialsListOrder.length > 0) {
      setProductLists((prevState) => ({
        ...prevState,
        related_materials: updatedRelatedMaterialsListOrder,
      }));
    }
  }, [updatedRelatedMaterialsListOrder]);

  const statusChangeHandler = (newStatus) => {
    const status_index = accountingStatusList.findIndex(
      (el) => el.accessor == status,
    );

    const new_status_index = accountingStatusList.findIndex(
      (el) => el.accessor == newStatus,
    );

    if (
      new_status_index < status_index ||
      new_status_index - status_index != 1
    ) {
      alert('Choose another status');
      return;
    }

    dispatch(
      updAccountingDataList({
        orders_article: orderCartData?.article,
        aproved: true,
      }),
    );
    setStoredData(null);
  };

  useEffect(() => {
    const updatedOrderCartData = list_of_orders.find(
      (order) => order.article === storedData.orders_article,
    );

    const accounting_status = getAccountingStatus(updatedOrderCartData?.status);

    setOrderCartData((prev) => ({ ...prev, status: accounting_status }));
  }, []);

  useEffect(() => {
    const allProducts = [
      ...productLists['products'],
      ...productLists['dryMixes'],
      ...productLists['anchors'],
      ...productLists['tools'],
      ...productLists['related_materials'],
    ];

    const final_price_product =
      allProducts.reduce(
        (acc, el) =>
          acc +
          (el?.final_price ||
            el?.final_price_dry ||
            el?.final_price_anchor ||
            el?.final_price_tool ||
            el?.final_price_rel_mat),
        0,
      ) || 0;

    if (!final_price_product || !vatValue.vat_procent) {
      setVatValue((prev) => ({
        ...prev,
        vat_result: 0,
      }));
    } else {
      const vat_euro = (
        (vatValue.vat_procent * final_price_product) /
        100
      ).toFixed(2);

      const vat_result = Number(final_price_product + Number(vat_euro)).toFixed(
        2,
      );

      setVatValue((prev) => ({
        ...prev,
        vat_euro_origin: final_price_product,
        vat_result: vat_result,
        vat_euro,
      }));
    }
  }, [productLists, vatValue.vat_procent]);

  useEffect(() => {
    const result = getAccountingStatus(orderCartData?.status);
    setStatus(result);
  }, []);

  const StatusPillCell = useMemo(
    () => makeStatusPillCell(status_list),
    [status_list],
  );

  return (
    <>
      <div className="acc-card">
        <button
          type="button"
          className="ord-card__back"
          onClick={() => setStoredData(null)}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back to Accounting
        </button>

        <div className="ord-card__head">
          <div className="ord-card__head-left">
            <h1 className="ord-card__article ord-mono">
              {orderCartData?.article}
            </h1>
            <StatusPillCell value={storedData?.orders_status} />
          </div>
          <div className="ord-card__actions">
            <button
              type="button"
              className="ord-btn ord-btn--primary"
              onClick={() => setIsInvoiceModalOpen(true)}
            >
              Generar factura PDF
            </button>
          </div>
        </div>

        <div className="acc-tiles">
          <div className="ord-tile">
            <div className="ord-tile__label">Client information</div>
            {filterAndMapData(orderCartData?.owner, filterKeysOrder)}
          </div>

          <div className="ord-tile">
            <div className="ord-tile__label">Contact person</div>
            {filterAndMapData(orderCartData?.contactInfo, filterKeysOrder)}
          </div>

          <div className="ord-tile">
            <div className="ord-tile__label">Delivery address</div>
            {filterAndMapData(orderCartData?.deliveryAddress, filterKeysOrder)}
          </div>
        </div>

        <div className="ord-grid">
          <div>
            <ProductCategoryTable
              title="Products"
              rows={updatedProductListOrder}
              qtyField="quantity_real"
              priceField="price_m2"
            />
            <ProductCategoryTable
              title="Dry mixes"
              rows={updatedDryMixesListOrder}
              qtyField="quantity_ud"
              priceField="pvp"
            />
            <ProductCategoryTable
              title="Fastners"
              rows={updatedAnchorsListOrder}
              qtyField="quantity_ud"
              priceField="pvp"
            />
            <ProductCategoryTable
              title="Tools"
              rows={updatedToolsListOrder}
              qtyField="quantity_ud"
              priceField="pvp"
            />
            <ProductCategoryTable
              title="Related materials"
              rows={updatedRelatedMaterialsListOrder}
              qtyField="quantity_ud"
              priceField="pvp"
            />

            <div className="ord-summary-card">
              <div className="ord-summary-card__title">Attachments</div>
              <FilesMain userAccess={userAccess} />
            </div>
          </div>

          <div>
            <div className="ord-summary-card">
              <div className="ord-summary-card__title">VAT summary</div>
              <div className="ord-summary-rows">
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">VAT, %</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_procent}
                  </span>
                </div>
                <div className="ord-summary-row">
                  <span className="ord-summary-row__label">VAT, €</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_euro}
                  </span>
                </div>
                <div className="ord-summary-divider" />
                <div className="ord-summary-row ord-summary-row--total ord-summary-row--accent">
                  <span className="ord-summary-row__label">Total</span>
                  <span className="ord-summary-row__value">
                    {vatValue.vat_result}
                  </span>
                </div>
              </div>
            </div>

            <div className="ord-status-card">
              <div className="ord-status-card__title">Approval status</div>
              <div className="ord-steps">
                {accountingStatusList.map((item) => {
                  const isDone = item.accessor < status;
                  const isCurrent = item.accessor == status;
                  return (
                    <div key={item.accessor} className="ord-step">
                      <div className="ord-step__rail">
                        <input
                          id={item.accessor}
                          type="checkbox"
                          className={
                            'ord-step__checkbox' +
                            (isDone ? ' ord-step__checkbox--done' : '') +
                            (isCurrent ? ' ord-step__checkbox--current' : '')
                          }
                          checked={item.accessor == status}
                          onChange={() => {
                            statusChangeHandler(item.accessor);
                          }}
                        />
                        <div
                          className={
                            'ord-step__line' +
                            (isDone ? ' ord-step__line--done' : '')
                          }
                        />
                      </div>
                      <div
                        className={
                          'ord-step__label' +
                          (isCurrent
                            ? ' ord-step__label--current'
                            : isDone
                              ? ' ord-step__label--done'
                              : '')
                        }
                      >
                        {item.Header}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AccountingInvoiceModal
        isOpen={isInvoiceModalOpen}
        toggle={() => setIsInvoiceModalOpen(false)}
        orderCartData={orderCartData}
        productLists={productLists}
        vatValue={vatValue}
        latestProducts={latestProducts}
        latestDryMix={latestDryMix}
        latestAnchors={latestAnchors}
        latestTools={latestTools}
        latestRelatedMaterials={latestRelatedMaterials}
      />
    </>
  );
});
export default AccountngOrderCard;
