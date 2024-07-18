import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllContactInfo } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';

const ClientsContactInfo = () => {
  const { currentClient } = useProjectContext();

  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.contactInfo);

  useEffect(() => {
    dispatch(getAllContactInfo(currentClient.id));
  }, [currentClient.id]);

  return (
    <Fragment>
      {' '}
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>id</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>address</th>
            <th>formal_position</th>
            <th>role_in_the_org</th>
            <th>phone_number_office</th>
            <th>phone_number_mobile</th>
            <th>phone_number_messenger</th>
            <th>email</th>
            <th>linkedin</th>
            <th>social</th>
          </tr>
        </thead>
        <tbody>
          {contactInfo?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr>
                <td>{entrie?.id}</td>
                <td>{entrie?.first_name}</td>
                <td>{entrie?.last_name}</td>
                <td>{entrie?.address}</td>
                <td>{entrie?.formal_position}</td>
                <td>{entrie?.role_in_the_org}</td>
                <td>{entrie?.phone_number_office}</td>
                <td>{entrie?.phone_number_mobile}</td>
                <td>{entrie?.phone_number_messenger}</td>
                <td>{entrie?.email}</td>
                <td>{entrie?.linkedin}</td>
                <td>{entrie?.social}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ClientsContactInfo;
