import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import { useProjectContext } from '../../contexts/Context';
import { useDispatch, useSelector } from 'react-redux';
import { addClient } from '../../redux/actions/clientAction';

function ClientsInfoModal(props) {
  const [clientInfo, setClientInfo] = useState({});
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { setModalAddClient, modalAddClient } = useProjectContext();

  const inputChange = (e) => {
    setClientInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={modalAddClient}
      toggle={() => {
        setModalAddClient(!modalAddClient);
      }}
    >
      <Modal.Header
        closeButton
        toggle={() => {
          setModalAddClient(!modalAddClient);
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">Add Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="addProductModal"
          className="w-full max-w-sm"
          onSubmit={(e) => dispatch(addClient({ client: clientInfo, user }))}
        >
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="version"
              >
                Client's Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="name"
                type="text"
                name="name"
                value={clientInfo.nae}
                onChange={inputChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="version"
              >
                TIN
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="tin"
                type="text"
                name="tin"
                value={clientInfo.name}
                onChange={inputChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="discription"
              >
                Category
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="category"
                type="text"
                name="category"
                value={clientInfo.name}
                onChange={inputChange}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={setModalAddClient(!modalAddClient)}>Close</button>
        <Button form="addProductModal" type="submit">
          Add Client
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClientsInfoModal;
