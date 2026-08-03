import { useModalContext } from "#components/contexts/ModalContext.js";
import { useOrderContext } from "#components/contexts/OrderContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { Button } from "reactstrap";
import AddDryMixesProductModal from "../modal/addProductModal/AddDryMixesProductModal";
import "../ordersView.css";

const DryMixesJournalTableOrder = ({
  productListOrder,
  onProductClickHandler,
  filterAndMapData,
  filterKeys,
  deleteHandler,
  displayNames = {},
}) => {
  const { setNewOrder, orderCartData } = useOrderContext();
  const { dryMixedProductModalOrder, setDryMixedProductModalOrder } =
    useModalContext();
  const { userAccess } = useUsersContext();

  const columns = Object.keys(productListOrder?.[0] || {}).filter(
    (key) => !filterKeys.includes(key) && key !== "warehouse_id" && key
  );

  return (
    <>
      {dryMixedProductModalOrder && (
        <AddDryMixesProductModal
          isOpen={dryMixedProductModalOrder}
          toggle={() =>
            setDryMixedProductModalOrder(!dryMixedProductModalOrder)
          }
        />
      )}
      <div className="ord-prod-card">
        <div className="ord-prod-card__head">
          <span className="ord-badge" style={{ background: "#fdf3e3", color: "#b45309" }}>
            Mezcla seca
          </span>
          <div className="ord-prod-card__title">Dry mixes</div>
        </div>
        <div className="ord-prod-table-wrap">
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
                      {orderCartData?.status < 3 && (
                        <Button
                          size="sm"
                          color="danger"
                          className="ord-mini-btn ord-mini-btn--danger ord-btn"
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
                      className="ord-add-row"
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
                      + Add product
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

export default DryMixesJournalTableOrder;
