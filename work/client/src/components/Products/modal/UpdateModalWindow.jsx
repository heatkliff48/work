import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';

function UpdateModalWindow() {
  const { promProduct, setPromProduct, setStayDefault, setPreviewProductData } =
    useProjectContext();
  const {
    modalUpdate,
    setModalUpdate,
    modal,
    setModal,
    setModalProductCard,
    modalProductCard,
    previewProductModal,
    setPreviewProductModal,
  } = useModalContext();

  const productData = useSelector((state) => state.products).findLast(
    (el) => el.article === promProduct.article
  );

  const updateHadler = () => {
    const updProduct = {
      ...promProduct,
      version: productData.version + 1,
    };

    setStayDefault(true);
    setPromProduct({});
    setModal(!modal);
    setModalProductCard(!modalProductCard);

    setPreviewProductData({ product: updProduct });
    setPreviewProductModal(!previewProductModal);
  };

  const backHadler = () => {
    setPromProduct((prev) => ({ ...prev, width: 0, certificate: '' }));
  };

  return (
    <div>
      <Modal
        isOpen={modalUpdate}
        toggle={() => {
          setModalUpdate(!modalUpdate);
        }}
      >
        <ModalHeader
          toggle={() => {
            setModalUpdate(!modalUpdate);
          }}
        >
          Внимание
        </ModalHeader>
        <ModalBody>
          Продукт с такими параметрами уже существует. Желаете обновить верссию или
          вернуться назад.
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              backHadler();
              setModalUpdate(!modalUpdate);
              setModal(!modal);
            }}
          >
            Назад
          </Button>
          <Button
            color="primary"
            onClick={() => {
              updateHadler();
              setModalUpdate(!modalUpdate);
            }}
          >
            Обновить
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default UpdateModalWindow;
