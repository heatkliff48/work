// import { useEffect, useState } from 'react';
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
//   const { lotesListModal, setLotesListModal } = useModalContext();
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
//       accessor: 'cake_id',
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

//   const lotesList = useSelector((state) => state.lotesList);

//   const user = useSelector((state) => state.user);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (user && roles.length > 0) {
//       const access = checkUserAccess(user, roles, 'Warehouse');

//       if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
//         setUserAccess(access);
//         dispatch(getLotesList());
//       }
//     }
//   }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

//   const openModal = (lotesListItem) => {
//     if (!lotesListItem) return;

//     const baseRecipe = list_of_recipes.find(
//       (r) => String(r.article) === String(lotesListItem.recipe)
//     );

//     if (!baseRecipe) {
//       console.error('Recipe not found:', lotesListItem.recipe);
//       return;
//     }

//     let resolvedRecipe = {
//       ...baseRecipe,
//       ...lotesListItem,
//     };

//     if (lotesListItem.custom_recipe === true) {
//       RECIPE_PARAMS.forEach((key) => {
//         const val = lotesListItem[key];

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

//     setSelectedLotesRecipe(resolvedRecipe);
//     setLotesListModal(true);
//   };

//   return (
//     <>
//       <Table
//         COLUMN_DATA={COLUMNS_LOTES_LIST}
//         dataOfTable={lotesList}
//         userAccess={userAccess}
//         tableName={'Lotes List'}
//         handleRowClick={(row) => {
//           openModal(row.original);
//         }}
//       />
//       <LotesListModal
//         show={lotesListModal}
//         onHide={() => setLotesListModal(false)}
//         selectedRecipe={selectedLotesRecipe}
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
  const { lotesListModal, setLotesListModal } = useModalContext();
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
      accessor: 'cake_id',
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
    {
      Header: 'Warehouse ID',
      accessor: 'warehouse_id',
    },
  ];

  const lotesList = useSelector((state) => state.lotesList);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const groupedLotesList = useMemo(() => {
    if (!Array.isArray(lotesList)) return [];

    const grouped = {};

    lotesList.forEach((item) => {
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
  }, [lotesList]);

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
    return lotesList.filter(
      (r) =>
        r.product === item.product &&
        r.production_date === item.production_date &&
        r.cake_id === item.cake_id
    );
  };

  const openModal = (lotesListItem) => {
    if (!lotesListItem) return;

    const relatedBatches = getRelatedBatches(lotesListItem);

    const baseRecipe = list_of_recipes.find(
      (r) => String(r.article) === String(lotesListItem.recipe)
    );

    if (!baseRecipe) {
      console.error('Recipe not found:', lotesListItem.recipe);
      return;
    }

    let resolvedRecipe = {
      ...baseRecipe,
      ...lotesListItem,
    };

    if (lotesListItem.custom_recipe === true) {
      RECIPE_PARAMS.forEach((key) => {
        const val = lotesListItem[key];

        if (
          val !== null &&
          val !== undefined &&
          Number(val) !== 0 &&
          Number.isFinite(Number(val))
        ) {
          resolvedRecipe[key] = Number(val);
        }
      });
    }

    setSelectedLotesRecipe({
      ...resolvedRecipe,
      relatedBatches, // 👈 добавили
      activeBatchId: lotesListItem.id,
    });

    setLotesListModal(true);
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
        show={lotesListModal}
        onHide={() => setLotesListModal(false)}
        selectedRecipe={selectedLotesRecipe}
        lotesList={lotesList}
      />
    </>
  );
}
export default LotesList;
