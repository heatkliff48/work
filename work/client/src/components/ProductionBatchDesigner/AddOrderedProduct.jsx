import Table from '#components/Table/Table';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';

const AddOrderedProduct = ({
  isOpen,
  toggle,
  data = [],
  onClickRow = null,
}) => {
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
      Header: 'Quantity of pallets',
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
  ];

  const dispatch = useDispatch();

  const list_of_orders_to_warehouse = useSelector(
    (state) => state.orderToWarehouse,
  );

  useEffect(() => {
    dispatch(getOrderToWarehouse());
  }, []);

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
          dataOfTable={list_of_orders_to_warehouse}
          tableName={'Orders to warehouse'}
          handleRowClick={(row) => {
            onClickRow(row.original);
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default AddOrderedProduct;
