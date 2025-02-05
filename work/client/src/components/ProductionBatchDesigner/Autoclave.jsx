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
      console.log('flatAutoclave[lastIndex]', flatAutoclave[lastIndex]);
      console.log('lastIndex', lastIndex);

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

  // useEffect(() => {
  //   console.log('batchDesigner', batchDesigner);
  // }, [batchDesigner]);

  const onSaveHandler = async () => {
    let positionInBatch = 1;

    batchOrderIDs.forEach((id) => {
      const product = productionBatchDesigner.find((p) => p.id === id);

      dispatch(
        addNewBatchOutside({
          product_article: product.article,
          quantity_pallets: product.cakes_in_batch * 3,
          quantity_free: product.free_product_package,
          position_in_autoclave: positionInBatch,
        })
      );
      positionInBatch = positionInBatch + product.cakes_in_batch;
    });

    // !!! add setQuantityPallets to other Autoclave add/delete actions/functions

    // for (const id in quantityPallets) {
    //   if (id !== undefined) {
    //     const { quantity } = list_of_ordered_production.find(
    //       (el) => el.id === Number(id)
    //     );

    //     const quantity_free = quantityPallets[id] - quantity;

    //     console.log('quantityPallets', quantityPallets[id]);
    //     console.log('quantity_free', quantity_free);

    //     // dispatch(
    //     //   addNewBatchOutside({
    //     //     quantity_pallets: quantityPallets[id],
    //     //     quantity_free,
    //     //   })
    //     // );

    //     // if (quantityPallets[id] === 0) {
    //     //   const currentBatch = batchOutside.find(
    //     //     (el) => el.id_list_of_ordered_production === Number(id)
    //     //   );
    //     //   dispatch(deleteBatchOutside(currentBatch?.id));
    //     //   setQuantityPallets((prev) => {
    //     //     return {
    //     //       ...prev,
    //     //       [Number(id)]: 0,
    //     //     };
    //     //   });
    //     // } else if (
    //     //   batchOutside.find(
    //     //     (el) => el.id_list_of_ordered_production === Number(id)
    //     //   ) !== undefined
    //     // ) {
    //     //   const currentBatchID = batchOutside.find(
    //     //     (el) => el.id_list_of_ordered_production === Number(id)
    //     //   ).id;
    //     //   dispatch(
    //     //     updateBatchOutside({
    //     //       id: currentBatchID,
    //     //       id_warehouse_batch: 'w',
    //     //       id_list_of_ordered_production: Number(id),
    //     //       quantity_pallets: quantityPallets[id],
    //     //       quantity_ordered: quantity,
    //     //       quantity_free,
    //     //       on_check: 0,
    //     //     })
    //     //   );
    //     //   setQuantityPallets((prev) => {
    //     //     return {
    //     //       ...prev,
    //     //       [Number(id)]: quantityPallets[id],
    //     //     };
    //     //   });
    //     // } else {
    //     //   dispatch(
    //     //     addNewBatchOutside({
    //     //       id_list_of_ordered_production: Number(id),
    //     //       quantity_pallets: quantityPallets[id],
    //     //       quantity_ordered: quantity,
    //     //       quantity_free,
    //     //       on_check: 0,
    //     //     })
    //     //   );
    //     // }
    //   }
    // }
  };

  useEffect(() => {
    setAutoclave(acData);
  }, [acData]);

  // ------------- ne udalay pls

  // useEffect(() => {
  //   // console.log('batchOutside', batchOutside);
  //   // console.log('list_of_ordered_production', list_of_ordered_production);
  //   if (batchOutside) {
  //     list_of_ordered_production.forEach((ordered) => {
  //       // console.log('id', ordered);
  //       const batch = batchOutside.find(
  //         (el) => el.id_list_of_ordered_production === Number(ordered.id)
  //       );
  //       if (batch) {
  //         console.log('batch', batch);
  //         console.log('ordered.id', ordered.id);
  //         setQuantityPallets((prev) => {
  //           return {
  //             ...prev,
  //             [ordered.id]: batch.quantity_pallets,
  //           };
  //         });
  //       }
  //     });
  //   }
  // }, [batchOutside]);

  // useEffect(() => {
  //   console.log('quantityPallets', quantityPallets);
  // }, [quantityPallets]);

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
