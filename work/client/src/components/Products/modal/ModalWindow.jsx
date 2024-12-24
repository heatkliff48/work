import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import InputField from '../../InputField/InputField';
import UpdateModalWindow from './UpdateModalWindow';
import { useProjectContext } from '#components/contexts/Context.js';
import { addNewProduct } from '#components/redux/actions/productsAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';

const ModalWindow = React.memo(({ list, formData, isOpen, toggle }) => {
  const {
    version,
    setVersion,
    promProduct,
    setPromProduct,
    stayDefault,
    setStayDefault,
  } = useProjectContext();
  const { modal, setModal, modalUpdate, setModalUpdate, setModalProductCard } =
    useModalContext();
  const { selectOptions } = useProductsContext();

  const [formInput, setFormInput] = useState({});
  const [haveMath, setHaveMath] = useState({});
  const [trMark, setTrMark] = useState('');
  const [articleId, setArticleId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({});
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const clearData = () => {
    setTrMark('');
    setFormInput(defaultValues);
    setArticleId(-1);
    const newHaveMath = memoizedNewHaveMath;
    setHaveMath(newHaveMath);
  };

  const handleInputChange = useCallback((e) => {
    setStayDefault(false);
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const updateProductHandler = () => {
    const {
      form,
      certificate,
      width,
      height,
      lengths,
      density,
      placeOfProduction,
      typeOfPackaging,
    } = formInput;

    const prodArticle = `T.${form?.toUpperCase()}${placeOfProduction}${typeOfPackaging}0${certificate?.substr(
      0,
      1
    )}${density}${width}${height}${lengths}`;

    const updatedProduct = {
      ...formInput,
      placeOfProduction:
        typeof placeOfProduction === 'number'
          ? placeOfProduction
          : selectOptions.placeOfProduction.find(
              (el) => el.label === placeOfProduction
            ).value,
      typeOfPackaging:
        typeof typeOfPackaging === 'number'
          ? typeOfPackaging
          : selectOptions.typeOfPackaging.find((el) => el.label === typeOfPackaging)
              .value,
      article: prodArticle,
    };

    console.log('updatedProduct', updatedProduct);

    const isExistingProduct = products.some(
      (product) => product.article === prodArticle
    );

    if (isExistingProduct) {
      const existingProduct = products.find(
        (product) => product.article === prodArticle
      );
      setPromProduct({
        ...updatedProduct,
        id: existingProduct.id,
      });
      setModalUpdate(!modalUpdate);
    } else {
      setModal(!modal);
      setModalProductCard(false);
      dispatch(addNewProduct({ product: updatedProduct }));
      clearData();
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
        values.m3 = (
          Math.floor(1200 / formInput?.lengths) *
          Math.floor(1000 / formInput?.height) *
          Math.floor(1500 / formInput?.width) *
          ((formInput?.lengths * formInput?.height * formInput?.width) /
            Math.pow(10, 9))
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
        values.m3InArray = (
          Math.floor(600 / formInput?.lengths) *
          Math.floor(6000 / formInput?.height) *
          values.widthInArray *
          ((formInput?.lengths * formInput?.height * formInput?.width) /
            Math.pow(10, 9))
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
          (1.05 + formInput?.humidity * 0.01) *
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
          (1 + formInput?.humidity * 0.01) *
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
      if (values.densityDryDef && values.m3) {
        values.weightDef = (values.densityDryDef * values.m3 + 23).toFixed(2);
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
    if (!stayDefault) return;
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
  }, []);

  useEffect(() => {
    setHaveMath(memoizedNewHaveMath);
  }, [memoizedNewHaveMath]);

  useEffect(() => {
    const extractedValues = Object.entries(memoizedNewHaveMath).reduce(
      (acc, [key, { value }]) => {
        acc[key] = value;
        return acc;
      },
      {}
    );

    setFormInput((prev) => ({
      ...prev,
      ...extractedValues,
    }));
  }, [memoizedNewHaveMath]);

  useEffect(() => {
    if (formData) {
      setFormInput((prev) => ({ ...prev, version: formData.version }));
      setVersion(formData.version);
    } else {
      setFormInput((prev) => ({ ...prev, version }));
    }
  }, [version]);

  return (
    <div>
      {modalUpdate && <UpdateModalWindow />}
      <Modal
        isOpen={isOpen}
        toggle={() => {
          clearData();
          toggle();
        }}
      >
        <ModalHeader
          toggle={() => {
            clearData();
            toggle();
          }}
        >
          New product
        </ModalHeader>
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
              let selOpt = selectOptions[el.accessor][0];
              return (
                <div className="item_select" key={el.id}>
                  <ModalBody>{el.Header}:</ModalBody>
                  <Select
                    defaultValue={selOpt}
                    onChange={(option) => {
                      if (articleId < 0) setArticleId(el.id);
                      setFormInput((prev) => ({
                        ...prev,
                        [el.accessor]: option.value, // Используем value вместо label
                      }));
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
              />
            );
          })}
        </div>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              updateProductHandler();
              setStayDefault(true);
              clearData();
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
