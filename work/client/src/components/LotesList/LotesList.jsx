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

  const COLUMNS_LOTES_LIST = [
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
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

  const groupedLotesList = useMemo(() => {
    if (!Array.isArray(lotesListBatches)) return [];

    const grouped = {};

    lotesListBatches.forEach((item) => {
      if (!item || item.batch_id == null) return;

      const key = String(item.batch_id);

      const start = Number(item.cake_id_start);
      const finish = Number(item.cake_id_finish);

      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          cake_id_start: start,
          cake_id_finish: finish,
          quantity_cakes: finish - start + 1,
        };
        return;
      }

      grouped[key].cake_id_start = Math.min(grouped[key].cake_id_start, start);

      grouped[key].cake_id_finish = Math.max(grouped[key].cake_id_finish, finish);

      grouped[key].quantity_cakes =
        grouped[key].cake_id_finish - grouped[key].cake_id_start + 1;
    });

    return Object.values(grouped).sort(
      (a, b) => Number(b.batch_id) - Number(a.batch_id),
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
    return lotesListBatches
      .filter((r) => String(r.batch_id) === String(item.batch_id))
      .sort((a, b) => Number(a.sub_batch_id) - Number(b.sub_batch_id));
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
        (r) => String(r.article) === String(lotesListItem.recipe),
      );

      // if (!baseRecipe) {
      //   console.error('Recipe not found:', lotesListItem.recipe);
      //   return;
      // }

      resolvedRecipe = {
        ...baseRecipe,
        ...lotesListItem,
      };
    }

    setSelectedLotesRecipe({
      ...resolvedRecipe,
      relatedBatches,
      activeSubBatchId: lotesListItem.sub_batch_id,
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
          console.log('row.original LotesList.jsx line 152', row.original)
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
