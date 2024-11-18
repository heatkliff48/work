import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '#components/redux/actions/recipeAction.js';

function RecipeInfoModal(props) {
  const {
    recipe_info,
    list_of_recipes,
    selectedProduct,
    setSelectedProduct,
    selectedRecipe,
  } = useRecipeContext();

  const dispatch = useDispatch();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    props.onHide();
  };

  const deleteRecipeHandler = () => {
    dispatch(deleteRecipe(selectedRecipe.id));

    props.onHide();
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-auto-size"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Recipe card</Modal.Title>
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
              <h3>{selectedRecipe?.article}</h3>
              {/* <h3>
                {parseInt(
                  list_of_recipes[list_of_recipes.length - 1].article.slice(-6)
                )}
              </h3> */}
              {selectedRecipe &&
                recipe_info.map((el) => (
                  <Row>
                    {/* <Col></Col> */}
                    <h3>
                      {el.Header}: {selectedRecipe[el.accessor] || 'Empty'}
                    </h3>
                  </Row>
                ))}
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <button form="RecipeInfoModal">Сохранить</button> */}
          <Button onClick={deleteRecipeHandler}>Delete Recipe</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeInfoModal;
