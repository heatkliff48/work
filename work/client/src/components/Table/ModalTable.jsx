import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const ModalTable = ({ isOpen, toggle, data = [], onClickRow = null }) => {
  const filteredData = data?.filter((item) => item?.article.startsWith('T'));

  const isProductData = filteredData.length > 0;
  const right_data = isProductData
    ? filteredData.map((item) => ({
        id: item.id,
        article: item.article,
        density: item?.density,
        width: item?.width,
      }))
    : data;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-products-table"
      scrollable={true}
    >
      <ModalHeader toggle={toggle}>Modal table</ModalHeader>
      <ModalBody>
        <div className="overflow-x-auto">
          {right_data.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(right_data[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {right_data.map((row, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="border border-gray-300 px-4 py-2"
                        onClick={() => {
                          onClickRow(row);
                          toggle();
                        }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No data to visble for you</p>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalTable;
