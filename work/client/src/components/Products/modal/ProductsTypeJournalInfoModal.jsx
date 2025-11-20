import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useCallback, useEffect, useState } from "react";
import "react-international-phone/style.css";
import Select from "react-select";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import { useProductsTypeJournalContext } from "#components/contexts/ProductsTypeJournalContext.js";
import BarcodeGenerator from "./BarcodeGenerator";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import {
  updateAnchor,
  updateDryMixesJournal,
  updateRelatedMaterialsJournal,
  updateTool,
} from "#components/redux/actions/productsTypeJournalAction.js";
import ShowProductsTypeJournalModal from "./ProductsTypeJournalModal";
import { useOrderContext } from "#components/contexts/OrderContext.js";
import { useWarehouseContext } from "#components/contexts/WarehouseContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { useNavigate } from "react-router-dom";

function ProductsTypeJournalInfoModal(props) {
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const {
    COLUMNS_DRY_MIXED_PRODUCT,
    COLUMNS_ANCHOR_PRODUCT,
    COLUMNS_TOOLS_PRODUCT,
    COLUMNS_RELATED_MATERIALS_JOURNAL,
    selectedProductsType,
    setSelectedProductsType,
    dataTable,
    typeOfMixOptions,
  } = useProductsTypeJournalContext();
  const {
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
  } = useOrderContext();
  const { related_materials_backorder_list } = useWarehouseContext();
  const products = useSelector((state) =>
    props.target == 1
      ? state.dryMixesJournal
      : props.target == 2
      ? state.relatedMaterialsJournal
      : props.target == 3
      ? state.anchor
      : state.tool
  );
  const user = useSelector((state) => state.user);
  const [isChecked, setIsChecked] = useState(
    selectedProductsType?.active_status
  );
  const [lastVersion, setLastVersion] = useState(1);
  const [productByVersion, setProductByVersion] = useState();
  const [currentVersion, setCurrentVersion] = useState(
    selectedProductsType?.version
  );
  const [repairButton, setRepairButton] = useState(true);
  const [selectedBarcodeValue, setSelectedBarcodeValue] = useState(1);
  // const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  // const user = useSelector((state) => state.user);

  // const navigate = useNavigate();

  useEffect(() => {
    const { id, article } = products;

    const have_product_poo =
      props.target == 1
        ? dryMixedProductsOfOrders.find((el) => el.product_id == id)
        : props.target == 2
        ? relMatProductsOfOrders.find((el) => el.product_id == id)
        : props.target == 3
        ? anchorProductsOfOrders.find((el) => el.product_id == id)
        : toolProductsOfOrders.find((el) => el.product_id == id);

    const have_product_backorder = related_materials_backorder_list.find(
      (el) => el.product_article == article
    );

    const rep_dis = have_product_poo || have_product_backorder ? true : false;

    setRepairButton(rep_dis);
  }, [
    dryMixedProductsOfOrders,
    anchorProductsOfOrders,
    toolProductsOfOrders,
    relMatProductsOfOrders,
    related_materials_backorder_list,
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSelectChange = (selectedOption) => {
    // Найти продукт с выбранной версией
    const selectedProduct = products.find(
      (product) =>
        product.article === selectedProductsType.article && // .slice(0, -4)
        product.version === parseInt(selectedOption.value)
    );

    if (selectedProduct) {
      // Обновить productCardData с новой версией

      setSelectedProductsType({
        ...selectedProduct,
      });
    }
  };

  const getSelectedOption = (accessor) => {
    if (!selectedProductsType?.[accessor]) return null;

    return productByVersion?.find(
      (option) => option.value === selectedProductsType?.[accessor]?.toString()
    );
  };

  useEffect(() => {
    setIsChecked(selectedProductsType?.active_status);

    const searchArticle = selectedProductsType?.article
      ? selectedProductsType?.article.slice(
          0,
          selectedProductsType?.article.length
        )
      : "";
    const prodArrVers = products?.reduce((acc, el) => {
      const { article, version } = el;
      if (article === searchArticle)
        acc.push({ value: `${version}`, label: `Version: ${version}` });
      return acc;
    }, []);

    const lva = products?.filter((el) => el.article === searchArticle);

    const lastVers = lva?.reduce((max, product) => {
      return product.version > max ? product.version : max;
    }, 1);

    if (lastVersion < lastVers) {
      setLastVersion(lastVers);
    }
    setProductByVersion(prodArrVers);
  }, [selectedProductsType, products]);

  useEffect(() => {
    setCurrentVersion(getSelectedOption("version"));
  }, [props.show, productByVersion]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    setLastVersion(1);
    props.onHide();
  };

  const handleCloseModal = () => {
    props.onHide();
    setLastVersion(1);
    setSelectedBarcodeValue(1);
  };

  const handleChange = (value) => {
    setSelectedBarcodeValue(value);
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, "Products");
      setUserAccess(access);

      console.log("access", access);

      if (!access?.canRead) {
        navigate("/"); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

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
            {props.title}
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
              <Row>
                <Col xs={12} md={8}>
                  {selectedProductsType &&
                    dataTable.map((el) => (
                      <Row>
                        <h3>
                          {el.Header}:{" "}
                          {el.accessor === "active_status"
                            ? selectedProductsType?.[el.accessor]
                              ? "Available"
                              : "Not available"
                            : el.accessor === "type_of_mix"
                            ? typeOfMixOptions.find(
                                (type) =>
                                  type.value ==
                                  selectedProductsType?.type_of_mix
                              )?.label || ""
                            : selectedProductsType[el.accessor] ?? "Empty"}
                        </h3>
                      </Row>
                    ))}
                </Col>
                <Col xs={6} md={4}>
                  <div>
                    <h5>Last version: {lastVersion}</h5>
                  </div>
                  <Select
                    onChange={handleSelectChange}
                    options={productByVersion}
                    value={currentVersion}
                  />
                  {userAccess?.canWrite && (
                    <div>
                      <h5>Change product's availability status</h5>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleStatusChange}
                      />
                    </div>
                  )}
                  <ToggleButtonGroup
                    type="radio"
                    name="options"
                    value={selectedBarcodeValue}
                    onChange={handleChange}
                  >
                    <ToggleButton id="tbg-radio-1" value={1}>
                      Unit barcode
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2}>
                      Box barcode
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-3" value={3}>
                      Pallet barcode
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <BarcodeGenerator
                    productCode={
                      selectedBarcodeValue == 1
                        ? selectedProductsType?.product_code
                        : selectedBarcodeValue == 2
                        ? selectedProductsType?.product_code_box.slice(0, -1)
                        : selectedProductsType?.product_code_pall.slice(0, -1)
                    }
                    chosenBarcodeType={selectedBarcodeValue}
                  />
                </Col>
              </Row>
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {userAccess?.canWrite && (
            <ShowProductsTypeJournalModal
              table={
                props.target == 1
                  ? COLUMNS_DRY_MIXED_PRODUCT
                  : props.target == 2
                  ? COLUMNS_RELATED_MATERIALS_JOURNAL
                  : props.target == 3
                  ? COLUMNS_ANCHOR_PRODUCT
                  : COLUMNS_TOOLS_PRODUCT
              }
              target={props.target}
              title={
                props.target == 1
                  ? "dry mix"
                  : props.target == 2
                  ? "related material"
                  : props.target == 3
                  ? "fastener"
                  : "tool"
              }
              productCode={selectedProductsType?.productCode}
              disabled={repairButton}
              repair={true}
            />
          )}
          {userAccess?.canWrite && (
            <ShowProductsTypeJournalModal
              table={
                props.target == 1
                  ? COLUMNS_DRY_MIXED_PRODUCT
                  : props.target == 2
                  ? COLUMNS_RELATED_MATERIALS_JOURNAL
                  : props.target == 3
                  ? COLUMNS_ANCHOR_PRODUCT
                  : COLUMNS_TOOLS_PRODUCT
              }
              target={props.target}
              title={
                props.target == 1
                  ? "dry mix"
                  : props.target == 2
                  ? "related material"
                  : props.target == 3
                  ? "fastener"
                  : "tool"
              }
              productCode={selectedProductsType?.productCode}
              addNewVersion={true}
            />
          )}
          {userAccess?.canWrite && (
            <ShowProductsTypeJournalModal
              table={
                props.target == 1
                  ? COLUMNS_DRY_MIXED_PRODUCT
                  : props.target == 2
                  ? COLUMNS_RELATED_MATERIALS_JOURNAL
                  : props.target == 3
                  ? COLUMNS_ANCHOR_PRODUCT
                  : COLUMNS_TOOLS_PRODUCT
              }
              target={props.target}
              title={
                props.target == 1
                  ? "dry mix"
                  : props.target == 2
                  ? "related material"
                  : props.target == 3
                  ? "fastener"
                  : "tool"
              }
              productCode={selectedProductsType?.productCode}
              duplicate={true}
            />
          )}
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsTypeJournalInfoModal;
