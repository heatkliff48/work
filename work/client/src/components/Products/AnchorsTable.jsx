import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getAnchor } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';

const AnchorsTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const anchor = useSelector((state) => state.anchor);

  const [anchorDataList, setAnchorDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const { selectedProductsType, setSelectedProductsType, dataTable, setDataTable } =
    useProductsTypeJournalContext();

  const anchors_table = [
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
  ];

  useEffect(() => {
    if (anchor) {
      setAnchorDataList(anchor);
      let code = '0001';
      const articleId = anchor.length === 0 ? 1 : anchor.length + 1;
      code = `2` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [anchor]);

  const anchorHandler = (id) => {
    setDataTable(anchors_table);
    const selectedAnchor = anchor.find((el) => el.id === id);
    setSelectedProductsType(selectedAnchor);
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
    dispatch(getAnchor());
    // }
  }, []);

  return (
    <Fragment>
      <ShowProductsTypeJournalModal
        table={anchors_table}
        target={3}
        title={'anchor'}
        productCode={productCode}
      />{' '}
      <Table
        COLUMN_DATA={anchors_table}
        dataOfTable={anchorDataList}
        tableName={'Anchors'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          anchorHandler(row.original.id);
        }}
      />
      <ProductsTypeJournalInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={'Anchor'}
      />
    </Fragment>
  );
};

export default AnchorsTable;
