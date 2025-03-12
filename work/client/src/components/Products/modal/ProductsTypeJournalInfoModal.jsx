import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import './styles.css';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import BarcodeGenerator from './BarcodeGenerator';

function ProductsTypeJournalInfoModal(props) {
  const { selectedProductsType, dataTable } = useProductsTypeJournalContext();
  // const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  // const user = useSelector((state) => state.user);

  // const navigate = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    props.onHide();
  };

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'recipe_products');
  //     setUserAccess(access);

  //     console.log('access', access);

  //     if (!access?.canRead) {
  //       navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
  //     }
  //   }
  // }, [user, roles]);

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-auto-size"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form
              id="RecipeInfoModal"
              className="w-full max-w-sm"
              onSubmit={(e) => {
                onSubmitForm(e);
              }}
            >
              <Row>
                <Col xs={12} md={8}>
                  {selectedProductsType &&
                    dataTable.map((el) => (
                      <Row>
                        <h3>
                          {el.Header}: {selectedProductsType[el.accessor] || 'Empty'}
                        </h3>
                      </Row>
                    ))}
                </Col>
                <Col xs={6} md={4}>
                  <BarcodeGenerator
                    productCode={selectedProductsType?.product_code}
                  />
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsTypeJournalInfoModal;
