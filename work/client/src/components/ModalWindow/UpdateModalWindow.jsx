import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../redux/actions/productsAction';
import { useProductContext } from '../contexts/Context';

function UpdateModalWindow() {
  const user = useSelector((state) => state.user);
  const {
    promProduct,
    setPromProduct,
    modalUpdate,
    setModalUpdate,
    modal,
    setModal,
  } = useProductContext();
  const productData = useSelector((state) => state.products).filter(
    (el) => el.id === promProduct.id
  )[0];
  const dispatch = useDispatch();

  const updateHadler = () => {
    const updProduct = { ...promProduct, version: productData.version + 1 };

    dispatch(updateProduct({ product: updProduct, user }));
    setPromProduct({});
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
