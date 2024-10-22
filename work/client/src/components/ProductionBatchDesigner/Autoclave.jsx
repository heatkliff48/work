import {
  getAutoclave,
  saveAutoclave,
} from '#components/redux/actions/autoclaveAction.js';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function Autoclave({ autoclave }) {
  const dispatch = useDispatch();

  // Объект для отслеживания идентификаторов и присвоенных цветов
  const [idColorMap, setIdColorMap] = useState({});

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

  const assignColorToId = (id) => {
    if (idColorMap[id] !== undefined) {
      return idColorMap[id];
    }

    const nextColor = Object.keys(idColorMap).length % 10;
    setIdColorMap((prevMap) => ({
      ...prevMap,
      [id]: nextColor,
    }));

    return nextColor;
  };

  const onSaveHandler = () => {
    dispatch(saveAutoclave(autoclave));
  };

  useEffect(() => {
    dispatch(getAutoclave());
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
                el.id !== null ? assignColorToId(el.id) : 0
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
