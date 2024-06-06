import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addNewProduct } from '../redux/actions/productsAction';
import { setUpdateModalWindow } from '../redux/actions/modalUpdateAction';

function UpdateModalWindow({ product }) {
  const modalUpdate = useSelector((state) => state.modalUpdate);
  const dispatch = useDispatch();
  console.log(product);

  return (
    <div>
      <Modal
        isOpen={modalUpdate}
        toggle={() => {
          dispatch(setUpdateModalWindow(!modalUpdate));
        }}
      >
        <modalUpdateHeader
          toggle={() => {
            dispatch(setUpdateModalWindow(!modalUpdate));
          }}
        >
          Внимание
        </modalUpdateHeader>
        <ModalBody>
          Продукт с такими параметрами уже существует. Можете обновить или вернуться
          назад.
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              dispatch(setUpdateModalWindow(!modalUpdate));
            }}
          >
            Назад
          </Button>
          <Button
            color="primary"
            onClick={() => {
              dispatch(setUpdateModalWindow(!modalUpdate));
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
