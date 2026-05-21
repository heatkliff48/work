import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

function WarehouseSummaryModal({ isOpen, toggle }) {
  const { warehouse_data } = useWarehouseContext();
  const { latestProducts } = useProductsContext();

  const aggregatedData = useMemo(() => {
    if (!warehouse_data || warehouse_data.length === 0) return [];

    const filteredData = warehouse_data.filter((item) => item.type == 'OK');

    const groupedData = filteredData.reduce((acc, item) => {
      const key = item.product_article;

      if (!acc[key]) {
        const product = latestProducts.find((p) => p.article === key);

        const prodDescription = product?.description.match(
          /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/,
        );

        acc[key] = {
          product_article: key,
          trademark: prodDescription ? prodDescription[1] : 'Unknown',
          free_quantity_remaining: 0,
          total_quantity: 0,
          ordered_quantity: 0,
        };
      }

      acc[key].free_quantity_remaining += item.free_quantity_remaining || 0;
      acc[key].total_quantity += item.total_quantity || 0;
      acc[key].ordered_quantity += item.ordered_quantity || 0;

      return acc;
    }, {});

    return Object.values(groupedData);
  }, [warehouse_data, latestProducts, isOpen]);

  return (
    <Modal show={isOpen} onHide={toggle} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Warehouse summary</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {aggregatedData.length === 0 ? (
          <p className="text-center text-muted">No data</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Trademark</th>
                <th>Total free quantity remaining, pallet</th>
                <th>Total quantity, pallet</th>
                <th>Total ordered quantity, pallet</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_article}</td>
                  <td>{item.trademark}</td>
                  <td>{item.free_quantity_remaining}</td>
                  <td>{item.total_quantity}</td>
                  <td>{item.ordered_quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={toggle}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default WarehouseSummaryModal;
