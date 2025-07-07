import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddProductOrderModal from '../modal/addProductModal/AddProductOrderModal';

const BlocksJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  productHandler,
  deleteHandler,
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { productModalOrder, setProductModalOrder } = useModalContext();
  const { userAccess } = useUsersContext();

  console.log('productListOrder - Blocks', productListOrder);

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
            <td>HCCA Blocks</td>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(productListOrder) &&
            productListOrder?.map((product) => (
              <tr key={product?.id || Math.random()} className="product-row">
                <td
                  onClick={() => {
                    onProductClickHandler(product);
                  }}
                >
                  {filterAndMapData(product, filterKeys)}
                  {product?.warehouse_id !== null ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        productHandler(product);
                      }}
                    >
                      Show batch
                    </Button>
                  ) : (
                    orderCartData?.status < 3 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHandler(product);
                        }}
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
              <td colSpan="100%">
                <Button
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
