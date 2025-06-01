import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
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
import FilesMain from '#components/FileUpload/Product/FilesMain.jsx';
import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useStatisticContext } from '#components/contexts/StatisticContext.js';
import ModalWindow from './ModalWindow';
import BarcodeGenerator from './BarcodeGenerator';

const ProductCardModal = React.memo(() => {
  const { userAccess } = useUsersContext();
  const { productsOfOrders } = useOrderContext();
  const { stock_balance } = useStatisticContext();
  const { COLUMNS, selectOptions, getOptionValue } = useProductsContext();
  const {
    productCardData,
    setProductCardData,
    isRepair,
    setIsRepair,
    isEdit,
    setIsEdit,
  } = useProjectContext();
  const {
    warehouse_data,
    list_of_ordered_production,
    list_of_ordered_production_oem,
  } = useWarehouseContext();
  const {
    modalProductCard,
    setModalProductCard,
    isModalWindowOpen,
    setIsModalWindowOpen,
  } = useModalContext();

  const productionBatchLog = useSelector((state) => state.productionBatchLog);
  const qualityManagementData = useSelector((state) => state.qualityManagementData);

  const [lastVersion, setLastVersion] = useState(1);
  const [repairButton, setRepairButton] = useState(true);
  const [productByVersion, setProductByVersion] = useState();
  const products = useSelector((state) => state.products);

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

  const handleSelectChange = (selectedOption) => {
    // Найти продукт с выбранной версией
    const selectedProduct = products.find(
      (product) =>
        product.article === productCardData.article && // .slice(0, -4)
        product.version === parseInt(selectedOption.value)
    );

    if (selectedProduct) {
      // Обновить productCardData с новой версией

      setProductCardData({
        ...selectedProduct,
        placeOfProduction: selectOptions.placeOfProduction.find(
          (el) =>
            el.label == selectedProduct.placeOfProduction ||
            el.value == selectedProduct.placeOfProduction
        )?.label,
        typeOfPackaging: selectOptions.typeOfPackaging.find(
          (el) =>
            el.label == selectedProduct.typeOfPackaging ||
            el.value == selectedProduct.typeOfPackaging
        )?.label,
        palletSize: selectOptions.palletSize.find(
          (el) =>
            el.label == selectedProduct.palletSize ||
            el.value == selectedProduct.palletSize
        )?.label,
        palletHeight: selectOptions.palletHeight.find(
          (el) =>
            el.label == selectedProduct.palletHeight ||
            el.value == selectedProduct.palletHeight
        )?.label,
      });
    }
  };

  const getSelectedOption = (accessor) => {
    if (!productCardData[accessor]) return null;

    return productByVersion?.find(
      (option) => option.value === productCardData[accessor]?.toString()
    );
  };

  const toggle = () => setModalProductCard(!modalProductCard);

  useEffect(() => {
    setProductCardData((prevProductCardData) => {
      const newArticle = memoizedArticle(prevProductCardData);
      return { ...prevProductCardData }; // , article: newArticle
    });
  }, [modalProductCard]);

  useEffect(() => {
    const { id, article } = productCardData;
    const have_product_poo = productsOfOrders.find((el) => el.product_id == id);
    const have_product_whd = warehouse_data.find(
      (el) => el.product_article == article
    );
    const have_product_pb = productionBatchLog.find(
      (el) => el.product_article == article
    );
    const have_product_loop = list_of_ordered_production.find(
      (el) => el.product_article == article
    );
    const have_product_loopoem = list_of_ordered_production_oem.find(
      (el) => el.product_article == article
    );
    const have_product_sb = stock_balance.find(
      (el) => el.product_article == article
    );
    const have_product_qmd = qualityManagementData.find(
      (el) => el.product_article == article
    );
    const rep_dis =
      have_product_poo ||
      have_product_whd ||
      have_product_pb ||
      have_product_loop ||
      have_product_loopoem ||
      have_product_sb ||
      have_product_qmd
        ? true
        : false;

    setRepairButton(rep_dis);
  }, [
    productsOfOrders,
    warehouse_data,
    productionBatchLog,
    list_of_ordered_production,
    list_of_ordered_production_oem,
    stock_balance,
    qualityManagementData,
  ]);

  useEffect(() => {
    const searchArticle = productCardData.article
      ? productCardData.article.slice(0, productCardData.article.length)
      : '';
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

    setLastVersion(lastVers);
    setProductByVersion(prodArrVers);
  }, [productCardData, products]);

  return (
    <div>
      <Modal isOpen={modalProductCard} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Product Card</ModalHeader>
        <ModalHeader>
          <div className="product_card_header">
            <div>
              <div>Article</div>
              <div className="product_article">
                {memoizedArticle(productCardData)}
              </div>
            </div>
            <div>
              <div>Last version: {lastVersion}</div>
              <div>
                <Select
                  onChange={handleSelectChange}
                  options={productByVersion}
                  defaultValue={getSelectedOption('version')}
                />
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
                          ? productCardData?.[el.accessor]
                            ? 'Available'
                            : 'Not available'
                          : productCardData?.[el.accessor] || ''}
                      </CardText>
                    </CardBody>
                  </Card>
                );
              else
                return (
                  <BarcodeGenerator productCode={productCardData?.productCode} />
                );
            })}
          </div>
          <FilesMain userAccess={userAccess} />
        </ModalBody>
        <ModalFooter>
          <div className="product_card">
            {userAccess?.canWrite && (
              <div className="product_card_btn">
                <Button
                  color="success"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setIsRepair(false);
                    setIsEdit(true);
                    setIsModalWindowOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  style={{ width: '100%' }}
                  color="success"
                  onClick={() => {
                    setIsRepair(true);
                    setIsEdit(false);
                    setIsModalWindowOpen(true);
                  }}
                  disabled={repairButton}
                >
                  Repair
                </Button>
              </div>
            )}
            {isModalWindowOpen && (
              <ModalWindow
                list={COLUMNS}
                formData={productCardData}
                isOpen={isModalWindowOpen}
                toggle={() => setIsModalWindowOpen(false)}
                isRepair={isRepair}
                isEdit={isEdit}
              />
            )}
            <Button
              color="primary"
              onClick={() => {
                setIsRepair(false);
                setIsEdit(false);
                setIsModalWindowOpen(true);
              }}
            >
              Duplicate
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default ProductCardModal;
