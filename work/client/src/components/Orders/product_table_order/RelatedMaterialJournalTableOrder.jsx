import { useModalContext } from "#components/contexts/ModalContext.js";
import { useOrderContext } from "#components/contexts/OrderContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { Button } from "reactstrap";
import AddRelatedMaterialProductModal from "../modal/addProductModal/AddRelatedMaterialProductModal";

const RelatedMaterialJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterKeys,
  deleteHandler,
  displayNames = {},
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const {
    relatedMaterialProductModalOrder,
    setRelatedMaterialProductModalOrder,
  } = useModalContext();
  const { userAccess } = useUsersContext();

  const columns = Object.keys(productListOrder?.[0] || {}).filter(
    (key) => !filterKeys.includes(key) && key !== "warehouse_id" && key
  );

  return (
    <>
      {relatedMaterialProductModalOrder && (
        <AddRelatedMaterialProductModal
          isOpen={relatedMaterialProductModalOrder}
          toggle={() =>
            setRelatedMaterialProductModalOrder(
              !relatedMaterialProductModalOrder
            )
          }
        />
      )}{" "}
      <table className="product-table">
        <thead>
          <tr>
            <td colSpan={columns.length + 1} style={{ fontWeight: "bold" }}>
              Related Materials
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
                  {orderCartData?.status < 3 && (
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
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
