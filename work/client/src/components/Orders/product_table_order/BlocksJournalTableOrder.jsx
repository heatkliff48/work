import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddProductOrderModal from '../modal/addProductModal/AddProductOrderModal';
import '../ordersView.css';

const BlocksJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterKeys = [],
  productHandler,
  deleteHandler,
  displayNames = {},
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { productModalOrder, setProductModalOrder } = useModalContext();
  const { userAccess } = useUsersContext();

  const allColumns = [
    'product_article',
    'description',
    'quantity_m2',
    'quantity_palet',
    'quantity_real',
    'price_m2',
    'price_m3',
    'price_m2_with_delivery',
    'discount',
    'final_price',
    'quantity_liberated',
  ];

  // const columns = Object.keys(productListOrder?.[0] || {}).filter(
  //   (key) => !filterKeys.includes(key) && key !== 'warehouse_id' && key,
  // );

  const columns = orderCartData?.main_order
    ? allColumns.filter((col) => col !== 'quantity_liberated')
    : allColumns;

  return (
    <>
      {productModalOrder && (
        <AddProductOrderModal
          isOpen={productModalOrder}
          toggle={() => setProductModalOrder(!productModalOrder)}
        />
      )}

      <div className="ord-prod-card">
        <div className="ord-prod-card__head">
          <span
            className="ord-badge"
            style={{ background: '#fbe9e9', color: '#bc1212' }}
          >
            Bloque
          </span>
          <div className="ord-prod-card__title">HCCA Blocks</div>
        </div>
        <table className="product-table ord-prod-table">
          <thead>
            <tr>
              {columns.map((key) => (
                <th key={key}>{displayNames[key] || key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(productListOrder) &&
              productListOrder.map((product) => (
                <tr
                  key={product?.id || Math.random()}
                  onClick={() => onProductClickHandler(product)}
                  style={{ cursor: "pointer" }}
                >
                  {columns.map((key) => {
                    let value = product[key];
                    if (value && typeof value === "object") {
                      value = JSON.stringify(value);
                    }
                    return <td key={key}>{value ?? ""}</td>;
                  })}

                  <td onClick={(e) => e.stopPropagation()}>
                    {product?.warehouse_id !== null ? (
                      <Button
                        size="sm"
                        className="ord-mini-btn ord-btn ord-btn--ghost"
                        onClick={() => productHandler(product)}
                      >
                        Show batch
                      </Button>
                    ) : (
                      orderCartData?.status < 3 && (
                        <Button
                          size="sm"
                          color="danger"
                          className="ord-mini-btn ord-mini-btn--danger ord-btn"
                          onClick={() => deleteHandler(product)}
                        >
                          Delete
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))}

            {userAccess?.canWrite && orderCartData?.status < 3 && (
              <tr>
                <td colSpan={columns.length + 1}>
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
                      setProductModalOrder(!productModalOrder);
                    }}
                  >
                    + Add product
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BlocksJournalTableOrder;
