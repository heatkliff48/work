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
      Header: 'M3 per pallet',
      accessor: 'm3',
    },
    {
      Header: 'M2 per pallet',
      accessor: 'm2',
    },
    {
      Header: 'Linear metre per pallet',
      accessor: 'm',
    },
    {
      Header: 'Width in the array',
      accessor: 'widthInArray',
    },
    {
      Header: 'M3 in the array',
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
      Header: 'Priority for free products',
      accessor: 'coefficientOfFree',
      defaultValue: 0.5,
      sortType: 'number',
    },
    {
      Header: 'Price per m³',
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
      ],
      placeOfProduction: [
        { value: 0, label: 'Spain' },
        { value: 1, label: 'Türkiye' },
      ],
      typeOfPackaging: [
        { value: 0, label: 'Reusable' },
        { value: 1, label: 'Disposable' },
        { value: 2, label: 'Marine' },
      ],
    }),
    []
  );

  // Мемоизация списка продуктов
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

      return {
        ...prod,
        placeOfProduction: newPlaceOfProduction?.label,
        typeOfPackaging: newTypeOfPackaging?.label,
      };
    });

    return newlatestProducts;
  }, [products]);

  return (
    <ProductsContext.Provider value={{ COLUMNS, latestProducts, selectOptions }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => useContext(ProductsContext);
