import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import InputField from '../InputField/InputField';

const ProductCardModal = React.memo((productData) => {
  const { modalProductCard, setModalProductCard } = useProjectContext();
  const [articleId, setArticleId] = useState(-1);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const memoizedArticle = () => {
    let newArticle = '';
    let versionNumber = '0001';

    versionNumber = `000${productData.version}`.slice(-4);

    // newArticle = `T${formInput.form}${formInput.certificate}${formInput.density}${formInput.width}${formInput.height}${formInput.lengths}${versionNumber}`;

    return newArticle;
  };

  return (
    <div>
      <Modal
        isOpen={modalProductCard}
        toggle={() => {
          setModalProductCard(!modalProductCard);
        }}
      >
        <ModalHeader
          toggle={() => {
            setModalProductCard(!modalProductCard);
          }}
        >
          Product
        </ModalHeader>
        <div className="item">
          {productData.map((el) => {
            if (el.accessor === 'id') return null;
            return (
              <InputField
                key={el.id}
                el={el}
                // formInput={formInput}
                // inputChange={handleInputChange}
                articleId={articleId}
                setArticleId={setArticleId}
              />
            );
          })}
        </div>
        <ModalFooter>
          <div className="product_card">
            <Button
              color="primary"
              onClick={() => {
                setModalProductCard(!modalProductCard);
              }}
            >
              Add
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setModalProductCard(!modalProductCard);
              }}
            >
              Add
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default ProductCardModal;
