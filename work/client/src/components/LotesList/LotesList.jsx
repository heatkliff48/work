import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../Table/Table";
import { useWarehouseContext } from "#components/contexts/WarehouseContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { getLotesList } from "#components/redux/actions/lotesListAction.js";

function LotesList() {
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const COLUMNS_LOTES_LIST = [
    {
      Header: "Batch ID",
      accessor: "id",
    },
    {
      Header: "Cake ID",
      accessor: "cake_id",
    },
    {
      Header: "Production date",
      accessor: "production_date",
    },
    {
      Header: "Product",
      accessor: "product",
    },
    {
      Header: "Recipe",
      accessor: "recipe",
    },
    {
      Header: "Quantity cakes",
      accessor: "quantity_cakes",
    },
    {
      Header: "Warehouse ID",
      accessor: "warehouse_id",
    },
  ];

  const lotesList = useSelector((state) => state.lotesList);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, "Warehouse");

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
        dispatch(getLotesList());
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_LOTES_LIST}
        dataOfTable={lotesList}
        userAccess={userAccess}
        tableName={"Lotes List"}
      />
    </>
  );
}
export default LotesList;
