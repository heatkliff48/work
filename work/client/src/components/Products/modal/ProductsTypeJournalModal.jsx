import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import ProductsTypeJournalInfoPreviewModal from './ProductsTypeJournalInfoPreviewModal';

function ProductsTypeJournalModal(props) {
  const {
    unitsOfMeasurementOptions,
    typeOfMixOptions,
    placeOfProductionOptions,
    latestDryMix,
    latestRelatedMaterials,
    latestAnchors,
    latestTools,
    selectedProductsType,
    setSelectedProductsType,
    productsTypeJournalPreviewInput,
    setProductsTypeJournalPreviewIInput,
  } = useProductsTypeJournalContext();

  const [errors, setErrors] = useState({});

  const [previewModalShow, setPreviewModalShow] = useState(false);

  const [productsTypeJournalInput, setProductsTypeJournalInput] = useState({});
  const product_code = useSelector((state) => state.productCode);

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
    'pallet_weight',
  ];

  const handleProductsTypeJournalInputChange = useCallback((e) => {
    setProductsTypeJournalInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }, []);

  const calculateEAN13Checksum = (barcode) => {
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const digit = parseInt(barcode[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3; // Нечетные позиции умножаем на 1, четные на 3
    }

    const checksum = (10 - (sum % 10)) % 10; // Вычисляем контрольную сумму
    return checksum;
  };

  const calculateEAN14Checksum = (barcode) => {
    let sum = 0;

    for (let i = 0; i < 13; i++) {
      const digit = parseInt(barcode[i], 10);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }

    const checksum = (10 - (sum % 10)) % 10;
    return checksum;
  };

  useEffect(() => {
    const { bag_weight, units_per_pallet, units_of_measurement } =
      productsTypeJournalInput;
    if (bag_weight && units_per_pallet && units_of_measurement) {
      const constante = units_of_measurement == 'pallets' ? 20 : 0;
      const palletWeight =
        parseFloat(bag_weight) * parseFloat(units_per_pallet) + constante;
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        pallet_weight: palletWeight,
      }));
    }
  }, [
    productsTypeJournalInput.bag_weight,
    productsTypeJournalInput.units_per_pallet,
    productsTypeJournalInput.units_of_measurement,
  ]);
  //tools pallet_weight
  useEffect(() => {
    const { piece_weight, units_per_pallet, units_of_measurement } =
      productsTypeJournalInput;
    if (piece_weight && units_per_pallet && units_of_measurement) {
      const constante = units_of_measurement == 'pallets' ? 20 : 0;
      const palletWeight =
        parseFloat(piece_weight) * parseFloat(units_per_pallet) + constante;
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        pallet_weight: palletWeight,
      }));
    }
  }, [
    productsTypeJournalInput.piece_weight,
    productsTypeJournalInput.units_per_pallet,
    productsTypeJournalInput.units_of_measurement,
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
    const { unit_x_base, altura_x_palet } = productsTypeJournalInput;
    if (unit_x_base && altura_x_palet) {
      const value = parseFloat(unit_x_base) * parseFloat(altura_x_palet);
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        units_per_pallet: value,
      }));
    }
  }, [
    productsTypeJournalInput.unit_x_base,
    productsTypeJournalInput.altura_x_palet,
  ]);

  useEffect(() => {
    const { pallet_weight } = productsTypeJournalInput;
    if (pallet_weight) {
      const value = Math.floor(24000 / parseFloat(pallet_weight));
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        qty_per_truck: value,
      }));
    }
  }, [productsTypeJournalInput.pallet_weight]);

  useEffect(() => {
    const { pallet_weight } = productsTypeJournalInput;
    if (pallet_weight) {
      const value = Math.floor(25000 / parseFloat(pallet_weight));
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        qty_per_contendor: value,
      }));
    }
  }, [productsTypeJournalInput.pallet_weight]);

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
    if (props.addNewVersion || props.repair) {
      setProductsTypeJournalInput({ ...selectedProductsType });
    } else if (props.duplicate) {
      let code = '0001';
      const articleId =
        props.target == 1
          ? latestDryMix.length === 0
            ? 1
            : latestDryMix.length + 1
          : props.target == 2
          ? latestRelatedMaterials.length === 0
            ? 1
            : latestRelatedMaterials.length + 1
          : props.target == 3
          ? latestAnchors.length === 0
            ? 1
            : latestAnchors.length + 1
          : latestTools.length === 0
          ? 1
          : latestTools.length + 1;

      // dryMixesJournal.length === 0 ? 1 : dryMixesJournal.length + 1;
      code =
        (props.target == 1
          ? `1`
          : props.target == 2
          ? `4`
          : props.target == 3
          ? `2`
          : `3`) + `0000${articleId}`.slice(-4);

      const productCode = calculateEAN13Checksum(
        '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );
      // const articleId = products.length === 0 ? 1 : products.length + 1;
      const fullPorductCode =
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        productCode;

      const boxProductCode = calculateEAN14Checksum(
        '1' +
          '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );

      const fullBoxProductCode =
        '1' +
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        boxProductCode;

      const palletProductCode = calculateEAN14Checksum(
        '2' +
          '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );

      const fullPalletProductCode =
        '2' +
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        palletProductCode;

      setProductsTypeJournalInput({
        ...selectedProductsType,
        article: `X.${
          props.target == 1
            ? `M`
            : props.target == 2
            ? `P`
            : props.target == 3
            ? `F`
            : `T`
        }${code}`,
        product_code: fullPorductCode,
        product_code_box: fullBoxProductCode,
        product_code_pall: fullPalletProductCode,
        version: 1,
      });
    } else {
      const productCode = calculateEAN13Checksum(
        '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );
      // const articleId = products.length === 0 ? 1 : products.length + 1;
      const fullPorductCode =
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        productCode;

      const boxProductCode = calculateEAN14Checksum(
        '1' +
          '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );

      const fullBoxProductCode =
        '1' +
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        boxProductCode;

      const palletProductCode = calculateEAN14Checksum(
        '2' +
          '84' +
          '36626' +
          '34' +
          ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
            -3
          )
      );

      const fullPalletProductCode =
        '2' +
        '84' +
        '36626' +
        '34' +
        ('00' + ((parseInt(product_code[0].product_code, 10) + 1) % 1000)).slice(
          -3
        ) +
        palletProductCode;

      let code = '0001';
      const articleId =
        props.target == 1
          ? latestDryMix.length === 0
            ? 1
            : latestDryMix.length + 1
          : props.target == 2
          ? latestRelatedMaterials.length === 0
            ? 1
            : latestRelatedMaterials.length + 1
          : props.target == 3
          ? latestAnchors.length === 0
            ? 1
            : latestAnchors.length + 1
          : latestTools.length === 0
          ? 1
          : latestTools.length + 1;

      // dryMixesJournal.length === 0 ? 1 : dryMixesJournal.length + 1;
      code =
        (props.target == 1
          ? `1`
          : props.target == 2
          ? `4`
          : props.target == 3
          ? `2`
          : `3`) + `0000${articleId}`.slice(-4);

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
        }${code}`,
        units_of_measurement: unitsOfMeasurementOptions[0].value,
        ...(props.target == 1 && { type_of_mix: typeOfMixOptions[0].value }), // Добавляем только если условие true
        place_of_production:
          defaultCountry?.value || placeOfProductionOptions[0].value,
        product_code: fullPorductCode,
        product_code_box: fullBoxProductCode,
        product_code_pall: fullPalletProductCode,
        active_status: true,
        version: 1,
      }));
    }
  }, [props.show]);

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
    }

    setProductsTypeJournalPreviewIInput(productsTypeJournalInput);

    setPreviewModalShow(true);
    props.onHide();
    setProductsTypeJournalInput({});
  };

  const isFieldDisabled = (fieldName) => {
    if (props?.addNewVersion) {
      return props.target == 1
        ? [
            'name',
            'manufacturer_name',
            'units_per_pallet',
            'bag_weight',
            'pallet_weight',
          ].includes(fieldName)
        : props.target == 2
        ? ['name', 'manufacturer_name'].includes(fieldName)
        : props.target == 3
        ? [
            'name',
            'manufacturer_name',
            'pieces_per_unit',
            'boxes_on_a_pallet',
            'box_weight',
            'pallet_weight',
          ].includes(fieldName)
        : ['name', 'manufacturer_name', 'piece_weight', 'pallet_weight'].includes(
            fieldName
          );
    }
    return false;
  };

  return (
    <div>
      <ProductsTypeJournalInfoPreviewModal
        show={previewModalShow}
        onHide={() => setPreviewModalShow(false)}
        table={props.table}
        target={props.target}
        title={props.title}
        productCode={props.productCode}
        addNewVersion={props.addNewVersion || false}
        repair={props.repair || false}
        duplicate={props.duplicate || false}
      />
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
                          isDisabled={props?.addNewVersion || false}
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
                          isDisabled={props?.addNewVersion || false}
                          defaultValue={getSelectedTypeOfMixOption(el.accessor)}
                          onChange={(v) => {
                            handleProductsTypeJournalSelectChange(v, el.accessor);
                          }}
                          options={typeOfMixOptions}
                        />
                      ) : el.accessor === 'place_of_production' ? (
                        <Select
                          isDisabled={props?.addNewVersion || false}
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
                            disabled={isFieldDisabled(el.accessor)}
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
                            <p
                              className="mt-1 text-sm "
                              style={{ color: '#ef4444' }}
                            >
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
    </div>
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
        disabled={props.disabled}
      >
        {props.addNewVersion
          ? `Edit`
          : props.repair
          ? `Repair`
          : props.duplicate
          ? `Duplicate`
          : `Add ${props.title}`}
      </Button>

      <ProductsTypeJournalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        table={props.table}
        target={props.target}
        title={props.title}
        productCode={props.productCode}
        addNewVersion={props.addNewVersion || false}
        repair={props.repair || false}
        duplicate={props.duplicate || false}
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

// old full version -------------

// const newErrors = {};

//     if (props.target == 1) {
//       requiredFieldsDryMix.forEach((field) => {
//         const value = productsTypeJournalInput[field];
//         if (!value) {
//           newErrors[field] = 'This field cannot be empty';
//         }
//       });

//       setErrors(newErrors);

//       if (Object.keys(newErrors).length > 0) {
//         return;
//       }

//       if (props.repair) {
//         setSelectedProductsType({
//           ...productsTypeJournalInput,
//         });
//         dispatch(
//           updateDryMixesJournal({
//             ...productsTypeJournalInput,
//           })
//         );
//       } else {
//         const existingProduct = hasMatchingObject(
//           dryMixesJournal,
//           productsTypeJournalInput,
//           [
//             'price_per_unit',
//             'price_per_kilogram',
//             'description',
//             'article',
//             'product_code',
//             'active_status',
//             'version',
//           ]
//         );

//         if (existingProduct) {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//             id: parseInt(
//               dryMixesJournal.length === 0 ? 1 : dryMixesJournal.length + 1
//             ),
//             article: existingProduct.article,
//             version: existingProduct.version + 1,
//             product_code: existingProduct.product_code,
//           });
//           dispatch(
//             addNewDryMixesJournal({
//               ...productsTypeJournalInput,
//               article: existingProduct.article,
//               version: existingProduct.version + 1,
//               product_code: existingProduct.product_code,
//             })
//           );
//         } else {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//           });
//           dispatch(
//             addNewDryMixesJournal({
//               ...productsTypeJournalInput,
//             })
//           );
//         }
//       }
//     } else if (props.target == 2) {
//       requiredFieldsRelatedMaterial.forEach((field) => {
//         const value = productsTypeJournalInput[field];
//         if (!value) {
//           newErrors[field] = 'This field cannot be empty';
//         }
//       });

//       setErrors(newErrors);

//       if (Object.keys(newErrors).length > 0) {
//         return;
//       }

//       if (props.repair) {
//         setSelectedProductsType({
//           ...productsTypeJournalInput,
//         });
//         dispatch(
//           updateRelatedMaterialsJournal({
//             ...productsTypeJournalInput,
//           })
//         );
//       } else {
//         const existingProduct = hasMatchingObject(
//           relatedMaterialsJournal,
//           productsTypeJournalInput,
//           [
//             'price_per_unit',
//             'description',
//             'article',
//             'product_code',
//             'active_status',
//             'version',
//           ]
//         );

//         if (existingProduct) {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//             id: parseInt(
//               relatedMaterialsJournal.length === 0
//                 ? 1
//                 : relatedMaterialsJournal.length + 1
//             ),
//             article: existingProduct.article,
//             version: existingProduct.version + 1,
//             product_code: existingProduct.product_code,
//           });
//           dispatch(
//             addNewRelatedMaterialsJournal({
//               ...productsTypeJournalInput,
//               article: existingProduct.article,
//               version: existingProduct.version + 1,
//               product_code: existingProduct.product_code,
//             })
//           );
//         } else {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//           });
//           dispatch(
//             addNewRelatedMaterialsJournal({
//               ...productsTypeJournalInput,
//             })
//           );
//         }
//       }
//     } else if (props.target == 3) {
//       requiredFieldsAnchors.forEach((field) => {
//         const value = productsTypeJournalInput[field];
//         if (!value) {
//           newErrors[field] = 'This field cannot be empty';
//         }
//       });

//       setErrors(newErrors);

//       if (Object.keys(newErrors).length > 0) {
//         return;
//       }

//       if (props.repair) {
//         setSelectedProductsType({
//           ...productsTypeJournalInput,
//         });
//         dispatch(
//           updateAnchor({
//             ...productsTypeJournalInput,
//           })
//         );
//       } else {
//         const existingProduct = hasMatchingObject(anchor, productsTypeJournalInput, [
//           'price_per_unit',
//           'description',
//           'article',
//           'product_code',
//           'active_status',
//           'version',
//         ]);

//         if (existingProduct) {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//             id: parseInt(anchor.length === 0 ? 1 : anchor.length + 1),
//             article: existingProduct.article,
//             version: existingProduct.version + 1,
//             product_code: existingProduct.product_code,
//           });
//           dispatch(
//             addNewAnchor({
//               ...productsTypeJournalInput,
//               article: existingProduct.article,
//               version: existingProduct.version + 1,
//               product_code: existingProduct.product_code,
//             })
//           );
//         } else {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//           });
//           dispatch(
//             addNewAnchor({
//               ...productsTypeJournalInput,
//             })
//           );
//         }
//       }
//     } else if (props.target == 4) {
//       requiredFieldsTools.forEach((field) => {
//         const value = productsTypeJournalInput[field];
//         if (!value) {
//           newErrors[field] = 'This field cannot be empty';
//         }
//       });

//       setErrors(newErrors);

//       if (Object.keys(newErrors).length > 0) {
//         return;
//       }

//       if (props.repair) {
//         setSelectedProductsType({
//           ...productsTypeJournalInput,
//         });
//         dispatch(
//           updateTool({
//             ...productsTypeJournalInput,
//           })
//         );
//       } else {
//         const existingProduct = hasMatchingObject(tool, productsTypeJournalInput, [
//           'price_per_unit',
//           'description',
//           'article',
//           'product_code',
//           'active_status',
//           'version',
//         ]);

//         if (existingProduct) {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//             id: parseInt(tool.length === 0 ? 1 : tool.length + 1),
//             article: existingProduct.article,
//             version: existingProduct.version + 1,
//             product_code: existingProduct.product_code,
//           });
//           dispatch(
//             addNewTool({
//               ...productsTypeJournalInput,
//               article: existingProduct.article,
//               version: existingProduct.version + 1,
//               product_code: existingProduct.product_code,
//             })
//           );
//         } else {
//           setSelectedProductsType({
//             ...productsTypeJournalInput,
//           });
//           dispatch(
//             addNewTool({
//               ...productsTypeJournalInput,
//             })
//           );
//         }
//       }
//     }
