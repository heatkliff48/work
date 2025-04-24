import { Fragment } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import WMOPdf from './WMOPdf';

const WMOCPDFModal = ({ isOpen, toggle, orderCartData }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          toggle();
        }}
        fullscreen
      >
        <ModalHeader
          toggle={() => {
            toggle();
          }}
        >
          <p>Select Batch</p>
        </ModalHeader>
        <Fragment>
          <ModalBody>
            <WMOPdf orderCartData={orderCartData} toggle={toggle} />
          </ModalBody>
        </Fragment>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default WMOCPDFModal;
