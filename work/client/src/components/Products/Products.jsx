import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import './products.css';
import { getAllProducts } from '../redux/actions/productsAction';
import { setModalWindow } from '../redux/actions/modalAction';
import ModalWindow from '../ModalWindow/ModalWindow';
import { SET_MODAL } from '../redux/types/modalTypes';
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
const MOCK_DATA = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'dgeibel0@twitter.com',
    gender: 'Male',
    date_of_birth: '1990-05-12',
    age: 25,
    country: 'Америка',
    phone: '1111111',
  },
];

function Products() {
  const dispatch = useDispatch();
  // const products = useSelector((state) => state.products);
  // console.log('PRODUCTS', products);
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);
  return (
    <>
      <ModalWindow />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => dispatch(setModalWindow(true))}>Add product new</button>
    </>
  );
}
export default Products;
