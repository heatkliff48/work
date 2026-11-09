import { useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Table from '../Table/Table';
import { updateRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { palletPackagingLabel } from '#components/Orders/modal/packagingUtils.js';

const isEmpty = (value) => value === null || value === undefined || value === '';

const sameValue = (left, right, numeric) => {
  if (isEmpty(left) && isEmpty(right)) return true;
  if (isEmpty(left) || isEmpty(right)) return false;
  if (numeric) return Number(left) === Number(right);
  return String(left) === String(right);
};

const sameBlock = (product, source) =>
  sameValue(product.density, source.density, true) &&
  sameValue(product.width, source.width, true) &&
  sameValue(product.form, source.form, false) &&
  sameValue(product.certificate, source.certificate, false);

function ArticleCorrectionModal({ show, onHide, selectedRow }) {
  const { t } = useTranslation('articleCorrection');
  const dispatch = useDispatch();
  // Как на /warehouse_HCCA_blocks: код размера паллеты уже заменён подписью
  // (0 → 1200x1000), иначе palletPackagingLabel показывает «0».
  const { latestProducts: products } = useProductsContext();

  const sourceProduct = useMemo(() => {
    if (!selectedRow) return null;
    return (
      (products || []).find(
        (product) => String(product.article) === String(selectedRow.batch_article),
      ) || null
    );
  }, [products, selectedRow]);

  const matchingProducts = useMemo(() => {
    if (!sourceProduct) return [];
    return (products || [])
      .filter(
        (product) =>
          sameBlock(product, sourceProduct) &&
          String(product.article) !== String(selectedRow.batch_article),
      )
      .map((product) => ({
        ...product,
        packaging: palletPackagingLabel(product),
      }));
  }, [products, sourceProduct, selectedRow]);

  const columns = useMemo(
    () => [
      { Header: t('modal.columns.productArticle'), accessor: 'article' },
      { Header: t('modal.columns.description'), accessor: 'description' },
      { Header: t('modal.columns.density'), accessor: 'density' },
      { Header: t('modal.columns.width'), accessor: 'width' },
      { Header: t('modal.columns.form'), accessor: 'form' },
      { Header: t('modal.columns.certificate'), accessor: 'certificate' },
      { Header: t('modal.columns.packaging'), accessor: 'packaging' },
    ],
    [t],
  );

  const applyArticle = (product) => {
    if (!selectedRow || !product?.article) return;
    dispatch(
      updateRawMatConsumption({
        id: selectedRow.id,
        batch_article: product.article,
      }),
    );
    onHide();
  };

  const articleSuffix = selectedRow?.batch_article
    ? ` (${selectedRow.batch_article})`
    : '';

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.explanation', { article: articleSuffix })}</p>

        {sourceProduct ? (
          <Table
            COLUMN_DATA={columns}
            dataOfTable={matchingProducts}
            tableName={t('modal.tableName')}
            handleRowClick={(row) => applyArticle(row.original)}
          />
        ) : (
          <p>
            {t('modal.noProduct', {
              article: selectedRow?.batch_article || '—',
            })}
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ArticleCorrectionModal;
