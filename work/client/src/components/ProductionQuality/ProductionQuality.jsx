import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import Table from '#components/Table/Table.jsx';
import { useEffect, useState } from 'react';
import ProductionQualityModal from './ProductionQualityModal';

function ProductionQuality() {
  const { PRODUCTION_QUALITY, production_quality } = useProjectContext();
  const { extractProductTitle, latestProducts } = useProductsContext();
  const { modalProductionQuality, setModalProductionQuality } = useModalContext();

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    console.log(
      'production_quality ProductionQuality.jsx line 17',
      production_quality,
    );
    const updatedData = production_quality.map((item) => {
      const product = latestProducts.find(
        (prod) => prod.article === item?.product_article,
      );

      return {
        ...item,
        production_type: extractProductTitle(product?.description),
      };
    });

    setData(updatedData);
  }, [production_quality, extractProductTitle]);

  return (
    <div>
      <Table
        COLUMN_DATA={PRODUCTION_QUALITY}
        dataOfTable={data}
        tableName={'Production quality'}
        handleRowClick={(row) => {
          setModalProductionQuality(true);
          setSelectedRow(row.original);
        }}
      />

      {modalProductionQuality && (
        <ProductionQualityModal
          show={modalProductionQuality}
          onHide={() => setModalProductionQuality(false)}
          selectedBatch={selectedRow}
        />
      )}
    </div>
  );
}

export default ProductionQuality;
