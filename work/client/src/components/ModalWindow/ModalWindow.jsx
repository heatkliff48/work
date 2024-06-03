import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
import { setModalWindow } from '../redux/actions/modalAction';

const ModalWindow = (props) => {
  const { className } = props;

  const modal = useSelector((state) => state.modal);
  console.log('Modal', modal);
  const dispatch = useDispatch();

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={() => {
          dispatch(setModalWindow(!modal));
        }}
        className={className}
      >
        <ModalHeader
          toggle={() => {
            dispatch(setModalWindow(!modal));
          }}
        >
          New product
        </ModalHeader>
        <ModalBody> Version:</ModalBody>
        <input type="text" />

        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              dispatch(setModalWindow(!modal));
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalWindow;
