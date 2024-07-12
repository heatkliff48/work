import { useEffect, useMemo } from 'react';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';
import { useSortBy, useTable } from 'react-table';
import './products.css';
import { getAllProducts } from '../redux/actions/productsAction';

import ModalWindow from '../ModalWindow/ModalWindow';
import { useProjectContext } from '../contexts/Context';
import ProductCardModal from '../ProductCardModal/ProductCardModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Products() {
  const {
    modal,
    setModal,
    COLUMNS,
    latestProducts,
    modalProductCard,
    setModalProductCard,
    setProductCardData,
    roles,
    checkUserAccess,
    userAccess,
    setUserAccess,
  } = useProjectContext();
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => latestProducts??[], [latestProducts]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
      sortTypes,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleRowClick = (row) => {
    if (userAccess.canRead) {
      setProductCardData(row.original);
      setModalProductCard(!modalProductCard);
    }
  };

  useEffect(() => {
    if (userAccess.canRead) {
      dispatch(getAllProducts());
    }
  }, [userAccess.canRead]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Products');
      setUserAccess(access);

      console.log(access)

      if (!access.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  if (!userAccess.canRead) {
    return <div>У вас нет прав для просмотра этой страницы.</div>;
  }

  return (
    <>
      <ModalWindow
        list={COLUMNS}
        formData={null}
        isOpen={modal}
        toggle={() => setModal(!modal)}
      />
      <ProductCardModal />
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
        {userAccess.canWrite && (
          <button onClick={() => setModal(!modal)}>Add product new</button>
        )}
      </div>
    </>
  );
}
export default Products;
