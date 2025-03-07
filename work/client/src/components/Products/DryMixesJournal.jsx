import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getDryMixesJournal } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';

const DryMixesJournal = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);

  const [dryMixesJournalDataList, setDryMixesJournalDataList] = useState([]);

  const dry_mixes_journal_table = [
    {
      Header: 'Product name',
      accessor: 'product_name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units per Pack',
      accessor: 'units_per_pack',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per Pack',
      accessor: 'price_per_pack',
      Filter: TextSearchFilter,
    },
    // {
    //   Header: 'Type',
    //   accessor: 'type',
    //   Filter: TextSearchFilter,
    // },
  ];

  useEffect(() => {
    if (dryMixesJournal) {
      setDryMixesJournalDataList(dryMixesJournal);
    }
  }, [dryMixesJournal]);

  const dryMixesJournalHandler = (id) => {};

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'batch_outside');
  //     setUserAccess(access);

  //     if (!access.canRead) {
  //       navigate('/');
  //     }
  //   }
  // }, [user, roles]);

  useEffect(() => {
    // if (userAccess?.canRead) {
    dispatch(getDryMixesJournal());
    // }
  }, []);

  return (
    <Fragment>
      <ShowProductsTypeJournalModal
        table={dry_mixes_journal_table}
        target={1}
        title={'dry mix'}
      />{' '}
      <Table
        COLUMN_DATA={dry_mixes_journal_table}
        dataOfTable={dryMixesJournalDataList}
        tableName={'Dry mixes journal'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          dryMixesJournalHandler(row.original.id);
        }}
      />
    </Fragment>
  );
};

export default DryMixesJournal;
