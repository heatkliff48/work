import React, { useEffect, useState, version } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useProjectContext } from "#components/contexts/Context.js";
import { useModalContext } from "#components/contexts/ModalContext.js";
import { useProductsContext } from "#components/contexts/ProductContext.js";
import BarcodeGenerator from "./BarcodeGenerator";
import { useDispatch } from "react-redux";
import {
  addNewProduct,
  repProduct,
} from "#components/redux/actions/productsAction.js";
import { updateProductCode } from "#components/redux/actions/productsTypeJournalAction.js";

const PreviewProductCardModal = React.memo(({ previewOperationName }) => {
  const { COLUMNS, getOptionValue, selectOptions, buildProductArticle } =
    useProductsContext();
  const {
    previewProductData,
    setPreviewOperationName,
    setIsRepair,
    setIsEdit,
  } = useProjectContext();
  const { previewProductModal, setPreviewProductModal } = useModalContext();

  const [selectedBarcodeValue, setSelectedBarcodeValue] = useState(1);

  const dispatch = useDispatch();

  // Артикул с номером версии, например T.NAH5D35W20C0001
  const memoizedArticle = (prod) =>
    `${buildProductArticle(prod)}${`000${prod.version}`.slice(-4)}`;

  const toggle = () => {
    setPreviewProductModal(!previewProductModal);
    setPreviewOperationName("");
  };

  const header = {
    add: "You are creating a new product card",
    edit: "You are creating a new version of product",
    repair: "You are fixing product whitout changing version",
  };

  const saveHandler = () => {
    const { placeOfProduction, typeOfPackaging, palletSize } =
      previewProductData;

    const rightPlaceOfProduction = getOptionValue(
      "placeOfProduction",
      placeOfProduction
    );

    const rightTypeOfPackaging = getOptionValue(
      "typeOfPackaging",
      typeOfPackaging
    );

    const rightPalletSize = getOptionValue("palletSize", palletSize);

    const newVersion =
      previewOperationName === "add" ? 1 : previewProductData.version;

    const obj = {
      ...previewProductData,
      version: newVersion,
      placeOfProduction: rightPlaceOfProduction,
      typeOfPackaging: rightTypeOfPackaging,
      palletSize: rightPalletSize,
      // Высота паллеты хранится рядами блоков; код высоты (Std / Marine / ...)
      // остаётся только у прежних карточек
      palletHeight: null,
      palletHeightBlocks: Number(previewProductData.palletHeightBlocks) || null,
    };

    if (["add", "edit"].includes(previewOperationName)) {
      dispatch(addNewProduct(obj));
    } else {
      dispatch(repProduct(obj));
    }
    dispatch(
      updateProductCode({
        id: 1,
        product_code: obj.productCode.slice(0, -1).slice(-3),
      })
    );
    setPreviewProductModal(!previewProductModal);
    setPreviewOperationName("");
    setIsEdit(false);
    setIsRepair(false);
  };

  const handleChange = (value) => {
    setSelectedBarcodeValue(value);
  };

  return (
    <div>
      <Modal isOpen={previewProductModal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {header[previewOperationName]}
        </ModalHeader>
        <ModalHeader>
          <div className="product_card_header">
            <div>
              <div>Article</div>
              <div className="product_article">
                {memoizedArticle(previewProductData)}
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="item">
          <div className="item_content">
            {COLUMNS.map((el) => {
              const { accessor } = el;
              if (
                accessor === "id" ||
                accessor === "article" ||
                accessor === "version"
              ) {
                return null;
              } else if (selectOptions[accessor]) {
                const data = selectOptions[accessor].find(
                  (el) =>
                    el.label == previewProductData[accessor] ||
                    el.value == previewProductData[accessor]
                )?.label;

                return (
                  <Card
                    className="my-2"
                    color="secondary"
                    outline
                    style={{
                      width: "8rem",
                    }}
                  >
                    <CardHeader>{el.Header}</CardHeader>
                    <CardBody>
                      <CardText>{data}</CardText>
                    </CardBody>
                  </Card>
                );
              } else if (accessor !== "productCode")
                return (
                  <Card
                    className="my-2"
                    color="secondary"
                    outline
                    style={{
                      width: "8rem",
                    }}
                  >
                    <CardHeader>{el.Header}</CardHeader>
                    <CardBody>
                      <CardText>
                        {["article", "id", "version"].includes(accessor)
                          ? null
                          : accessor === "activeStatus"
                          ? previewProductData?.[accessor]
                            ? "Available"
                            : "Not available"
                          : previewProductData?.[accessor] || ""}
                      </CardText>
                    </CardBody>
                  </Card>
                );
              else
                return (
                  <>
                    <ToggleButtonGroup
                      type="radio"
                      name="options-preview"
                      value={selectedBarcodeValue}
                      onChange={handleChange}
                    >
                      <ToggleButton id="tbg-radio-preview-1" value={1}>
                        Unit barcode
                      </ToggleButton>
                      <ToggleButton id="tbg-radio-preview-2" value={2}>
                        Pallet barcode
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <BarcodeGenerator
                      productCode={
                        selectedBarcodeValue == 1
                          ? previewProductData?.productCode
                          : previewProductData?.product_code_pall.slice(0, -1)
                      }
                      chosenBarcodeType={selectedBarcodeValue}
                    />
                  </>
                );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="product_card">
            <Button
              color="primary"
              onClick={() => {
                saveHandler();
              }}
            >
              Save
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default PreviewProductCardModal;
