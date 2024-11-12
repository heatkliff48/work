import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import AddNewRecipeModal from './AddNewRecipeModal';

function RecipeChoiceModal(props) {
  const { selectedProduct, setSelectedProduct } = useRecipeContext();
  const [newRecipeModalShow, setNewRecipeModalShow] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    props.onHide();
  };

  return (
    <>
      {newRecipeModalShow && (
        <AddNewRecipeModal
          show={newRecipeModalShow}
          onHide={() => setNewRecipeModalShow(false)}
        />
      )}
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-auto-size"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form
              id="RecipeChoiceModal"
              className="w-full max-w-sm"
              onSubmit={(e) => {
                onSubmitForm(e);
              }}
            >
              <h3>{selectedProduct?.article}</h3>
              <Row>
                <Col>
                  <Button>Выбрать существующий рецепт</Button>
                </Col>
                <Col>
                  <Button onClick={() => setNewRecipeModalShow(true)}>
                    Создать новый
                  </Button>
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button form="RecipeChoiceModal">Сохранить</button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeChoiceModal;
