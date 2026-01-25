import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from '#components/redux/actions/recipeAction.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';

function RecipeInfoModal(props) {
  const { recipe_info } = useRecipeContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    props.onHide();
  };

  const deleteRecipeHandler = () => {
    dispatch(deleteRecipe(props.selectedRecipe.id));
    props.onHide();
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'recipe_products');
      setUserAccess(access);

      console.log('access', access);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  const specialFields = [
    {
      Header: 'Solids, kg',
      accessor: 'solids',
    },
    {
      Header: 'Volume, m3',
      accessor: 'volume',
    },
    {
      Header: 'Density, kg/m3',
      accessor: 'density_recipe',
    },
    {
      Header: 'Produced amount of return (dry), kg',
      accessor: 'produced_return_dry',
    },
    {
      Header: 'Water total, kg',
      accessor: 'water_total',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
  ];

  const mainFields = recipe_info.filter(
    (field) =>
      !specialFields.some((special) => special.accessor === field.accessor),
  );

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
          <Modal.Title id="contained-modal-title-vcenter">
            Recipe card
          </Modal.Title>
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
              <h3 className="mb-4">
                {props.selectedRecipe?.article || 'No recipe selected'}
              </h3>

              <Row>
                <Col xs={8}>
                  {mainFields.length > 0 && (
                    <div className="main-recipe-info">
                      <Table striped bordered hover size="sm">
                        <tbody>
                          {props.selectedRecipe &&
                            mainFields.map((el, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{el.Header}</strong>
                                </td>
                                <td>
                                  {props.selectedRecipe[el.accessor] || 'Empty'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Col>

                <Col xs={4}>
                  <div className="special-recipe-info">
                    <Table
                      striped
                      bordered
                      hover
                      size="sm"
                      className="bg-light"
                    >
                      <tbody>
                        {props.selectedRecipe &&
                          specialFields.map((el, index) => (
                            <tr key={`special-${index}`}>
                              <td>
                                <strong>{el.Header}</strong>
                              </td>
                              <td>
                                {props.selectedRecipe[el.accessor] || 'Empty'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {props.needDeleteButton && userAccess?.canWrite && (
            <Button onClick={deleteRecipeHandler}>Delete Recipe</Button>
          )}
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeInfoModal;
