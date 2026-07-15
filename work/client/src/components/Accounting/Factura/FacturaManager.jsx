import { useProjectContext } from '#components/contexts/Context.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import Table from '#components/Table/Table';
import { useEffect, useState } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useDispatch } from 'react-redux';
import {
  getAllWarehouse,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import {
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getProductsOfOrders,
  getRelMatProductsOfOrders,
  getToolProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

import '#components/Styles/main-pages.css';
import { useNavigate } from 'react-router-dom';

// Функция для определения типа продукта по артикулу
const getProductType = (
  article,
  latestProducts,
  latestDryMix,
  latestAnchors,
  latestTools,
  latestRelatedMaterials
) => {
  if (!article) return 'unknown';

  const inProducts = latestProducts?.some((p) => p.article === article);
  if (inProducts) return 'product';

  const inDryMix = latestDryMix?.some((d) => d.article === article);
  if (inDryMix) return 'dryMixed';

  const inAnchors = latestAnchors?.some((a) => a.article === article);
  if (inAnchors) return 'anchor';

  const inTools = latestTools?.some((t) => t.article === article);
  if (inTools) return 'tool';

  const inRelMat = latestRelatedMaterials?.some((r) => r.article === article);
  if (inRelMat) return 'relMat';

  return 'unknown';
};

// Функция для получения объекта продукта по артикулу и типу
const getProductByArticle = (
  article,
  type,
  latestProducts,
  latestDryMix,
  latestAnchors,
  latestTools,
  latestRelatedMaterials
) => {
  switch (type) {
    case 'product':
      return latestProducts?.find((p) => p.article === article);
    case 'dryMixed':
      return latestDryMix?.find((d) => d.article === article);
    case 'anchor':
      return latestAnchors?.find((a) => a.article === article);
    case 'tool':
      return latestTools?.find((t) => t.article === article);
    case 'relMat':
      return latestRelatedMaterials?.find((r) => r.article === article);
    default:
      return null;
  }
};

// Функция для формирования productLists для одного заказа
const buildProductLists = (
  productsData,
  latestProducts,
  latestDryMix,
  latestAnchors,
  latestTools,
  latestRelatedMaterials
) => {
  const productLists = {
    products: [],
    dryMixes: [],
    anchors: [],
    tools: [],
    related_materials: [],
  };

  if (!productsData || !Array.isArray(productsData)) {
    return productLists;
  }

  productsData.forEach((item) => {
    const match = item.match(/^([^:]+):\s*([\d.,]+)/);
    if (!match) return;

    const article = match[1].trim();
    const quantity = parseFloat(match[2].trim().replace(/[^\d.]/g, '')) || 0;

    if (!article || quantity === 0) return;

    const productType = getProductType(
      article,
      latestProducts,
      latestDryMix,
      latestAnchors,
      latestTools,
      latestRelatedMaterials
    );
    const product = getProductByArticle(
      article,
      productType,
      latestProducts,
      latestDryMix,
      latestAnchors,
      latestTools,
      latestRelatedMaterials
    );

    if (!product) return;

    switch (productType) {
      case 'product': {
        const m2 = product.m2 || 0;
        const quantityReal = m2 * quantity;
        const finalPrice = product.price || 0;

        productLists.products.push({
          product_id: product.id,
          product_article: article,
          quantity_real: quantityReal,
          quantity_m2: quantityReal,
          final_price: finalPrice * quantity,
          price_m2: finalPrice,
        });
        break;
      }

      case 'dryMixed': {
        const finalPrice = product.price || product.pallet_price || 0;

        productLists.dryMixes.push({
          dry_mixed_id: product.id,
          quantity_ud: quantity,
          total: quantity,
          final_price_dry: finalPrice * quantity,
          final_price: finalPrice * quantity,
        });
        break;
      }

      case 'anchor': {
        const finalPrice = product.price || 0;

        productLists.anchors.push({
          anchor_id: product.id,
          quantity_ud: quantity,
          total: quantity,
          final_price_anchor: finalPrice * quantity,
          final_price: finalPrice * quantity,
        });
        break;
      }

      case 'tool': {
        const finalPrice = product.price || 0;

        productLists.tools.push({
          tool_id: product.id,
          total: quantity,
          quantity_ud: quantity,
          final_price_tool: finalPrice * quantity,
          final_price: finalPrice * quantity,
        });
        break;
      }

      case 'relMat': {
        const finalPrice = product.price || 0;

        productLists.related_materials.push({
          rel_mat_id: product.id,
          total: quantity,
          quantity_ud: quantity,
          final_price_rel_mat: finalPrice * quantity,
          final_price: finalPrice * quantity,
        });
        break;
      }

      default:
        break;
    }
  });

  return productLists;
};

// Функция для вычисления VAT
const calculateVAT = (productLists, vatProcent) => {
  const allProducts = [
    ...(productLists.products || []),
    ...(productLists.dryMixes || []),
    ...(productLists.anchors || []),
    ...(productLists.tools || []),
    ...(productLists.related_materials || []),
  ];

  const final_price_product = allProducts.reduce(
    (acc, el) =>
      acc +
      (el?.final_price ||
        el?.final_price_dry ||
        el?.final_price_anchor ||
        el?.final_price_tool ||
        el?.final_price_rel_mat ||
        0),
    0
  );

  if (!final_price_product || !vatProcent) {
    return {
      vat_euro_origin: 0,
      vat_euro: 0,
      vat_result: 0,
    };
  }

  const vat_euro = Number(
    ((vatProcent * final_price_product) / 100).toFixed(2),
  );
  const vat_result = Number((final_price_product + vat_euro).toFixed(2));

  return {
    vat_euro_origin: Number(final_price_product.toFixed(2)),
    vat_euro: vat_euro,
    vat_result: vat_result,
  };
};

function FacturaManager() {
  const { WAREHOUSE_MANAGER_TRAILER_TABLE } = useProjectContext();
  const {
    setWmoctProductShippedBD,
    setSelectedOrder,
    order_dispatch_data,
    list_of_reserved_products,
    list_of_dry_mix_reserved_products,
    list_of_anchor_reserved_products,
    list_of_tool_reserved_products,
    list_of_rel_mat_reserved_products,
  } = useWarehouseContext();
  const { list_of_orders, deliveryAddresses, getCurrentOrderInfoHandler } =
    useOrderContext();

  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();

  const [facturaData, setFacturaData] = useState([]);
  const [vatValue, setVatValue] = useState({
    vat_procent: 21, // Значение по умолчанию, можно взять из контекста
    vat_euro_origin: 0,
    vat_euro: 0,
    vat_result: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedOrder(null);
  }, []);

  useEffect(() => {
    dispatch(getListOfReservedProducts());
    dispatch(getListOfDryMixedReservedProducts());
    dispatch(getListOfAnchorReservedProducts());
    dispatch(getListOfToolReservedProducts());
    dispatch(getListOfRelMatReservedProducts());
    dispatch(getProductsOfOrders());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getAnchorProductsOfOrders());
    dispatch(getToolProductsOfOrders());
    dispatch(getRelMatProductsOfOrders());
    dispatch(getAllWarehouse());
    dispatch(getDryMixesWarehouse());
    dispatch(getAnchorsWarehouse());
    dispatch(getToolsWarehouse());
    dispatch(getRelatedMaterialsWarehouse());
  }, []);

  useEffect(() => {
    if (!order_dispatch_data || order_dispatch_data.length === 0) {
      setFacturaData([]);
      setWmoctProductShippedBD([]);
      return;
    }

    const filteredDispatchData = order_dispatch_data.filter((item) => {
      const order = list_of_orders.find((o) => o.id === item.orderId);
      if (!order || (order.status || 0) < 8) {
        return false;
      }

      let reservedProduct = [];
      switch (item?.product_table) {
        case 'product':
          reservedProduct = list_of_reserved_products?.find(
            (reserved) => reserved.order_dispatch_id === item.id,
          );

          if (reservedProduct && reservedProduct.quantity === item.quantity) {
            return false;
          }
          break;

        case 'relMat':
          reservedProduct = list_of_rel_mat_reserved_products?.find(
            (reserved) => reserved.order_dispatch_id === item.id,
          );

          if (reservedProduct && reservedProduct.quantity === item.quantity) {
            return false;
          }
          break;

        case 'tool':
          reservedProduct = list_of_tool_reserved_products?.find(
            (reserved) => reserved.order_dispatch_id === item.id,
          );

          if (reservedProduct && reservedProduct.quantity === item.quantity) {
            return false;
          }
          break;

        case 'dryMixed':
          reservedProduct = list_of_dry_mix_reserved_products?.find(
            (reserved) => reserved.order_dispatch_id === item.id,
          );

          if (reservedProduct && reservedProduct.quantity === item.quantity) {
            return false;
          }
          break;

        case 'anchor':
          reservedProduct = list_of_anchor_reserved_products?.find(
            (reserved) => reserved.order_dispatch_id === item.id,
          );

          if (reservedProduct && reservedProduct.quantity === item.quantity) {
            return false;
          }
          break;

        default:
          break;
      }

      return true;
    });

    if (filteredDispatchData.length === 0) {
      setFacturaData([]);
      setWmoctProductShippedBD([]);
      return;
    }

    const groupedData = filteredDispatchData.reduce((acc, item) => {
      const key = `${item.orderId}_${item.trailer}`;

      if (!acc[key]) {
        acc[key] = {
          orderId: item.orderId,
          trailer: item.trailer,
          products: [],
          fecha: item.fecha || '',
          articles: [],
          totalQuantity: 0,
          productDetails: [],
          rawProductsData: [],
          trailer_stage: item?.trailer_stage || 0,
        };
      }

      acc[key].products.push(`${item.title}: ${item.quantity}, `);
      acc[key].articles.push(`${item.article}: ${item.quantity}`);
      acc[key].rawProductsData.push(`${item.article}: ${item.quantity}`);

      if (item.fecha && !acc[key].fecha) {
        acc[key].fecha = item.fecha;
      }

      return acc;
    }, {});

    const result = Object.values(groupedData).map((group) => {
      const order = list_of_orders.find((o) => o.id === group.orderId);
      const delivery = deliveryAddresses.find(
        (d) => d.id === order?.del_adr_id,
      );

      // Формируем productLists для этого заказа
      const productLists = buildProductLists(
        group.rawProductsData,
        latestProducts,
        latestDryMix,
        latestAnchors,
        latestTools,
        latestRelatedMaterials
      );

      // Вычисляем VAT для этого заказа
      const vatData = calculateVAT(productLists, vatValue.vat_procent);

      return {
        order_id: group.orderId,
        orders_article: order?.article || '',
        projects_name: delivery?.project_name || '',
        fecha: group.fecha || order?.due_date || '',
        orders_products: group.products,
        orders_products_articles: group.articles,
        trailer: group.trailer,
        productLists: productLists,
        vatData: vatData,
        rawProductsData: group.rawProductsData,
        trailer_stage: group.trailer_stage,
      };
    });

    setFacturaData(result);
    setWmoctProductShippedBD([]);
  }, [
    order_dispatch_data,
    list_of_orders,
    deliveryAddresses,
    latestProducts,
    latestDryMix,
    latestAnchors,
    latestTools,
    latestRelatedMaterials,
    vatValue.vat_procent,
  ]);

  return (
    <Table
      COLUMN_DATA={WAREHOUSE_MANAGER_TRAILER_TABLE}
      dataOfTable={facturaData}
      tableName={'Factura Manager'}
      handleRowClick={(row) => {
        getCurrentOrderInfoHandler({ order_id: row.original.order_id });
        setSelectedOrder({
          ...row.original,
          productLists: row.original.productLists,
          vatData: row.original.vatData,
        });
        navigate('/factura_manager/order-card');
      }}
    />
  );
}

export default FacturaManager;
