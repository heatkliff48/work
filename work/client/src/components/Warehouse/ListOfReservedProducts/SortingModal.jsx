import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '#components/Table/Table';
import Select from 'react-select';
import { TextSearchFilter } from '#components/Table/filters.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import {
  addNewWarehouse,
  updateRemainingStock,
  updListOfOrderedProduction,
} from '#components/redux/actions/warehouseAction.js';

function SortingModal(props) {
  const { latestProducts } = useProductsContext();
  const { warehouse_data, list_of_ordered_production } = useWarehouseContext();
  const { warehouseInfoCurIdModal } = useModalContext();

  const [sortingInput, setSortingInput] = useState({});
  const [errors, setErrors] = useState({});

  const sorting_inputs = [
    {
      Header: 'OK, pall',
      accessor: 'ok',
    },
    {
      Header: 'NOT OK, pall',
      accessor: 'not_ok',
    },
    {
      Header: 'Sorting, pall',
      accessor: 'sorting',
    },
  ];

  const curr_warehouse = warehouse_data.find(
    (wh) => wh.id === warehouseInfoCurIdModal,
  );

  const dispatch = useDispatch();

  const handleSortingInputChange = useCallback((e) => {
    let processedValue = e.target.value;
    if (typeof e.target.value === 'string') {
      processedValue = e.target.value.replace(/(\d+),(\d*)/g, '$1.$2');
    }

    setSortingInput((prev) => ({
      ...prev,
      [e.target.name]: processedValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    let summ = 0;
    const limit = curr_warehouse.total_quantity;

    sorting_inputs.forEach(({ accessor }) => {
      const value = sortingInput?.[accessor];

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ''
      ) {
        newErrors[accessor] = `This field is required`;
        return;
      }

      const num = Number(value);
      if (isNaN(num) || num < 0) {
        newErrors[accessor] = `This field must contain a non-negative number`;
      }

      summ += num;
      if (summ > limit) {
        newErrors[accessor] =
          `Summ cannot be larger than sorting quantity (${limit})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const warehouse_entries = warehouse_data.filter(
      (el) => el.article === curr_warehouse?.article,
    );

    console.log(
      warehouse_entries,
      'warehouse_entries SortingModal.jsx line 69',
    );

    const ok_warehouse_entrie = warehouse_entries.find((el) =>
      el.type?.includes('OK'),
    );

    // 1. Фильтруем резервы для текущего product_article

    const reservedProducts =
      list_of_ordered_production?.filter(
        (item) => item.product_article === curr_warehouse?.product_article,
      ) || [];

    // 2. Сколько осталось "свободного" количества

    let remainingFreeQty = Number(sortingInput.ok);

    let summReserve = 0;

    // 3. Обходим каждый резерв и корректируем остатки

    const updatedReserves = reservedProducts.map((reservedItem) => {
      if (reservedItem.product_article !== curr_warehouse?.product_article) {
        return reservedItem; // Не трогаем резервы других товаров
      }

      // Сколько можно зарезервировать из нового товара для этого резерва

      const deducted = Math.min(
        reservedItem.quantity - reservedItem.quantity_in_warehouse, // Сколько нужно для этого резерва

        remainingFreeQty, // Сколько доступно в новом товаре
      );

      // Уменьшаем остаток нового товара

      remainingFreeQty -= deducted;

      summReserve += deducted;

      // ИСПРАВЛЕНИЕ: Правильное суммирование количества на складе

      const baseQuantityInWarehouse = reservedItem.quantity_in_warehouse;

      return {
        ...reservedItem,

        // Добавляем к существующему количеству только новое из свободного

        quantity_in_warehouse: baseQuantityInWarehouse + deducted,
      };
    });

    // Проверки на корректность

    if (summReserve < 0) {
      alert('Error: summReserve cannot be negative.');

      return;
    }

    const calculatedOrderedQuantity =
      ok_warehouse_entrie?.ordered_quantity + summReserve || summReserve;

    // Обновляем склад

    if (ok_warehouse_entrie) {
      dispatch(
        updateRemainingStock({
          warehouse_id: ok_warehouse_entrie.id,
          free_quantity_remaining:
            ok_warehouse_entrie.free_quantity_remaining + remainingFreeQty,
          ordered_quantity: calculatedOrderedQuantity,
          total_quantity:
            ok_warehouse_entrie.total_quantity +
            calculatedOrderedQuantity +
            remainingFreeQty,
        }),
      );
    } else {
      dispatch(
        addNewWarehouse({
          product_article: curr_warehouse?.product_article,
          article: curr_warehouse?.article,
          warehouse_loc: 'local',
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: calculatedOrderedQuantity,
          total_quantity: calculatedOrderedQuantity + remainingFreeQty,
          type: 'OK',
          sorting: 0,
        }),
      );
    }

    for (const ordered_production of updatedReserves) {
      await dispatch(updListOfOrderedProduction(ordered_production));
    }

    const not_ok_warehouse_entrie = warehouse_entries.find((el) =>
      el.type?.includes('NOT OK'),
    );

    if (not_ok_warehouse_entrie) {
      dispatch(
        updateRemainingStock({
          warehouse_id: not_ok_warehouse_entrie.id,
          free_quantity_remaining: 0,
          ordered_quantity: 0,
          total_quantity:
            not_ok_warehouse_entrie.total_quantity +
            Number(sortingInput.not_ok),
        }),
      );
    } else {
      dispatch(
        addNewWarehouse({
          product_article: curr_warehouse?.product_article,
          article: curr_warehouse?.article,
          warehouse_loc: 'local',
          free_quantity_remaining: 0,
          ordered_quantity: 0,
          total_quantity: sortingInput.not_ok,
          type: 'NOT OK',
          sorting: 0,
        }),
      );
    }

    const sorting_warehouse_entrie = warehouse_entries.find((el) =>
      el.type?.includes('Sorting'),
    );

    if (sorting_warehouse_entrie) {
      dispatch(
        updateRemainingStock({
          warehouse_id: sorting_warehouse_entrie.id,
          free_quantity_remaining: 0,
          ordered_quantity: 0,
          total_quantity: sortingInput.sorting,
          sorting: sortingInput.sorting,
        }),
      );
    } else {
      dispatch(
        addNewWarehouse({
          product_article: curr_warehouse?.product_article,
          article: curr_warehouse?.article,
          warehouse_loc: 'local',
          free_quantity_remaining: 0,
          ordered_quantity: 0,
          total_quantity: sortingInput.sorting,
          type: 'Sorting',
          sorting: 0,
        }),
      );
    }

    setSortingInput({});

    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Sorting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="sortingModalForm"
          className="w-full max-w-sm"
          onSubmit={(e) => {
            onSubmitForm(e);
          }}
        >
          <Row>
            {sorting_inputs.map((el) => {
              return (
                <Col>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        for="version"
                      >
                        {el.Header}
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={sortingInput[el.accessor] || ''}
                        onChange={(e) => handleSortingInputChange(e)}
                      />
                      {errors[el.accessor] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[el.accessor]}
                        </p>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button form="sortingModalForm" type="submit">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowSortingModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Sorting
      </Button>

      <SortingModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowSortingModal;
