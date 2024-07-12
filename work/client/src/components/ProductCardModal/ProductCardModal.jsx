import React, { useEffect, useState } from 'react';
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
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import ModalWindow from '../ModalWindow/ModalWindow';

const ProductCardModal = React.memo(() => {
  const {
    modalProductCard,
    setModalProductCard,
    COLUMNS,
    productCardData,
    setProductCardData,
  } = useProjectContext();
  const [lastVersion, setLastVersion] = useState(1);
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [productByVersicon, setProductByVersicon] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const memoizedArticle = (prod) => {
    let newArticle = '';
    let versionNumber = '0001';

    versionNumber = `000${prod.version}`.slice(-4);

    newArticle = `T.${prod.form?.toUpperCase()}${prod.certificate?.substr(0, 1)}${
      prod.density
    }${prod.width}${prod.height}${prod.lengths}${versionNumber}`;

    return newArticle;
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedVersion(selectedOption.value);

    // Найти продукт с выбранной версией
    const selectedProduct = products.find(
      (product) =>
        product.article === productCardData.article.slice(0, -4) &&
        product.version === parseInt(selectedOption.value)
    );

    if (selectedProduct) {
      // Обновить productCardData с новой версией
      setProductCardData({
        ...selectedProduct,
        article: memoizedArticle(selectedProduct),
      });
    }
  };

  const getSelectedOption = (accessor) => {
    if (!productCardData[accessor]) return null;
    return productByVersicon?.find(
      (option) => option.value === productCardData[accessor].toString()
    );
  };

  const toggle = () => setModalProductCard(!modalProductCard);

  useEffect(() => {
    setProductCardData((prevProductCardData) => {
      const newArticle = memoizedArticle(prevProductCardData);
      return { ...prevProductCardData, article: newArticle };
    });
  }, [modalProductCard]);

  useEffect(() => {
    const searchArticle = productCardData.article
      ? productCardData.article.slice(0, productCardData.article.length - 4)
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
    setProductByVersicon(prodArrVers);
  }, [productCardData, products]);

  return (
    <div>
      <Modal isOpen={modalProductCard} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Product Card</ModalHeader>
        <ModalHeader>
          <div className="product_card_header">
            <div>
              <div>Article</div>
              <div className="product_article">{productCardData.article}</div>
            </div>
            <div>
              <div>Last version: {lastVersion}</div>
              <div>
                <Select
                  onChange={handleSelectChange}
                  options={productByVersicon}
                  value={getSelectedOption('version')}
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
                        : productCardData?.[el.accessor] || ''}
                    </CardText>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="product_card">
            <Button color="success" onClick={() => setIsModalWindowOpen(true)}>
              Redactor
            </Button>

            {isModalWindowOpen && (
              <ModalWindow
                list={COLUMNS}
                formData={productCardData}
                isOpen={isModalWindowOpen}
                toggle={() => setIsModalWindowOpen(false)}
              />
            )}
            <Button color="primary" disabled>
              Add
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default ProductCardModal;
