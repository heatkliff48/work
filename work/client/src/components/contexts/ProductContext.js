import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownFilter,
  NumberRangeColumnFilter,
  TextSearchFilter,
} from '#components/Table/filters.js';

const ProductsContext = createContext();

export const ProductsContextProvider = ({ children }) => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const TABLE_COLUMNS = [
    {
      Header: 'Id',
      accessor: 'id',
      sortType: 'number',
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
      disableSortBy: true,
    },
    {
      Header: 'Density, kg/m³',
      accessor: 'density',
      defaultValue: 500,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 80,
      max: 800,
    },
    {
      Header: 'Place of production',
      accessor: 'placeOfProduction',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Type of packaging',
      accessor: 'typeOfPackaging',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Pallet Size, mm',
      accessor: 'palletSize',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'text',
    },
    {
      Header: 'Pallet Height',
      accessor: 'palletHeight',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Form',
      accessor: 'form',
      defaultValue: 'Normal',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Certificate',
      accessor: 'certificate',
      defaultValue: 'CE',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
      defaultValue: 200,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 50,
      max: 500,
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
      defaultValue: 600,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 400,
      max: 3000,
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
      defaultValue: 250,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 100,
      max: 1000,
    },
    {
      Header: 'Trading Mark',
      accessor: 'tradingMark',
      sortType: 'string',
    },
    {
      Header: 'Volume per pallet, m3',
      accessor: 'volumeBlockOnPallet',
    },
    {
      Header: 'Area on the pallet, m2',
      accessor: 'm2',
    },
    {
      Header: 'Price per m³, EURO',
      accessor: 'price',
      defaultValue: 0,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
  ];

  const COLUMNS = [
    {
      Header: 'Id',
      accessor: 'id',
      sortType: 'number',
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
      disableSortBy: true,
    },
    {
      Header: 'Version',
      accessor: 'version',
      defaultValue: 1,
      sortType: 'number',
    },
    {
      Header: 'Density, kg/m³',
      accessor: 'density',
      defaultValue: 500,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 80,
      max: 800,
    },
    {
      Header: 'Place of production',
      accessor: 'placeOfProduction',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Type of packaging',
      accessor: 'typeOfPackaging',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Pallet Size, mm',
      accessor: 'palletSize',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'text',
    },
    {
      Header: 'Pallet Height',
      accessor: 'palletHeight',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Form',
      accessor: 'form',
      defaultValue: 'Normal',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Certificate',
      accessor: 'certificate',
      defaultValue: 'CE',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
      defaultValue: 200,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 50,
      max: 500,
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
      defaultValue: 600,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 400,
      max: 3000,
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
      defaultValue: 250,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 100,
      max: 1000,
    },
    {
      Header: 'Trading Mark',
      accessor: 'tradingMark',
      sortType: 'string',
    },
    {
      Header: 'Volume per pallet, m3',
      accessor: 'volumeBlockOnPallet',
    },
    {
      Header: 'Area on the pallet, m2',
      accessor: 'm2',
    },
    {
      Header: 'Linear metre per pallet, m',
      accessor: 'm',
    },
    {
      Header: 'Width in the cakes',
      accessor: 'widthInArray',
    },
    {
      Header: 'Volume in the cakes, m3',
      accessor: 'm3InArray',
    },
    {
      Header: 'Dry density max, kg/m³',
      accessor: 'densityDryMax',
    },
    {
      Header: 'Dry density default, kg/m³',
      accessor: 'densityDryDef',
    },
    {
      Header: 'Humidity, %',
      accessor: 'humidity',
      defaultValue: 30,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 0,
      max: 100,
    },
    {
      Header: 'Density wet max, kg/m³',
      accessor: 'densityHuminityMax',
    },
    {
      Header: 'Density wet default, kg/m³',
      accessor: 'densityHuminityDef',
    },
    {
      Header: 'Product pallet weight max, kg',
      accessor: 'weightMax',
    },
    {
      Header: 'Product pallet weight default, kg',
      accessor: 'weightDef',
    },
    {
      Header: 'Norm of defect, %',
      accessor: 'normOfBrack',
      defaultValue: 2,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
    {
      Header: 'Priority for free products, 0-5',
      accessor: 'coefficientOfFree',
      defaultValue: 0.5,
      sortType: 'number',
    },
    {
      Header: 'Price per m³, EURO',
      accessor: 'price',
      defaultValue: 0,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
  ];

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
        { value: 'DoP', label: 'DoP' },
      ],
      placeOfProduction: [
        { value: 0, label: 'Spain' },
        { value: 1, label: 'Türkiye' },
      ],
      typeOfPackaging: [
        { value: 0, label: 'Reusable' },
        { value: 1, label: 'Disposable' },
      ],
      palletSize: [
        { value: 0, label: '1200x1000' },
        { value: 1, label: '1200x800' },
      ],
      palletHeight: [
        { value: 0, label: 'Std' },
        { value: 1, label: 'Marine' },
        { value: 2, label: 'High' },
      ],
    }),
    []
  );

  const latestProducts = useMemo(() => {
    const newProductList = products?.reduce((acc, product) => {
      const { article, version } = product;
      const existingProduct = acc.find((p) => p.article === article);
      if (!existingProduct) {
        acc.push(product);
      } else if (version > existingProduct.version) {
        acc = acc.map((p) => (p.article === article ? product : p));
      }
      return acc;
    }, []);

    newProductList?.sort((a, b) => a.id - b.id);

    const newlatestProducts = newProductList.map((prod) => {
      const newPlaceOfProduction = selectOptions.placeOfProduction.find(
        (opt) => opt.value == prod.placeOfProduction
      );
      const newTypeOfPackaging = selectOptions.typeOfPackaging.find(
        (opt) => opt.value == prod.typeOfPackaging
      );
      const newPalletSize = selectOptions.palletSize.find(
        (opt) => opt.value == prod.palletSize
      );
      const newPalletHeight = selectOptions.palletHeight.find(
        (opt) => opt.value == prod.palletHeight
      );

      return {
        ...prod,
        placeOfProduction: newPlaceOfProduction?.label,
        typeOfPackaging: newTypeOfPackaging?.label,
        palletSize: newPalletSize?.label,
        palletHeight: newPalletHeight?.label,
      };
    });

    return newlatestProducts;
  }, [products]);

  const rightPlaceOfProductionFunc = (placeOfProduction) => {
    if (typeof placeOfProduction === 'number') {
      // Если это число, вернуть его как есть
      return placeOfProduction;
    }

    if (!isNaN(Number(placeOfProduction))) {
      // Если это строка, представляющая число, преобразовать в число
      return Number(placeOfProduction);
    }

    // Если это строка, попытаться найти в `selectOptions.placeOfProduction`
    const matchedOption = selectOptions.placeOfProduction.find(
      (el) => el.label === placeOfProduction || el.value === placeOfProduction
    );

    // Вернуть найденное значение или null, если не найдено
    return matchedOption ? Number(matchedOption.value) : null;
  };

  const rightTypeOfPackagingFunc = (typeOfPackaging) => {
    if (typeof typeOfPackaging === 'number') {
      // Если это число, вернуть его как есть
      return typeOfPackaging;
    }

    if (!isNaN(Number(typeOfPackaging))) {
      // Если это строка, представляющая число, преобразовать в число
      return Number(typeOfPackaging);
    }

    // Если это строка, попытаться найти в `selectOptions.typeOfPackaging`
    const matchedOption = selectOptions.typeOfPackaging.find(
      (el) => el.label === typeOfPackaging || el.value === typeOfPackaging
    );

    // Вернуть найденное значение или null, если не найдено
    return matchedOption ? Number(matchedOption.value) : null;
  };

  return (
    <ProductsContext.Provider
      value={{
        TABLE_COLUMNS,
        COLUMNS,
        latestProducts,
        selectOptions,
        rightPlaceOfProductionFunc,
        rightTypeOfPackagingFunc,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => useContext(ProductsContext);
