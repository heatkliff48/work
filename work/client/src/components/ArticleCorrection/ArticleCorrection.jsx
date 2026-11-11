import Table from '../Table/Table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import ArticleCorrectionModal from './ArticleCorrectionModal';

function ArticleCorrection() {
  const { t } = useTranslation('articleCorrection');
  const { raw_mat_consumption } = useRecipeContext();
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { Header: t('columns.date'), accessor: 'date' },
      { Header: t('columns.productArticle'), accessor: 'batch_article' },
      { Header: t('columns.recipe'), accessor: 'recipe_article' },
      // { Header: t('columns.productionVolume'), accessor: 'production_volume' },
      { Header: t('columns.batchId'), accessor: 'batch_id' },
      // { Header: t('columns.cakeIdStart'), accessor: 'cake_id_start' },
      // {
      //   Header: t('columns.used'),
      //   accessor: 'used',
      //   Cell: ({ value }) => t(value ? 'yes' : 'no', { ns: 'common' }),
      // },
      // {
      //   Header: t('columns.consumptionCalculated'),
      //   accessor: 'consumption_calculated',
      //   Cell: ({ value }) => t(value ? 'yes' : 'no', { ns: 'common' }),
      // },
      // { Header: t('columns.pallets'), accessor: 'batch_quantity_pallets' },
      // {
      //   Header: t('columns.orderedProductId'),
      //   accessor: 'id_ordered_product_to_warehouse',
      // },
      // { Header: t('columns.id'), accessor: 'id' },
    ],
    [t],
  );

  return (
    <>
      <Table
        COLUMN_DATA={columns}
        dataOfTable={raw_mat_consumption || []}
        tableName={t('tableName')}
        handleRowClick={(row) => {
          setSelectedRow(row.original);
          setModalOpen(true);
        }}
      />

      <ArticleCorrectionModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        selectedRow={selectedRow}
      />
    </>
  );
}

export default ArticleCorrection;
