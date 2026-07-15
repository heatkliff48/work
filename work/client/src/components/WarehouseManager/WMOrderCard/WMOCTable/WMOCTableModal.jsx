import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../../warehouseManagerView.css';

const WMOCTableModal = ({ isOpen, toggle, selectedProduct }) => {
  const [wmoctmodalData, setWmoctModalData] = useState();
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
      const remainingInBatch = Number(batch.total_quantity || 0);

      return prev.map((product) => {
        if (product.article !== selectedProduct) {
          return product;
        }

        return {
          ...product,
          batches: [
            ...product.batches,
            {
              batchId: batch.batch_article,

              baseRemainingInBatch: remainingInBatch,
              remainingInBatch,

              allocated: 0,
              minAllocated: 0,

              warehouseId: batch.warehouse_id,
              orders_products_id: product.orders_products_id,
              order_dispatch_id: product.order_dispatch_id,
            },
          ],
        };
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
      .filter((el) => el.ordered_quantity > 0 || el.free_quantity_remaining > 0)
      .map((el) => ({
        warehouse_id: el.id,
        batch_article: el.article,
        free_quantity_remaining: el.free_quantity_remaining,
        quantity: el.ordered_quantity,
        total_quantity: el.total_quantity,
      }));
    setWmoctModalData(result);
  }, [selectedProduct, wmoctProduct]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          toggle();
        }}
        contentClassName="wm-modal-card wm-modal-card--sm"
        backdropClassName="wm-modal-backdrop"
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
            <table className="wm-prod-table">
              <thead>
                <tr>
                  <th>Batch article</th>
                  <th>Free quantity remaining</th>
                  <th>Ordered quantity</th>
                </tr>
              </thead>

              <tbody>
                {wmoctmodalData?.map((product, productIndex) => (
                  <Fragment key={productIndex}>
                    <tr
                      className="tbl-row--click"
                      onClick={() => {
                        onClickHandler(product);
                      }}
                    >
                      <td className="wm-mono" rowSpan={product?.length || 1}>
                        {product.batch_article}
                      </td>
                      <td rowSpan={product?.length || 1}>
                        {product.free_quantity_remaining}
                      </td>
                      <td rowSpan={product?.length || 1}>{product.quantity}</td>
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
