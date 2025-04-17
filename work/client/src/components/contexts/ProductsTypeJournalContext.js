import { TextSearchFilter, DropdownFilter } from '#components/Table/filters.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getNames, getData } from 'country-list';

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
      Header: 'Units per pallet',
      accessor: 'units_per_pallet',
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
      Header: 'Price per unit',
      accessor: 'price_per_unit',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Price per kilogram',
      accessor: 'price_per_kilogram',
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
      Header: 'Price per unit',
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
      Header: 'Price per unit',
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
      Header: 'Price per unit',
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

  // const placeOfProductionOptions = getData();
  //   code: 'ES',
  //   name: 'Spain'

  const placeOfProductionOptions = getData().map(({ code, name }) => ({
    value: code,
    label: name,
  }));

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
        COLUMNS_RELATED_MATERIALS_JOURNAL,
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
