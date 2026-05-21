import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import { getAllWarehouse } from '#components/redux/actions/warehouseAction.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '#components/Styles/main-pages.css';

function ProductsTypeWarehouse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllWarehouse());
    dispatch(getDryMixesWarehouse());
    dispatch(getAnchorsWarehouse());
    dispatch(getToolsWarehouse());
    dispatch(getRelatedMaterialsWarehouse());
  }, []);

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
      <h1 className="main-title">Raw Materials Warehouse</h1>
      <div className="button-container">
        <button
          className="nav-button"
          onClick={() => navigate('/warehouse_raw_materials')}
        >
          Raw Materials
        </button>
      </div>
    </div>
  );
}
export default ProductsTypeWarehouse;
