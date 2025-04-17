import { TextSearchFilter } from '#components/Table/filters.js';
import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

const ProductsTypeJournalContext = createContext();

const ProductsTypeJournalContextProvider = ({ children }) => {
  const COLUMNS_DRY_MIXED_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Number of bags',
      accessor: 'number_of_bags',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Bag weight',
      accessor: 'bag_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Type of mix',
      accessor: 'type_of_mix',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per kilogram',
      accessor: 'price_per_kilogram',
      Filter: TextSearchFilter,
    },
  ];

  const COLUMNS_ANCHOR_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pieces per box',
      accessor: 'pieces_per_box',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Boxes on a pallet',
      accessor: 'boxes_on_a_pallet',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Box weight',
      accessor: 'box_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallet weight',
      accessor: 'pallet_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Filter: TextSearchFilter,
    },
  ];

  const COLUMNS_TOOLS_PRODUCT = [
    {
      Header: 'Product name',
      accessor: 'name',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Units of measurement',
      accessor: 'units_of_measurement',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Piece weight',
      accessor: 'piece_weight',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Place of production',
      accessor: 'place_of_production',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Filter: TextSearchFilter,
    },
  ];

  const unitsOfMeasurementOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'kilograms', label: 'Kilograms' },
    { value: 'bags', label: 'Bags' },
  ];
  const typeOfMixOptions = [
    { value: 0, label: 'Dry mix' },
    { value: 1, label: 'Plaster' },
    { value: 2, label: 'Glue' },
  ];

  const placeOfProductionOptions = [
    { value: 0, label: 'Spain' },
    { value: 1, label: 'Türkiye' },
  ];

  const [selectedProductsType, setSelectedProductsType] = useState(null);
  const [dataTable, setDataTable] = useState([]);

  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);
  const relatedMaterialsJournal = useSelector(
    (state) => state.relatedMaterialsJournal
  );
  const anchor = useSelector((state) => state.anchor);
  const tool = useSelector((state) => state.tool);

  return (
    <ProductsTypeJournalContext.Provider
      value={{
        COLUMNS_DRY_MIXED_PRODUCT,
        COLUMNS_ANCHOR_PRODUCT,
        COLUMNS_TOOLS_PRODUCT,
        unitsOfMeasurementOptions,
        typeOfMixOptions,
        placeOfProductionOptions,
        selectedProductsType,
        setSelectedProductsType,
        dataTable,
        setDataTable,
        dryMixesJournal,
        relatedMaterialsJournal,
        anchor,
        tool,
      }}
    >
      {children}
    </ProductsTypeJournalContext.Provider>
  );
};

export default ProductsTypeJournalContextProvider;

const useProductsTypeJournalContext = () => useContext(ProductsTypeJournalContext);
export { useProductsTypeJournalContext };
