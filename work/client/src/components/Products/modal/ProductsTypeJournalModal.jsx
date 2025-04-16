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

  const dispatch = useDispatch();

  const handleProductsTypeJournalInputChange = useCallback((e) => {
    setProductsTypeJournalInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    const { bag_weight, number_of_bags } = productsTypeJournalInput;
    if (bag_weight && number_of_bags) {
      const palletWeight = parseFloat(bag_weight) * parseFloat(number_of_bags) + 23;
      setProductsTypeJournalInput((prev) => ({
        ...prev,
        pallet_weight: palletWeight,
      }));
    }
  }, [productsTypeJournalInput.bag_weight, productsTypeJournalInput.number_of_bags]);

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
    console.log('placeOfProductionOptions', placeOfProductionOptions);
    // console.log('defaultCountry', defaultCountry);

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
      type_of_mix: typeOfMixOptions[0].value,
      place_of_production:
        defaultCountry?.value || placeOfProductionOptions[0].value,
      product_code: props?.productCode,
      active_status: true,
    }));
  }, [props.show]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (props.target == 1) {
      dispatch(
        addNewDryMixesJournal({
          productsTypeJournalInput,
        })
      );
    } else if (props.target == 2) {
      dispatch(
        addNewRelatedMaterialsJournal({
          productsTypeJournalInput,
        })
      );
    } else if (props.target == 3) {
      dispatch(
        addNewAnchor({
          productsTypeJournalInput,
        })
      );
    } else if (props.target == 4) {
      dispatch(
        addNewTool({
          productsTypeJournalInput,
        })
      );
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
            id="addClientModel"
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
                    ) : el.accessor === 'type_of_mix' ? (
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
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={productsTypeJournalInput[el.accessor] || ''}
                        onChange={(e) => handleProductsTypeJournalInputChange(e)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
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
