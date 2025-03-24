import { useNavigate } from 'react-router-dom';
function ProductsTypeJournal() {
  const navigate = useNavigate();

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
        <button className="nav-button" onClick={() => navigate('/anchors')}>
          Anchors
        </button>
        <button className="nav-button" onClick={() => navigate('/tools')}>
          Tools
        </button>
      </div>
    </div>
  );
}
export default ProductsTypeJournal;
