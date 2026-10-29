import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { fieldLabel } from '../ordersI18n.js';
import AddRelatedMaterialProductModal from '../modal/addProductModal/AddRelatedMaterialProductModal';
import { useState } from 'react';
import ReturnCheckbox from './ReturnCheckbox';
import '../ordersView.css';

const RelatedMaterialJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterKeys,
  deleteHandler,
  displayNames = {},
  vatValue,
  setVatValue,
}) => {
  const { t } = useTranslation('orders');
  const { setNewOrder, orderCartData } = useOrderContext();
  const {
    relatedMaterialProductModalOrder,
    setRelatedMaterialProductModalOrder,
  } = useModalContext();
  const { userAccess } = useUsersContext();

  const [returnCheckedProducts, setReturnCheckedProducts] = useState({});

  const handleReturnCheckChange = (productId, isChecked) => {
    setReturnCheckedProducts((prev) => ({
      ...prev,
      [productId]: isChecked,
    }));
  };

  const columns = Object.keys(productListOrder?.[0] || {}).filter(
    (key) => !filterKeys.includes(key) && key !== 'warehouse_id' && key,
  );

  return (
    <>
      {relatedMaterialProductModalOrder && (
        <AddRelatedMaterialProductModal
          isOpen={relatedMaterialProductModalOrder}
          toggle={() =>
            setRelatedMaterialProductModalOrder(
              !relatedMaterialProductModalOrder,
            )
          }
        />
      )}{' '}
      <div className="ord-prod-card">
        <div className="ord-prod-card__head">
          <span className="ord-badge" style={{ background: '#e9f6ed', color: '#16a34a' }}>
            Consumible
          </span>
          <div className="ord-prod-card__title">{t('products.relatedMaterialsTitle')}</div>
        </div>
        <div className="ord-prod-table-wrap">
          <table className="product-table ord-prod-table">
            <thead>
              <tr>
                {columns.map((key) => (
                  <th key={key}>
                    {key === 'total'
                      ? fieldLabel(t, 'totalUd')
                      : fieldLabel(t, key, displayNames[key])}
                  </th>
                ))}
                <th>{t('products.return')}</th>
                <th>{t('products.delete')}</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(productListOrder) &&
                productListOrder.map((product) => (
                  <tr
                    key={product?.id || Math.random()}
                    onClick={() => onProductClickHandler(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {columns.map((key) => {
                      let value = product[key];
                      if (value && typeof value === 'object') {
                        value = JSON.stringify(value);
                      }
                      return <td key={key}>{value ?? ''}</td>;
                    })}

                    <td onClick={(e) => e.stopPropagation()}>
                      {product?.final_price < 0 ? (
                        <span className="ord-return-text ord-return-text--active">
                          {t('products.return')}
                        </span>
                      ) : (
                        <span className="ord-return-text">
                          {t('products.noReturn')}
                        </span>
                      )}
                      {/* <ReturnCheckbox
                        product={product}
                        vatValue={vatValue}
                        setVatValue={setVatValue}
                        isChecked={returnCheckedProducts[product?.id] || false}
                        onCheckChange={handleReturnCheckChange}
                      /> */}
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      {orderCartData?.status < 3 && (
                        <Button
                          size="sm"
                          color="danger"
                          className="ord-mini-btn ord-mini-btn--danger ord-btn"
                          onClick={() => deleteHandler(product)}
                        >
                          {t('products.delete')}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

              {/* Добавлять товары можно до Proposal accepted by client, удалять — только на Initial contact */}
              {userAccess?.canWrite && orderCartData?.status <= 4 && (
                <tr>
                  <td colSpan={columns.length + 2}>
                    <Button
                      block
                      className="ord-add-row"
                      onClick={() => {
                        setNewOrder((prev) => ({
                          ...prev,
                          article: orderCartData.article,
                          owner: orderCartData.owner?.id,
                          status: orderCartData.status,
                          del_adr_id: orderCartData.deliveryAddress?.id,
                        }));
                        setRelatedMaterialProductModalOrder(
                          !relatedMaterialProductModalOrder,
                        );
                      }}
                    >
                      {t('products.addProduct')}
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RelatedMaterialJournalTableOrder;
