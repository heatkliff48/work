import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  DropdownFilter,
  NumberRangeColumnFilter,
  TextSearchFilter,
} from '#components/Table/filters.js';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ProductsContext = createContext();

// "BAUBLOCK® TERMECO 36 Medidas 600x365x250 mm ..." -> "TERMECO 36"
export const extractProductTitle = (value = '') => {
  if (!value) return '';

  return String(value)
    .replace(/BAUBLOCK®/gi, '')
    .replace(/\s*Medidas[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Номер в названии — ширина в целых см: 100 мм -> "10", 365 мм -> "36", 75 мм -> "7"
export const widthToTitleCm = (width) => {
  const mm = Number(width);
  if (width == null || width === '' || !Number.isFinite(mm)) return '-';

  return String(Math.floor(mm / 10));
};

// Номер перед "Medidas" (или перед "(Ø..)" у O-block)
const DESCRIPTION_TITLE_WIDTH =
  /^(BAUBLOCK®.*?\s)(\d+(?:[.,]\d+)?)(\s+(?:\(Ø[^)]*\)\s+)?Medidas\b)/i;

// Номер в названии записан не в тех единицах:
// мм вместо см — "TERMECO 100 Medidas 600x100x250" -> "TERMECO 10 Medidas ...",
// дробные см — "TERMECO 36.5 Medidas 600x365x250" -> "TERMECO 36 Medidas ...".
// Возвращает исправленное описание или null, если в описании этой ошибки нет
export const fixDescriptionTitleWidth = (description, width) => {
  const match = String(description ?? '').match(DESCRIPTION_TITLE_WIDTH);
  const widthMm = Number(width);
  if (!match || !widthMm) return null;

  const current = Number(match[2].replace(',', '.'));
  const expected = widthToTitleCm(widthMm);
  const isWidthInOtherUnits = current === widthMm || current === widthMm / 10;

  if (!isWidthInOtherUnits || match[2] === expected) return null;

  return description.replace(DESCRIPTION_TITLE_WIDTH, `$1${expected}$3`);
};

export const ProductsContextProvider = ({ children }) => {
  const products = useSelector((state) => state.products);

  const TABLE_COLUMNS = [
    // {
    //   Header: 'Id',
    //   accessor: 'id',
    //   sortType: 'number',
    // },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
      disableSortBy: true,
    },
    {
      Header: 'Description',
      accessor: 'description',
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
      sortType: 'string',
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
    {
      Header: 'Product availability',
      accessor: 'activeStatus',
      Filter: DropdownFilter,
      Cell: ({ cell }) =>
        cell.row.values.activeStatus ? (
          <FaCheck color="green" size={24} />
        ) : (
          <FaTimes color="red" size={24} />
        ),
    },
  ];

  const COLUMNS = [
    {
      Header: 'Id',
      accessor: 'id',
      sortType: 'number',
    },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
      disableSortBy: true,
    },
    {
      Header: 'Description',
      accessor: 'description',
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
      sortType: 'string',
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
      Header: 'Diametro',
      accessor: 'diametro',
      defaultValue: 250,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
    {
      Header: 'Resistencia a la compresión, N/mm2',
      accessor: 'resistenciaCompresion',
      defaultValue: '2,3',
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
    {
      Header: 'Trading Mark',
      accessor: 'tradingMark',
      sortType: 'string',
    },
    {
      Header: 'Peso Unitario,kg',
      accessor: 'pesoUnitario',
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
    {
      Header: 'Product code',
      accessor: 'productCode',
    },
    {
      Header: 'Product availability',
      accessor: 'activeStatus',
    },
  ];

  const selectOptions = useMemo(
    () => ({
      form: [
        { value: 'normal', label: 'Normal' },
        { value: 'U-block', label: 'U-block' },
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
      ],
      palletSize: [
        { value: 0, label: '1200x1000' },
        { value: 1, label: '1200x800' },
      ],
      palletHeight: [
        { value: 0, label: 'Std' },
        { value: 1, label: 'Marine' },
        { value: 2, label: 'High' },
        { value: 3, label: 'Std+1' },
      ],
    }),
    [],
  );

  // Все версии карточек, с подписями опций вместо кодов (как в latestProducts).
  // Строка заказа ссылается по product_id на версию, с которой её оформили,
  // и остаётся на ней после правки карточки — искать её нужно здесь по id
  const productVersions = useMemo(() => {
    return (products || []).map((prod) => {
      const newPlaceOfProduction = selectOptions.placeOfProduction.find(
        (opt) => opt.value == prod.placeOfProduction,
      );
      const newTypeOfPackaging = selectOptions.typeOfPackaging.find(
        (opt) => opt.value == prod.typeOfPackaging,
      );
      const newPalletSize = selectOptions.palletSize.find(
        (opt) => opt.value == prod.palletSize,
      );
      const newPalletHeight = selectOptions.palletHeight.find(
        (opt) => opt.value == prod.palletHeight,
      );

      return {
        ...prod,
        placeOfProduction: newPlaceOfProduction?.label,
        typeOfPackaging: newTypeOfPackaging?.label,
        palletSize: newPalletSize?.label,
        palletHeight: newPalletHeight?.label,
      };
    });
  }, [products]);

  const latestProducts = useMemo(() => {
    const newProductList = productVersions.reduce((acc, product) => {
      const { article, version } = product;
      const existingProduct = acc.find((p) => p.article === article);
      if (!existingProduct) {
        acc.push(product);
      } else if (version > existingProduct.version) {
        acc = acc.map((p) => (p.article === article ? product : p));
      }
      return acc;
    }, []);

    newProductList.sort((a, b) => a.id - b.id);

    return newProductList;
  }, [productVersions]);

  const getOptionValue = (category, inputValue) => {
    if (typeof inputValue === 'number') {
      return inputValue; // Если это число, возвращаем как есть
    }

    if (!isNaN(Number(inputValue))) {
      return Number(inputValue); // Если это строка с числом, конвертируем
    }

    // Проверяем, существует ли такая категория в selectOptions
    if (!selectOptions[category]) {
      console.warn(`Категория ${category} не найдена в selectOptions`);
      return null;
    }

    // Ищем соответствие по label или value
    const matchedOption = selectOptions[category].find(
      (el) => el.label === inputValue || el.value === inputValue,
    );

    return matchedOption ? matchedOption.value : null;
  };

  // Буква комбинации в артикуле: место-упаковка-размер-высота;
  // после Z идут цифры 2–7 (без 0/1, чтобы не путать с O/I)
  const articleCombinationMap = {
    '0-0-0-0': 'A',
    '0-0-0-1': 'B',
    '0-0-0-2': 'C',
    '0-0-0-3': 'D',
    '0-0-1-0': 'E',
    '0-0-1-1': 'F',
    '0-0-1-2': 'G',
    '0-0-1-3': 'H',
    '0-1-0-0': 'I',
    '0-1-0-1': 'J',
    '0-1-0-2': 'K',
    '0-1-0-3': 'L',
    '0-1-1-0': 'M',
    '0-1-1-1': 'N',
    '0-1-1-2': 'O',
    '0-1-1-3': 'P',
    '1-0-0-0': 'Q',
    '1-0-0-1': 'R',
    '1-0-0-2': 'S',
    '1-0-0-3': 'T',
    '1-0-1-0': 'U',
    '1-0-1-1': 'V',
    '1-0-1-2': 'W',
    '1-0-1-3': 'X',
    '1-1-0-0': 'Y',
    '1-1-0-1': 'Z',
    '1-1-0-2': '2',
    '1-1-0-3': '3',
    '1-1-1-0': '4',
    '1-1-1-1': '5',
    '1-1-1-2': '6',
    '1-1-1-3': '7',
  };

  // Принимает как value (при создании), так и label (из latestProducts)
  const buildProductArticle = ({
    form,
    certificate,
    width,
    density,
    placeOfProduction,
    typeOfPackaging,
    palletSize,
    palletHeight,
  }) => {
    const combinationKey = [
      getOptionValue('placeOfProduction', placeOfProduction),
      getOptionValue('typeOfPackaging', typeOfPackaging),
      getOptionValue('palletSize', palletSize),
      getOptionValue('palletHeight', palletHeight),
    ].join('-');
    const combinationLetter = articleCombinationMap[combinationKey];

    if (!combinationLetter) {
      console.warn('Unknown combination for prodArticle:', combinationKey);
    }

    return `T.${form
      ?.toUpperCase()
      .slice(
        0,
        1,
      )}${combinationLetter}D${density.toString().slice(0, 2)}W${width
      .toString()
      .slice(0, 2)}${certificate?.substr(0, 1)}`;
  };

  return (
    <ProductsContext.Provider
      value={{
        TABLE_COLUMNS,
        COLUMNS,
        latestProducts,
        productVersions,
        products,
        selectOptions,
        getOptionValue,
        buildProductArticle,
        extractProductTitle,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => useContext(ProductsContext);
