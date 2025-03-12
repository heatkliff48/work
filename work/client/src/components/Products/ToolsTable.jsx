import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getTool } from '#components/redux/actions/productsTypeJournalAction.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';

const ToolsTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tool = useSelector((state) => state.tool);

  const [toolDataList, setToolDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const { selectedProductsType, setSelectedProductsType, dataTable, setDataTable } =
    useProductsTypeJournalContext();

  const tools_table = [
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
    if (tool) {
      setToolDataList(tool);
      let code = '0001';
      const articleId = tool.length === 0 ? 1 : tool.length + 1;
      code = `3` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [tool]);

  const toolHandler = (id) => {
    setDataTable(tools_table);
    const selectedTool = tool.find((el) => el.id === id);
    setSelectedProductsType(selectedTool);
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
    dispatch(getTool());
    // }
  }, []);

  return (
    <Fragment>
      <ShowProductsTypeJournalModal
        table={tools_table}
        target={4}
        title={'tool'}
        productCode={productCode}
      />{' '}
      <Table
        COLUMN_DATA={tools_table}
        dataOfTable={toolDataList}
        tableName={'Tools'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          toolHandler(row.original.id);
        }}
      />
      <ProductsTypeJournalInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={'Tool'}
      />
    </Fragment>
  );
};

export default ToolsTable;
