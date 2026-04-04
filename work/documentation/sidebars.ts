import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    // {
    //   type: 'category',
    //   label: 'Architecture',
    //   items: ['01-architecture/overview', '01-architecture/data-flow'],
    // },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/production/ProductionBatchDesigner',
        'components/production/Autoclave',
        'components/production/QualityManagement',
        'components/orders/OrderCart',
        'components/warehouse/Warehouse',
        'components/warehouse/WarehouseAddModal',
        'components/clients/Clients',
        // ... другие компоненты
      ],
    },
    // ... другие категории
  ],
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
  // tutorialSidebar: [
  //   'intro',
  //   {
  //     type: 'category',
  //     label: 'Components',
  //     link: {
  //       type: 'generated-index',
  //       title: 'Компоненты системы',
  //       description: 'Все React компоненты MES системы',
  //       slug: '/components',
  //     },
  //     items: [
  //       {
  //         type: 'category',
  //         label: 'Production',
  //         items: [
  //           'components/production/ProductionBatchDesignerNew',
  //           'components/production/Autoclave',
  //         ],
  //       },
  //       {
  //         type: 'category',
  //         label: 'Orders',
  //         items: ['components/orders/OrderCart'],
  //       },
  //       {
  //         type: 'category',
  //         label: 'Warehouse',
  //         items: [
  //           'components/warehouse/Warehouse',
  //           'components/warehouse/WarehouseAddModal',
  //         ],
  //       },
  //     ],
  //   },
  // ],
};

export default sidebars;
