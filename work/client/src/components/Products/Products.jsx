import { useEffect, useMemo, useState } from 'react';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';
import { useTable, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import './products.css';

import ModalWindow from './modal/ModalWindow';
import ProductCardModal from './modal/ProductCardModal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GlobalFilterInput } from '#components/Table/GlobalFilterInput';
import { matchSorter } from 'match-sorter';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import PreviewProductCardModal from './modal/PreviewProductCardModal';

function Products() {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const {
    modal,
    setModal,
    modalProductCard,
    setModalProductCard,
    previewProductModal,
  } = useModalContext();
  const { TABLE_COLUMNS, COLUMNS, latestProducts, products } = useProductsContext();
  const { setProductCardData, previewOperationName } = useProjectContext();

  const [data, setData] = useState([]);
  const columns = useMemo(() => TABLE_COLUMNS, []);
  // const data = useMemo(() => latestProducts ?? [], [latestProducts, products]);

  useEffect(() => {
    setData(latestProducts);
  }, [latestProducts, products]);

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

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

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
      initialState: {
        sortBy: [
          {
            id: 'article',
            desc: false,
          },
        ],
      },
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

  const handleRowClick = (row) => {
    if (userAccess?.canRead) {
      setProductCardData(row.original);
      setModalProductCard(!modalProductCard);
    }
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Products');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  if (!userAccess?.canRead) {
    return <div>У вас нет прав для просмотра этой страницы.</div>;
  }

  return (
    <>
      {modal && (
        <ModalWindow
          list={COLUMNS}
          formData={null}
          isOpen={modal}
          toggle={() => setModal(!modal)}
        />
      )}
      {previewProductModal && (
        <PreviewProductCardModal previewOperationName={previewOperationName} />
      )}

      {modalProductCard && <ProductCardModal />}
      <h1>HCCA Blocks</h1>
      {userAccess?.canWrite && (
        <button
          onClick={() => setModal(!modal)}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add product new
        </button>
      )}
      <div className="table-wrapper">
        {/* к разметке надо привыкнуть :) */}
        <GlobalFilterInput
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
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
export default Products;
