import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const WMOCTableModal = ({ isOpen, toggle }) => {
  const { warehouse_data } = useWarehouseContext();
  const [wmoctmodal, setWmoctModal] = useState();

  const onClickHandler = (batch) => {};

  useEffect(() => {
    const result = warehouse_data.map((el) => ({
      batch_artcle: el.article,
      quantity: el.total_quantity,
    }));
    setWmoctModal(result);
  }, []);

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
                        {product.batch_artcle}
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
