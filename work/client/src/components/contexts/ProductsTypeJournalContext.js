import { TextSearchFilter, DropdownFilter } from '#components/Table/filters.js';
import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getData } from 'country-list';

const ProductsTypeJournalContext = createContext();

const ProductsTypeJournalContextProvider = ({ children }) => {
  const COLUMNS_DRY_MIXED_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Altura x Palet',
      accessor: 'altura_x_palet',
    },
    {
      Header: 'Unit x Base',
      accessor: 'unit_x_base',
    },
    {
      Header: 'Units per pallet',
      accessor: 'units_per_pallet',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Bag weight, kg',
      accessor: 'bag_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight, kg',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Type of mix',
      accessor: 'type_of_mix',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Manufacturer name',
      accessor: 'manufacturer_name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per unit, €',
      accessor: 'price_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per kilogram, €',
      accessor: 'price_per_kilogram',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity per truck, pallets',
      accessor: 'qty_per_truck',
    },
    {
      Header: 'Quantity per contendor, pallets',
      accessor: 'qty_per_contendor',
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product availability',
      accessor: 'active_status',
      Filter: DropdownFilter,
      Cell: ({ cell }) =>
        cell.row.values.active_status ? (
          <FaCheck color="green" size={24} />
        ) : (
          <FaTimes color="red" size={24} />
        ),
    },
  ];

  const COLUMNS_ANCHOR_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
    },

    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pieces per unit',
      accessor: 'pieces_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Boxes on a pallet',
      accessor: 'boxes_on_a_pallet',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Box weight, kg',
      accessor: 'box_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight, kg',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },

    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Manufacturer name',
      accessor: 'manufacturer_name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per unit, €',
      accessor: 'price_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product availability',
      accessor: 'active_status',
      Filter: DropdownFilter,
      Cell: ({ cell }) =>
        cell.row.values.active_status ? (
          <FaCheck color="green" size={24} />
        ) : (
          <FaTimes color="red" size={24} />
        ),
    },
  ];

  const COLUMNS_RELATED_MATERIALS_JOURNAL = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
    },

    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },

    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Manufacturer name',
      accessor: 'manufacturer_name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per unit, €',
      accessor: 'price_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product availability',
      accessor: 'active_status',
      Filter: DropdownFilter,
      Cell: ({ cell }) =>
        cell.row.values.active_status ? (
          <FaCheck color="green" size={24} />
        ) : (
          <FaTimes color="red" size={24} />
        ),
    },
  ];

  const COLUMNS_TOOLS_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product ID',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units per pallet',
      accessor: 'units_per_pallet',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Unit weight, kg',
      accessor: 'piece_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight, kg',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Manufacturer name',
      accessor: 'manufacturer_name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per unit, €',
      accessor: 'price_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity per truck, pallet',
      accessor: 'qty_per_truck',
    },
    {
      Header: 'Quantity per contendor, pallet',
      accessor: 'qty_per_contendor',
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Product availability',
      accessor: 'active_status',
      Filter: DropdownFilter,
      Cell: ({ cell }) =>
        cell.row.values.active_status ? (
          <FaCheck color="green" size={24} />
        ) : (
          <FaTimes color="red" size={24} />
        ),
    },
  ];

  const unitsOfMeasurementOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'kilograms', label: 'Kilograms' },
    { value: 'bags', label: 'Bags' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'pallets', label: 'Pallets' },
  ];
  const typeOfMixOptions = [
    { value: 0, label: 'Dry mix' },
    { value: 1, label: 'Plaster' },
    { value: 2, label: 'Glue' },
  ];

  const placeOfProductionOptions = getData().map(({ code, name }) => ({
    value: code,
    label: name,
  }));

  const [selectedProductsType, setSelectedProductsType] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [productsTypeJournalPreviewInput, setProductsTypeJournalPreviewIInput] =
    useState({});

  const resetProductTypeJState = () => {
    setSelectedProductsType(null);
    setProductsTypeJournalPreviewIInput({});
    setDataTable([]);
  };

  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);
  const relatedMaterialsJournal = useSelector(
    (state) => state.relatedMaterialsJournal,
  );
  const anchor = useSelector((state) => state.anchor);
  const tool = useSelector((state) => state.tool);

  function getLatestAuxilaryProducts(products) {
    const latestVersionsMap = products?.reduce((acc, product) => {
      const { article, version } = product;
      if (!acc.has(article) || version > acc.get(article).version) {
        acc.set(article, product);
      }
      return acc;
    }, new Map());

    const uniqueProductsInOriginalOrder = products
      ?.filter((product, index, self) => {
        return self.findIndex((p) => p.article === product.article) === index;
      })
      .map((product) => {
        return latestVersionsMap.get(product.article);
      });

    return uniqueProductsInOriginalOrder || [];
  }

  const latestDryMix = useMemo(() => {
    return getLatestAuxilaryProducts(dryMixesJournal);
  }, [dryMixesJournal]);

  const latestRelatedMaterials = useMemo(() => {
    return getLatestAuxilaryProducts(relatedMaterialsJournal);
  }, [relatedMaterialsJournal]);

  const latestAnchors = useMemo(() => {
    return getLatestAuxilaryProducts(anchor);
  }, [anchor]);

  const latestTools = useMemo(() => {
    return getLatestAuxilaryProducts(tool);
  }, [tool]);

  return (
    <ProductsTypeJournalContext.Provider
      value={{
        COLUMNS_DRY_MIXED_PRODUCT,
        COLUMNS_ANCHOR_PRODUCT,
        COLUMNS_TOOLS_PRODUCT,
        COLUMNS_RELATED_MATERIALS_JOURNAL,
        unitsOfMeasurementOptions,
        typeOfMixOptions,
        placeOfProductionOptions,
        selectedProductsType,
        setSelectedProductsType,
        productsTypeJournalPreviewInput,
        setProductsTypeJournalPreviewIInput,
        dataTable,
        setDataTable,
        dryMixesJournal,
        relatedMaterialsJournal,
        anchor,
        tool,
        latestDryMix,
        latestRelatedMaterials,
        latestAnchors,
        latestTools,
        resetProductTypeJState,
      }}
    >
      {children}
    </ProductsTypeJournalContext.Provider>
  );
};

export default ProductsTypeJournalContextProvider;

const useProductsTypeJournalContext = () => useContext(ProductsTypeJournalContext);
export { useProductsTypeJournalContext };
