import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';

const AVATAR = { bg: '#f3f4f6', fg: '#565d6d' };

function getInitials(name = '') {
  const parts = String(name)
    .replace(/[^A-Za-zÀ-ÿ\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const ClientsContactInfo = ({ clickFunk = null, fullContact = false }) => {
  const { currentClient, currentContact } = useProjectContext();

  const contactInfo = useSelector((state) => state.contactInfo);

  const [listOfContactsFiltered, setListOfContactsFiltered] =
    useState(currentContact);

  useEffect(() => {
    if (!contactInfo) return;

    let filteredContacts;

    if (fullContact) {
      const matching = contactInfo.filter(
        (el) => el.client_id === currentClient?.id,
      );
      const others = contactInfo.filter(
        (el) => el.client_id !== currentClient?.id,
      );
      filteredContacts = [...matching, ...others];
    } else {
      filteredContacts = contactInfo.filter(
        (el) => el.client_id === currentClient?.id,
      );
    }

    setListOfContactsFiltered(filteredContacts);
  }, [contactInfo, currentClient]);

  const list = listOfContactsFiltered || [];

  if (list.length === 0) {
    return (
      <div className="cl-empty">No contacts for this client yet.</div>
    );
  }

  return (
    <Fragment>
      <div className="cl-cardlist">
        {list.map((row) => {
          const name =
            [row.first_name, row.last_name].filter(Boolean).join(' ') ||
            row.preffered_name ||
            '—';
          const position = row.formal_position || row.role_in_the_org || '';
          const phone =
            row.phone_number_mobile ||
            row.phone_number_office ||
            row.phone_number_messenger ||
            '';
          return (
            <div
              key={row.id}
              className="cl-itemcard"
              onClick={() => {
                if (!clickFunk) return;
                clickFunk(row.id);
              }}
            >
              <div
                className="cl-avatar cl-avatar--round"
                style={{ background: AVATAR.bg, color: AVATAR.fg }}
              >
                {getInitials(name)}
              </div>
              <div className="cl-min0 cl-itemcard__main">
                <div className="cl-itemcard__title">{name}</div>
                {position && (
                  <div className="cl-itemcard__sub">{position}</div>
                )}
              </div>
              <div className="cl-itemcard__right">
                {phone && (
                  <div className="cl-itemcard__right-top cl-mono">{phone}</div>
                )}
                {row.email && (
                  <div className="cl-itemcard__right-bot">{row.email}</div>
                )}
              </div>
              <svg className="cl-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c8d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default ClientsContactInfo;
