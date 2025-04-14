import { Fragment, useEffect, useState } from 'react';
import WMOCTableModal from './WMOCTableModal';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const WMOCTable = ({ product_list }) => {
  const { wmoctProduct, setWmoctProduct } = useWarehouseContext();
  const { wmoctModal, setWmoctModal } = useModalContext();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePlusBatch = (product) => {
    setSelectedProduct(product.article);
    setWmoctModal(true);
  };

  const handlePlus = (productIndex, batchIndex) => {};

  const handleMinus = (productIndex, batchIndex) => {};

  const haveBatches = (i) => {
    return wmoctProduct[i]?.batches?.length > 0;
  };

  useEffect(() => {
    const initialProducts = product_list.orders_products.map((el) => {
      const [article, quantityStr] = el.split(':').map((s) => s.trim());
      const quantity = Number(quantityStr);

      return {
        article,
        qty_total: quantity,
        shipped: 0,
        qty_rem: quantity - 0,
        batches: [],
      };
    });

    setWmoctProduct(initialProducts);
  }, [product_list]);

  useEffect(() => {
    console.log('wmoctProduct', wmoctProduct);
  }, [wmoctProduct]);

  return (
    <>
      <WMOCTableModal
        isOpen={wmoctModal}
        toggle={() => {
          setWmoctModal(!wmoctModal);
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />
      <div className="overflow-auto">
        <table className="table-auto border border-gray-300 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2">Product article</th>
              <th className="border px-2">Qty total</th>
              <th className="border px-2">Qty shipped</th>
              <th className="border px-2">Qty remaining</th>
              <th className="border px-2">Batch ID</th>
              <th className="border px-2">Qty in batch</th>
              <th className="border px-2">Controls</th>
              <th className="border px-2">Qty allocated</th>
            </tr>
          </thead>
          <tbody>
            {wmoctProduct?.map((product, productIndex) => (
              <Fragment key={productIndex}>
                {/* Основная строка продукта */}
                <tr>
                  <td className="border p-1">{product.article}</td>
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
                        <button onClick={() => handlePlusBatch(product)}>＋</button>
                        <button
                          onClick={() =>
                            product.batches.length > 0 &&
                            handleMinus(productIndex, 0)
                          }
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
                  <tr key={batchIndex + 1}>
                    {/* Первые 4 колонки оставляем пустыми, так как они уже отображены в основной строке */}
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1">{batch.batchId}</td>
                    <td className="border p-1">{batch.remainingInBatch}</td>
                    <td className="border p-1 text-center">
                      <button onClick={() => handlePlusBatch(product)}>＋</button>
                      <button
                        onClick={() => handleMinus(productIndex, batchIndex + 1)}
                      >
                        －
                      </button>
                    </td>
                    <td className="border p-1">{batch.allocated}</td>
                  </tr>
                ))}
                {/* Всегда отображаем пустую строку для добавления нового батча */}
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
        </table>
      </div>
    </>
  );
};

export default WMOCTable;
