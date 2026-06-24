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

  const cityLine = [
    legalAddress?.zip_code,
    legalAddress?.city,
    legalAddress?.province,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Fragment>
      <div className="cl-field-value cl-addr__street">
        {legalAddress?.street || '—'}
        {legalAddress?.additional_info ? `, ${legalAddress.additional_info}` : ''}
      </div>
      {cityLine && <div className="cl-addr__line">{cityLine}</div>}
      {legalAddress?.country && (
        <div className="cl-addr__line">{legalAddress.country}</div>
      )}

      <div className="cl-addr__contacts">
        {legalAddress?.phone_office && (
          <a
            className="cl-addr__contact"
            href={`tel:${String(legalAddress.phone_office).replace(/[^+\d]/g, '')}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bc1212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5.5C4 4.7 4.7 4 5.5 4H8l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v2.5c0 .8-.7 1.5-1.5 1.5A14 14 0 0 1 4 5.5z" />
            </svg>
            {legalAddress.phone_office}
          </a>
        )}
        {legalAddress?.email && (
          <a className="cl-addr__contact" href={`mailto:${legalAddress.email}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bc1212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" />
            </svg>
            {legalAddress.email}
          </a>
        )}
      </div>

      {(legalAddress?.phone_mobile ||
        legalAddress?.fax ||
        legalAddress?.web_link) && (
        <div className="cl-addr__extra">
          {legalAddress?.phone_mobile && (
            <span>Mobile: {legalAddress.phone_mobile}</span>
          )}
          {legalAddress?.fax && <span>Fax: {legalAddress.fax}</span>}
          {legalAddress?.web_link && (
            <a
              href={legalAddress.web_link}
              target="_blank"
              rel="noreferrer"
              className="cl-addr__web"
            >
              {legalAddress.web_link}
            </a>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ClientsAddress;
