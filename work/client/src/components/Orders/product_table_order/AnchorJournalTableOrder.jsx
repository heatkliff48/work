import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddDryMixesProductModal from '../modal/addProductModal/AddDryMixesProductModal';
import AddAnchorProductModal from '../modal/addProductModal/AddAnchorProductModal';

const AnchorJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  deleteHandler,
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { anchorProductModalOrder, setAnchorProductModalOrder } = useModalContext();
  const { userAccess } = useUsersContext();

  return (
    <>
      {anchorProductModalOrder && (
        <AddAnchorProductModal
          isOpen={anchorProductModalOrder}
          toggle={() => setAnchorProductModalOrder(!anchorProductModalOrder)}
        />
      )}
      <table className="product-table">
        <thead>
          <tr>
            <td>Fastener Journal Products</td>
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
                    setAnchorProductModalOrder(!anchorProductModalOrder);
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

export default AnchorJournalTableOrder;
