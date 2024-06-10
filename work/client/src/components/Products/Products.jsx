import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import './products.css';
import { getAllProducts } from '../redux/actions/productsAction';
import ModalWindow from '../ModalWindow/ModalWindow';
import { useProjectContext } from '../contexts/Context';
export const COLUMNS = [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'Version',
    accessor: 'version',
  },
  {
    Header: 'Density',
    accessor: 'density',
  },
  {
    Header: 'Form',
    accessor: 'form',
  },
  {
    Header: 'Certificate',
    accessor: 'certificate',
  },
  {
    Header: 'Width',
    accessor: 'width',
  },
  {
    Header: 'Lengths',
    accessor: 'lengths',
  },
  {
    Header: 'Height',
    accessor: 'height',
  },
  {
    Header: 'Trading Mark',
    accessor: 'tradingMark',
  },
  {
    Header: 'M3',
    accessor: 'm3',
  },
  {
    Header: 'M2',
    accessor: 'm2',
  },
  {
    Header: 'M',
    accessor: 'm',
  },
  {
    Header: 'Width  in array',
    accessor: 'widthInArray',
  },
  {
    Header: 'M3 in array',
    accessor: 'm3InArray',
  },
  {
    Header: 'Density dry max',
    accessor: 'densityDryMax',
  },
  {
    Header: 'Density dry def',
    accessor: 'densityDryDef',
  },
  {
    Header: 'Humidity',
    accessor: 'humidity',
  },
  {
    Header: 'Density huminity max',
    accessor: 'densityHuminityMax',
  },
  {
    Header: 'Density huminity def',
    accessor: 'densityHuminityDef',
  },
  {
    Header: 'Weight max',
    accessor: 'weightMax',
  },
  {
    Header: 'Weight Def',
    accessor: 'weightDef',
  },
  {
    Header: 'Norm of brack',
    accessor: 'normOfBrack',
  },
  {
    Header: 'Coefficient of free',
    accessor: 'coefficientOfFree',
  },
];

function Products() {
  const dispatch = useDispatch();
  const { modal, setModal, modalUpdate } = useProjectContext();
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => products, [products]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    dispatch(getAllProducts(user));
    console.log('PRODUCT', products);
  }, [modalUpdate]);
  return (
    <>
      <ModalWindow list={COLUMNS} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...restProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody key={getTableBodyProps().key} {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...restProps } = row.getRowProps();

            return (
              <tr key={key} {...restProps}>
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
    </>
  );
}
export default Products;
