import {
  getDryMixesJournal,
  getRelatedMaterialsJournal,
} from '#components/redux/actions/productsTypeJournalAction.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function ProductsTypeJournal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getDryMixesJournal());
    dispatch(getRelatedMaterialsJournal());
  }, []);

  return (
    <div className="main-container">
      <h1 className="main-title">Products Type Journal</h1>
      <div className="button-container">
        <button className="nav-button" onClick={() => navigate('/products')}>
          Blocks journal
        </button>
        <button
          className="nav-button"
          onClick={() => navigate('/dry_mixes_journal')}
        >
          Dry mixes journal
        </button>
        <button
          className="nav-button"
          onClick={() => navigate('/related_materials_journal')}
        >
          Related materials journal
        </button>
      </div>
    </div>
  );
}
export default ProductsTypeJournal;
