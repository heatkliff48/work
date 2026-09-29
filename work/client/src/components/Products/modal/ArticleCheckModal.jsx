import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { fixProductArticles } from '#components/redux/actions/productsAction.js';

// Сверяет артикул последней версии каждого продукта с тем, что собрал бы buildProductArticle
const ArticleCheckModal = ({ isOpen, toggle, canFix }) => {
  const dispatch = useDispatch();
  const { latestProducts, buildProductArticle } = useProductsContext();

  const issues = useMemo(() => {
    const checked = (latestProducts ?? []).map((product) => {
      let expected = null;
      try {
        expected = buildProductArticle(product);
      } catch (err) {
        // Нет плотности или ширины — артикул не собрать
      }
      // 'undefined' в артикуле — неизвестная комбинация, нет формы или сертификата
      if (expected?.includes('undefined')) expected = null;

      return { product, expected };
    });

    // Артикулы после исправления: если два продукта получат один и тот же, они сольются
    const finalCount = checked.reduce((acc, { product, expected }) => {
      const finalArticle = expected ?? product.article;
      acc[finalArticle] = (acc[finalArticle] ?? 0) + 1;
      return acc;
    }, {});

    return checked
      .map((item) => {
        let status = null;
        if (!item.expected) status = 'Missing data';
        else if (finalCount[item.expected] > 1) status = 'Conflict';
        else if (item.product.article !== item.expected)
          status = 'Wrong article';
        return { ...item, status };
      })
      .filter((item) => item.status)
      .sort((a, b) => a.product.article.localeCompare(b.product.article));
  }, [latestProducts]);

  const fixable = issues.filter(({ status }) => status === 'Wrong article');

  const fixHandler = () => {
    const confirmed = window.confirm(
      `Rename ${fixable.length} article(s)?\n\n` +
        'All versions of these products will be renamed, as well as ' +
        'references in warehouse, stock balances, orders, batches and quality.',
    );
    if (!confirmed) return;

    dispatch(
      fixProductArticles(
        fixable.map(({ product, expected }) => ({
          from: product.article,
          to: expected,
        })),
      ),
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Article check</ModalHeader>
      <ModalBody>
        {issues.length === 0 ? (
          <div>All {latestProducts?.length ?? 0} articles are correct.</div>
        ) : (
          <Table size="sm" bordered hover responsive>
            <thead>
              <tr>
                <th>Article</th>
                <th>Expected</th>
                <th>Place</th>
                <th>Packaging</th>
                <th>Pallet size</th>
                <th>Pallet height</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(({ product, expected, status }) => (
                <tr key={product.id}>
                  <td>{product.article}</td>
                  <td>{expected ?? '—'}</td>
                  <td>{product.placeOfProduction ?? '—'}</td>
                  <td>{product.typeOfPackaging ?? '—'}</td>
                  <td>{product.palletSize ?? '—'}</td>
                  <td>{product.palletHeight ?? '—'}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ModalBody>
      <ModalFooter>
        <span className="me-auto">
          Checked: {latestProducts?.length ?? 0}, with issues: {issues.length}
        </span>
        {canFix && fixable.length > 0 && (
          <Button color="primary" onClick={fixHandler}>
            Fix {fixable.length} article(s)
          </Button>
        )}
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ArticleCheckModal;
