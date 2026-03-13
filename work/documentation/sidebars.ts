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
};

export default sidebars;
