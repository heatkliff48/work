import { Fragment, useEffect, useState } from 'react';
import WMOCTableModal from './WMOCTableModal';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useDispatch } from 'react-redux';
import {
  addNewReservedProducts,
  updateWarehouseQuantitys,
  updReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';

const WMOCTable = ({ product_list }) => {
  const {
    wmoctProduct,
    setWmoctProduct,
    warehouse_data,
    list_of_reserved_products,
  } = useWarehouseContext();
  const { productsOfOrders, list_of_orders } = useOrderContext();
  const { wmoctModal, setWmoctModal } = useModalContext();
  const { latestProducts } = useProductsContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  const handlePlusBatch = (product) => {
    setSelectedProduct(product.article);
    setWmoctModal(true);
  };

  const handlePlus = (batch, batchIndex) => {
    setWmoctProduct((prev) =>
      prev.map((wmoctItem) => {
        if (wmoctItem.article == batch.article) {
          let { shipped, qty_rem } = wmoctItem;

          const newBatches = wmoctItem.batches.map((el, i) => {
            if (i == batchIndex) {
              const { allocated, remainingInBatch } = el;
              const canPlus = allocated == remainingInBatch;
              const result = canPlus ? allocated : allocated + 1;

              shipped = canPlus ? shipped : shipped + 1;
              qty_rem = canPlus ? qty_rem : qty_rem - 1;

              return { ...el, allocated: result };
            }

            return el;
          });

          return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
        }

        return wmoctItem;
      })
    );
  };

  const handleMinus = (batch, batchIndex) => {
    setWmoctProduct((prev) =>
      prev.map((wmoctItem) => {
        if (wmoctItem.article == batch.article) {
          let { shipped, qty_rem } = wmoctItem;
          const newBatches = wmoctItem.batches.map((el, i) => {
            const { allocated } = el;

            if (i == batchIndex) {
              const canMinus = allocated != 0;

              const result = canMinus ? allocated - 1 : 0;
              shipped = canMinus ? shipped - 1 : shipped;
              qty_rem = canMinus ? qty_rem + 1 : qty_rem;

              return { ...el, allocated: result };
            }
            return el;
          });
          return { ...wmoctItem, shipped, qty_rem, batches: newBatches };
        }

        return wmoctItem;
      })
    );
  };

  const haveBatches = (i) => {
    return wmoctProduct[i]?.batches?.length > 0;
  };

  const isDisable = (article) => {
    return wmoctProduct.some(
      (el) => el.article == article && el.qty_total == el.shipped
    );
  };

  const saveHandler = () => {
    const newReserved = [];
    const wh_arr = [];

    wmoctProduct.forEach((el) => {
      const { orders_products_id } = el;

      el?.batches?.forEach((elem) => {
        const wh = warehouse_data.find((el) => el.article == elem.batchId);

        const haveReserve = list_of_reserved_products.find(
          (el) =>
            el.warehouse_id == wh.id && el.orders_products_id == orders_products_id
        );

        const obj = {
          warehouse_id: wh.id,
          orders_products_id,
          quantity: elem.allocated,
        };

        if (!haveReserve) {
          newReserved.push(obj);
          wh_arr.push({
            warehouse_id: wh.id,
            total_quantity: wh.total_quantity - elem.allocated,
            ordered_quantity: wh.ordered_quantity - elem.allocated,
          });
        }

        if (haveReserve && haveReserve.quantity != elem.allocated) {
          const quantity = haveReserve.quantity - elem.allocated;

          wh_arr.push({
            warehouse_id: wh.id,
            total_quantity: wh.total_quantity + quantity,
            ordered_quantity: wh.ordered_quantity + quantity,
          });
          dispatch(updReservedProducts(obj));
        }
      });
    });

    wh_arr.forEach((el) => {
      dispatch(updateWarehouseQuantitys(el));
    });

    dispatch(addNewReservedProducts(newReserved));
  };

  useEffect(() => {
    const initialProducts = product_list.orders_products.map((el) => {
      const [article, quantityStr] = el.split(':').map((s) => s.trim());
      const quantity = Number(quantityStr);

      const batches = [];
      let shipped = 0;
      let qty_rem = quantity;

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
      ).id;

      const list_of_batches = list_of_reserved_products.filter(
        (el) => el.orders_products_id == product
      );

      if (list_of_batches.length > 0) {
        list_of_batches.forEach((batch) => {
          const { quantity } = batch;
          const wrh_item = warehouse_data.find((el) => el.id == batch.warehouse_id);

          const obj = {
            batchId: wrh_item.article,
            remainingInBatch: wrh_item.ordered_quantity,
            allocated: quantity,
          };
          shipped += quantity;
          qty_rem -= quantity;
          batches.push(obj);
        });
      }

      return {
        article,
        qty_total: quantity,
        shipped,
        qty_rem,
        batches,
        orders_products_id: product,
      };
    });

    setWmoctProduct(initialProducts);
  }, [product_list, latestProducts, list_of_orders, list_of_reserved_products]);

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
                        <button
                          disabled={isDisable(product.article)}
                          onClick={() => handlePlus(product, 0)}
                        >
                          ＋
                        </button>
                        <button
                          disabled={isDisable(product.article)}
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
                  <tr key={batchIndex + 1}>
                    {/* Первые 4 колонки оставляем пустыми, так как они уже отображены в основной строке */}
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1"></td>
                    <td className="border p-1">{batch.batchId}</td>
                    <td className="border p-1">{batch.remainingInBatch}</td>
                    <td className="border p-1 text-center">
                      <button
                        disabled={isDisable(product.article)}
                        onClick={() => handlePlus(product, batchIndex + 1)}
                      >
                        ＋
                      </button>
                      <button
                        disabled={isDisable(product.article)}
                        onClick={() => handleMinus(product, batchIndex + 1)}
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
          <button onClick={saveHandler}>SAVE</button>
        </table>
      </div>
    </>
  );
};

export default WMOCTable;
