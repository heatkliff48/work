import React, { Fragment, useEffect, useState, useContext, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MydModalWithGrid from './ClientFullModal.js';
import ShowClientsModal from './ClientsInfoModal.js';
import { getAllClients } from '#components/redux/actions/clientAction';

export const ClientContext = createContext();

const ClientsInfo = () => {
  const [modalShow, setModalShow] = useState(false);

  const [currentClient, setCurrentClient] = useState({});

  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(getAllClients());
  }, []);

  const clientHandler = (id) => {
    const client = clients.filter((el) => el.id === id)[0];
    setCurrentClient(client);
    setModalShow(true)
  };

  return (
    <Fragment>
      {' '}
      <ClientContext.Provider value={[currentClient, setCurrentClient]}>
      <ShowClientsModal />
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>id</th>
            <th>c_name</th>
            <th>tin</th>
            <th>category</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
                    <td>John</td>
                    <td>Doe</td>
                    <td>john@example.com</td>
                </tr> */}
          {clients?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr
                key={entrie.id}
                onClick={(e) => {
                  clientHandler(entrie.id);
                }}
              >
                <td>{entrie?.id}</td>
                <td>{entrie?.c_name}</td>
                <td>{entrie?.tin}</td>
                <td>{entrie?.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <MydModalWithGrid
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      </ClientContext.Provider>
    </Fragment>
  );
};

export default ClientsInfo;