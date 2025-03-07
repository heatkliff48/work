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
    <div>
      <p>Products Type Journal</p>
      <button onClick={() => navigate('/products')}>Blocks journal</button>
      <button onClick={() => navigate('/dry_mixes_journal')}>
        Dry mixes journal
      </button>
      <button onClick={() => navigate('/related_materials_journal')}>
        Related materials journal
      </button>
    </div>
  );
}
export default ProductsTypeJournal;
