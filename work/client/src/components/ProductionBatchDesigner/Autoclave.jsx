import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  getAutoclave,
  saveAutoclave,
} from '#components/redux/actions/autoclaveAction.js';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function Autoclave({ autoclave }) {
  const [selectedId, setSelectedId] = useState(null);
  const { setAutoclave } = useOrderContext();

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

  const addArrayAfterId = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      const lastIndex = flatAutoclave.map((el) => el.id).lastIndexOf(selectedId);

      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }

      const newElement = { ...flatAutoclave[lastIndex] };
      flatAutoclave.splice(lastIndex + 1, 0, newElement);

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();

      const firstIndex = flatAutoclave.findIndex((el) => el.id === selectedId);

      if (firstIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }
      flatAutoclave.splice(firstIndex, 1);

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const deleteBatchById = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const moveBatchLater = () => {
    if (!selectedId) return;

    // setAutoclave((prevAutoclave) => {
    //   let flatAutoclave = prevAutoclave.flat();
    //   const batchToMove = flatAutoclave.filter((el) => el.id === selectedId);

    //   flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);

    //   const lastIndexOfOtherId = flatAutoclave
    //     .map((el) => el.id)
    //     .lastIndexOf((id) => id !== selectedId);

    //   flatAutoclave.splice(lastIndexOfOtherId + 1, 0, ...batchToMove);
    //   const newAutoclave = [];
    //   while (flatAutoclave.length) {
    //     newAutoclave.push(flatAutoclave.splice(0, 21));
    //   }

    //   return newAutoclave;
    // });
  };

  const onSaveHandler = () => {
    dispatch(saveAutoclave(autoclave));
  };

  useEffect(() => {
    dispatch(getAutoclave());
  }, [dispatch]);

  return (
    <div>
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
                onClick={() => setSelectedId(el.id)}
              >
                {el.id !== null ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="autoclave-buttons-container">
        <button onClick={deleteBatchById}>Удалить партию</button>
        <button onClick={deleteArrayById}>Удалить Массив</button>
        <button onClick={addArrayAfterId}>Добавить массив</button>
        <button onClick={moveBatchLater}>Поставить партию позже</button>
        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default Autoclave;
