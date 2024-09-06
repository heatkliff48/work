import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useProjectContext } from '#components/contexts/Context.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import Table from '#components/Table/Table.jsx';
import { addNewProductionBatchLog } from '#components/redux/actions/productionBatchLogAction.js';
import { useDispatch, useSelector } from 'react-redux';
// import { registerLocale, setDefaultLocale } from 'react-datepicker';
// import { es } from 'date-fns/locale/es';
// registerLocale('es', es);

function AddListOfOrderedModal(props) {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useProjectContext();

  const { COLUMNS_LIST_OF_ORDERED_PRODUCTION, list_of_ordered_production } =
    useWarehouseContext();

  const [selectedProduct, setSelectedProduct] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handlerAddProductToBatchLog = (row) => {
    const product = list_of_ordered_production.find(
      (el) => el.id === row.original.id
    );

    setSelectedProduct(product);

    console.log('selectedProduct', selectedProduct);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    dispatch(
      addNewProductionBatchLog({
        productionBatchLog: {
          products_article: selectedProduct.product_article,
          orders_article: selectedProduct.order_article,
          production_date: new Date(startDate),
        },
      })
    );
    props.onHide();
    setSelectedProduct({});
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Production_batch_log');
      setUserAccess(access);
    }
  }, [user, roles]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addProductModal"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <p>
              Select date:{' '}
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </p>
            <p>Selected product: {selectedProduct.product_article}</p>
            <Table
              COLUMN_DATA={COLUMNS_LIST_OF_ORDERED_PRODUCTION}
              dataOfTable={list_of_ordered_production}
              userAccess={userAccess}
              tableName={'List of ordered production'}
              handleRowClick={(row) => {
                handlerAddProductToBatchLog(row);
              }}
            />
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addProductModal" type="submit">
          Add Product
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowAddListOfOrderedModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add from list_of_ordered_production
      </Button>

      <AddListOfOrderedModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowAddListOfOrderedModal;
