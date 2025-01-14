import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import { updateProduct } from '#components/redux/actions/productsAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';

function UpdateModalWindow() {
  const { promProduct, setPromProduct, setStayDefault } = useProjectContext();
  const {
    modalUpdate,
    setModalUpdate,
    modal,
    setModal,
    setModalProductCard,
    modalProductCard,
  } = useModalContext();
  const { selectOptions, rightPlaceOfProductionFunc, rightTypeOfPackagingFunc } =
    useProductsContext();

  const dispatch = useDispatch();
  const productData = useSelector((state) => state.products).findLast(
    (el) => el.article === promProduct.article
  );

  const updateHadler = () => {
    const { placeOfProduction, typeOfPackaging } = promProduct;
    const updProduct = {
      ...promProduct,
      version: productData.version + 1,
      placeOfProduction: rightPlaceOfProductionFunc(placeOfProduction),
      typeOfPackaging: rightTypeOfPackagingFunc(typeOfPackaging),
    };

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
