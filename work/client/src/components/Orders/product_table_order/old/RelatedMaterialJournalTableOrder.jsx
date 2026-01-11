import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { Button } from 'reactstrap';
import AddRelatedMaterialProductModal from '../modal/addProductModal/AddRelatedMaterialProductModal';

const RelatedMaterialJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  deleteHandler,
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { relatedMaterialProductModalOrder, setRelatedMaterialProductModalOrder } =
    useModalContext();
  const { userAccess } = useUsersContext();

  return (
    <>
      {relatedMaterialProductModalOrder && (
        <AddRelatedMaterialProductModal
          isOpen={relatedMaterialProductModalOrder}
          toggle={() =>
            setRelatedMaterialProductModalOrder(!relatedMaterialProductModalOrder)
          }
        />
      )}{' '}
      <table className="product-table">
        <thead>
          <tr>
            <td>Related Materials</td>
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
                  {orderCartData?.status < 3 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler(product);
                      }}
                    >
                      Delete
                    </Button>
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
                    setRelatedMaterialProductModalOrder(
                      !relatedMaterialProductModalOrder
                    );
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

export default RelatedMaterialJournalTableOrder;
