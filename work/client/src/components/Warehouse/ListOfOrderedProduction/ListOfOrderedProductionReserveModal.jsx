import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useDispatch } from 'react-redux';
import {
  addNewReservedProducts,
  updateRemainingStock,
  updListOfOrderedProductionOEM,
} from '#components/redux/actions/warehouseAction.js';

function ListOfOrderedProductionReserveModal({
  show,
  onHide,
  listOfOrderedProductionReserveData,
  currentOrderedProduct,
  needToReserve = false,
  handleRowClick = () => {},
}) {
  const {
    list_of_reserved_products,
    warehouse_data,
    setFilteredWarehouseByProduct,
  } = useWarehouseContext();
  const { list_of_orders, list_of_ordered_production_oem, productsOfOrders } =
    useOrderContext();
  const { latestProducts } = useProductsContext();
  const dispatch = useDispatch();
  const [remainsToReserve, setRemainsToReserve] = useState(0);

  const handleReserveOrderedProduct = (product) => {
    const { quantity, product_article, order_article } = currentOrderedProduct;

    const warehouse = warehouse_data.find(
      (warehouse) => warehouse.article === product.article
    );

    const product_id = latestProducts.find((el) => el.article === product_article);

    const filteredProductsOfOrders = productsOfOrders.filter(
      (item) => item.product_id === product_id.id
    );

    const ordersWithProduct = filteredProductsOfOrders.map((product) => {
      const order = list_of_orders.find((order) => order.id === product.order_id);
      return {
        productsOfOrders_id: product.id,
        order_article: order ? order.article : '',
        quantity_palet: product.quantity_palet,
      };
    });
    const result = ordersWithProduct.find(
      (order) => order.order_article === order_article
    );

    // console.log(result);

    if (remainsToReserve == 0) {
      alert('Fully reserved!');
      return;
    } else if (quantity > product.remaining_stock) {
      dispatch(
        updateRemainingStock({ warehouse_id: warehouse.id, new_remaining_stock: 0 })
      );

      dispatch(
        addNewReservedProducts({
          warehouse_id: warehouse.id,
          orders_products_id: result.productsOfOrders_id,
          quantity: product.remaining_stock,
        })
      );
    } else {
      const new_remaining_stock = product.remaining_stock - quantity;

      dispatch(
        updateRemainingStock({ warehouse_id: warehouse.id, new_remaining_stock })
      );

      dispatch(
        addNewReservedProducts({
          warehouse_id: warehouse.id,
          orders_products_id: result.productsOfOrders_id,
          quantity: quantity,
        })
      );

      if (
        latestProducts.find((el) => el.id === warehouse.product_id)
          ?.placeOfProduction !== 'Spain'
      ) {
        const list_of_order_oem_id = list_of_ordered_production_oem.find(
          (el) =>
            el.order_article === order_article &&
            el.product_article === product_article
        );
        if (list_of_order_oem_id) {
          dispatch(
            updListOfOrderedProductionOEM({
              id: list_of_order_oem_id.id,
              status: 'Reserved',
            })
          );
          const order_id = list_of_orders.find(
            (el) => el.article === order_article
          )?.id;

          dispatch(
            updateOrderStatus({
              order_id,
              status: 7,
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    console.log('remainsToReserve', remainsToReserve);
  }, [remainsToReserve]);

  const COLUMNS_FILTERED_WAREHOUSE_FOR_RESERVE = [
    { Header: 'Warehouse article', accessor: 'article', sortType: 'string' },
    { Header: 'Product article', accessor: 'product_article', sortType: 'string' },
    {
      Header: 'Quantity in warehouse, pallets',
      accessor: 'remaining_stock',
      sortType: 'number',
    },
    {
      Header: 'Reserve',
      accessor: 'reserve',
      Cell: ({ cell }) => (
        <button onClick={() => handleReserveOrderedProduct(cell.row.values)}>
          Reserve
        </button>
      ),
    },
  ];

  const COLUMNS_FILTERED_WAREHOUSE = [
    { Header: 'Warehouse article', accessor: 'article', sortType: 'string' },
    { Header: 'Product article', accessor: 'product_article', sortType: 'string' },
    {
      Header: 'Quantity in warehouse, pallets',
      accessor: 'remaining_stock',
      sortType: 'number',
    },
  ];

  useEffect(() => {
    if (!show) return;
    const order_id = list_of_orders.find(
      (order) => order.article === currentOrderedProduct.order_article
    ).id;

    const product_id = latestProducts.find(
      (el) => el.article === currentOrderedProduct.product_article
    ).id;

    const checkReserve = productsOfOrders.find(
      (prod) => prod.order_id === order_id && prod.product_id === product_id
    );

    if (checkReserve?.warehouse_id !== null) {
      let reserveSum = 0;
      // const reserveQuantity = list_of_reserved_products?.find(
      //   (reserve) => reserve.orders_products_id === checkReserve?.id
      // )?.quantity;
      list_of_reserved_products.forEach((product) => {
        if (product.orders_products_id === checkReserve?.id) {
          reserveSum += product.quantity;
        }
      });

      if (checkReserve?.quantity_palet - reserveSum > 0) {
        setRemainsToReserve(checkReserve.quantity_palet - reserveSum);
      } else setRemainsToReserve(0);
    } else setRemainsToReserve(checkReserve.quantity_palet);
  }, [list_of_reserved_products, show]);

  useEffect(() => {
    const filteredWarehouse = warehouse_data.filter(
      (entry) =>
        entry.product_article === currentOrderedProduct.product_article &&
        entry.remaining_stock != 0
    );
    setFilteredWarehouseByProduct(filteredWarehouse);
  }, [warehouse_data]);

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-auto-size"
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Order {currentOrderedProduct.order_article}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <Table
            key={remainsToReserve}
            COLUMN_DATA={
              needToReserve
                ? COLUMNS_FILTERED_WAREHOUSE_FOR_RESERVE
                : COLUMNS_FILTERED_WAREHOUSE
            }
            dataOfTable={listOfOrderedProductionReserveData}
            // userAccess={userAccess}
            onClickButton={() => {}}
            buttonText={''}
            tableName={`Entries of product ${
              currentOrderedProduct.product_article
            } in the warehouse\n${
              remainsToReserve !== 0
                ? `Left to reserve: ${remainsToReserve}`
                : `Fully reserved`
            }`}
            handleRowClick={handleRowClick}
          />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ListOfOrderedProductionReserveModal;
