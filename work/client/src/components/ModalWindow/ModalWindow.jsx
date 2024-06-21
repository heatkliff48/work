import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { addNewProduct } from '../redux/actions/productsAction';
import UpdateModalWindow from './UpdateModalWindow';
import { useProjectContext } from '../contexts/Context';
import InputField from '../InputField/InputField';

const ModalWindow = React.memo(({ list, formData, isOpen, toggle }) => {
  const {
    version,
    promProduct,
    setPromProduct,
    modal,
    setModal,
    modalUpdate,
    setModalUpdate,
  } = useProjectContext();
  const [value, setValue] = useState('default');
  const [formInput, setFormInput] = useState({});
  const [haveMath, setHaveMath] = useState({});
  const [trMark, setTrMark] = useState('');
  const [articleId, setArticleId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({});
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const selectOptions = useMemo(
    () => ({
      form: [
        { value: 'normal', label: 'Normal' },
        { value: 'U-block', label: 'U-block' },
        { value: 'Lintel', label: 'Lintel' },
        { value: 'O-block', label: 'O-block' },
        { value: 'Forjado', label: 'Forjado' },
      ],
      certificate: [
        { value: 'CE', label: 'CE' },
        { value: 'DAU', label: 'DAU' },
      ],
    }),
    []
  );

  const clearData = () => {
    setHaveMath({});
    setTrMark('');
    setValue('default');
    setFormInput(defaultValues);
    setArticleId(-1);
  };

  const handleInputChange = useCallback((e) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSelectChange = (selectedOption, key) => {
    setValue(selectedOption.value);
    setFormInput((prev) => ({ ...prev, [key]: selectedOption.value }));
  };

  const getSelectedOption = (accessor) => {
    const options = selectOptions[accessor];
    if (!options) return null;
    const defaultOption = options[0]; // Получаем первый элемент массива
    return defaultOption;
  };

  const updateProductHandler = () => {
    const isExistingProduct = products.some(
      (product) =>
        product.density === formInput.density &&
        product.form === formInput.form &&
        product.width === formInput.width &&
        product.height === formInput.height &&
        product.lengths === formInput.lengths &&
        product.certificate === formInput.certificate
    );

    if (isExistingProduct) {
      const existingProduct = products.find(
        (product) =>
          product.density === formInput.density &&
          product.form === formInput.form &&
          product.width === formInput.width &&
          product.height === formInput.height &&
          product.lengths === formInput.lengths &&
          product.certificate === formInput.certificate
      );
      setPromProduct({ ...formInput, id: existingProduct.id });
      setModalUpdate(!modalUpdate);
    } else {
      dispatch(addNewProduct({ product: formInput, user }));
    }
  };

  const handleTradingMark = () => {
    let tradingMark = '';

    if (formInput.density < 200) {
      tradingMark = 'SA-TEC';
    } else if (formInput.density >= 200 && formInput.density < 360) {
      tradingMark = 'Termeco';
    } else if (formInput.density >= 360 && formInput.density < 460) {
      tradingMark = 'Utilitas';
    } else if (formInput.density > 460) {
      tradingMark = 'Silenso';
    }

    if (formInput.form === 'U-block') {
      tradingMark = 'U-TEC';
    } else if (formInput.form === 'Lintel') {
      tradingMark = 'L-TEC';
    } else if (formInput.form === 'Forjado') {
      tradingMark = 'Forja-TEC';
    }

    setTrMark(tradingMark);
  };

  const memoizedDefaultValues = useMemo(() => {
    const newDefaultValues = {};
    list.forEach((el) => {
      if (el.defaultValue !== undefined) {
        newDefaultValues[el.accessor] = el.defaultValue;
      }
    });
    return newDefaultValues;
  }, [list]);

  const memoizedCalculateValues = useCallback(
    (formInput) => {
      const values = {};
      const updateFuncs = {};

      // Вычисление m3
      if (formInput?.lengths && formInput?.height && formInput?.width) {
        values.m3 =
          Math.floor(1200 / formInput?.lengths) *
          Math.floor(1000 / formInput?.height) *
          Math.floor(1500 / formInput?.width) *
          (
            (formInput?.lengths * formInput?.height * formInput?.width) /
            Math.pow(10, 9)
          ).toFixed(2);
        updateFuncs.m3 = (value) => setFormInput((prev) => ({ ...prev, m3: value }));
      }

      // Вычисление m2
      if (values.m3 && formInput?.width) {
        values.m2 = (values.m3 / (formInput?.width / 1000)).toFixed(2);
        updateFuncs.m2 = (value) => setFormInput((prev) => ({ ...prev, m2: value }));
      }

      // Вычисление m
      if (values.m2 && formInput?.height) {
        values.m = (values.m2 / (formInput?.height / 1000)).toFixed(2);
        updateFuncs.m = (value) => setFormInput((prev) => ({ ...prev, m: value }));
      }

      // Вычисление widthInArray
      if (formInput?.width) {
        values.widthInArray = Math.floor(1500 / formInput?.width).toFixed(2);
        updateFuncs.widthInArray = (value) =>
          setFormInput((prev) => ({ ...prev, widthInArray: value }));
      }

      // Вычисление m3InArray
      if (
        formInput?.lengths &&
        formInput?.height &&
        formInput?.width &&
        values.widthInArray
      ) {
        values.m3InArray =
          Math.floor(600 / formInput?.lengths) *
          Math.floor(6000 / formInput?.height) *
          values.widthInArray *
          (
            (formInput?.lengths * formInput?.height * formInput?.width) /
            Math.pow(10, 9)
          ).toFixed(2);
        updateFuncs.m3InArray = (value) =>
          setFormInput((prev) => ({ ...prev, m3InArray: value }));
      }

      if (formInput?.density) {
        values.densityDryMax = (formInput?.density * 1.25).toFixed(2);
        updateFuncs.densityDryMax = (value) =>
          setFormInput((prev) => ({ ...prev, densityDryMax: value }));
      }

      // Вычисление densityDryDef
      if (formInput?.density) {
        values.densityDryDef = (formInput?.density * 1.05).toFixed(2);
        updateFuncs.densityDryDef = (value) =>
          setFormInput((prev) => ({ ...prev, densityDryDef: value }));
      }

      // Вычисление densityHuminityMax
      if (formInput?.humidity && values.densityDryMax) {
        values.densityHuminityMax = (
          (1.05 + formInput?.humidity) *
          values.densityDryMax
        ).toFixed(2);
        updateFuncs.densityHuminityMax = (value) =>
          setFormInput((prev) => ({
            ...prev,
            densityHuminityMax: value,
          }));
      }

      // Вычисление densityHuminityDef
      if (formInput?.humidity && values.densityDryDef) {
        values.densityHuminityDef = (
          (1 + formInput?.humidity) *
          values.densityDryDef
        ).toFixed(2);
        updateFuncs.densityHuminityDef = (value) =>
          setFormInput((prev) => ({
            ...prev,
            densityHuminityDef: value,
          }));
      }

      // Вычисление weightMax
      if (values.densityHuminityMax && values.m3) {
        values.weightMax = (values.densityHuminityMax * values.m3 + 23).toFixed(2);
        updateFuncs.weightMax = (value) =>
          setFormInput((prev) => ({ ...prev, weightMax: value }));
      }

      // Вычисление weightDef
      if (values.densityHuminityDef && values.m3) {
        values.weightDef = (values.densityHuminityDef * values.m3 + 23).toFixed(2);
        updateFuncs.weightDef = (value) =>
          setFormInput((prev) => ({ ...prev, weightDef: value }));
      }

      return { values, updateFuncs };
    },
    [
      formInput.lengths,
      formInput.height,
      formInput.width,
      formInput.density,
      formInput.humidity,
    ]
  );

  const memoizedUpdateFuncs = useMemo(() => {
    const resultOfValues = memoizedCalculateValues(formInput);
    const { updateFuncs } = resultOfValues;
    return Object.fromEntries(
      Object.entries(updateFuncs).map(([key, func]) => [key, func])
    );
  }, [
    formInput.lengths,
    formInput.height,
    formInput.width,
    formInput.density,
    formInput.humidity,
  ]);

  const memoizedNewHaveMath = useMemo(() => {
    const result = {};
    const resultOfValues = memoizedCalculateValues(formInput);
    const { values } = resultOfValues;
    Object.keys(values).forEach((key) => {
      result[key] = {
        value: values[key],
        func: memoizedUpdateFuncs[key],
      };
    });
    return result;
  }, [
    memoizedCalculateValues,
    memoizedUpdateFuncs,
    formInput.lengths,
    formInput.height,
    formInput.width,
    formInput.density,
    formInput.humidity,
  ]);

  useEffect(() => {
    handleTradingMark();
    setFormInput((prev) => ({ ...prev, tradingMark: trMark }));
  }, [formInput.density, formInput.form, trMark]);

  useEffect(() => {
    setHaveMath(memoizedNewHaveMath);
  }, [memoizedNewHaveMath]);

  useEffect(() => {
    if (formData) {
      setFormInput(formData);
    } else if (promProduct) {
      setFormInput(promProduct);
    } else {
      setDefaultValues(memoizedDefaultValues);
      const extractedValues = Object.entries(memoizedNewHaveMath).reduce(
        (acc, [key, { value }]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );
      setFormInput((prev) => ({
        ...prev,
        ...memoizedDefaultValues,
        ...extractedValues,
      }));
    }
  }, [formData, memoizedDefaultValues, memoizedNewHaveMath]);

  useEffect(() => {
    setFormInput((prev) => ({ ...prev, version }));
  }, [version]);

  return (
    <div>
      {modalUpdate && <UpdateModalWindow />}
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>New product</ModalHeader>
        <div className="item_content">
          {list.map((el) => {
            if (el.accessor === 'id' || el.accessor === 'article') return null;
            if (el.accessor === 'version') {
              return (
                <div className="item_topic" key={el.id}>
                  <ModalBody>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={version}
                    readOnly
                  />
                </div>
              );
            }
            if (el.accessor === 'tradingMark') {
              return (
                <div className="item_topic" key={el.id}>
                  <ModalBody>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={trMark}
                    readOnly
                  />
                </div>
              );
            }
            if (selectOptions[el.accessor]) {
              return (
                <div className="item_select" key={el.id}>
                  <ModalBody>{el.Header}:</ModalBody>
                  <Select
                    defaultValue={getSelectedOption(el.accessor)}
                    onChange={(v) => {
                      if (articleId < 0) setArticleId(el.id);
                      handleSelectChange(v, el.accessor);
                      setFormInput((prev) => ({ ...prev, [el.accessor]: v.value })); // Обновляем formInput
                    }}
                    options={selectOptions[el.accessor]}
                  />
                </div>
              );
            }
            if (haveMath[el.accessor]) {
              return (
                <div className="item_topic" key={el.id}>
                  <ModalBody>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={haveMath[el.accessor].value}
                    readOnly
                  />
                </div>
              );
            }
            return (
              <InputField
                key={el.id}
                el={el}
                inputValue={formInput}
                inputValueChange={handleInputChange}
                articleId={articleId}
                setArticleId={setArticleId}
              />
            );
          })}
        </div>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              updateProductHandler();
              clearData();
              setModal(!modal);
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default ModalWindow;
