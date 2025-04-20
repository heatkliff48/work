import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getRelatedMaterialsJournal } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';

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
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    COLUMNS_RELATED_MATERIALS_JOURNAL,
    selectedProductsType,
    setSelectedProductsType,
    dataTable,
    setDataTable,
    latestRelatedMaterials,
  } = useProductsTypeJournalContext();

  useEffect(() => {
    if (latestRelatedMaterials) {
      setRelatedMaterialsJournalDataList(latestRelatedMaterials);
      let code = '0001';
      const articleId =
        relatedMaterialsJournal.length === 0
          ? 1
          : relatedMaterialsJournal.length + 1;
      code = `4` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [latestRelatedMaterials]);

  const relatedMaterialsJournalHandler = (id) => {
    setDataTable(COLUMNS_RELATED_MATERIALS_JOURNAL);
    const relatedMaterial = latestRelatedMaterials.find((el) => el.id === id);
    setSelectedProductsType(relatedMaterial);
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
    dispatch(getRelatedMaterialsJournal());
    // }
  }, []);

  return (
    <Fragment>
      <ShowProductsTypeJournalModal
        table={COLUMNS_RELATED_MATERIALS_JOURNAL}
        target={2}
        title={'related material'}
        productCode={productCode}
      />{' '}
      <Table
        COLUMN_DATA={COLUMNS_RELATED_MATERIALS_JOURNAL}
        dataOfTable={relatedMaterialsJournalDataList}
        tableName={'Related materials journal'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          relatedMaterialsJournalHandler(row.original.id);
        }}
      />
      <ProductsTypeJournalInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={'Related material card'}
        target={2}
      />
    </Fragment>
  );
};

export default RelatedMaterialsJournal;
