import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  getAutoclave,
  saveAutoclave,
} from '#components/redux/actions/autoclaveAction.js';
import {
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewBatchOutside } from '#components/redux/actions/batchOutsideAction.js';

function Autoclave({ autoclave, quantity_pallets }) {
  const dispatch = useDispatch();
  const { setAutoclave } = useOrderContext();
  const [selectedId, setSelectedId] = useState(null);
  const [idColorMap, setIdColorMap] = useState({});

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );

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
    const { id, cakes_in_batch } = batchDesigner.find((el) => el.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();

      const firstIndex = flatAutoclave.findIndex((el) => el.id === selectedId);

      if (firstIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }
      flatAutoclave.splice(firstIndex, 1);
      const count = flatAutoclave.filter((el) => el.id === id).length;

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }
      if (cakes_in_batch <= count) {
        dispatch(
          updateBatchState({
            id,
            cakes_in_batch: count,
            cakes_residue: 0,
          })
        );
        dispatch(
          unlockButton({
            id,
            isButtonLocked: true,
          })
        );
      } else {
        dispatch(
          updateBatchState({
            id,
            cakes_in_batch: count,
            cakes_residue: cakes_in_batch - count,
          })
        );
        dispatch(
          unlockButton({
            id,
            isButtonLocked: false,
          })
        );
      }

      return newAutoclave;
    });
  };

  const deleteBatchById = () => {
    if (!selectedId) return;
    const { id, cakes_in_batch } = batchDesigner.find((el) => el.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);
      // const count = flatAutoclave.filter((el) => el.id === id).length;

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }
      // if()

      return newAutoclave;
    });

    dispatch(
      updateBatchState({
        id,
        cakes_in_batch: 0,
        cakes_residue: cakes_in_batch,
      })
    );

    dispatch(
      unlockButton({
        id: selectedId,
        isButtonLocked: false,
      })
    );
  };

  const moveBatchLater = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      // Преобразуем двухмерный массив в одномерный
      let flatAutoclave = prevAutoclave.flat();

      // Находим все элементы с выбранным id
      const batchToMove = flatAutoclave.filter((el) => el.id === selectedId);

      // Оставляем в массиве только элементы с другим id
      flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);

      // Находим индекс последнего элемента с другим id
      const lastIndexOfOtherId = flatAutoclave
        .map((el) => el.id)
        .lastIndexOf(flatAutoclave.find((el) => el.id !== selectedId)?.id);

      // Вставляем партию после последнего элемента с другим id
      flatAutoclave.splice(lastIndexOfOtherId + 1, 0, ...batchToMove);

      // Преобразуем одномерный массив обратно в двухмерный
      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21)); // 21 — количество элементов в каждой строке
      }

      return newAutoclave;
    });
  };

  const onSaveHandler = () => {
    dispatch(saveAutoclave(autoclave));
    // const last_entry =
    //   list_of_ordered_production[list_of_ordered_production.length - 1];
    // const buff = last_entry?.quantity;
    // const quantity_ordered = buff;
    // const quantity_free = quantity_pallets - buff;
    // const batchOutside = {
    //   id_warehouse_batch: 'w',
    //   id_list_of_ordered_production: last_entry?.id,
    //   quantity_pallets,
    //   quantity_ordered,
    //   quantity_free,
    //   on_check: 0,
    // };
    // dispatch(addNewBatchOutside(batchOutside));
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
        {selectedId && <div>Выбран массив с id: {selectedId}</div>}
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
