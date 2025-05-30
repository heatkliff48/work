import { useNavigate } from 'react-router-dom';
function ProductsTypeWarehouse() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1 className="main-title">Warehouse</h1>
      <div className="button-container">
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_HCCA_blocks')}
        >
          HCCA Blocks
        </button>
      </div>
      <h1 className="main-title">Auxilary Products Warehouse</h1>
      <div className="button-container">
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_dry_mixes')}
        >
          Dry mixes
        </button>
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_related_materials')}
        >
          Related materials
        </button>
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_anchors')}
        >
          Fasteners
        </button>
        <button className="nav-button" onClick={() => navigate('/warehouse_tools')}>
          Tools
        </button>
      </div>
    </div>
  );
}
export default ProductsTypeWarehouse;
