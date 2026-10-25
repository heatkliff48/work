import { useModalContext } from '#components/contexts/ModalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { Fragment, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import '../../warehouseManagerView.css';

const WMOCTableDataModal = ({ isOpen, toggle, reprint, onReprint }) => {
  const {
    setAdditionalInfoPDF,
    setWmoctProductDeltaForPdf,
    wmoctProduct,
    aldabaran,
  } = useWarehouseContext();
  const { setWmoctPdfModal, wmoctPdfModal } = useModalContext();

  const [formData, setFormData] = useState({
    referencia: '',
    matricula: '',
    agencia: '',
  });
  const [albaranNum, setAlbaranNum] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (reprint) {
      // Albaran saved before it was linked to its trailer: the number is
      // typed in, and the albaran with that number gives its date
      const saved = (aldabaran || []).find(
        (item) => albaranNum && Number(item.num) === Number(albaranNum),
      );

      onReprint({ ...formData, num: albaranNum, data: saved?.data });
      return;
    }

    const deltaForPdf = (wmoctProduct || []).map((p) => {
      const delta = (p.batches || []).reduce((sum, b) => {
        const prev = Number(b.minAllocated || 0);
        const cur = Number(b.allocated || 0);
        return sum + Math.max(cur - prev, 0);
      }, 0);

      return {
        order_dispatch_id: p.order_dispatch_id,
        article: p.article,
        product_name: p.product_name,
        delta,
      };
    });

    setWmoctProductDeltaForPdf(deltaForPdf);

    setAdditionalInfoPDF(formData);
    setWmoctPdfModal(!wmoctPdfModal);
    toggle();
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        contentClassName="wm-modal-card wm-modal-card--xs"
        backdropClassName="wm-modal-backdrop"
      >
        <ModalHeader toggle={toggle}>
          <p>Write additional info</p>
        </ModalHeader>
        <Fragment>
          <ModalBody>
            {reprint && (
              <div className="wm-field">
                <label htmlFor="albaranNum">Nº Albaran:</label>
                <input
                  id="albaranNum"
                  name="albaranNum"
                  value={albaranNum}
                  onChange={(e) => setAlbaranNum(e.target.value)}
                />
              </div>
            )}
            <div className="wm-field">
              <label htmlFor="agencia">Agencia Transporte:</label>
              <input
                id="agencia"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
              />
            </div>
            <div className="wm-field">
              <label htmlFor="matricula">Matricula:</label>
              <input
                id="matricula"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
              />
            </div>
            <div className="wm-field">
              <label htmlFor="referencia">S/Referencia:</label>
              <input
                id="referencia"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
              />
            </div>
          </ModalBody>
        </Fragment>
        <ModalFooter>
          <Button className="wm-btn wm-btn--primary" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WMOCTableDataModal;
