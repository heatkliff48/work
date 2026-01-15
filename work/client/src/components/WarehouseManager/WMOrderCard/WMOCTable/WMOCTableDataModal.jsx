import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';

const WMOCTableDataModal = ({ isOpen, toggle }) => {
  const { setAdditionalInfoPDF } = useWarehouseContext();
  const { setWmoctPdfModal, wmoctPdfModal } = useModalContext();

  const [formData, setFormData] = useState({
    referencia: '',
    matricula: '',
    agencia: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setAdditionalInfoPDF(formData);
    setWmoctPdfModal(!wmoctPdfModal);

    toggle();
  };
  if (!isOpen) return null;
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <p>Write additional info</p>
        </ModalHeader>
        <Fragment>
          <ModalBody>
            <FormGroup>
              <Label for="name">Agencia Transporte:</Label>
              <Input
                id="agencia"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="position">Matricula:</Label>
              <Input
                id="matricula"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="comment">S/Referencia:</Label>
              <Input
                id="referencia"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>
        </Fragment>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WMOCTableDataModal;
