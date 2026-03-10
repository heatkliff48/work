import React, { useCallback, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import Select from 'react-select';
import {
  addNewWarehouse,
  updListOfOrderedProduction,
} from '#components/redux/actions/warehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const WarehouseAddModal = React.memo(
  ({ isOpen, toggle, COLUMNS_WAREHOUSE }) => {
    const { COLUMNS, latestProducts } = useProductsContext();
    const {
      list_of_ordered_production,
      getWarehouseArticle,
      COLUMNS_WAREHOUSE_ADD_MODAL,
    } = useWarehouseContext();
    const dispatch = useDispatch();

    const [warehouseData, setWarehouseData] = useState([]);
    const [warehouse_loc, setWarehouseLoc] = useState('local');

    const haveProduct = useMemo(() => {
      return warehouseData?.product_article ?? false;
    }, [warehouseData?.product_article]);

    const warehouseLocOpt = [
      { value: 'local', label: 'Local' },
      { value: 'remote', label: 'Remote' },
    ];

    const type_select = [
      {
        value: 'OK',
        label: 'OK',
      },
      {
        value: 'Remnants',
        label: 'Remnants',
      },
      {
        value: 'Sorting',
        label: 'Sorting',
      },
    ];

    function extractProductTitle(description) {
      if (!description) return '';
      const match = description.match(/BAUBLOCK®\s*(.+?)\s*(?:Medidas|$)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
      return description;
    }

    const handlerAddProductWarehouse = useCallback(
      (row) => {
        const product = latestProducts.find((el) => el.id === row.original.id);
        const warehouse_article = getWarehouseArticle(product);
        const description = extractProductTitle(product?.description);

        setWarehouseData((prev) => ({
          ...prev,
          product_article: product.article,
          description,
          article: warehouse_article,
        }));
      },
      [latestProducts],
    );

    const handleWareHouseInput = (e) => {
      setWarehouseData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSelectChange = (selectedOption) => {
      setWarehouseData((prev) => ({
        ...prev,
        warehouse_loc: selectedOption.value,
      }));

      setWarehouseLoc(selectedOption.value);
    };

    const getSelectedOption = (accessor) => {
      if (!warehouseData?.warehouse_loc)
        setWarehouseData((prev) => ({
          ...prev,
          warehouse_loc: warehouseLocOpt[0].value,
        }));

      const selectedOption = warehouseLocOpt.find(
        (option) => option.value === warehouseData?.[accessor],
      );

      return selectedOption || warehouseLocOpt[0];
    };

    const handleSelectTypeChange = (selectedOption) => {
      setWarehouseData((prev) => ({ ...prev, type: selectedOption.value }));

      setWarehouseLoc(selectedOption.value);
    };

    const getSelectedTypeOption = (accessor) => {
      if (!warehouseData?.type)
        setWarehouseData((prev) => ({
          ...prev,
          type: type_select[0].value,
        }));

      const selectedOption = type_select.find(
        (option) => option.value === warehouseData?.[accessor],
      );

      return selectedOption || type_select[0];
    };

    const addProductOrder = async () => {
      const { product_article, quantity_ok, quantity_sorting } = warehouseData;

      const free_quantity_remaining = quantity_ok;
      const ordered_quantity = 0;

      // 1. Фильтруем резервы для текущего product_article
      const reservedProducts =
        list_of_ordered_production?.filter(
          (item) => item.product_article === product_article,
        ) || [];

      // 2. Сколько осталось "свободного" количества и сколько всего свободной продукции было зарезервированно сразу
      let remainingFreeQty = parseInt(free_quantity_remaining);
      let summReserve = 0;

      // 3. Обходим каждый резерв и корректируем остатки
      const updatedReserves = reservedProducts.map((reservedItem) => {
        if (reservedItem.product_article !== product_article) {
          return reservedItem; // Не трогаем резервы других товаров
        }

        // Если новый товар уже "исчерпан" и кол-во паллет совпадает с кол-вом зарезервированных, ничего не меняем, если исчерпан и кол-во паллет больше кол-ва зарезервированных, то прибавляем к существующему резерву новый и смотрим, чтобы он не выходил за предел кол-ва паллет общего.
        if (remainingFreeQty <= 0) {
          if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
            return reservedItem;
          } else if (
            reservedItem.quantity > reservedItem.quantity_in_warehouse
          ) {
            return {
              ...reservedItem,
              quantity_in_warehouse: Math.min(
                reservedItem.quantity_in_warehouse + parseInt(ordered_quantity),
                reservedItem.quantity,
              ),
            };
          }
        }

        // Сколько можно зарезервировать из нового товара для этого резерва
        const deducted = Math.min(
          reservedItem.quantity -
            reservedItem.quantity_in_warehouse -
            parseInt(ordered_quantity), // Сколько нужно для этого резерва
          remainingFreeQty, // Сколько доступно в новом товаре
        );

        // Уменьшаем остаток нового товара
        remainingFreeQty -= deducted;
        summReserve += deducted;

        // Возвращаем обновленный резерв
        return {
          ...reservedItem,
          quantity_in_warehouse:
            reservedItem.quantity_in_warehouse +
            parseInt(ordered_quantity) +
            deducted,
        };
      });

      const { description, ...dataWithoutDescription } = warehouseData;

      dispatch(
        addNewWarehouse({
          ...dataWithoutDescription,
          sorting: 0,
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: parseInt(ordered_quantity) + summReserve,
          total_quantity:
            parseInt(ordered_quantity) + summReserve + remainingFreeQty,
          type: 'OK',
        }),
      );
      if (quantity_sorting > 0) {
        dispatch(
          addNewWarehouse({
            ...dataWithoutDescription,
            free_quantity_remaining: 0,
            ordered_quantity: 0,
            total_quantity: quantity_sorting,
            sorting: quantity_sorting,
            type: 'Sorting',
          }),
        );
      }
      for (const ordered_production of updatedReserves) {
        await dispatch(updListOfOrderedProduction(ordered_production));
      }
      setWarehouseData({});
      toggle();
    };

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {haveProduct ? (
              <p>Fill in the remaining parameters</p>
            ) : (
              <p>Select product</p>
            )}
          </ModalHeader>
          <ModalBody>
            {haveProduct ? (
              <>
                {COLUMNS_WAREHOUSE_ADD_MODAL.map((el) => {
                  if (
                    el.accessor === 'sorting' ||
                    el.accessor === 'total_m3' ||
                    el.accessor === 'type' ||
                    el.accessor === 'product_article'
                    // &&
                    // warehouseData.type !== 'Sorting'
                  ) {
                    return;
                  }
                  if (
                    el.accessor === 'article' ||
                    el.accessor === 'product_article'
                  )
                    return (
                      <>
                        <ModalBody>{el.Header}:</ModalBody>
                        <input
                          type="text"
                          id={el.accessor}
                          name={el.accessor}
                          value={warehouseData[el.accessor] || ''}
                          key={el.id}
                          readOnly
                        />
                      </>
                    );
                  if (
                    el.accessor === 'free_quantity_remaining' ||
                    el.accessor === 'ordered_quantity'
                  )
                    return null;
                  if (el.accessor === 'warehouse_loc')
                    return (
                      <>
                        <ModalBody>{el.Header}:</ModalBody>
                        <Select
                          defaultValue={getSelectedOption(el.accessor)}
                          onChange={(v) => {
                            handleSelectChange(v);
                          }}
                          options={warehouseLocOpt}
                          key={el.id}
                        />
                      </>
                    );

                  // if (el.accessor === 'type')
                  //   return (
                  //     <>
                  //       <ModalBody>{el.Header}:</ModalBody>
                  //       <Select
                  //         defaultValue={getSelectedTypeOption(el.accessor)}
                  //         onChange={(v) => {
                  //           handleSelectTypeChange(v);
                  //         }}
                  //         options={type_select}
                  //         key={el.id}
                  //       />
                  //     </>
                  //   );
                  return (
                    <InputField
                      key={el.id}
                      el={el}
                      inputValue={warehouseData}
                      inputValueChange={handleWareHouseInput}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <Table
                  COLUMN_DATA={COLUMNS}
                  dataOfTable={latestProducts}
                  // userAccess={userAccess}
                  onClickButton={() => {}}
                  buttonText={''}
                  tableName={'Orders'}
                  handleRowClick={(row) => {
                    handlerAddProductWarehouse(row);
                  }}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <button onClick={addProductOrder}>Add product</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
);
export default WarehouseAddModal;
