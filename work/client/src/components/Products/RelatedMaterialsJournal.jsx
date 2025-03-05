import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getRelatedMaterialsJournal } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';

const RelatedMaterialsJournal = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const relatedMaterialsJournal = useSelector(
    (state) => state.relatedMaterialsJournal
  );

  const [relatedMaterialsJournalDataList, setRelatedMaterialsJournalDataList] =
    useState([]);

  const related_materials_journal_table = [
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
    if (relatedMaterialsJournal) {
      setRelatedMaterialsJournalDataList(relatedMaterialsJournal);
    }
  }, [relatedMaterialsJournal]);

  const relatedMaterialsJournalHandler = (id) => {};

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
    dispatch(getRelatedMaterialsJournal());
    // }
  }, []);

  return (
    <Fragment>
      <ShowProductsTypeJournalModal table={related_materials_journal_table} />{' '}
      <Table
        COLUMN_DATA={related_materials_journal_table}
        dataOfTable={relatedMaterialsJournalDataList}
        tableName={'Related materials journal'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          relatedMaterialsJournalHandler(row.original.id);
        }}
      />
    </Fragment>
  );
};

export default RelatedMaterialsJournal;
