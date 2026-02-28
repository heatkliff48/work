import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useModalContext } from '#components/contexts/ModalContext.js';
import DimensionTestModal from './DimensionsTestModal';
import CompressTestModal from './CompressTestModal';

function ProductionQualityModal({ show, onHide, selectedBatch }) {
  const { batch_id, date } = selectedBatch;
  const {
    dimensionTestModal,
    setDimensionTestModal,
    compressTestModal,
    setCompressTestModal,
  } = useModalContext();

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="simple-modal-title"
        centered
        dialogClassName="modal-sm-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title id="simple-modal-title">Batch calendar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-4">
            <Col xs={6}>
              <strong>Batch id:</strong> {batch_id}
            </Col>
            <Col xs={6} className="text-end">
              <strong>Date:</strong> {date}
            </Col>
          </Row>

          <Row>
            <Col className="d-flex justify-content-center gap-3">
              <Button variant="primary" onClick={() => setDimensionTestModal(true)}>
                Dimensions test
              </Button>
              <Button variant="secondary" onClick={() => setCompressTestModal(true)}>
                Compress test
              </Button>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

      {dimensionTestModal && (
        <DimensionTestModal
          show={dimensionTestModal}
          onHide={() => setDimensionTestModal(false)}
          selectedBatch={selectedBatch}
        />
      )}

      {compressTestModal && (
        <CompressTestModal
          show={compressTestModal}
          onHide={() => setCompressTestModal(false)}
          selectedBatch={selectedBatch}
        />
      )}
    </>
  );
}

export default ProductionQualityModal;
