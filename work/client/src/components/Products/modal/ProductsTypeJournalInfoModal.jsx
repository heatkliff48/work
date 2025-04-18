import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import BarcodeGenerator from './BarcodeGenerator';
import {
  updateAnchor,
  updateDryMixesJournal,
  updateRelatedMaterialsJournal,
  updateTool,
} from '#components/redux/actions/productsTypeJournalAction.js';

function ProductsTypeJournalInfoModal(props) {
  const { selectedProductsType, setSelectedProductsType, dataTable } =
    useProductsTypeJournalContext();
  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);
  const [isChecked, setIsChecked] = useState(selectedProductsType?.active_status);
  // const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  // const user = useSelector((state) => state.user);

  // const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleStatusChange = () => {
    setIsChecked(!isChecked);
    setSelectedProductsType({
      ...selectedProductsType,
      active_status: !selectedProductsType.active_status,
    });
    if (props.target == 1) {
      dispatch(
        updateDryMixesJournal({
          ...selectedProductsType,
          active_status: !selectedProductsType.active_status,
        })
      );
    } else if (props.target == 2) {
      dispatch(
        updateRelatedMaterialsJournal({
          ...selectedProductsType,
          active_status: !selectedProductsType.active_status,
        })
      );
    } else if (props.target == 3) {
      dispatch(
        updateAnchor({
          ...selectedProductsType,
          active_status: !selectedProductsType.active_status,
        })
      );
    } else if (props.target == 4) {
      dispatch(
        updateTool({
          ...selectedProductsType,
          active_status: !selectedProductsType.active_status,
        })
      );
    }
  };

  useEffect(() => {
    setIsChecked(selectedProductsType?.active_status);
  }, [selectedProductsType]);

  // useEffect(() => {
  //   const dryMix = dryMixesJournal.find((el) => el.id === selectedProductsType?.id);
  //   setSelectedProductsType(dryMix);
  // }, [dryMixesJournal]);

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
                          {el.Header}:{' '}
                          {el.accessor === 'active_status'
                            ? selectedProductsType?.[el.accessor]
                              ? 'Available'
                              : 'Not available'
                            : selectedProductsType[el.accessor] || 'Empty'}
                        </h3>
                      </Row>
                    ))}
                </Col>
                <Col xs={6} md={4}>
                  <div>
                    <h5>Change product's availability status</h5>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleStatusChange}
                    />
                  </div>
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
