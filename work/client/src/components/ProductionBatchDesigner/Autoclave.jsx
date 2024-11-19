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
import {
  addNewBatchOutside,
  deleteBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';

function Autoclave({ autoclave, quantity_pallets, batchFromBD }) {
  const dispatch = useDispatch();
  const { setAutoclave } = useOrderContext();
  const [selectedId, setSelectedId] = useState(null);
  const [idColorMap, setIdColorMap] = useState({});
  const [quantityPallets, setQuantityPallets] = useState(quantity_pallets);

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );
  const batchOutside = useSelector((state) => state.batchOutside);

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
    const { id } = batchDesigner?.find((el) => el?.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      const lastIndex = flatAutoclave.map((el) => el.id).lastIndexOf(selectedId);

      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }

      const newElement = { ...flatAutoclave[lastIndex] };
      flatAutoclave.splice(lastIndex + 1, 0, newElement);
      const count = flatAutoclave.filter((el) => el.id === id).length;

      dispatch(
        updateBatchState({
          id,
          cakes_in_batch: count,
          cakes_residue: 0,
        })
      );

      setQuantityPallets((prev) => {
        return {
          ...prev,
          [id]: count * 3,
        };
      });

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;

    const { id, cakes_in_batch } = batchDesigner?.find(
      (el) => el?.id === selectedId
    );

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
      const batchBD = batchFromBD.find((el) => el.id === selectedId);
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
        setQuantityPallets((prev) => {
          return {
            ...prev,
            [id]: count,
          };
        });
      } else {
        dispatch(
          updateBatchState({
            id,
            cakes_in_batch: count,
            cakes_residue: batchBD.cakes_in_batch - count,
          })
        );

        dispatch(
          unlockButton({
            id,
            isButtonLocked: false,
          })
        );

        setQuantityPallets((prev) => {
          return {
            ...prev,
            [id]: count * 3,
          };
        });
      }

      return newAutoclave;
    });
  };

  const deleteBatchById = () => {
    if (!selectedId) return;
    const { id } = batchDesigner?.find((el) => el.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });

    const { cakes_residue } = batchFromBD.find((el) => el.id === selectedId);
    dispatch(
      updateBatchState({
        id,
        cakes_in_batch: 0,
        cakes_residue: cakes_residue,
      })
    );

    setQuantityPallets((prev) => {
      return {
        ...prev,
        [id]: 0,
      };
    });

    dispatch(
      unlockButton({
        id,
        isButtonLocked: false,
      })
    );
  };

  const moveBatchLater = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      const batchToMove = flatAutoclave.filter((el) => el.id === selectedId);
      flatAutoclave = flatAutoclave.filter((el) => el.id !== selectedId);

      const lastIndexOfOtherId = flatAutoclave
        .map((el) => el.id)
        .lastIndexOf(flatAutoclave.find((el) => el.id !== selectedId)?.id);

      flatAutoclave.splice(lastIndexOfOtherId + 1, 0, ...batchToMove);

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const fillingAutoclave = () => {
    if (!selectedId) return;

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();
      const fillingElement = flatAutoclave.find((el) => el.id === selectedId);
      let count = 0;

      return prevAutoclave.map((prevAutoclave) => {
        const emptyIndex = prevAutoclave.findIndex((el) => !el.id);
        if (emptyIndex >= 1) {
          return prevAutoclave.map((el, i) => {
            if (i >= emptyIndex) {
              count++;
              return fillingElement;
            } else {
              return el;
            }
          });
        }

        // ----------------------- TUT KAKAYA TO ZALUPA S CIFRAMI-----------------------

        dispatch(
          updateBatchState({
            selectedId,
            cakes_in_batch: quantityPallets[selectedId] / 3 + count,
            // cakes_residue: 0,
          })
        );

        setQuantityPallets((prev) => {
          return {
            ...prev,
            [selectedId]: quantityPallets[selectedId] + count * 3,
          };
        });
        return prevAutoclave;
      });
    });
  };

  const onSaveHandler = () => {
    dispatch(saveAutoclave(autoclave));
    Object.keys(quantityPallets).forEach((key) =>
      quantityPallets[key] === undefined ? delete quantityPallets[key] : {}
    ); // delete undefined from obj

    // !!! add setQuantityPallets to other Autoclave add/delete actions/functions

    for (const id in quantityPallets) {
      if (id !== undefined) {

        const { quantity } = list_of_ordered_production.find(
          (el) => el.id == Number(id)
        );

        const quantity_free = quantityPallets[id] - quantity;

        if (quantityPallets[id] === 0) {
          const currentBatch = batchOutside.find(
            (el) => el.id_list_of_ordered_production === Number(id)
          );
          dispatch(deleteBatchOutside(currentBatch.id));
        } else if (
          batchOutside.find(
            (el) => el.id_list_of_ordered_production === Number(id)
          ) !== undefined
        ) {
          dispatch(
            updateBatchOutside({
              id: Number(id),
              id_warehouse_batch: 'w',
              id_list_of_ordered_production: id,
              quantity_pallets: quantityPallets[id],
              quantity_ordered: quantity,
              quantity_free,
              on_check: 0,
            })
          );
        } else {
          dispatch(
            addNewBatchOutside({
              id_warehouse_batch: 'w',
              id_list_of_ordered_production: id,
              quantity_pallets: quantityPallets[id],
              quantity_ordered: quantity,
              quantity_free,
              on_check: 0,
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getAutoclave());
  }, [dispatch]);

  useEffect(() => {
    Object.keys(quantity_pallets).forEach((id) =>
      setQuantityPallets((prev) => {
        return {
          ...prev,
          [id]: quantity_pallets[id],
        };
      })
    );

  }, [quantity_pallets]);

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
                  el?.id !== null ? assignColorToId(el?.id) : 0
                )}`}
                onClick={() => setSelectedId(el?.id)}
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
        <button onClick={fillingAutoclave}>Заполнить Автоклав</button>
        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default Autoclave;
