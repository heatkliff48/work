import { GlobalFilterInput } from './GlobalFilterInput';
import { matchSorter } from 'match-sorter';
import { useMemo } from 'react';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';
import { useTable, useGlobalFilter, useFilters, useSortBy } from 'react-table';

function Table({
  COLUMN_DATA = [],
  dataOfTable = [],
  userAccess = { canRead: true, canWrite: false },
  onClickButton,
  buttonText = '',
  tableName = 'Table',
  handleRowClick,
}) {
  const columns = useMemo(() => {
    return Array.isArray(COLUMN_DATA) ? COLUMN_DATA : [];
  }, [COLUMN_DATA]);

  const data = useMemo(() => {
    return Array.isArray(dataOfTable) ? dataOfTable : [];
  }, [dataOfTable]);

  const defaultColumn = useMemo(
    () => ({
      Filter: '',
    }),
    [],
  );

  function matchSorterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }

  const filterTypes = useMemo(
    () => ({
      rankedMatchSorter: matchSorterFn,
    }),
    [],
  );

  const sortTypes = {
    string: (rowA, rowB, columnId, desc) => {
      const a = rowA.values[columnId];
      const b = rowB.values[columnId];

      const comparison = a.localeCompare(b, 'en');

      return desc ? -comparison : comparison;
    },
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      sortTypes,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  const haveButton = buttonText.trim() == '';

  return (
    <>
      <h1>{tableName}</h1>
      <div className="table-wrapper">
        <GlobalFilterInput
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
        <div>
          {userAccess?.canWrite && !haveButton && (
            <button onClick={onClickButton} className="table_button">
              {buttonText}
            </button>
          )}
        </div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((hG) => {
              const { key, ...restProps } = hG.getHeaderGroupProps();
              return (
                <tr key={key} {...restProps}>
                  {hG.headers.map((col) => {
                    const { key, ...restProps } = col.getHeaderProps(
                      col.getSortByToggleProps(),
                    );
                    return (
                      <th key={key} {...restProps}>
                        {col.render('Header')}
                        {col.canSort && (
                          <span>
                            {col.isSorted ? (
                              col.isSortedDesc ? (
                                <BiSortUp />
                              ) : (
                                <BiSortDown />
                              )
                            ) : (
                              <BiSortAlt2 />
                            )}
                          </span>
                        )}
                        <div>{col.canFilter ? col.render('Filter') : null}</div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...restProps } = row.getRowProps();
              return (
                <tr key={key} {...restProps} onClick={() => handleRowClick(row)}>
                  {row.cells.map((cell) => {
                    const { key, ...restProps } = cell.getCellProps();

                    return (
                      <td key={key} {...restProps}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Table;
