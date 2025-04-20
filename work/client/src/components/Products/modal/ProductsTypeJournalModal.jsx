import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import './styles.css';
import {
  addNewAnchor,
  addNewDryMixesJournal,
  addNewRelatedMaterialsJournal,
  addNewTool,
} from '#components/redux/actions/productsTypeJournalAction.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

function ProductsTypeJournalModal(props) {
  const {
    unitsOfMeasurementOptions,
    typeOfMixOptions,
    placeOfProductionOptions,
    dryMixesJournal,
    relatedMaterialsJournal,
    anchor,
    tool,
  } = useProductsTypeJournalContext();
  const [productsTypeJournalInput, setProductsTypeJournalInput] = useState({
    // type_of_mix: 0,
    // place_of_production: 0,
  });

  const [errors, setErrors] = useState({});

  const requiredFieldsDryMix = [
    'name',
    'place_of_production',
    'price_per_unit',
    'bag_weight',
    'units_per_pallet',
  ];

  const requiredFieldsRelatedMaterial = [
    'name',
    'place_of_production',
    'price_per_unit',
  ];

  const requiredFieldsAnchors = [
    'name',
    'place_of_production',
    'price_per_unit',
    'boxes_on_a_pallet',
    'box_weight',
    'pieces_per_unit',
  ];

  const requiredFieldsTools = [
    'name',
    'place_of_production',
    'price_per_unit',
    'piece_weight',
  ];

  const dispatch = useDispatch();

  const handleProductsTypeJournalInputChange = useCallback((e) => {
    setProductsTypeJournalInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }, []);

  useEffect(() => {
    const { bag_weight, units_per_pallet } = productsTypeJournalInput;
    if (bag_weight && units_per_pallet) {
      const palletWeight =
        parseFloat(bag_weight) * parseFloat(units_per_pallet) + 23;
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        pallet_weight: palletWeight,
      }));
    }
  }, [
    productsTypeJournalInput.bag_weight,
    productsTypeJournalInput.units_per_pallet,
  ]);

  useEffect(() => {
    const { price_per_unit, bag_weight } = productsTypeJournalInput;
    if (price_per_unit && bag_weight) {
      const pricePerKilo = parseFloat(price_per_unit) / parseFloat(bag_weight);
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        price_per_kilogram: pricePerKilo,
      }));
    }
  }, [productsTypeJournalInput.price_per_unit, productsTypeJournalInput.bag_weight]);

  useEffect(() => {
    const { boxes_on_a_pallet, box_weight } = productsTypeJournalInput;
    if (boxes_on_a_pallet && box_weight) {
      const palletWeight =
        parseFloat(boxes_on_a_pallet) * parseFloat(box_weight) + 23;
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        pallet_weight: palletWeight,
      }));
    }
  }, [
    productsTypeJournalInput.boxes_on_a_pallet,
    productsTypeJournalInput.box_weight,
  ]);

  const handleProductsTypeJournalSelectChange = (selectedOption, key) => {
    setProductsTypeJournalInput((prev) => ({
      ...prev,
      [key]: selectedOption.value,
    }));
  };

  const getSelectedUnitsOfMeasurementOption = (accessor) => {
    const options = unitsOfMeasurementOptions;
    if (!options) return null;
    const unitsOfMeasurementOption = options.find(
      (option) => option.value === productsTypeJournalInput?.[accessor]
    );
    return unitsOfMeasurementOption || options[0];
  };

  const getSelectedTypeOfMixOption = (accessor) => {
    const options = typeOfMixOptions;
    if (!options) return null;
    const typeOfMixOption = options.find((option) =>
      (option.value == productsTypeJournalInput?.[accessor]) !== undefined
        ? Number(productsTypeJournalInput?.[accessor])
        : undefined
    );
    return typeOfMixOption || options[0];
  };

  const getSelectedPlaceOfProductionOption = (accessor) => {
    const options = placeOfProductionOptions;
    if (!options) return null;
    const placeOfProductionOption = options.find(
      (option) => option.value === productsTypeJournalInput?.[accessor]
    );
    return placeOfProductionOption || options.find((opt) => opt.value === 'ES'); // 'ES' — код Испании
  };

  useEffect(() => {
    const defaultCountry = placeOfProductionOptions.find(
      (opt) => opt.value === 'ES'
    );

    setProductsTypeJournalInput((prev) => ({
      ...prev,
      article: `X.${
        props.target == 1
          ? `M`
          : props.target == 2
          ? `P`
          : props.target == 3
          ? `F`
          : `T`
      }${props?.productCode}`,
      units_of_measurement: unitsOfMeasurementOptions[0].value,
      ...(props.target == 1 && { type_of_mix: typeOfMixOptions[0].value }), // Добавляем только если условие true
      place_of_production:
        defaultCountry?.value || placeOfProductionOptions[0].value,
      product_code: props?.productCode,
      active_status: true,
      version: 1,
    }));
  }, [props.show]);

  function hasMatchingObject(array, newObj, excludedAttrs) {
    return array.findLast((item) => {
      // Получаем все ключи нового объекта, исключая указанные атрибуты
      const keys = Object.keys(newObj).filter((key) => !excludedAttrs.includes(key));
      // Проверяем, что все соответствующие значения совпадают
      return keys.every((key) => {
        // Проверяем, что ключ существует в объекте из массива
        // и его значение совпадает со значением в новом объекте
        return item.hasOwnProperty(key) && item[key] == newObj[key];
      });
    });
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (props.target == 1) {
      requiredFieldsDryMix.forEach((field) => {
        const value = productsTypeJournalInput[field];
        if (!value) {
          newErrors[field] = 'This field cannot be empty';
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const existingProduct = hasMatchingObject(
        dryMixesJournal,
        productsTypeJournalInput,
        [
          'price_per_unit',
          'price_per_kilogram',
          'description',
          'article',
          'product_code',
          'active_status',
          'version',
        ]
      );

      if (existingProduct) {
        dispatch(
          addNewDryMixesJournal({
            ...productsTypeJournalInput,
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          })
        );
      } else {
        dispatch(
          addNewDryMixesJournal({
            ...productsTypeJournalInput,
          })
        );
      }
    } else if (props.target == 2) {
      requiredFieldsRelatedMaterial.forEach((field) => {
        const value = productsTypeJournalInput[field];
        if (!value) {
          newErrors[field] = 'This field cannot be empty';
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const existingProduct = hasMatchingObject(
        relatedMaterialsJournal,
        productsTypeJournalInput,
        [
          'price_per_unit',
          'description',
          'article',
          'product_code',
          'active_status',
          'version',
        ]
      );

      console.log(existingProduct);

      if (existingProduct) {
        dispatch(
          addNewRelatedMaterialsJournal({
            ...productsTypeJournalInput,
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          })
        );
      } else {
        dispatch(
          addNewRelatedMaterialsJournal({
            ...productsTypeJournalInput,
          })
        );
      }
    } else if (props.target == 3) {
      requiredFieldsAnchors.forEach((field) => {
        const value = productsTypeJournalInput[field];
        if (!value) {
          newErrors[field] = 'This field cannot be empty';
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const existingProduct = hasMatchingObject(anchor, productsTypeJournalInput, [
        'price_per_unit',
        'description',
        'article',
        'product_code',
        'active_status',
        'version',
      ]);

      if (existingProduct) {
        dispatch(
          addNewAnchor({
            ...productsTypeJournalInput,
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          })
        );
      } else {
        dispatch(
          addNewAnchor({
            ...productsTypeJournalInput,
          })
        );
      }
    } else if (props.target == 4) {
      requiredFieldsTools.forEach((field) => {
        const value = productsTypeJournalInput[field];
        if (!value) {
          newErrors[field] = 'This field cannot be empty';
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const existingProduct = hasMatchingObject(tool, productsTypeJournalInput, [
        'price_per_unit',
        'description',
        'article',
        'product_code',
        'active_status',
        'version',
      ]);

      if (existingProduct) {
        dispatch(
          addNewTool({
            ...productsTypeJournalInput,
            article: existingProduct.article,
            version: existingProduct.version + 1,
            product_code: existingProduct.product_code,
          })
        );
      } else {
        dispatch(
          addNewTool({
            ...productsTypeJournalInput,
          })
        );
      }
    }

    // setModalShow(false);
    props.onHide();
    setProductsTypeJournalInput({});
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
        <Modal.Title id="contained-modal-title-vcenter">
          Add {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addAuxilaryModal"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <h3></h3>
            <Row>
              {props.table.map((el) => (
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      for="version"
                    >
                      {el.Header === 'Product availability' ? null : el.Header}
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    {el.accessor === 'units_of_measurement' ? (
                      <Select
                        defaultValue={getSelectedUnitsOfMeasurementOption(
                          el.accessor
                        )}
                        onChange={(v) => {
                          handleProductsTypeJournalSelectChange(v, el.accessor);
                        }}
                        options={unitsOfMeasurementOptions}
                      />
                    ) : el.accessor === 'type_of_mix' && props.target == 1 ? (
                      <Select
                        defaultValue={getSelectedTypeOfMixOption(el.accessor)}
                        onChange={(v) => {
                          handleProductsTypeJournalSelectChange(v, el.accessor);
                        }}
                        options={typeOfMixOptions}
                      />
                    ) : el.accessor === 'place_of_production' ? (
                      <Select
                        defaultValue={getSelectedPlaceOfProductionOption(
                          el.accessor
                        )}
                        onChange={(v) => {
                          handleProductsTypeJournalSelectChange(v, el.accessor);
                        }}
                        options={placeOfProductionOptions}
                      />
                    ) : el.accessor === 'article' ? (
                      <h4>{productsTypeJournalInput[el.accessor] || ''}</h4>
                    ) : el.accessor === 'description' ? (
                      <AutoResizeTextarea
                        id={el.accessor}
                        name={el.accessor}
                        value={productsTypeJournalInput[el.accessor] || ''}
                        onChange={(e) => handleProductsTypeJournalInputChange(e)}
                        placeholder=""
                      />
                    ) : el.accessor === 'active_status' ? null : (
                      <div>
                        <input
                          className={`${
                            errors[el.accessor]
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500`}
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          value={productsTypeJournalInput[el.accessor] || ''}
                          onChange={(e) => handleProductsTypeJournalInputChange(e)}
                          style={{
                            border: `${errors[el.accessor] ? 'solid red' : ''}`,
                          }}
                        />
                        {errors[el.accessor] && (
                          <p className="mt-1 text-sm " style={{ color: '#ef4444' }}>
                            {errors[el.accessor]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addAuxilaryModal" type="submit">
          Add {props.title}
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowProductsTypeJournalModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add {props.title}
      </Button>

      <ProductsTypeJournalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        table={props.table}
        target={props.target}
        title={props.title}
        productCode={props.productCode}
      />
    </>
  );
}

const AutoResizeTextarea = ({ value, onChange, ...props }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сброс высоты
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Установка новой
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        overflow: 'hidden', // Скрываем scroll при авто-расширении
        resize: 'none', // Отключаем ручное изменение размера
      }}
      {...props}
    />
  );
};

export default ShowProductsTypeJournalModal;
