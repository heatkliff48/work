import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment } from 'react';
import '../../../warehouseManagerView.css';

const WMOCTProduct = ({
  orderId,
  trailer,
  haveBatches,
  handlePlusBatch,
  handlePlus,
  handleMinus,
  isDisablePlus,
  isDisableMinus,
}) => {
  const { wmoctProduct, order_dispatch_data } = useWarehouseContext();
  const {
    wmoctModal,
    setWmoctModal,
    wmoctPdfAddDataModal,
    setWmoctPdfAddDataModal,
  } = useModalContext();

  const isSaveButtonVisible = () => {
    if (!Array.isArray(wmoctProduct) || wmoctProduct.length === 0) {
      return false;
    }

    const currentTrailerDispatches = (order_dispatch_data || []).filter(
      (dispatch) =>
        Number(dispatch.orderId) === Number(orderId) &&
        Number(dispatch.trailer) === Number(trailer),
    );

    if (currentTrailerDispatches.length === 0) {
      return false;
    }

    return currentTrailerDispatches.every(
      (dispatch) => Number(dispatch.trailer_stage) === 1,
    );
  };

  const onSaveHandler = () => {
    const incorrectlyAllocatedProducts = wmoctProduct
      .map((product) => {
        const qtyTotal = Number(product.qty_total);

        const allocatedTotal = (product.batches || []).reduce(
          (sum, batch) => sum + Number(batch.allocated || 0),
          0,
        );

        return {
          article: product.article,
          qtyTotal,
          allocatedTotal,
        };
      })
      .filter((product) => product.allocatedTotal !== product.qtyTotal);

    if (incorrectlyAllocatedProducts.length > 0) {
      const errorDescription = incorrectlyAllocatedProducts
        .map(
          (product) =>
            `${product.article}: loaded ${product.allocatedTotal} of ${product.qtyTotal}`,
        )
        .join('\n');

      window.alert(
        `Cannot save.\n\n` +
          `Every product must be fully loaded:\n\n` +
          errorDescription,
      );

      return;
    }

    setWmoctPdfAddDataModal(!wmoctPdfAddDataModal);
  };

  return (
    <div className="wm-prod-card">
      <div className="overflow-auto">
        <table className="wm-prod-table">
          <thead>
            <tr>
              <th>Product article</th>
              <th>Qty total, pallet</th>
              <th>Qty shipped, pallet</th>
              <th>Qty remaining, pallet</th>
              <th>Batch ID</th>
              <th>Qty in batch, pallet</th>
              <th>Controls</th>
              <th>Qty allocated, pallet</th>
            </tr>
          </thead>
          <tbody>
            {wmoctProduct?.map((product, productIndex) => (
              <Fragment key={product.article}>
                {/* Основная строка продукта */}
                <tr>
                  <td className="wm-mono">{product.article}</td>
                  <td>{product.qty_total}</td>
                  <td>{product.shipped}</td>
                  <td>{product.qty_rem}</td>
                  {haveBatches(productIndex) ? (
                    <>
                      <td className="wm-mono">{product.batches[0]?.batchId}</td>
                      <td>{product.batches[0]?.remainingInBatch}</td>
                      <td>
                        <div className="wm-prod-table__controls">
                          <button
                            className="wm-round-btn"
                            disabled={isDisablePlus(product.article)}
                            onClick={() => handlePlus(product, 0)}
                          >
                            ＋
                          </button>
                          <button
                            className="wm-round-btn"
                            disabled={isDisableMinus(
                              product.article,
                              product.batches[0],
                            )}
                            onClick={() => handleMinus(product, 0)}
                          >
                            －
                          </button>
                        </div>
                      </td>
                      <td>{product.batches[0]?.allocated}</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <button
                          className="wm-add-batch-btn"
                          onClick={() => {
                            setWmoctModal(!wmoctModal);
                            handlePlusBatch(product);
                          }}
                        >
                          ＋
                        </button>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                </tr>
                {/* Дополнительные строки для батчей */}
                {product.batches?.slice(1).map((batch, batchIndex) => (
                  <tr key={`${product.article}__${batch.batchId}`}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="wm-mono">{batch.batchId}</td>
                    <td>{batch.remainingInBatch}</td>
                    <td>
                      <div className="wm-prod-table__controls">
                        <button
                          className="wm-round-btn"
                          disabled={isDisablePlus(product.article)}
                          onClick={() => handlePlus(product, batchIndex + 1)}
                        >
                          ＋
                        </button>
                        <button
                          className="wm-round-btn"
                          disabled={isDisableMinus(product.article, batch)}
                          onClick={() => handleMinus(product, batchIndex + 1)}
                        >
                          －
                        </button>
                      </div>
                    </td>
                    <td>{batch.allocated}</td>
                  </tr>
                ))}
                {haveBatches(productIndex) ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button
                        className="wm-add-batch-btn"
                        onClick={() => {
                          setWmoctModal(!wmoctModal);
                          handlePlusBatch(product);
                        }}
                      >
                        ＋
                      </button>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  <></>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {isSaveButtonVisible() && (
        <div className="wm-prod-card__foot">
          <button className="wm-btn wm-btn--primary" onClick={onSaveHandler}>
            SAVE
          </button>
        </div>
      )}
    </div>
  );
};

export default WMOCTProduct;
