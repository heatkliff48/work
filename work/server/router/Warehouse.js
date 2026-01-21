const { Router } = require('express');
const WarehouseController = require('../controllers/Warehouse');

const router = Router();

router.get('/', WarehouseController.getAllWarehouse);
router.get('/reserved/product', WarehouseController.getListOfReservedProducts);
router.get(
  '/reserved/drymix',
  WarehouseController.getListOfReservedDryMixedProducts,
);
router.get(
  '/reserved/anchor',
  WarehouseController.getListOfReservedAnchorProducts,
);
router.get('/reserved/tool', WarehouseController.getListOfReservedToolProducts);
router.get(
  '/reserved/relmat',
  WarehouseController.getListOfReservedRelatedMaterialsProducts,
);
router.get(
  '/ordered_production',
  WarehouseController.getListOfOrderedProduction,
);
router.get('/autoclave_calendares', WarehouseController.getAutoclaveCalendar);
router.post(
  '/autoclave_calendares/add',
  WarehouseController.addNewAutoclaveCalendarData,
);
router.get(
  '/ordered_production_oem',
  WarehouseController.getListOfReservedProductsOEM,
);
router.post('/add', WarehouseController.addNewWarehouse);
router.post('/upd/remaining_stock', WarehouseController.updateRemainingStock);
router.post('/upd/quantitys', WarehouseController.updateWarehouseQuantitys);
router.post(
  '/upd/quantitys/drymix',
  WarehouseController.updateDryMixedWarehouseQuantitys,
);
router.post(
  '/upd/quantitys/anchor',
  WarehouseController.updateAnchorWarehouseQuantitys,
);
router.post(
  '/upd/quantitys/tool',
  WarehouseController.updateToolWarehouseQuantitys,
);
router.post(
  '/upd/quantitys/relmat',
  WarehouseController.updateRelMatWarehouseQuantitys,
);

router.post(
  '/reserved/product/add',
  WarehouseController.addNewReservedProducts,
);
router.post('/reserved/product/upd', WarehouseController.updReservedProducts);
router.post(
  '/reserved/product/delete',
  WarehouseController.deleteReservedProducts,
);

router.post(
  '/reserved/drymix/add',
  WarehouseController.addNewReservedDryMixedProducts,
);
router.post(
  '/reserved/drymix/upd',
  WarehouseController.updReservedDryMixedProducts,
);
router.post(
  '/reserved/drymix/delete',
  WarehouseController.deleteReservedDryMixedProducts,
);

router.post(
  '/reserved/anchor/add',
  WarehouseController.addNewReservedAnchorProducts,
);
router.post(
  '/reserved/anchor/upd',
  WarehouseController.updReservedAnchorProducts,
);
router.post(
  '/reserved/anchor/delete',
  WarehouseController.deleteReservedAnchorProducts,
);

router.post(
  '/reserved/tool/add',
  WarehouseController.addNewReservedToolProducts,
);
router.post('/reserved/tool/upd', WarehouseController.updReservedToolProducts);
router.post(
  '/reserved/tool/delete',
  WarehouseController.deleteReservedToolProducts,
);

router.post(
  '/reserved/relmat/add',
  WarehouseController.addNewReservedRelMatProducts,
);
router.post(
  '/reserved/relmat/upd',
  WarehouseController.updReservedRelMatProducts,
);
router.post(
  '/reserved/relmat/delete',
  WarehouseController.deleteReservedRelMatProducts,
);

router.post(
  '/ordered_production/add',
  WarehouseController.addNewListOfOrderedProduction,
);
router.post(
  '/ordered_production/update',
  WarehouseController.updateListOfOrderedProduction,
);
router.post(
  '/ordered_production_oem/add',
  WarehouseController.addNewListOfOrderedProductionOEM,
);
router.post(
  '/ordered_production_oem/update',
  WarehouseController.updateListOfOrderedProductionOEM,
);

module.exports = router;
