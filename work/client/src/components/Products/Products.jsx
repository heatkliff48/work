import { useMemo } from 'react';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';
import { useSortBy, useTable } from 'react-table';
import './products.css';

import ModalWindow from '../ModalWindow/ModalWindow';
import { useProjectContext } from '../contexts/Context';

function Products() {
  const {
    modal,
    setModal,
    COLUMNS,
    latestProducts,
    modalProductCard,
    setModalProductCard,
  } = useProjectContext();
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => latestProducts, [latestProducts]);

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
      sortTypes,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleRowClick = (row) => {
    // Здесь вы можете выполнить любые действия, необходимые для открытия модального окна
    // Например, установить состояние модального окна или передать данные строки в модальное окно
    // setModalProductCard(!modalProductCard);
  };

  return (
    <>
      <ModalWindow list={COLUMNS} />
      <h1>Sortable Table</h1>
      <div className="table-wrapper">
        {/* к разметке надо привыкнуть :) */}
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
                        {col.render('Header')}{' '}
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
        <button onClick={() => setModal(!modal)}>Add product new</button>
      </div>
    </>
  );
}
export default Products;
