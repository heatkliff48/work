import { useEffect, useMemo, useState } from 'react';
import { Button } from 'reactstrap';
import CackeFillUpModal from './CackeFillUpModal';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch } from 'react-redux';
import {
  addNewLotesListCakes,
  updateLotesListNotes,
} from '#components/redux/actions/lotesListAction.js';
import { updateBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import { addNewRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

function CackeFillUp() {
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const { batchOutside } = useWarehouseContext();
  const { cackeFillUp, setCackeFillUp, lotesListBatches, lotesListCakes } =
    useProjectContext();
  const { latestProducts } = useProductsContext();
  const { list_of_recipes, recipeOrders } = useRecipeContext();

  const [allocated, setAllocated] = useState(0);
  const [cakeIds, setCakeIds] = useState([]);
  const [finish, setFinish] = useState(false);

  const [activeCakeId, setActiveCakeId] = useState(null);
  const [cakeNotes, setCakeNotes] = useState({});

  useEffect(() => {
    const batch_in_produce = batchOutside.find((el) => el.is_prodused == 1);

    if (batch_in_produce) {
      const product = latestProducts.find(
        (el) => el.article === batch_in_produce?.product_article,
      );

      const total_cacke = batch_in_produce.quantity_pallets / product?.widthInArray;
      setCackeFillUp({ ...batch_in_produce, total_cacke });
    }
  }, [batchOutside]);

  useEffect(() => {
    setAllocated(0);
    setCakeIds([]);
    setFinish(false);
    setActiveCakeId(null);
    setCakeNotes({});
  }, []);

  const nextBatchId = useMemo(() => {
    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const maxId = list.reduce((acc, it) => {
      const v = Number(it?.batch_id);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);
    return maxId + 1;
  }, [lotesListBatches]);

  const lastCakeId = useMemo(() => {
    const list = Array.isArray(lotesListCakes) ? lotesListCakes : [];
    const maxId = list.reduce((acc, it) => {
      const v = Number(it?.id);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);
    return maxId;
  }, [lotesListCakes]);

  const totalCake =
    Number(cackeFillUp?.total_cacke ?? cackeFillUp?.total_quantity_plan ?? 0) || 0;

  const batchCalDate = cackeFillUp?.date ?? cackeFillUp?.batch_cal_date ?? '';

  const handlePlus = () => {
    if (totalCake > 0 && allocated >= totalCake) return;

    const newId = lastCakeId + cakeIds.length + 1;
    setCakeIds((prev) => [...prev, newId]);
    setAllocated((prev) => prev + 1);
  };

  const handleMinus = () => {
    setCakeIds((prev) => {
      if (!prev.length) return prev;
      return prev.slice(0, -1);
    });
    setAllocated((prev) => Math.max(0, prev - 1));
  };

  const handleSave = () => {
    const { id } = cackeFillUp;
    dispatch(addNewLotesListCakes({ num: cakeIds.length }));

    if (!finish) {
      dispatch(
        updateBatchOutside({
          id,
          is_prodused: 0,
        }),
      );
    }

    const cacke_id_start = cakeIds[cakeIds.length - 1];

    const recipe = recipeOrders.find((recipe) => recipe.id_batch === id);

    const recipeDetails = list_of_recipes.find(
      (rec) => rec.id === recipe?.id_recipe,
    );

    dispatch(
      addNewRawMatConsumption({
        batch_id: nextBatchId,
        production_volume: allocated,
        recipe_article: recipeDetails?.article,
        cacke_id_start,
        date: cackeFillUp.date,
      }),
    );
  };

  const handleSaveNote = () => {
    dispatch(
      updateLotesListNotes({
        id: cackeFillUp.id,
        note: cakeNotes,
      }),
    );
  };

  const hasCackeFillUp = cackeFillUp && Object.keys(cackeFillUp).length > 0;

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Start new batch
      </Button>

      {hasCackeFillUp && (
        <div className="mt-3" style={{ maxWidth: 900 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1.6fr 1.2fr',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Batch id</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{nextBatchId}</div>
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>Date</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{batchCalDate}</div>
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>Total cacke</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{totalCake}</div>
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>Cackes allocated</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{allocated}</div>
            </div>
          </div>

          <div
            className="mt-2"
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <Button color="success" onClick={handlePlus} style={{ minWidth: 60 }}>
              +
            </Button>
            <Button color="success" onClick={handleMinus} style={{ minWidth: 60 }}>
              -
            </Button>

            <label
              className="ms-2"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <input
                type="checkbox"
                checked={finish}
                onChange={(e) => setFinish(e.target.checked)}
              />
              Finish
            </label>

            <Button color="success" onClick={handleSave} className="ms-auto">
              Save
            </Button>
          </div>

          <div className="mt-3">
            <div style={{ fontWeight: 600 }}>Cacke id</div>
            <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
              {cakeIds.map((id) => {
                const isActive = activeCakeId === id;

                return (
                  <div key={id}>
                    <div
                      onClick={() => setActiveCakeId(isActive ? null : id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveCakeId(isActive ? null : id);
                        }
                      }}
                      style={{
                        border: isActive
                          ? '2px solid #28a745'
                          : '1px solid rgba(0,0,0,0.25)',
                        borderRadius: 10,
                        padding: '6px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        userSelect: 'none',
                        background: isActive
                          ? 'rgba(40,167,69,0.08)'
                          : 'transparent',
                        fontWeight: 600,
                        width: 'fit-content',
                      }}
                      title="Нажми, чтобы добавить заметку"
                    >
                      <span style={{ opacity: 0.7 }}>#</span>
                      <span>{id}</span>
                      <span style={{ marginLeft: 6, opacity: 0.6, fontWeight: 400 }}>
                        {isActive ? '▲ note' : '▼ note'}
                      </span>
                    </div>

                    {isActive && (
                      <div style={{ marginTop: 6 }}>
                        <textarea
                          rows={3}
                          placeholder={`Заметка для cake id ${id}...`}
                          value={cakeNotes[id] ?? ''}
                          onChange={(e) =>
                            setCakeNotes((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            maxWidth: 520,
                            borderRadius: 10,
                            padding: 10,
                            border: '1px solid rgba(0,0,0,0.25)',
                            outline: 'none',
                            display: 'block',
                          }}
                        />

                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCakeId(null);
                              handleSaveNote();
                            }}
                            style={{
                              borderRadius: 10,
                              padding: '8px 12px',
                              border: '1px solid rgba(0,0,0,0.25)',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Сохранить
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCakeId(null)}
                            style={{
                              borderRadius: 10,
                              padding: '8px 12px',
                              border: '1px solid rgba(0,0,0,0.25)',
                              cursor: 'pointer',
                              opacity: 0.8,
                            }}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {modalShow && (
        <CackeFillUpModal show={modalShow} onHide={() => setModalShow(false)} />
      )}
    </>
  );
}

export default CackeFillUp;
