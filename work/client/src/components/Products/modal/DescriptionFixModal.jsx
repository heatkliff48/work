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
import {
  fixDescriptionTitleWidth,
  useProductsContext,
} from '#components/contexts/ProductContext.js';
import { fixProductDescriptions } from '#components/redux/actions/productsAction.js';

// Ищет во всех версиях продуктов описания с шириной в мм вместо см
// ("TERMECO 100" вместо "TERMECO 10") и правит их на месте, без новой версии
const DescriptionFixModal = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const { products } = useProductsContext();

  const issues = useMemo(
    () =>
      (products ?? [])
        .map((product) => ({
          product,
          expected: fixDescriptionTitleWidth(product.description, product.width),
        }))
        .filter(({ expected }) => expected)
        .sort(
          (a, b) =>
            a.product.article.localeCompare(b.product.article) ||
            a.product.version - b.product.version,
        ),
    [products],
  );

  const fixHandler = () => {
    dispatch(
      fixProductDescriptions(
        issues.map(({ product, expected }) => ({
          id: product.id,
          description: expected,
        })),
      ),
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Fix descriptions</ModalHeader>
      <ModalBody>
        {issues.length === 0 ? (
          <div>All {products?.length ?? 0} descriptions are correct.</div>
        ) : (
          <Table size="sm" bordered hover responsive>
            <thead>
              <tr>
                <th>Article</th>
                <th>Version</th>
                <th>Description</th>
                <th>Expected</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(({ product, expected }) => (
                <tr key={product.id}>
                  <td>{product.article}</td>
                  <td>{product.version}</td>
                  <td>{product.description}</td>
                  <td>{expected}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ModalBody>
      <ModalFooter>
        <span className="me-auto">
          Checked: {products?.length ?? 0}, with issues: {issues.length}
        </span>
        {issues.length > 0 && (
          <Button color="primary" onClick={fixHandler}>
            Fix {issues.length} description(s)
          </Button>
        )}
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DescriptionFixModal;
