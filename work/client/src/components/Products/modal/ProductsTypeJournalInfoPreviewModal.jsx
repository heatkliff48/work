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
  addNewAnchor,
  addNewDryMixesJournal,
  addNewRelatedMaterialsJournal,
  addNewTool,
  updateAnchor,
  updateDryMixesJournal,
  updateRelatedMaterialsJournal,
  updateTool,
} from '#components/redux/actions/productsTypeJournalAction.js';

function ProductsTypeJournalInfoPreviewModal(props) {
  const {
    COLUMNS_DRY_MIXED_PRODUCT,
    COLUMNS_ANCHOR_PRODUCT,
    COLUMNS_TOOLS_PRODUCT,
    COLUMNS_RELATED_MATERIALS_JOURNAL,
    dryMixesJournal,
    relatedMaterialsJournal,
    anchor,
    tool,
    selectedProductsType,
    setSelectedProductsType,
    dataTable,
    productsTypeJournalPreviewInput,
    setProductsTypeJournalPreviewInput,
  } = useProductsTypeJournalContext();
  const products = useSelector((state) =>
    props.target == 1
      ? state.dryMixesJournal
      : props.target == 2
      ? state.relatedMaterialsJournal
      : props.target == 3
      ? state.anchor
      : state.tool
  );
  const [isChecked, setIsChecked] = useState(
    productsTypeJournalPreviewInput?.active_status
  );
  const [lastVersion, setLastVersion] = useState(1);
  const [productByVersion, setProductByVersion] = useState();
  const [currentVersion, setCurrentVersion] = useState(
    productsTypeJournalPreviewInput?.version
  );
  // const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  // const user = useSelector((state) => state.user);

  // const navigate = useNavigate();

  const dispatch = useDispatch();

  function hasMatchingObject(array, newObj, excludedAttrs) {
    return array.findLast((item) => {
      // Получаем все ключи нового объекта, исключая указанные атрибуты
      const keys = Object.keys(newObj).filter((key) => !excludedAttrs.includes(key));
      // Проверяем, что все соответствующие значения совпадают
      return keys.every((key) => {
        // Проверяем, что ключ существует в объекте из массива
        // и его значение совпадает со значением в новом объекте
        console.log('item[key]', item[key]);
        console.log('newObj[key]', newObj[key]);
        return item.hasOwnProperty(key) && item[key] == newObj[key];
      });
    });
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    console.log('CONFIRM!');

    if (props.target == 1) {
      if (props.repair) {
        setSelectedProductsType({
          ...productsTypeJournalPreviewInput,
        });
        dispatch(
          updateDryMixesJournal({
            ...productsTypeJournalPreviewInput,
          })
        );
      } else {
        const existingProduct = hasMatchingObject(
          dryMixesJournal,
          productsTypeJournalPreviewInput,
          [
            'id',
            'price_per_unit',
            'price_per_kilogram',
            'description',
            'article',
            'product_code',
            'active_status',
            'version',
            'createdAt',
            'updatedAt',
          ]
        );

        if (existingProduct) {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
            id: parseInt(
              dryMixesJournal.length === 0 ? 1 : dryMixesJournal.length + 1
            ),
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          });
          dispatch(
            addNewDryMixesJournal({
              ...productsTypeJournalPreviewInput,
              article: existingProduct.article,
              version: existingProduct.version + 1,
              product_code: existingProduct.product_code,
            })
          );
        } else {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
          });
          dispatch(
            addNewDryMixesJournal({
              ...productsTypeJournalPreviewInput,
            })
          );
        }
      }
    } else if (props.target == 2) {
      if (props.repair) {
        setSelectedProductsType({
          ...productsTypeJournalPreviewInput,
        });
        dispatch(
          updateRelatedMaterialsJournal({
            ...productsTypeJournalPreviewInput,
          })
        );
      } else {
        const existingProduct = hasMatchingObject(
          relatedMaterialsJournal,
          productsTypeJournalPreviewInput,
          [
            'id',
            'price_per_unit',
            'description',
            'article',
            'product_code',
            'active_status',
            'version',
            'createdAt',
            'updatedAt',
          ]
        );

        if (existingProduct) {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
            id: parseInt(
              relatedMaterialsJournal.length === 0
                ? 1
                : relatedMaterialsJournal.length + 1
            ),
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          });
          dispatch(
            addNewRelatedMaterialsJournal({
              ...productsTypeJournalPreviewInput,
              article: existingProduct.article,
              version: existingProduct.version + 1,
              product_code: existingProduct.product_code,
            })
          );
        } else {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
          });
          dispatch(
            addNewRelatedMaterialsJournal({
              ...productsTypeJournalPreviewInput,
            })
          );
        }
      }
    } else if (props.target == 3) {
      if (props.repair) {
        setSelectedProductsType({
          ...productsTypeJournalPreviewInput,
        });
        dispatch(
          updateAnchor({
            ...productsTypeJournalPreviewInput,
          })
        );
      } else {
        const existingProduct = hasMatchingObject(
          anchor,
          productsTypeJournalPreviewInput,
          [
            'id',
            'price_per_unit',
            'description',
            'article',
            'product_code',
            'active_status',
            'version',
            'createdAt',
            'updatedAt',
          ]
        );

        if (existingProduct) {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
            id: parseInt(anchor.length === 0 ? 1 : anchor.length + 1),
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          });
          dispatch(
            addNewAnchor({
              ...productsTypeJournalPreviewInput,
              article: existingProduct.article,
              version: existingProduct.version + 1,
              product_code: existingProduct.product_code,
            })
          );
        } else {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
          });
          dispatch(
            addNewAnchor({
              ...productsTypeJournalPreviewInput,
            })
          );
        }
      }
    } else if (props.target == 4) {
      if (props.repair) {
        setSelectedProductsType({
          ...productsTypeJournalPreviewInput,
        });
        dispatch(
          updateTool({
            ...productsTypeJournalPreviewInput,
          })
        );
      } else {
        const existingProduct = hasMatchingObject(
          tool,
          productsTypeJournalPreviewInput,
          [
            'id',
            'price_per_unit',
            'description',
            'article',
            'product_code',
            'active_status',
            'version',
            'createdAt',
            'updatedAt',
          ]
        );

        if (existingProduct) {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
            id: parseInt(tool.length === 0 ? 1 : tool.length + 1),
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          });
          dispatch(
            addNewTool({
              ...productsTypeJournalPreviewInput,
              article: existingProduct.article,
              version: existingProduct.version + 1,
              product_code: existingProduct.product_code,
            })
          );
        } else {
          setSelectedProductsType({
            ...productsTypeJournalPreviewInput,
          });
          dispatch(
            addNewTool({
              ...productsTypeJournalPreviewInput,
            })
          );
        }
      }
    }
    props.onHide();
  };

  const handleCloseModal = () => {
    props.onHide();
    // setLastVersion(1);
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
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-auto-size"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm{' '}
            {props.addNewVersion
              ? `Edit`
              : props.repair
              ? `Repair`
              : props.duplicate
              ? `Duplicate`
              : `Add ${props.title}`}{' '}
            Page
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form
              id="AuxProdPreviewInfoModal"
              className="w-full max-w-sm"
              onSubmit={(e) => {
                onSubmitForm(e);
              }}
            >
              <Row>
                <Col xs={12} md={8}>
                  {productsTypeJournalPreviewInput &&
                    dataTable.map((el) => (
                      <Row>
                        <h3>
                          {el.Header}:{' '}
                          {el.accessor === 'active_status'
                            ? productsTypeJournalPreviewInput?.[el.accessor]
                              ? 'Available'
                              : 'Not available'
                            : productsTypeJournalPreviewInput[el.accessor] ||
                              'Empty'}
                        </h3>
                      </Row>
                    ))}
                </Col>
                <Col xs={6} md={4}>
                  <div>
                    <h5>
                      Current version: {productsTypeJournalPreviewInput?.version}
                    </h5>
                  </div>
                  <BarcodeGenerator
                    productCode={productsTypeJournalPreviewInput?.product_code}
                  />
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button form="AuxProdPreviewInfoModal" type="submit">
            Confirm{' '}
            {props.addNewVersion
              ? `Edit`
              : props.repair
              ? `Repair`
              : props.duplicate
              ? `Duplicate`
              : `Add ${props.title}`}
          </Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsTypeJournalInfoPreviewModal;
