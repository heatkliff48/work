import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';

const ClientsContactInfo = ({ clickFunk = null, showSearch = false }) => {
  const { currentClient, currentContact, setCurrentContact } = useProjectContext();

  const contactInfo = useSelector((state) => state.contactInfo);

  const [searchFilter, setSearchFilter] = useState('');
  const [listOfContactsFiltered, setListOfContactsFiltered] =
    useState(currentContact);

  useEffect(() => {
    const currentContactInfo = contactInfo.filter(
      (el) => el.client_id === currentClient?.id
    );
    setListOfContactsFiltered(currentContactInfo);
  }, [contactInfo, currentClient]);

  const filterListOfContactsHandler = (e) => {
    setSearchFilter(e.target.value);
    let filtered = contactInfo.filter((el) => {
      if (el.client_id === currentClient.id) {
        return el.last_name?.toLowerCase().includes(e.target.value.toLowerCase());
      }
    });
    setListOfContactsFiltered(filtered);
  };

  return (
    <Fragment>
      {showSearch == true && (
        <div>
          <h4>Search delivery address</h4>
          <input
            value={searchFilter}
            onChange={(e) => {
              filterListOfContactsHandler(e);
            }}
          />
        </div>
      )}
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>id</th>
            <th>client id</th>
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
          {listOfContactsFiltered?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr
                onClick={() => {
                  if (!clickFunk) return;

                  clickFunk(entrie.id);
                }}
              >
                <td>{entrie?.id}</td>
                <td>{entrie?.client_id}</td>
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
