import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import { useMemo } from 'react';

function ProductionBatchFooter() {
  const {
    selectedCell,
    deleteBatchBySelectedArticle,
    deleteOneArrayOfSelected,
    addArrayAfterSelected,
    moveBatchLater,
    fillToRowEnd,
    onSaveHandler,
  } = useAutoclaveContext();

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

        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default ProductionBatchFooter;
