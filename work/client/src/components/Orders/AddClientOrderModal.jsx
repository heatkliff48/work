import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import React from 'react';

const UpdateModalWindow = React.memo(({ isOpen, toggle }) => {
  const {} = useProjectContext();
  const dispatch = useDispatch();

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}></ModalHeader>

        <ModalFooter>
          <Button>Add</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
});
export default UpdateModalWindow;
