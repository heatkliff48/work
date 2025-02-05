import { useStatisticContext } from '#components/contexts/StatisticContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useEffect, useMemo, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const StockBalanceModal = ({ isOpen, toggle }) => {
  const { warehouse_data } = useWarehouseContext();
  const { stockBalance, setStockBalance } = useStatisticContext();

  const [filter_data, setFilterData] = useState([]);
  const [stock_requirements, setStockRequirements] = useState();
  const [stock, setStock] = useState({});

  const onClickRow = (row) => {
    setStock((prev) => ({ ...prev, ...row }));
  };

  const onButtonClick = () => {
    const num_stock_requirements = Number(stock_requirements);
    setStockBalance((prev) => [
      ...prev,
      {
        ...stock,
        stock_requirements: num_stock_requirements,
        diff: num_stock_requirements - stock.in_stock,
      },
    ]);
    toggle();
  };

  let haveProduct = useMemo(() => stock?.product_article ?? false, [stock]);

  useEffect(() => {
    if (!warehouse_data || warehouse_data.length === 0 || !stockBalance) return;

    const aggregatedData = warehouse_data.reduce((acc, item) => {
      const { product_article, remaining_stock } = item;

      if (!acc[product_article]) {
        acc[product_article] = { product_article, in_stock: 0 };
      }

      acc[product_article].in_stock += remaining_stock;
      return acc;
    }, {});

    let resultArray = Object.values(aggregatedData);

    resultArray = resultArray.filter(
      (item) =>
        !stockBalance.some((stock) => stock.product_article === item.product_article)
    );

    setFilterData(resultArray);
  }, []);

  useEffect(() => {
    console.log('stock', stock);
  }, [stock]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-products-table"
      scrollable={true}
    >
      <ModalHeader toggle={toggle}>Stock modal table</ModalHeader>
      <ModalBody>
        <div className="overflow-x-auto">
          {filter_data.length > 0 ? (
            haveProduct ? (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Stock requirements"
                  value={stock_requirements}
                  onChange={(e) => setStockRequirements(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <button
                  onClick={() => {
                    onButtonClick();
                  }}
                  className="bg-blue-500 text-black px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Артикул
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Остаток
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filter_data.map((row, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50"
                      onClick={() => {
                        onClickRow(row);
                      }}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {row.product_article}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.in_stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p className="text-center text-gray-500">Нет данных для отображения</p>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default StockBalanceModal;
