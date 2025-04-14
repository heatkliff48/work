import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const WMOCTableModal = ({ isOpen, toggle, selectedProduct }) => {
  const { warehouse_data } = useWarehouseContext();
  const [wmoctmodal, setWmoctModal] = useState();
  const { wmoctProduct, setWmoctProduct } = useWarehouseContext();

  const onClickHandler = (batch) => {
    setWmoctProduct((prev) => {
      return prev.map((el) => {
        if (el.article == selectedProduct)
          return {
            ...el,
            batches: [
              ...el.batches,
              {
                batchId: batch.batch_article,
                remainingInBatch: batch.quantity,
                allocated: 0,
              },
            ],
          };
        return el;
      });
    });
    toggle();
  };

  useEffect(() => {
    const result = warehouse_data
      .filter((el) => el.product_article == selectedProduct)
      .filter((warehouseItem) => {
        const isArticleInAnyWMOCTBatches = wmoctProduct.some((wmoctItem) => {
          return wmoctItem.batches.some((batchItem) => {
            return batchItem.batchId == warehouseItem.article;
          });
        });

        return !isArticleInAnyWMOCTBatches;
      })
      .filter((el) => el.ordered_quantity > 0)
      .map((el) => ({
        batch_article: el.article,
        quantity: el.ordered_quantity,
      }));
    setWmoctModal(result);
  }, [selectedProduct, wmoctProduct]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          toggle();
        }}
      >
        <ModalHeader
          toggle={() => {
            toggle();
          }}
        >
          <p>Select Batch</p>
        </ModalHeader>
        <Fragment>
          <ModalBody>
            <table className="table-auto border border-gray-300 w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2">Batch article</th>
                  <th className="border px-2">Qty remaining in batch, pallets</th>
                </tr>
              </thead>

              <tbody>
                {wmoctmodal?.map((product, productIndex) => (
                  <Fragment key={productIndex}>
                    <tr
                      onClick={() => {
                        onClickHandler(product);
                      }}
                    >
                      <td className="border p-1" rowSpan={product?.length || 1}>
                        {product.batch_article}
                      </td>
                      <td className="border p-1" rowSpan={product?.length || 1}>
                        {product.quantity}
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </ModalBody>
        </Fragment>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default WMOCTableModal;
