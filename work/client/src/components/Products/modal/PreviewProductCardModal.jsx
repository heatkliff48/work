import React, { useEffect, version } from 'react';
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
} from 'reactstrap';
import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import BarcodeGenerator from './BarcodeGenerator';
import { useDispatch } from 'react-redux';
import {
  addNewProduct,
  repProduct,
} from '#components/redux/actions/productsAction.js';

const PreviewProductCardModal = React.memo(({ previewOperationName }) => {
  const { COLUMNS, getOptionValue, selectOptions } = useProductsContext();
  const { previewProductData, setPreviewOperationName, setIsRepair, setIsEdit } =
    useProjectContext();
  const { previewProductModal, setPreviewProductModal } = useModalContext();

  const dispatch = useDispatch();

  const memoizedArticle = (prod) => {
    const {
      form,
      certificate,
      width,
      height,
      lengths,
      density,
      version,
      placeOfProduction,
      typeOfPackaging,
      palletSize,
    } = prod;

    let versionNumber = '0001';
    versionNumber = `000${version}`.slice(-4);

    const rightPlaceOfProduction = getOptionValue(
      'placeOfProduction',
      placeOfProduction
    );
    const rightTypeOfPackaging = getOptionValue('typeOfPackaging', typeOfPackaging);

    const rightPalletSize = getOptionValue('palletSize', palletSize);
    const combinationMap = {
      '0-0-0': 'A',
      '0-0-1': 'B',
      '0-0-2': 'C',
      '0-1-0': 'D',
      '0-1-1': 'E',
      '0-1-2': 'F',
      '1-0-0': 'G',
      '1-0-1': 'H',
      '1-0-2': 'I',
      '1-1-0': 'J',
      '1-1-1': 'K',
      '1-1-2': 'L',
    };

    const combinationKey = `${rightPlaceOfProduction}-${rightTypeOfPackaging}-${rightPalletSize}`;
    const combinationLetter = combinationMap[combinationKey];

    if (!combinationLetter) {
      console.warn('Unknown combination for prodArticle:', combinationKey);
    }

    const prodArticle = `T.${form
      ?.toUpperCase()
      .slice(0, 1)}${combinationLetter}D${density.toString().slice(0, 2)}W${width
      .toString()
      .slice(0, 2)}${certificate?.substr(0, 1)}${versionNumber}`;

    return prodArticle;
  };

  const toggle = () => {
    setPreviewProductModal(!previewProductModal);
    setPreviewOperationName('');
  };

  const header = {
    add: 'You are creating a new product card',
    edit: 'You are creating a new version of product',
    repair: 'You are fixing product whitout changing version',
  };

  const saveHandler = () => {
    const { placeOfProduction, typeOfPackaging, palletSize, palletHeight } =
      previewProductData;

    const rightPlaceOfProduction = getOptionValue(
      'placeOfProduction',
      placeOfProduction
    );

    const rightTypeOfPackaging = getOptionValue('typeOfPackaging', typeOfPackaging);

    const rightPalletSize = getOptionValue('palletSize', palletSize);
    const rightPalletHeight = getOptionValue('palletHeight', palletHeight);

    const newVersion =
      previewOperationName === 'add' ? 1 : previewProductData.version;

    const obj = {
      ...previewProductData,
      version: newVersion,
      placeOfProduction: rightPlaceOfProduction,
      typeOfPackaging: rightTypeOfPackaging,
      palletSize: rightPalletSize,
      palletHeight: rightPalletHeight,
    };

    if (['add', 'edit'].includes(previewOperationName)) {
      dispatch(addNewProduct(obj));
    } else {
      dispatch(repProduct(obj));
    }
    setPreviewProductModal(!previewProductModal);
    setPreviewOperationName('');
    setIsEdit(false);
    setIsRepair(false);
  };

  return (
    <div>
      <Modal isOpen={previewProductModal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>{header[previewOperationName]}</ModalHeader>
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
                accessor === 'id' ||
                accessor === 'article' ||
                accessor === 'version'
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
                      width: '8rem',
                    }}
                  >
                    <CardHeader>{el.Header}</CardHeader>
                    <CardBody>
                      <CardText>{data}</CardText>
                    </CardBody>
                  </Card>
                );
              } else if (accessor !== 'productCode')
                return (
                  <Card
                    className="my-2"
                    color="secondary"
                    outline
                    style={{
                      width: '8rem',
                    }}
                  >
                    <CardHeader>{el.Header}</CardHeader>
                    <CardBody>
                      <CardText>
                        {['article', 'id', 'version'].includes(accessor)
                          ? null
                          : accessor === 'activeStatus'
                          ? previewProductData?.[accessor]
                            ? 'Available'
                            : 'Not available'
                          : previewProductData?.[accessor] || ''}
                      </CardText>
                    </CardBody>
                  </Card>
                );
              else
                return (
                  <BarcodeGenerator productCode={previewProductData?.productCode} />
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
