import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  getAutoclave,
  saveAutoclave,
} from '#components/redux/actions/autoclaveAction.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Autoclave({ autoclave }) {
  const dispatch = useDispatch();
  // const autoclave = useSelector((state) => state.autoclave); // Получаем данные autoclave из Redux

  const getClassForAutoclave = (num) => {
    switch (num) {
      case 0:
        return 'cell-white';
      case 1:
        return 'cell-red';
      case 2:
        return 'cell-green';
      case 3:
        return 'cell-orange';
      case 4:
        return 'cell-black';
      case 5:
        return 'cell-yellow';
      case 6:
        return 'cell-gray';
      case 7:
        return 'cell-purple';
      case 8:
        return 'cell-blue';
      case 9:
        return 'cell-pink';
      default:
        return 'cell-white';
    }
  };

  // Разбиваем autoclave на подмассивы по 21 объекту
  // const filledAutoclave = useMemo(() => {
  //   console.log('filledAutoclave autoclave', autoclave);
  //   if (!Array.isArray(autoclave)) return [];
  //   const chunks = [];
  //   for (let i = 0; i < autoclave.length; i += 21) {
  //     chunks.push(autoclave.slice(i, i + 21));
  //   }
  //   return chunks;
  // }, [autoclave]);

  const onSaveHandler = () => {
    dispatch(saveAutoclave(autoclave));
  };

  useEffect(() => {
    dispatch(getAutoclave());

    console.log('AUTOCLAVE', autoclave);
  }, [dispatch]);

  return (
    <div className="autoclave-container">
      {autoclave?.map((autoclaveRow, rowIndex) => (
        <div key={rowIndex} className="autoclave-row">
          <h3 className="autoclave-header">Автоклав {rowIndex + 1}</h3>
          {autoclaveRow?.map((el, cellIndex) => (
            <div
              key={cellIndex}
              className={`autoclave-cell ${getClassForAutoclave(
                el.id !== null ? el.status_batch : 0
              )}`}
            >
              {el.id !== null ? `${el.density}x${el.width}` : ''}
            </div>
          ))}
        </div>
      ))}
      <button onClick={onSaveHandler}>Save</button>
    </div>
  );
}

export default Autoclave;
