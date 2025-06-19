import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const WMOCTableModal = ({ isOpen, toggle, selectedProduct }) => {
  const [wmoctmodal, setWmoctModal] = useState();
  const {
    wmoctProduct,
    setWmoctProduct,
    getProductType,
    warehouse_data,
    dry_mixes_warehouse_data,
    anchors_warehouse_data,
    tools_warehouse_data,
    related_materials_warehouse_data,
  } = useWarehouseContext();

  const warehouseMap = {
    product: warehouse_data,
    dryMixed: dry_mixes_warehouse_data,
    anchor: anchors_warehouse_data,
    tool: tools_warehouse_data,
    relMat: related_materials_warehouse_data,
  };

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
    if (!selectedProduct) return;
    const type = getProductType(selectedProduct);
    const wh_arr = warehouseMap[type];
    const result = wh_arr
      .filter((el) => {
        const product_article =
          el.product_article ||
          el.dry_mixed_article ||
          el.anchor_article ||
          el.tool_article ||
          el.rel_mat_article;
        return product_article == selectedProduct;
      })
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
