import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../redux/actions/productsAction';
import { useProjectContext } from '../contexts/Context';

function UpdateModalWindow() {
  const {
    promProduct,
    setPromProduct,
    modalUpdate,
    setModalUpdate,
    modal,
    setModal,
    setStayDefault,
    setModalProductCard,
    modalProductCard,
  } = useProjectContext();
  const dispatch = useDispatch();

  const productData = useSelector((state) => state.products).findLast(
    (el) => el.article === promProduct.article
  );

  const updateHadler = () => {
    const updProduct = { ...promProduct, version: productData.version + 1 };
    setStayDefault(true);
    dispatch(updateProduct({ product: updProduct }));
    setPromProduct({});
    setModal(!modal);
    setModalProductCard(!modalProductCard);
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
          Продукт с такими параметрами уже существует. Можете обновить или вернуться
          назад.
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
