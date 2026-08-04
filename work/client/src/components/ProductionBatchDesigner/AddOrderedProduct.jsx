import Table from '#components/Table/Table';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';
import { useState } from 'react';
import { useProductsContext } from '#components/contexts/ProductContext.js';

const AddOrderedProduct = ({ isOpen, toggle, data = [], onClickRow = null }) => {
  const { latestProducts } = useProductsContext();
  const COLUMNS_ORDERS_TO_WAREHOUSE = [
    {
      Header: 'Ref.',
      accessor: 'product_article',
      disableSortBy: true,
    },
    {
      Header: 'Description',
      accessor: 'description',
      sortType: 'string',
    },
    {
      Header: 'Product size',
      accessor: 'product_size',
    },
    {
      Header: 'Product density',
      accessor: 'density',
    },
    {
      Header: 'Pallets, qty',
      accessor: 'quantity_pallets',
    },
    {
      Header: 'Real quantity, m2',
      accessor: 'quantity_real_m2',
    },
    {
      Header: 'Produced',
      accessor: 'quantity_produced',
    },
    {
      Header: 'Allocated',
      accessor: 'quantity_allocated',
    },
  ];

  const [fileterdList, setFilteredList] = useState([]);

  const dispatch = useDispatch();

  const list_of_orders_to_warehouse = useSelector((state) => state.orderToWarehouse);

  useEffect(() => {
    dispatch(getOrderToWarehouse());
  }, []);

  useEffect(() => {
    if (!list_of_orders_to_warehouse) {
      setFilteredList([]);
      return;
    }

    const filtered = list_of_orders_to_warehouse.filter(
      (order) =>
        order.quantity_pallets > order.quantity_produced &&
        order.quantity_pallets > order.quantity_allocated,
    );

    const regex = /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/;
    const filteredWithSize = filtered.reduce((acc, el) => {
      const match = el?.description?.match(regex);

      const product_size = match ? `${match[1]}x${match[2]}x${match[3]}` : '';

      const product = latestProducts.find((p) => p.article == el.product_article);

      const newObj = {
        ...el,
        product_size,
        density: product.density,
      };
      acc.push(newObj);
      return acc;
    }, []);

    setFilteredList(filteredWithSize);
  }, [list_of_orders_to_warehouse]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
      className="modal-products-table"
      scrollable={true}
    >
      <ModalHeader
        toggle={() => {
          toggle();
        }}
      ></ModalHeader>
      <ModalBody>
        <Table
          COLUMN_DATA={COLUMNS_ORDERS_TO_WAREHOUSE}
          dataOfTable={fileterdList}
          tableName={'Orders to warehouse'}
          handleRowClick={(row) => {
            onClickRow(row.original);
            toggle();
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default AddOrderedProduct;
