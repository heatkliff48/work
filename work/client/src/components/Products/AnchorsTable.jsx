import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';
import { getAnchor } from '#components/redux/actions/productsTypeJournalAction.js';

const AnchorsTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const anchor = useSelector((state) => state.anchor);

  const [anchorDataList, setAnchorDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    COLUMNS_ANCHOR_PRODUCT,
    unitsOfMeasurementOptions,
    placeOfProductionOptions,
    setSelectedProductsType,
    setDataTable,
    latestAnchors,
  } = useProductsTypeJournalContext();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAnchor());
  }, []);

  useEffect(() => {
    if (latestAnchors) {
      const newData = latestAnchors.map((piece) => {
        return {
          ...piece,
          units_of_measurement:
            unitsOfMeasurementOptions.find(
              (unit) => unit.value == piece.units_of_measurement
            )?.label || piece.units_of_measurement,
          place_of_production:
            placeOfProductionOptions.find(
              (place) => place.value == piece.place_of_production
            )?.label || '',
        };
      });
      setAnchorDataList(newData);
      let code = '0001';
      const articleId = latestAnchors.length === 0 ? 1 : latestAnchors.length + 1;
      code = `2` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [latestAnchors]);

  const anchorHandler = (id) => {
    setDataTable(COLUMNS_ANCHOR_PRODUCT);
    const selectedAnchor = latestAnchors.find((el) => el.id === id);
    setSelectedProductsType(selectedAnchor);
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
          table={COLUMNS_ANCHOR_PRODUCT}
          target={3}
          title={'fastener'}
          productCode={productCode}
        />
      )}{' '}
      <Table
        COLUMN_DATA={COLUMNS_ANCHOR_PRODUCT}
        dataOfTable={anchorDataList}
        tableName={'Fasteners'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          anchorHandler(row.original.id);
        }}
      />
      <ProductsTypeJournalInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={'Fasteners'}
        target={3}
      />
    </Fragment>
  );
};

export default AnchorsTable;
