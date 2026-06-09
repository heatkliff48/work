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
    return `Выбран массив с article: ${selectedCell.article}`;
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
          Удалить партию
        </button>

        <button onClick={deleteOneArrayOfSelected} disabled={!selectedCell?.article}>
          Удалить Массив
        </button>

        <button
          onClick={addArrayAfterSelected}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Добавить массив
        </button>

        <button onClick={moveBatchLater} disabled={!selectedCell?.article}>
          Поставить партию позже
        </button>

        <button
          onClick={fillToRowEnd}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Заполнить Автоклав
        </button>

        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default ProductionBatchFooter;
