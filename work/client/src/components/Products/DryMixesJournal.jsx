import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { getDryMixesJournal } from '#components/redux/actions/productsTypeJournalAction.js';

const DryMixesJournal = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { user } = useProjectContext();

  const navigate = useNavigate();
  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);

  const [dryMixesJournalDataList, setDryMixesJournalDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    COLUMNS_DRY_MIXED_PRODUCT,
    unitsOfMeasurementOptions,
    typeOfMixOptions,
    placeOfProductionOptions,
    setSelectedProductsType,
    setDataTable,
    latestDryMix,
  } = useProductsTypeJournalContext();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDryMixesJournal());
  }, []);

  useEffect(() => {
    if (latestDryMix) {
      const newData = latestDryMix.map((dry) => {
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
      const articleId = latestDryMix.length === 0 ? 1 : latestDryMix.length + 1;
      code = `1` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [latestDryMix]);

  const dryMixesJournalHandler = (id) => {
    setDataTable(COLUMNS_DRY_MIXED_PRODUCT);
    const dryMix = latestDryMix.find((el) => el.id === id);
    setSelectedProductsType(dryMix);
    setModalShow(true);
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Products');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  return (
    <Fragment>
      {userAccess?.canWrite && (
        <ShowProductsTypeJournalModal
          table={COLUMNS_DRY_MIXED_PRODUCT}
          target={1}
          title={'dry mix'}
          productCode={productCode}
        />
      )}{' '}
      <Table
        COLUMN_DATA={COLUMNS_DRY_MIXED_PRODUCT}
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
        target={1}
      />
    </Fragment>
  );
};

export default DryMixesJournal;
