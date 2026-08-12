import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductionBatchFooter() {
  const navigate = useNavigate();
  const {
    selectedCell,
    deleteBatchBySelectedArticle,
    deleteOneArrayOfSelected,
    addArrayAfterSelected,
    moveBatchLater,
    fillToRowEnd,
    onSaveHandler,
    onSaveEditHandler,
    isEditMode,
  } = useAutoclaveContext();

  const handleSaveClick = async () => {
    const saved = isEditMode ? await onSaveEditHandler() : await onSaveHandler();
    if (saved) navigate('/batch_outside');
  };

  const selectedLabel = useMemo(() => {
    if (!selectedCell?.article) return null;
    return `Selected cake with article: ${selectedCell.article}`;
  }, [selectedCell]);

  return (
    <div className="autoclave-buttons-container">
      {selectedLabel && (
        <div className="autoclave-selected-label">{selectedLabel}</div>
      )}

      <div className="autoclave-buttons-row">
        <button
          onClick={deleteBatchBySelectedArticle}
          disabled={!selectedCell?.article}
        >
          Delete batch
        </button>

        <button onClick={deleteOneArrayOfSelected} disabled={!selectedCell?.article}>
          Delete cake
        </button>

        <button
          onClick={addArrayAfterSelected}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Add cake
        </button>

        <button onClick={moveBatchLater} disabled={!selectedCell?.article}>
          Move batch later
        </button>

        <button
          onClick={fillToRowEnd}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Fill autoclave
        </button>

        <button onClick={handleSaveClick}>
          {isEditMode ? 'Save edits' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default ProductionBatchFooter;
