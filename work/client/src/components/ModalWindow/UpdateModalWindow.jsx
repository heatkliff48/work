import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addNewProduct } from '../redux/actions/productsAction';
import { setUpdateModalWindow } from '../redux/actions/modalUpdateAction';

function UpdateModalWindow() {
  const modalUpdate = useSelector((state) => state.modalUpdate);
  const dispatch = useDispatch();

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
          1 === 1
        </modalUpdateHeader>
        <ModalBody>kek</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              dispatch(setUpdateModalWindow(!modalUpdate));
            }}
          >
            cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default UpdateModalWindow;
