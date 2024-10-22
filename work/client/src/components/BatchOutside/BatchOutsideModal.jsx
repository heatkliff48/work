import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function BatchOutsideModal(props) {
  const [batchOutsideInput, setBatchOutsideInput] = useState({});
  const batch_outside_info_table = [
    {
      Header: 'качественная продукция',
      accessor: 'quality_product',
    },
    {
      Header: 'хвосты',
      accessor: 'leftovers',
    },
    {
      Header: 'некондиция',
      accessor: 'nonconditioning',
    },
    {
      Header: 'брак',
      accessor: 'discard',
    },
    {
      Header: 'не произведено',
      accessor: 'not_complete',
    },
  ];

  const handleBatchOutsideInfoInputChange = useCallback((e) => {
    setBatchOutsideInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Модалочка для инпутиков
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="batchOutsideModal"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <h3>Батч аутсайд нихуя себе</h3>
            <Row>
              {batch_outside_info_table.map((el) => (
                <Col key={el.id}>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        for="version"
                      >
                        {el.Header}
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={batchOutsideInput[el.accessor] || ''}
                        onChange={(e) => handleBatchOutsideInfoInputChange(e)}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="batchOutsideModal">Сохранить</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BatchOutsideModal;
