import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowProductsTypeJournalModal from './modal/ProductsTypeJournalModal';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoModal from './modal/ProductsTypeJournalInfoModal';

const ToolsTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const tool = useSelector((state) => state.tool);

  const [toolDataList, setToolDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productCode, setProductCode] = useState('');
  const {
    COLUMNS_TOOLS_PRODUCT,
    unitsOfMeasurementOptions,
    placeOfProductionOptions,
    setSelectedProductsType,
    setDataTable,
  } = useProductsTypeJournalContext();

  useEffect(() => {
    if (tool) {
      const newData = tool.map((piece) => {
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
      setToolDataList(newData);
      let code = '0001';
      const articleId = tool.length === 0 ? 1 : tool.length + 1;
      code = `3` + `0000${articleId}`.slice(-4);
      setProductCode(code);
    }
  }, [tool]);

  const toolHandler = (id) => {
    setDataTable(COLUMNS_TOOLS_PRODUCT);
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

  return (
    <Fragment>
      <ShowProductsTypeJournalModal
        table={COLUMNS_TOOLS_PRODUCT}
        target={4}
        title={'tool'}
        productCode={productCode}
      />{' '}
      <Table
        COLUMN_DATA={COLUMNS_TOOLS_PRODUCT}
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
        target={4}
      />
    </Fragment>
  );
};

export default ToolsTable;
