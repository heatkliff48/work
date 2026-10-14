import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import showMessage from '#components/Utils/showMessage.js';
import { errorToText } from '#components/Utils/errorToText.js';
import { getApiUrl } from '#utils/getApiUrl.js';

const getRange = (records, startField, finishField) => {
  if (!Array.isArray(records)) return null;

  const values = records.flatMap((record) =>
    [record?.[startField], record?.[finishField]]
      .map(Number)
      .filter(Number.isFinite),
  );

  if (!values.length) return null;

  return { start: Math.min(...values), finish: Math.max(...values) };
};

const formatShiftedRange = (range, newStart) => {
  const shift = Number(newStart) - range.start;

  return `${range.start}–${range.finish} → ${range.start + shift}–${
    range.finish + shift
  }`;
};

const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

function RenumberLotesListModal({ show, onHide, lotesListBatches }) {
  const [batchIdStart, setBatchIdStart] = useState('');
  const [cakeIdStart, setCakeIdStart] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const batchRange = useMemo(
    () => getRange(lotesListBatches, 'batch_id', 'batch_id'),
    [lotesListBatches],
  );
  const cakeRange = useMemo(
    () => getRange(lotesListBatches, 'cake_id_start', 'cake_id_finish'),
    [lotesListBatches],
  );

  useEffect(() => {
    if (!show) return;

    setBatchIdStart(batchRange ? String(batchRange.start) : '');
    setCakeIdStart(cakeRange ? String(cakeRange.start) : '');
  }, [show]);

  const isValid =
    batchRange &&
    cakeRange &&
    isPositiveInteger(batchIdStart) &&
    isPositiveInteger(cakeIdStart);

  const hasChanges =
    isValid &&
    (Number(batchIdStart) !== batchRange.start ||
      Number(cakeIdStart) !== cakeRange.start);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const isConfirmed = window.confirm(
      `Batch ID: ${formatShiftedRange(batchRange, batchIdStart)}\n` +
        `Cake ID: ${formatShiftedRange(cakeRange, cakeIdStart)}\n\n` +
        'Renumber all batches and cakes?',
    );

    if (!isConfirmed) return;

    setIsSaving(true);

    try {
      await axios.post(
        `${getApiUrl()}/lotesList/renumber`,
        {
          batch_id_start: Number(batchIdStart),
          cake_id_start: Number(cakeIdStart),
        },
        { withCredentials: true },
      );

      // Batch and cake numbers live in many stores, a reload refetches them all
      window.location.reload();
    } catch (err) {
      showMessage(errorToText(err), 'error');
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Set first Batch ID and Cake ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!batchRange || !cakeRange ? (
            <p>Lotes List is empty, nothing to renumber.</p>
          ) : (
            <>
              <p>
                Enter the numbers the first batch should have. All the other
                batches and cakes are shifted by the same amount in Lotes
                List, Casting, raw materials consumption and quality records.
              </p>

              <Form.Group className="mb-3" controlId="renumberBatchIdStart">
                <Form.Label>First Batch ID</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  value={batchIdStart}
                  onChange={(e) => setBatchIdStart(e.target.value)}
                />
                {isPositiveInteger(batchIdStart) && (
                  <Form.Text muted>
                    {formatShiftedRange(batchRange, batchIdStart)}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="renumberCakeIdStart">
                <Form.Label>First Cake ID</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  value={cakeIdStart}
                  onChange={(e) => setCakeIdStart(e.target.value)}
                />
                {isPositiveInteger(cakeIdStart) && (
                  <Form.Text muted>
                    {formatShiftedRange(cakeRange, cakeIdStart)}
                  </Form.Text>
                )}
              </Form.Group>

              <p className="text-danger mb-0">
                Do it while nobody is casting. Other users have to reload the
                page afterwards.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={!hasChanges || isSaving}>
            {isSaving ? 'Saving...' : 'Apply'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RenumberLotesListModal;
