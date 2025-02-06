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
  const columns = useMemo(() => COLUMN_DATA, []);
  const data = useMemo(() => dataOfTable, [dataOfTable]);

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: '',
    }),
    []
  );

  function matchSorterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }

  const filterTypes = useMemo(
    () => ({
      rankedMatchSorter: matchSorterFn,
    }),
    []
  );

  const sortTypes = {
    // Функция сортировки для строковых значений
    string: (rowA, rowB, columnId, desc) => {
      const a = rowA.values[columnId];
      const b = rowB.values[columnId];

      // Используем метод localeCompare для сравнения строк
      // с учетом локали (в данном случае 'en' - английский язык)
      const comparison = a.localeCompare(b, 'en');

      // Если desc (сортировка по убыванию) равно true,
      // инвертируем результат сравнения
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
    useSortBy
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
        {/* к разметке надо привыкнуть :) */}
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
                      col.getSortByToggleProps()
                    );
                    return (
                      <th key={key} {...restProps}>
                        {col.render('Header')}
                        {/* если колонка является сортируемой, рендерим рядом с заголовком соответствующую иконку в зависимости от того, включена ли сортировка, а также на основе порядка сортировки */}
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
                        {/* Render the columns filter UI */}
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
