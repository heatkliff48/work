import React from 'react';
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

const PreviewProductCardModal = React.memo(() => {
  const { COLUMNS, getOptionValue } = useProductsContext();
  const { previewProductData } = useProjectContext();
  const { previewProductModal, setPreviewProductModal, previewOperationName } =
    useModalContext();
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

    const prodArticle = `T.${form
      ?.toUpperCase()
      .slice(
        0,
        1
      )}${rightPlaceOfProduction}${rightTypeOfPackaging}${rightPalletSize}D${density
      .toString()
      .slice(0, 2)}W${width}H${height.toString().slice(0, 2)}L${lengths
      .toString()
      .slice(0, 2)}${certificate?.substr(0, 1)}${versionNumber}`;

    return prodArticle;
  };

  const toggle = () => setPreviewProductModal(!previewProductModal);

  const header = {
    add: 'You are creating a new product card',
    edit: 'You are creating a new version of product',
    repair: 'You are fixing product whitout changing version',
  };

  const saveHandler = () => {
    if ('product' in previewProductData) {
      dispatch(addNewProduct(previewProductData));
    } else {
      dispatch(repProduct(previewProductData));
    }
    setPreviewProductModal(!previewProductModal);
  };

  return (
    <div>
      <Modal isOpen={previewProductModal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>{header.previewOperationName}</ModalHeader>
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
              if (
                el.accessor === 'id' ||
                el.accessor === 'article' ||
                el.accessor === 'version'
              )
                return null;
              if (el.accessor !== 'productCode')
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
                        {['article', 'id', 'version'].includes(el.accessor)
                          ? null
                          : el.accessor === 'activeStatus'
                          ? previewProductData?.[el.accessor]
                            ? 'Available'
                            : 'Not available'
                          : previewProductData?.[el.accessor] || ''}
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
