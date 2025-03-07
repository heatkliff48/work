import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import { addNewProductsTypeJournal } from '#components/redux/actions/usersInfoAction';
import './styles.css';
import {
  addNewDryMixesJournal,
  addNewRelatedMaterialsJournal,
} from '#components/redux/actions/productsTypeJournalAction.js';

function ProductsTypeJournalModal(props) {
  const [productsTypeJournalInput, setProductsTypeJournalInput] = useState({});

  const dispatch = useDispatch();

  const handleProductsTypeJournalInputChange = useCallback((e) => {
    setProductsTypeJournalInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // useEffect(() => {
  //   setProductsTypeJournalInput((prev) => ({ ...prev, role: roleOptions[0].value }));
  // }, [props.show]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (props.target == 1) {
      dispatch(
        addNewDryMixesJournal({
          product_name: productsTypeJournalInput.product_name,
          units_per_pack: productsTypeJournalInput.units_per_pack,
          price_per_pack: productsTypeJournalInput.price_per_pack,
        })
      );
    } else {
      dispatch(
        addNewRelatedMaterialsJournal({
          product_name: productsTypeJournalInput.product_name,
          units_per_pack: productsTypeJournalInput.units_per_pack,
          price_per_pack: productsTypeJournalInput.price_per_pack,
        })
      );
    }

    // setModalShow(false);
    props.onHide();
    setProductsTypeJournalInput({});
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addClientModel"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <h3></h3>
            <Row>
              {props.table.map((el) => (
                <Col key={el.id}>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        for="version"
                      >
                        {el.Header}
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={productsTypeJournalInput[el.accessor] || ''}
                        onChange={(e) => handleProductsTypeJournalInputChange(e)}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          Add {props.title}
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowProductsTypeJournalModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add {props.title}
      </Button>

      <ProductsTypeJournalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        table={props.table}
        target={props.target}
        title={props.title}
      />
    </>
  );
}

export default ShowProductsTypeJournalModal;
