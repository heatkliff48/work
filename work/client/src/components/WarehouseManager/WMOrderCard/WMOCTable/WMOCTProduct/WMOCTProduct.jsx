import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment } from 'react';

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
            `${product.article}: загружено ${product.allocatedTotal} из ${product.qtyTotal}`,
        )
        .join('\n');

      window.alert(
        `Невозможно сохранить.\n\n` +
          `Необходимо полностью загрузить каждый продукт:\n\n` +
          errorDescription,
      );

      return;
    }

    setWmoctPdfAddDataModal(!wmoctPdfAddDataModal);
  };

  return (
    <div className="overflow-auto">
      <table className="table-auto border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">Product article</th>
            <th className="border px-2">Qty total, pallet</th>
            <th className="border px-2">Qty shipped, pallet</th>
            <th className="border px-2">Qty remaining, pallet</th>
            <th className="border px-2">Batch ID</th>
            <th className="border px-2">Qty in batch, pallet</th>
            <th className="border px-2">Controls</th>
            <th className="border px-2">Qty allocated, pallet</th>
          </tr>
        </thead>
        <tbody>
          {wmoctProduct?.map((product, productIndex) => (
            <Fragment key={product.article}>
              {/* Основная строка продукта */}
              <tr>
                <td className="border p-1" style={{ width: '25%' }}>
                  {product.article}
                </td>
                <td className="border p-1">{product.qty_total}</td>
                <td className="border p-1">{product.shipped}</td>
                <td className="border p-1">{product.qty_rem}</td>
                {haveBatches(productIndex) ? (
                  <>
                    <td className="border p-1">{product.batches[0]?.batchId}</td>
                    <td className="border p-1">
                      {product.batches[0]?.remainingInBatch}
                    </td>
                    <td className="border p-1 text-center">
                      <button
                        disabled={isDisablePlus(product.article)}
                        onClick={() => handlePlus(product, 0)}
                      >
                        ＋
                      </button>
                      <button
                        disabled={isDisableMinus(
                          product.article,
                          product.batches[0],
                        )}
                        onClick={() => handleMinus(product, 0)}
                      >
                        －
                      </button>
                    </td>
                    <td className="border p-1">{product.batches[0]?.allocated}</td>
                  </>
                ) : (
                  <>
                    <td className="border p-1">
                      <button
                        onClick={() => {
                          setWmoctModal(!wmoctModal);
                          handlePlusBatch(product);
                        }}
                      >
                        ＋
                      </button>
                    </td>
                    <td className="border p-1"></td>
                    <td className="border p-1 text-center"></td>
                    <td className="border p-1"></td>
                  </>
                )}
              </tr>
              {/* Дополнительные строки для батчей */}
              {product.batches?.slice(1).map((batch, batchIndex) => (
                <tr key={`${product.article}__${batch.batchId}`}>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">{batch.batchId}</td>
                  <td className="border p-1">{batch.remainingInBatch}</td>
                  <td className="border p-1 text-center">
                    <button
                      disabled={isDisablePlus(product.article)}
                      onClick={() => handlePlus(product, batchIndex + 1)}
                    >
                      ＋
                    </button>
                    <button
                      disabled={isDisableMinus(product.article, batch)}
                      onClick={() => handleMinus(product, batchIndex + 1)}
                    >
                      －
                    </button>
                  </td>
                  <td className="border p-1">{batch.allocated}</td>
                </tr>
              ))}
              {haveBatches(productIndex) ? (
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">
                    <button
                      onClick={() => {
                        setWmoctModal(!wmoctModal);
                        handlePlusBatch(product);
                      }}
                    >
                      ＋
                    </button>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center"></td>
                  <td className="border p-1"></td>
                </tr>
              ) : (
                <></>
              )}
            </Fragment>
          ))}
        </tbody>
        {isSaveButtonVisible() && (
          <tfoot>
            <tr>
              <td colSpan={8} className="border p-1">
                <button type="button" onClick={onSaveHandler}>
                  SAVE
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default WMOCTProduct;
