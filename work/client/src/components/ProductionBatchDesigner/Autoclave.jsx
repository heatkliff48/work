import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import {
  addNewBatchOutside,
  deleteBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Autoclave({ acData, batchFromBD }) {
  const dispatch = useDispatch();
  const {
    setAutoclave,
    quantityPallets,
    setQuantityPallets,
    autoclave,
    productionBatchDesigner,
    batchOrderIDs,
    setBatchOrderIDs,
  } = useOrderContext();
  const [selectedId, setSelectedId] = useState(null);
  const [idColorMap, setIdColorMap] = useState({});

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

      setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;

    const { id } = batchDesigner?.find((el) => el?.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();

      const firstIndex = flatAutoclave.findIndex((el) => el.id === selectedId);

      if (firstIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }

      flatAutoclave.splice(firstIndex, 1);
      const count = flatAutoclave.filter((el) => el.id === selectedId).length;

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }
      const { cakes_residue } = batchFromBD.find((el) => el.id === selectedId);
      if (cakes_residue <= count) {
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
            [id]: count * 3,
          };
        });
        setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
      } else {
        dispatch(
          updateBatchState({
            id,
            cakes_in_batch: count,
            cakes_residue: cakes_residue - count,
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
        setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
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
    const { cakes_in_batch, cakes_residue } = batchFromBD.find(
      (el) => el.id === selectedId
    );
    dispatch(
      updateBatchState({
        id,
        cakes_in_batch,
        cakes_residue,
      })
    );

    setQuantityPallets((prev) => {
      return {
        ...prev,
        [id]: 0,
      };
    });

    setBatchOrderIDs((prev) => prev.filter((item) => item !== id));

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
    const { id } = batchDesigner?.find((el) => el?.id === selectedId);

    setAutoclave((prevAutoclave) => {
      let flatAutoclave = prevAutoclave.flat();

      const lastIndex = flatAutoclave.map((el) => el.id).lastIndexOf(selectedId);

      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prevAutoclave;
      }
      const fillingElement = flatAutoclave.find((el) => el.id === selectedId);

      for (let i = lastIndex % 21; i < 20; i++) {
        flatAutoclave.splice(lastIndex + 1, 0, fillingElement);
      }

      const count = flatAutoclave.filter((el) => el.id === id).length;

      dispatch(
        updateBatchState({
          id: selectedId,
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

      setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));

      const newAutoclave = [];
      while (flatAutoclave.length) {
        newAutoclave.push(flatAutoclave.splice(0, 21));
      }

      return newAutoclave;
    });
  };

  const onSaveHandler = async () => {
    let positionInBatch = 1;
    let batchPositions = [];

    batchOrderIDs.forEach((id) => {
      // const product = productionBatchDesigner.find((p) => p.id === id);
      const product = batchDesigner.find((p) => p.id === id);

      if (product) {
        batchPositions.push({
          product,
          positionInBatch, // Store position before updating
        });

        positionInBatch += product.cakes_in_batch;
      }
    });

    const mergedBatchPositions = batchPositions.reduce((acc, current) => {
      const lastItem = acc[acc.length - 1];

      // Check if the last product in the merged array is the same
      if (
        lastItem &&
        lastItem.product.product_article === current.product.product_article &&
        lastItem.product.id_list_of_ordered_production !== null &&
        current.product.id_list_of_ordered_production !== null
      ) {
        // Keep the positionInBatch from the first entry
        lastItem.product.cakes_in_batch += current.product.cakes_in_batch; // Sum cakes_in_batch
      } else {
        // Add a new entry
        acc.push({
          product: { ...current.product },
          positionInBatch: current.positionInBatch, // Keep initial position
        });
      }

      return acc;
    }, []);

    mergedBatchPositions.forEach((position) => {
      dispatch(
        addNewBatchOutside({
          product_article: position.product.article,
          quantity_pallets: position.product.cakes_in_batch * 3,
          quantity_free: position.product.free_product_package ?? null,
          position_in_autoclave: position.positionInBatch,
          id_list_of_ordered_production:
            position.product.id_list_of_ordered_production !== null
              ? position.product.id
              : null,
        })
      );
    });
  };

  useEffect(() => {
    setAutoclave(acData);
  }, [acData]);

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
                  assignColorToId(el?.id)
                )}`}
                onClick={() => {
                  setSelectedId(el?.id);
                }}
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
