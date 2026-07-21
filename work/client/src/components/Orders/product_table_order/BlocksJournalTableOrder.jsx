import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddProductOrderModal from '../modal/addProductModal/AddProductOrderModal';

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

  const columns = [
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
  ];

  // const columns = Object.keys(productListOrder?.[0] || {}).filter(
  //   (key) => !filterKeys.includes(key) && key !== 'warehouse_id' && key,
  // );

  return (
    <>
      {productModalOrder && (
        <AddProductOrderModal
          isOpen={productModalOrder}
          toggle={() => setProductModalOrder(!productModalOrder)}
        />
      )}

      <table className="product-table">
        <thead>
          <tr>
            <td colSpan={columns.length + 1} style={{ fontWeight: 'bold' }}>
              HCCA Blocks
            </td>
          </tr>
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
                  {product?.warehouse_id !== null ? (
                    <Button size="sm" onClick={() => productHandler(product)}>
                      Show batch
                    </Button>
                  ) : (
                    orderCartData?.status < 3 && (
                      <Button
                        size="sm"
                        color="danger"
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
                  Add product
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default BlocksJournalTableOrder;
