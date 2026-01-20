// import { useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Table from '../Table/Table';
// import { useUsersContext } from '#components/contexts/UserContext.js';
// import { getLotesList } from '#components/redux/actions/lotesListBatchesAction.js';
// import { useModalContext } from '#components/contexts/ModalContext.js';
// import { useRecipeContext } from '#components/contexts/RecipeContext.js';
// import LotesListModal from './LotesListModal';

// function LotesList() {
//   const {
//     list_of_recipes = [],
//     selectedLotesRecipe,
//     setSelectedLotesRecipe,
//   } = useRecipeContext();
//   const { lotesListBatchesModal, setLotesListBatchesModal } = useModalContext();
//   const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

//   const RECIPE_PARAMS = [
//     'sand_dry',
//     'sand_slurry_dry',
//     'lime',
//     'cement',
//     'gypsum_dry',
//     'return_dry',
//     'gypsum_stone',
//     'aluminum_paste',
//     'aluminum_paste_2',
//     'grinding_balls',
//     'aac',
//   ];

//   const COLUMNS_LOTES_LIST = [
//     {
//       Header: 'Batch ID',
//       accessor: 'id',
//     },
//     {
//       Header: 'Cake ID start',
//       accessor: 'cake_id_start',
//     },
//     {
//       Header: 'Cake ID finish',
//       accessor: 'cake_id_finish',
//     },
//     {
//       Header: 'Production date',
//       accessor: 'production_date',
//     },
//     {
//       Header: 'Product',
//       accessor: 'product',
//     },
//     {
//       Header: 'Recipe',
//       accessor: 'recipe',
//     },
//     {
//       Header: 'Quantity cakes',
//       accessor: 'quantity_cakes',
//     },
//     {
//       Header: 'Warehouse ID',
//       accessor: 'warehouse_id',
//     },
//   ];

//   const lotesListBatches = useSelector((state) => state.lotesListBatches);
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const groupedLotesList = useMemo(() => {
//     if (!Array.isArray(lotesListBatches)) return [];

//     const grouped = {};

//     lotesListBatches.forEach((item) => {
//       if (!item) return;

//       const key = `${item.product}|${item.production_date}|${item.cake_id_start}`;

//       const finish = Number(item.cake_id_finish) || 0;

//       if (!grouped[key]) {
//         grouped[key] = item;
//         return;
//       }

//       const storedFinish = Number(grouped[key].cake_id_finish) || 0;

//       if (finish > storedFinish) {
//         grouped[key] = item;
//       }
//     });

//     return Object.values(grouped).sort(
//       (a, b) => Number(b.cake_id_finish) - Number(a.cake_id_finish)
//     );
//   }, [lotesListBatches]);

//   useEffect(() => {
//     if (user && roles.length > 0) {
//       const access = checkUserAccess(user, roles, 'Warehouse');

//       if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
//         setUserAccess(access);
//         dispatch(getLotesList());
//       }
//     }
//   }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

//   const getRelatedBatches = (item) => {
//     return lotesListBatches.filter(
//       (r) =>
//         r.product === item.product &&
//         r.production_date === item.production_date &&
//         r.cake_id_start === item.cake_id_start
//     );
//   };

//   const openModal = (lotesListBatchesItem) => {
//     if (!lotesListBatchesItem) return;

//     const relatedBatches = getRelatedBatches(lotesListBatchesItem);

//     const baseRecipe = list_of_recipes.find(
//       (r) => String(r.article) === String(lotesListBatchesItem.recipe)
//     );

//     if (!baseRecipe) {
//       console.error('Recipe not found:', lotesListBatchesItem.recipe);
//       return;
//     }

//     let resolvedRecipe = {
//       ...baseRecipe,
//       ...lotesListBatchesItem,
//     };

//     if (lotesListBatchesItem.custom_recipe === true) {
//       RECIPE_PARAMS.forEach((key) => {
//         const val = lotesListBatchesItem[key];

//         if (
//           val !== null &&
//           val !== undefined &&
//           Number(val) !== 0 &&
//           Number.isFinite(Number(val))
//         ) {
//           resolvedRecipe[key] = Number(val);
//         }
//       });
//     }

//     setSelectedLotesRecipe({
//       ...resolvedRecipe,
//       relatedBatches, // 👈 добавили
//       activeBatchId: lotesListBatchesItem.id,
//     });

//     setLotesListBatchesModal(true);
//   };

//   return (
//     <>
//       <Table
//         COLUMN_DATA={COLUMNS_LOTES_LIST}
//         dataOfTable={groupedLotesList}
//         userAccess={userAccess}
//         tableName={'Lotes List'}
//         handleRowClick={(row) => {
//           openModal(row.original);
//         }}
//       />
//       <LotesListModal
//         show={lotesListBatchesModal}
//         onHide={() => setLotesListBatchesModal(false)}
//         selectedRecipe={selectedLotesRecipe}
//         lotesListBatches={lotesListBatches}
//       />
//     </>
//   );
// }
// export default LotesList;

// import { useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Table from '../Table/Table';
// import { useUsersContext } from '#components/contexts/UserContext.js';
// import { getLotesList } from '#components/redux/actions/lotesListAction.js';
// import { useModalContext } from '#components/contexts/ModalContext.js';
// import { useRecipeContext } from '#components/contexts/RecipeContext.js';
// import LotesListModal from './LotesListModal';

// function LotesList() {
//   const {
//     list_of_recipes = [],
//     selectedLotesRecipe,
//     setSelectedLotesRecipe,
//   } = useRecipeContext();
//   const { lotesListBatchesModal, setLotesListBatchesModal } = useModalContext();
//   const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

//   const RECIPE_PARAMS = [
//     'sand_dry',
//     'sand_slurry_dry',
//     'lime',
//     'cement',
//     'gypsum_dry',
//     'return_dry',
//     'gypsum_stone',
//     'aluminum_paste',
//     'aluminum_paste_2',
//     'grinding_balls',
//     'aac',
//   ];

//   const COLUMNS_LOTES_LIST = [
//     {
//       Header: 'Batch ID',
//       accessor: 'batch_id',
//     },
//     {
//       Header: 'Sub-batch',
//       accessor: 'sub_batch_id',
//     },
//     {
//       Header: 'Cake ID start',
//       accessor: 'cake_id_start',
//     },
//     {
//       Header: 'Cake ID finish',
//       accessor: 'cake_id_finish',
//     },
//     {
//       Header: 'Production date',
//       accessor: 'production_date',
//     },
//     {
//       Header: 'Product',
//       accessor: 'product',
//     },
//     {
//       Header: 'Recipe',
//       accessor: 'recipe',
//     },
//     {
//       Header: 'Quantity cakes',
//       accessor: 'quantity_cakes',
//     },
//   ];

//   const lotesListBatches = useSelector((state) => state.lotesListBatches);
//   const lotesListCakes = useSelector((state) => state.lotesListCakes);
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const groupedLotesList = useMemo(() => {
//     if (!Array.isArray(lotesListBatches)) return [];

//     const grouped = {};

//     lotesListBatches.forEach((item) => {
//       if (!item) return;

//       const key = String(item.batch_id ?? '');
//       const sub = Number(item.sub_batch_id) || 0;

//       if (!grouped[key]) {
//         grouped[key] = item;
//         return;
//       }

//       const storedSub = Number(grouped[key].sub_batch_id) || 0;
//       if (sub > storedSub) {
//         grouped[key] = item;
//       }
//     });

//     return Object.values(grouped).sort(
//       (a, b) => Number(b.batch_id) - Number(a.batch_id)
//     );
//   }, [lotesListBatches]);

//   useEffect(() => {
//     if (user && roles.length > 0) {
//       const access = checkUserAccess(user, roles, 'Warehouse');

//       if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
//         setUserAccess(access);
//         dispatch(getLotesList());
//       }
//     }
//   }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

//   const getRelatedBatches = (item) => {
//     return lotesListBatches
//       .filter((r) => String(r.batch_id) === String(item.batch_id))
//       .sort((a, b) => Number(a.sub_batch_id) - Number(b.sub_batch_id));
//   };

//   const openModal = (lotesListBatchesItem) => {
//     if (!lotesListBatchesItem) return;

//     const relatedBatches = getRelatedBatches(lotesListBatchesItem);

//     const baseRecipe = list_of_recipes.find(
//       (r) => String(r.article) === String(lotesListBatchesItem.recipe)
//     );

//     if (!baseRecipe) {
//       console.error('Recipe not found:', lotesListBatchesItem.recipe);
//       return;
//     }

//     let resolvedRecipe = {
//       ...baseRecipe,
//       ...lotesListBatchesItem,
//     };

//     if (lotesListBatchesItem.custom_recipe === true) {
//       RECIPE_PARAMS.forEach((key) => {
//         const val = lotesListBatchesItem[key];

//         if (
//           val !== null &&
//           val !== undefined &&
//           Number(val) !== 0 &&
//           Number.isFinite(Number(val))
//         ) {
//           resolvedRecipe[key] = Number(val);
//         }
//       });
//     }

//     setSelectedLotesRecipe({
//       ...resolvedRecipe,
//       relatedBatches,
//       activeSubBatchId: lotesListBatchesItem.sub_batch_id,
//     });

//     setLotesListBatchesModal(true);
//   };

//   return (
//     <>
//       <Table
//         COLUMN_DATA={COLUMNS_LOTES_LIST}
//         dataOfTable={groupedLotesList}
//         userAccess={userAccess}
//         tableName={'Lotes List'}
//         handleRowClick={(row) => {
//           openModal(row.original);
//         }}
//       />
//       <LotesListModal
//         show={lotesListBatchesModal}
//         onHide={() => setLotesListBatchesModal(false)}
//         selectedRecipe={selectedLotesRecipe}
//         lotesListBatches={lotesListBatches}
//       />
//     </>
//   );
// }
// export default LotesList;

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getLotesList } from '#components/redux/actions/lotesListAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import LotesListModal from './LotesListModal';

function LotesList() {
  const {
    list_of_recipes = [],
    selectedLotesRecipe,
    setSelectedLotesRecipe,
  } = useRecipeContext();
  const { lotesListBatchesModal, setLotesListBatchesModal } = useModalContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const RECIPE_PARAMS = [
    'sand_dry',
    'sand_slurry_dry',
    'lime',
    'cement',
    'gypsum_dry',
    'return_dry',
    'gypsum_stone',
    'aluminum_paste',
    'aluminum_paste_2',
    'grinding_balls',
    'aac',
  ];

  const COLUMNS_LOTES_LIST = [
    {
      Header: 'Batch ID',
      accessor: 'id',
    },
    {
      Header: 'Cake ID start',
      accessor: 'cake_id_start',
    },
    {
      Header: 'Cake ID finish',
      accessor: 'cake_id_finish',
    },
    {
      Header: 'Production date',
      accessor: 'production_date',
    },
    {
      Header: 'Product',
      accessor: 'product',
    },
    {
      Header: 'Recipe',
      accessor: 'recipe',
    },
    {
      Header: 'Quantity cakes',
      accessor: 'quantity_cakes',
    },
  ];

  const lotesListBatches = useSelector((state) => state.lotesListBatches);
  const lotesListCakes = useSelector((state) => state.lotesListCakes);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log('lotesListBatches', lotesListBatches);
  console.log('lotesListCakes', lotesListCakes);

  const groupedLotesList = useMemo(() => {
    if (!Array.isArray(lotesListBatches)) return [];

    const grouped = {};

    lotesListBatches.forEach((item) => {
      if (!item) return;

      const key = `${item.product}|${item.production_date}|${item.cake_id}`;

      const finish = Number(item.cake_id_finish) || 0;

      if (!grouped[key]) {
        grouped[key] = item;
        return;
      }

      const storedFinish = Number(grouped[key].cake_id_finish) || 0;

      if (finish > storedFinish) {
        grouped[key] = item;
      }
    });

    return Object.values(grouped).sort(
      (a, b) => Number(b.cake_id_finish) - Number(a.cake_id_finish)
    );
  }, [lotesListBatches]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
        dispatch(getLotesList());
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  const getRelatedBatches = (item) => {
    return lotesListBatches.filter(
      (r) =>
        r.product === item.product &&
        r.production_date === item.production_date &&
        r.cake_id === item.cake_id
    );
  };

  const openModal = (lotesListItem) => {
    if (!lotesListItem) return;

    const relatedBatches = getRelatedBatches(lotesListItem);

    let resolvedRecipe;

    if (lotesListItem.custom_recipe === true) {
      resolvedRecipe = {
        ...lotesListItem,
      };
    } else {
      const baseRecipe = list_of_recipes.find(
        (r) => String(r.article) === String(lotesListItem.recipe)
      );

      if (!baseRecipe) {
        console.error('Recipe not found:', lotesListItem.recipe);
        return;
      }

      resolvedRecipe = {
        ...baseRecipe,
        ...lotesListItem,
      };
    }
    console.log('resolvedRecipe LotesList.jsx line 513', resolvedRecipe);

    setSelectedLotesRecipe({
      ...resolvedRecipe,
      relatedBatches,
      activeBatchId: lotesListItem.id,
    });

    setLotesListBatchesModal(true);
  };

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_LOTES_LIST}
        dataOfTable={groupedLotesList}
        userAccess={userAccess}
        tableName={'Lotes List'}
        handleRowClick={(row) => {
          openModal(row.original);
        }}
      />
      <LotesListModal
        show={lotesListBatchesModal}
        onHide={() => setLotesListBatchesModal(false)}
        selectedRecipe={selectedLotesRecipe}
        lotesListBatches={lotesListBatches}
        lotesListCakes={lotesListCakes}
      />
    </>
  );
}
export default LotesList;
