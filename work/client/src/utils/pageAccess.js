// Какой аксессор (page_name из таблицы Pages, редактируется на странице Roles)
// нужен, чтобы открыть страницу. По этой карте скрываются кнопки меню и
// закрываются сами маршруты. Страницы, которых здесь нет, открыты всем.
export const PAGE_ACCESS = {
  '/users_info': 'Users_info',
  '/roles': 'Roles',

  '/products_type_journal': 'Products',
  '/production_quality': 'production_quality',
  '/statistics': 'Statistics',

  '/clients': 'Clients',
  '/clients_price_info': 'clients_price_info',

  '/orders': 'Orders',
  '/orders_to_warehouse': 'orders_to_warehouse',

  '/list_of_ordered_production': 'List_of_ordered_production',
  '/list_of_ordered_production_oem': 'list_of_ordered_production_oem',
  '/related_materials_backorder_list': 'related_materials_backorder_list',

  '/production_batch_designer_new': 'production_batch_designer',
  '/autoclave_calendar': 'autoclave_calendar',
  '/batch_outside': 'production_plan',

  '/recipe_products': 'recipe_products',
  '/technology_calendar': 'technology_calendar',
  '/cake_fillup': 'cake_fillup',
  '/raw_material_consumption': 'raw_material_consumption',
  '/lotes_list': 'lotes_list',

  '/quality_management': 'quality_management',
  '/warehouse_products_type': 'Warehouse',
  '/warehouse_manager': 'warehouse_manager',
  '/warehouse-manager/order-card': 'warehouse_manager',

  '/accounting': 'accounting',
  '/factura_manager': 'factura_manager',
  '/factura_manager/order-card': 'factura_manager',

  '/green_line_monitoring': 'green_line_monitoring',
  '/temperature_data_monitoring': 'temperature_data_monitoring',

  '/task_board': 'TaskBoard',
};
