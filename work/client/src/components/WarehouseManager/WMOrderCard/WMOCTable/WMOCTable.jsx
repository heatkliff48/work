import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { Fragment, useEffect, useState } from 'react';
import WMOCTableModal from './WMOCTableModal';
import { useModalContext } from '#components/contexts/ModalContext.js';

const WMOCTable = ({ product_list }) => {
  const { productsOfOrders, list_of_orders } = useOrderContext();
  const { wmoctModal, setWmoctModal } = useModalContext();
  const { latestProducts } = useProductsContext();
  const [wmoctProduct, setWmoctProduct] = useState();

  const handlePlus = (productIndex, batchIndex) => {

  };

  const handleMinus = (productIndex, batchIndex) => {
    // Уменьшение выделения
  };

  useEffect(() => {
    const result = product_list.orders_products.map((el) => {
      const [article, quantityStr] = el.split(':').map((s) => s.trim());
      const quantity = Number(quantityStr);

      const product_from_list_id = latestProducts.find(
        (el) => el.article == article
      )?.id;

      const order_from_list_id = list_of_orders.find(
        (el) => el.article == product_list.orders_article
      )?.id;

      const product = productsOfOrders.find(
        (poo) =>
          poo.product_id === product_from_list_id &&
          poo.order_id === order_from_list_id
      );
      console.log('product', product);

      return {
        article,
        qty_total: quantity,
        shipped: 0,
        qty_rem: quantity - 0,
        batches: [],
      };
    });
    setWmoctProduct(result);
  }, []);

  return (
    <>
      <WMOCTableModal
        isOpen={wmoctModal}
        toggle={() => {
          setWmoctModal(!wmoctModal);
        }}
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
                <tr>
                  <td className="border p-1" rowSpan={product?.batches?.length || 1}>
                    {product.article}
                  </td>
                  <td className="border p-1" rowSpan={product?.batches?.length || 1}>
                    {product.qty_total}
                  </td>
                  <td className="border p-1" rowSpan={product?.batches?.length || 1}>
                    {product.shipped}
                  </td>
                  <td className="border p-1" rowSpan={product?.batches?.length || 1}>
                    {product.qty_rem}
                  </td>

                  {product?.batches?.length > 0 ? (
                    product?.batches.map((el, i) => (
                      <>
                        <td className="border p-1">{el.batchId}</td>
                        <td className="border p-1">
                          {el.remainingInBatch}
                          {i === product?.batches?.length ? (
                            <>
                              <button onClick={() => setWmoctModal(!wmoctModal)}>
                                ＋
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                        </td>
                        <td className="border p-1 text-center">
                          <button onClick={() => handlePlus(el)}>＋</button>
                          <button onClick={() => handleMinus(el)}>－</button>
                        </td>
                        <td className="border p-1">{el.allocated}</td>
                      </>
                    ))
                  ) : (
                    <>
                      <td className="border p-1"></td>
                      <td className="border p-1"></td>
                      <td className="border p-1 text-center"></td>
                      <td className="border p-1"></td>
                    </>
                  )}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WMOCTable;
