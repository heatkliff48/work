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
  // вид-опции (необязательные, ничего не меняют в данных):
  variant = 'default', // 'default' | 'card'
  hideTitle = false,
  renderToolbar, // (api) => JSX
  emptyTitle = 'No clients match your search',
  emptySubtitle = 'Try a different name, CIF/VAT or category.',
  getRowProps, // (row) => ({ className, style }) — optional per-row view hook, nothing else changes
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
  const isCard = variant === 'card';

  const toolbar = renderToolbar
    ? renderToolbar({
        globalFilter: state.globalFilter,
        setGlobalFilter,
        preGlobalFilteredRows,
        rows,
      })
    : null;

  return (
    <>
      {!hideTitle && (
        <h1 className={isCard ? 'tbl-title' : undefined}>{tableName}</h1>
      )}

      {toolbar}

      <div className={isCard ? 'tbl-card' : 'table-wrapper'}>
        {!renderToolbar && (
          <GlobalFilterInput
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={state.globalFilter}
          />
        )}

        {userAccess?.canWrite && !haveButton && (
          <div>
            <button onClick={onClickButton} className="table_button">
              {buttonText}
            </button>
          </div>
        )}

        <table {...getTableProps()} className={isCard ? 'tbl' : undefined}>
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
                        <span className="tbl-th-inner">
                          {col.render('Header')}
                          {col.canSort && (
                            <span className="tbl-sort">
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
                        </span>
                        {!isCard && (
                          <div>{col.canFilter ? col.render('Filter') : null}</div>
                        )}
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
              const rowView = getRowProps ? getRowProps(row) || {} : {};
              return (
                <tr
                  key={key}
                  {...restProps}
                  className={
                    [handleRowClick ? 'tbl-row--click' : '', rowView.className]
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  style={rowView.style}
                  onClick={() => handleRowClick && handleRowClick(row)}
                >
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

        {isCard && rows.length === 0 && (
          <div className="tbl-empty">
            <div className="tbl-empty__title">{emptyTitle}</div>
            <div className="tbl-empty__sub">{emptySubtitle}</div>
          </div>
        )}
      </div>
    </>
  );
}
export default Table;
