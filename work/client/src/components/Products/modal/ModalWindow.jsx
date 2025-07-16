import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import InputField from '../../InputField/InputField';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ModalWindow = React.memo(
  ({ list, formData, isOpen, toggle, isRepair, isEdit }) => {
    const {
      version,
      setVersion,
      stayDefault,
      setStayDefault,
      setPreviewProductData,
      setPreviewOperationName,
    } = useProjectContext();

    const { setModalProductCard, previewProductModal, setPreviewProductModal } =
      useModalContext();
    const { selectOptions, getOptionValue } = useProductsContext();

    const [formInput, setFormInput] = useState({});
    const [haveMath, setHaveMath] = useState({});
    const [trMark, setTrMark] = useState('');
    const [articleId, setArticleId] = useState(-1);
    const [defaultValues, setDefaultValues] = useState({});
    const products = useSelector((state) => state.products);

    const editableAccessors = [
      'palletHeight',
      'price',
      'coefficientOfFree',
      'normOfBrack',
      'humidity',
    ];

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
        palletSize,
      } = formInput;

      const rightPlaceOfProduction = getOptionValue(
        'placeOfProduction',
        placeOfProduction
      );
      const rightTypeOfPackaging = getOptionValue(
        'typeOfPackaging',
        typeOfPackaging
      );

      const rightPalletSize = getOptionValue('palletSize', palletSize);

      const prodArticle = `T.${form
        ?.toUpperCase()
        .slice(
          0,
          1
        )}${rightPlaceOfProduction}${rightTypeOfPackaging}${rightPalletSize}D${density
        .toString()
        .slice(0, 2)}W${width}H${height.toString().slice(0, 2)}L${lengths
        .toString()
        .slice(0, 2)}${certificate?.substr(0, 1)}`;

      let productCode = '0001';
      const articleId = products.length === 0 ? 1 : products.length + 1;
      productCode = `00000${articleId}`.slice(-5);

      const updatedProduct = {
        ...formInput,
        article: prodArticle,
        productCode,
        activeStatus: true,
      };

      const isExistingProduct = products.some(
        (product) => product.article === prodArticle && product.density == density
      ); // добавить проверку выс шир длин

      const existingProduct = products.find(
        (product) => product.article === prodArticle
      );

      const lastVersion = products.findLast(
        (el) => el.article === prodArticle
      )?.version;

      const needRepair = products.some(
        (product) => product.article === prodArticle && product.density != density
      ); // добавить проверку выс шир длин

      if (isExistingProduct) {
        setPreviewOperationName('edit');

        const obj = {
          ...updatedProduct,
          id: existingProduct.id,
          productCode: existingProduct.productCode,
          version: lastVersion + 1,
        };

        setPreviewProductData(obj);
      } else if (isRepair) {
        const prevName = needRepair ? 'repair' : 'edit';
        setPreviewOperationName(prevName);

        if (isExistingProduct && !needRepair) {
          updatedProduct.version = lastVersion + 1;
        }
        updatedProduct.productCode = existingProduct.productCode;

        setPreviewProductData(updatedProduct);
      } else if (isEdit) {
        setPreviewOperationName('edit');

        console.log('updatedProduct', updatedProduct);

        const obj = {
          ...updatedProduct,
          version: lastVersion + 1,
        };

        setPreviewProductData(obj);
      } else {
        setPreviewOperationName('add');

        setPreviewProductData(updatedProduct);
      }
      setPreviewProductModal(!previewProductModal);
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

    const calculatePalletDimensions = (palletSize, palletHeight) => {
      // Определение ширины и длины паллета
      const palletWidthValue = parseInt(palletSize) === 0 ? 1000 : 800;
      const palletLengthValue = 1200;

      // Определение высоты паллета
      let palletHeightValue;
      switch (palletHeight) {
        case 0:
          palletHeightValue = 1200;
          break;
        case 1:
          palletHeightValue = 1000;
          break;
        case 2:
          palletHeightValue = 1500;
          break;
        default:
          palletHeightValue = 1200; // Стандартное значение
      }

      return {
        palletWidth: palletWidthValue,
        palletLength: palletLengthValue,
        palletHeight: palletHeightValue,
      };
    };

    const memoizedCalculateValues = useCallback(
      (formInput) => {
        const values = {};
        const updateFuncs = {};

        const { palletWidth, palletLength, palletHeight } =
          calculatePalletDimensions(formInput?.palletSize, formInput?.palletHeight);

        if (
          formInput?.lengths &&
          formInput?.height &&
          formInput?.width &&
          palletWidth &&
          palletLength &&
          palletHeight
        ) {
          values.quantityBlockOnPallet =
            Math.floor(palletLength / formInput?.lengths) *
            Math.floor(palletHeight / formInput?.width) *
            Math.floor(palletWidth / formInput?.height);

          updateFuncs.quantityBlockOnPallet = (value) =>
            setFormInput((prev) => ({ ...prev, quantityBlockOnPallet: value }));
        }

        if (formInput?.lengths && formInput?.height && formInput?.width) {
          values.volumeBlock = Number(
            ((((formInput?.lengths / 1000) * formInput?.height) / 1000) *
              formInput?.width) /
              1000
          ).toFixed(3);

          updateFuncs.volumeBlock = (value) =>
            setFormInput((prev) => ({ ...prev, volumeBlock: value }));
        }

        // Вычисление m3
        if (values.quantityBlockOnPallet && values.volumeBlock) {
          values.volumeBlockOnPallet = (
            values.quantityBlockOnPallet * values.volumeBlock
          ).toFixed(2);

          updateFuncs.volumeBlockOnPallet = (value) =>
            setFormInput((prev) => ({ ...prev, volumeBlockOnPallet: value }));
        }

        // Вычисление m2
        if (values.volumeBlockOnPallet && formInput?.width) {
          values.m2 = (
            values.volumeBlockOnPallet /
            (formInput?.width / 1000)
          ).toFixed(2);
          updateFuncs.m2 = (value) =>
            setFormInput((prev) => ({ ...prev, m2: value }));
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
        if (values.volumeBlock && values.widthInArray) {
          // values.m3InArray = (
          //             1 *
          // Math.floor(6000 / formInput?.height) *
          // values.widthInArray *
          // values.volumeBlock
          // ).toFixed(2);
          values.m3InArray = (values.volumeBlockOnPallet * 3).toFixed(2);
          updateFuncs.m3InArray = (value) =>
            setFormInput((prev) => ({ ...prev, m3InArray: value }));
        }

        if (formInput?.density) {
          if (formInput?.certificate === 'CE') {
            values.densityDryMax = Number(formInput?.density) + 50;
            updateFuncs.densityDryMax = (value) =>
              setFormInput((prev) => ({ ...prev, densityDryMax: value }));
          } else if (formInput?.certificate === 'DAU') {
            values.densityDryMax = Number(formInput?.density) + 25;
            updateFuncs.densityDryMax = (value) =>
              setFormInput((prev) => ({ ...prev, densityDryMax: value }));
          }
        }

        // Вычисление densityDryDef
        if (formInput?.density) {
          values.densityDryDef = (formInput?.density * 1.02).toFixed(2);
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
        if (values.densityHuminityMax && values.volumeBlockOnPallet) {
          values.weightMax = (
            values.densityHuminityMax * values.volumeBlockOnPallet +
            23
          ).toFixed(2);
          updateFuncs.weightMax = (value) =>
            setFormInput((prev) => ({ ...prev, weightMax: value }));
        }

        // Вычисление weightDef
        if (values.densityDryDef && values.volumeBlockOnPallet) {
          values.weightDef = (
            values.densityDryDef * values.volumeBlockOnPallet +
            23
          ).toFixed(2);
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
        formInput.palletSize,
        formInput.palletHeight,
        formInput.certificate,
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

    useEffect(() => {
      console.log('formInput', formInput);
    }, [formInput]);

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={() => {
            clearData();
            setStayDefault(true);
            toggle();
          }}
        >
          <ModalHeader
            toggle={() => {
              clearData();
              toggle();
            }}
          >
            {isRepair ? <p>Repair product</p> : <p>New product</p>}
          </ModalHeader>
          <div className="item_content">
            {list.map((el) => {
              const isDisabled = isEdit && !editableAccessors.includes(el.accessor);

              if (
                el.accessor === 'id' ||
                el.accessor === 'article' ||
                el.accessor === 'productCode' ||
                el.accessor === 'activeStatus'
              )
                return null;
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
                      value={
                        selectOptions[el.accessor].find(
                          (opt) =>
                            opt.value == formInput[el.accessor] ||
                            opt.label == formInput[el.accessor]
                        ) || null
                      }
                      onChange={(option) => {
                        if (articleId < 0) setArticleId(el.id);
                        setFormInput((prev) => ({
                          ...prev,
                          [el.accessor]: option.value,
                        }));
                        if (el.accessor == 'form' && option.value == 'Forjado') {
                          setFormInput((prev) => ({
                            ...prev,
                            lengths: 600,
                            height: 500,
                          }));
                        }
                      }}
                      options={selectOptions[el.accessor]}
                      isDisabled={isDisabled}
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
                  isDisabled={
                    formInput?.form == 'Forjado' &&
                    (el.accessor == 'lengths' || el.accessor == 'height')
                      ? true
                      : false
                  }
                />
              );
            })}
          </div>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                updateProductHandler();
                setModalProductCard(false);
                setStayDefault(true);
                setVersion(1);
                clearData();
                toggle();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
);

export default ModalWindow;
