import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import Table from '#components/Table/Table';

const ClientsContactInfo = ({ clickFunk = null }) => {
  const { currentClient, currentContact, clients_contact_information_table } =
    useProjectContext();

  const contactInfo = useSelector((state) => state.contactInfo);

  const [listOfContactsFiltered, setListOfContactsFiltered] =
    useState(currentContact);

  useEffect(() => {
    const currentContactInfo = contactInfo.filter(
      (el) => el.client_id === currentClient?.id
    );
    setListOfContactsFiltered(currentContactInfo);
  }, [contactInfo, currentClient]);

  return (
    <Fragment>
      <Table
        COLUMN_DATA={clients_contact_information_table}
        dataOfTable={listOfContactsFiltered}
        tableName={'Contact information'}
        handleRowClick={(row) => {
          if (!clickFunk) return;

          clickFunk(row.original.id);
        }}
      />
    </Fragment>
  );
};

export default ClientsContactInfo;
