import React, { Fragment, useEffect } from 'react';
import { useProjectContext } from '../../contexts/Context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../redux/actions/clientAction';
import ClientsInfoModal from './ClientsInfoModal';
import Button from 'react-bootstrap/Button';

const ClientsInfo = () => {
  const { setClientID, setModalAddClient, modalAddClient } = useProjectContext();
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllClients(user));
  }, []);

  return (
    <Fragment>
      <Button variant="primary" onClick={() => setModalAddClient(!modalAddClient)}>
        Add Client
      </Button>
      <ClientsInfoModal />
      <table
        class="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>c_id</th>
            <th>c_name</th>
            <th>tin</th>
            <th>category</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((clients) => (
            <tr
              onClick={(e) => {
                setClientID(clients.c_id);
              }}
            >
              <td>{clients.c_id}</td>
              <td>{clients.c_name}</td>
              <td>{clients.tin}</td>
              <td>{clients.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ClientsInfo;
