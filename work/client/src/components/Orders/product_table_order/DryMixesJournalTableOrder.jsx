import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddDryMixesProductModal from '../modal/addProductModal/AddDryMixesProductModal';

const DryMixesJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  deleteHandler,
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { dryMixedProductModalOrder, setDryMixedProductModalOrder } =
    useModalContext();
  const { userAccess } = useUsersContext();

  return (
    <>
      {dryMixedProductModalOrder && (
        <AddDryMixesProductModal
          isOpen={dryMixedProductModalOrder}
          toggle={() => setDryMixedProductModalOrder(!dryMixedProductModalOrder)}
        />
      )}
      <table className="product-table">
        <thead>
          <tr>
            <td>Dry Mixes Journal Products</td>
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
                    setDryMixedProductModalOrder(!dryMixedProductModalOrder);
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

export default DryMixesJournalTableOrder;
