import Table from '#components/Table/Table';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';

const RelatedMaterialsJournal = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [relatedMaterialsJournalDataList, setRelatedMaterialsJournalDataList] =
    useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    COLUMNS_RELATED_MATERIALS_JOURNAL,
    setSelectedProductsType,
    setDataTable,
    latestRelatedMaterials,
  } = useProductsTypeJournalContext();

  useEffect(() => {
    if (latestRelatedMaterials) {
      setRelatedMaterialsJournalDataList(latestRelatedMaterials);
      let code = '0001';
      const articleId =
        latestRelatedMaterials.length === 0 ? 1 : latestRelatedMaterials.length + 1;
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
          table={COLUMNS_RELATED_MATERIALS_JOURNAL}
          target={2}
          title={'related material'}
          productCode={productCode}
        />
      )}{' '}
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
