import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddToolProductModal from '../modal/addProductModal/AddToolProductModal';

const ToolJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  deleteHandler,
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { toolProductModalOrder, setToolProductModalOrder } = useModalContext();
  const { userAccess } = useUsersContext();

  return (
    <>
      {toolProductModalOrder && (
        <AddToolProductModal
          isOpen={toolProductModalOrder}
          toggle={() => setToolProductModalOrder(!toolProductModalOrder)}
        />
      )}{' '}
      <table className="product-table">
        <thead>
          <tr>
            <td>Tool Journal Products</td>
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
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHandler(product);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          {userAccess?.canWrite && (
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
                    setToolProductModalOrder(!toolProductModalOrder);
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

export default ToolJournalTableOrder;
