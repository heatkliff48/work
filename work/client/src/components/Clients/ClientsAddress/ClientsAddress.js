import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLegalAddress } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';

const ClientsAddress = () => {
  const { currentClient } = useProjectContext();

  const dispatch = useDispatch();
  const legalAddress = useSelector((state) => state.legalAddress);

  useEffect(() => {
    dispatch(getLegalAddress(currentClient.id));
  }, [currentClient]);

  return (
    <Fragment>
      {' '}
      <h3 className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
        Legal Address
      </h3>
      <p>street: {legalAddress?.street}</p>
      <p>additional_info: {legalAddress?.additional_info}</p>
      <p>city: {legalAddress?.city}</p>
      <p>zip_code: {legalAddress?.zip_code}</p>
      <p>province: {legalAddress?.province}</p>
      <p>country: {legalAddress?.country}</p>
      <p>phone_office: {legalAddress?.phone_office}</p>
      <p>fax: {legalAddress?.fax}</p>
      <p>phone_mobile: {legalAddress?.phone_mobile}</p>
      <p>web_link: {legalAddress?.web_link}</p>
      <p>email: {legalAddress?.email}</p>
    </Fragment>
  );
};

export default ClientsAddress;
