import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getDryMixesJournal } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const DryMixesJournal = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);

  const [dryMixesJournalDataList, setDryMixesJournalDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    unitsOfMeasurementOptions,
    typeOfMixOptions,
    placeOfProductionOptions,
    setSelectedProductsType,
    setDataTable,
  } = useProductsTypeJournalContext();

  const dry_mixes_journal_table = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Number of bags',
      accessor: 'number_of_bags',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Bag weight',
      accessor: 'bag_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Type of mix',
      accessor: 'type_of_mix',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per kilogram',
      accessor: 'price_per_kilogram',
      Filter: TextSearchFilter,
    },
  ];

  useEffect(() => {
    if (dryMixesJournal) {
      const newData = dryMixesJournal.map((dry) => {
        return {
          ...dry,
          units_of_measurement:
            unitsOfMeasurementOptions.find(
              (unit) => unit.value == dry.units_of_measurement
            )?.label || dry.units_of_measurement,
          type_of_mix:
            typeOfMixOptions.find((type) => type.value == dry.type_of_mix)?.label ||
            '',
          place_of_production:
            placeOfProductionOptions.find(
              (place) => place.value == dry.place_of_production
            )?.label || '',
        };
      });
      setDryMixesJournalDataList(newData);
      let code = '0001';
      const articleId =
        dryMixesJournal.length === 0 ? 1 : dryMixesJournal.length + 1;
      code = `1` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [dryMixesJournal]);

  const dryMixesJournalHandler = (id) => {
    setDataTable(dry_mixes_journal_table);
    const dryMix = dryMixesJournal.find((el) => el.id === id);
    setSelectedProductsType(dryMix);
    setModalShow(true);
  };

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
        productCode={productCode}
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
      <ProductsTypeJournalInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={'Dry mix card'}
      />
    </Fragment>
  );
};

export default DryMixesJournal;
