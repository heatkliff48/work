import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Table from '#components/Table/Table.jsx';
import { addNewProductionBatchLog } from '#components/redux/actions/productionBatchLogAction.js';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
// import { registerLocale, setDefaultLocale } from 'react-datepicker';
// import { es } from 'date-fns/locale/es';
// registerLocale('es', es);

function AddProductToProductionBatchLogModal(props) {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const { COLUMNS, latestProducts } = useProductsContext();

  const [selectedProduct, setSelectedProduct] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handlerAddProductToBatchLog = (row) => {
    // const product = latestProducts.filter((el) => el.id === row.original.id);
    const product = latestProducts.find((el) => el.id === row.original.id);

    setSelectedProduct((prev) => ({ ...prev, article_product: product?.article }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    dispatch(
      addNewProductionBatchLog({
        productionBatchLog: {
          products_article: selectedProduct.article_product,
          orders_article: 0,
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
            <p>Selected product: {selectedProduct.article_product}</p>
            <Table
              COLUMN_DATA={COLUMNS}
              dataOfTable={latestProducts}
              userAccess={userAccess}
              tableName={'Production Batch Logs'}
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

function ShowAddProductToProductionBatchLogModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add Product
      </Button>

      <AddProductToProductionBatchLogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ShowAddProductToProductionBatchLogModal;
