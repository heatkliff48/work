import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../../warehouseManagerView.css';

const WMOCTableModal = ({ isOpen, toggle, selectedProduct }) => {
  const [wmoctmodalData, setWmoctModalData] = useState();
  const {
    wmoctProduct,
    setWmoctProduct,
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
        if (product.order_dispatch_id !== selectedProduct) {
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
    const line = (wmoctProduct || []).find(
      (product) => product.order_dispatch_id === selectedProduct,
    );
    if (!line) return;

    const type = line.product_type;
    const wh_arr = warehouseMap[type] || [];

    // A batch already taken by a line is matched by its warehouse row, not by
    // article: articles of auxiliary warehouses aren't unique, and ids only
    // mean something within one warehouse type.
    const takenWarehouseIds = new Set(
      wmoctProduct
        .filter((product) => product.product_type === type)
        .flatMap((product) =>
          (product.batches || []).map((batch) => Number(batch.warehouseId)),
        ),
    );

    const result = wh_arr
      .filter((el) => {
        const product_article =
          el.product_article ||
          el.dry_mixed_article ||
          el.anchor_article ||
          el.tool_article ||
          el.rel_mat_article;
        return product_article == line.article;
      })
      .filter((warehouseItem) => !takenWarehouseIds.has(Number(warehouseItem.id)))
      .filter((el) => el.ordered_quantity > 0 || el.free_quantity_remaining > 0)
      .map((el) => ({
        warehouse_id: el.id,
        batch_article: el.article,
        // Only block batches have a batch_id; the other warehouses show
        // their article
        batch_id: el.batch_id ?? el.article,
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
        centered
        scrollable
        className="wm-modal-dialog--batch"
        contentClassName="wm-modal-card"
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
            <div className="overflow-auto">
              <table className="wm-prod-table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
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
                          {product.batch_id}
                        </td>
                        <td rowSpan={product?.length || 1}>
                          {product.free_quantity_remaining}
                        </td>
                        <td rowSpan={product?.length || 1}>
                          {product.quantity}
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </Fragment>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default WMOCTableModal;
