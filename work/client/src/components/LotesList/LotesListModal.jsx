import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';

import {
  updateLotesListRecipe,
  updateLotesListCakesRecipe,
  updateLotesListCakesBooleanRecipe,
} from '#components/redux/actions/lotesListAction.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import QuickCheckingModal from './QuickCheckingModal';

const SECTIONS = {
  batchInfo: {
    title: 'Batch info',
    columns: 1,
    fields: [
      { label: 'Cake id start', key: 'cake_id_start', readOnly: true },
      { label: 'Cake id finish', key: 'cake_id_finish', readOnly: true },
      { label: 'Production date', key: 'production_date', type: 'date' },
      { label: 'Recepie', key: 'recipe', readOnly: true },
    ],
  },

  mixerBatch: {
    title: 'Mixer parameters',
    columns: 2,
    fields: [
      {
        label: 'Dosing order',
        key: 'dosing_order',
        type: 'select',
        options: [
          { label: 'cem+cal', value: 'cem+cal' },
          { label: 'cem→cal', value: 'cem->cal' },
          { label: 'cal→cem', value: 'cal->cem' },
        ],
      },
      {
        label: 'Delay before dosing to the mixer',
        key: 'dosing_delay_lime_sec',
      },
      { label: 'Mixer speed', key: 'mixer_speed_rpm' },
      { label: 'Mixing before Al', key: 'mixing_before_al_sec' },
      { label: 'Mixing after Al', key: 'mixing_after_al_sec' },
      { label: 'Vibrator working time', key: 'vibrator_time_sec' },
      { label: 'Vibrator working speed', key: 'vibrator_speed_hz' },
    ],
  },

  mixerCake: {
    title: 'Mixer (cake)',
    columns: 1,
    fields: [
      { label: 'W/S', key: 'water_solid_ratio' },
      { label: 'Sand slurry density', key: 'sand_slurry_density' },
      { label: 'Return slurry density', key: 'return_slurry_density' },
      { label: 'Casting temperature', key: 'casting_temp_c' },
      { label: 'Temperature in the factory', key: 'factory_temp_c' },
      { label: 'Issues with mixer', key: 'mixer_issues' },
      { label: 'Issues with oiling machine', key: 'oiling_issues' },
      { label: 'Issues with moving the mold', key: 'mold_moving_issues' },
    ],
  },

  actualRecipe: {
    title: 'Actual Recepie',
    columns: 3,
    fields: [
      { label: 'Lime, kg', key: 'lime' },
      { label: 'Sand slurry (dry), kg', key: 'sand_slurry_dry' },
      { label: 'Aluminum 1', key: 'aluminum_paste' },

      { label: 'Cement, kg', key: 'cement' },
      { label: 'Gypsum (dry), kg', key: 'gypsum_dry' },
      { label: 'Aluminum 2', key: 'aluminum_paste_2' },

      { label: 'Sand powder (dry), kg', key: 'sand_dry' },
      { label: 'Return (dry), kg', key: 'return_dry' },
      // { label: 'Water solids', key: 'w_s' },
    ],
  },

  rawMaterials: {
    title: 'Raw materials:',
    columns: 3,
    fields: [
      { label: 'Fines of the sand', key: 'sand_fines' },
      { label: 'Sand', key: 'sand_producer' },
      { label: 'Cement', key: 'cement_producer' },

      { label: 'SO3 content in sand slurry', key: 'sand_slurry_so3' },
      { label: 'Sand type', key: 'sand_type' },
      { label: 'Cement type', key: 'cement_type' },

      { label: 'SO3 content in return slurry', key: 'return_slurry_so3' },
      { label: 'Gypsum stone', key: 'gypsum_producer' },
      { label: 'Al paste', key: 'al_paste_producer' },

      { label: 'Activity of return slurry', key: 'return_slurry_activity' },
      { label: 'Gypsum', key: 'gypsum_type' },
      { label: 'Al paste 1 types', key: 'al_paste_types' },

      { label: 'Lime activity', key: 'lime_activity' },
      { label: 'Lime', key: 'lime' },
      { label: 'Al paste 1 proportions', key: 'al_paste_proportion' },

      {
        label: 'Slaking time for lime',
        key: 'lime_slaking_time_sec',
        type: 'time_mmss',
      },
      { label: 'Lime type', key: 'lime_type' },

      { label: 'Al paste 2 types', key: 'al_paste_types_2' },
      { type: 'spacer', key: '__sp_al_3' },
      { type: 'spacer', key: '__sp_al_4' },
      { label: 'Al paste 2 proportions', key: 'al_paste_proportion_2' },
    ],
  },
};

const numericKeys = new Set([
  'dosing_delay_lime_sec',
  'mixer_speed_rpm',
  'mixing_before_al_sec',
  'mixing_after_al_sec',
  'vibrator_time_sec',
  'vibrator_speed_hz',

  'lime',
  'sand_slurry_dry',
  'aluminum_paste',
  'cement',
  'gypsum_dry',
  'aluminum_paste_2',
  'sand_dry',
  'return_dry',
  'w_s',

  'sand_fines',
  'sand_slurry_so3',
  'return_slurry_so3',
  'return_slurry_activity',
  'lime_activity',

  'water_solid_ratio',
  'sand_slurry_density',
  'return_slurry_density',
  'casting_temp_c',
  'factory_temp_c',
]);

const NUMERIC_FORMATS = {
  dosing_delay_lime_sec: 2,
  mixer_speed_rpm: 2,
  mixing_before_al_sec: 2,
  mixing_after_al_sec: 2,
  vibrator_time_sec: 2,
  vibrator_speed_hz: 2,

  water_solid_ratio: 3,
  lime: 2,
  sand_slurry_dry: 2,
  aluminum_paste: 2,
  cement: 2,
  gypsum_dry: 2,
  aluminum_paste_2: 2,
  sand_dry: 2,
  return_dry: 2,

  sand_fines: 2,
  sand_slurry_so3: 2,
  return_slurry_so3: 2,
  return_slurry_activity: 2,
  lime_activity: 2,

  sand_slurry_density: 3,
  return_slurry_density: 3,

  casting_temp_c: 1,
  factory_temp_c: 1,
};

function RenderSection({
  section,
  formData,
  onChange,
  headerRight = null,
  columnsOverride = null,
}) {
  if (!section) return null;

  const cols = columnsOverride ?? section.columns ?? 1;

  const formatMMSS = (input) => {
    if (input == null) return '';

    const digits = String(input).replace(/\D/g, '').slice(0, 4);

    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };

  return (
    <div
      className="section-container mb-3"
      style={{ border: '2px solid black', padding: 0 }}
    >
      <div
        style={{
          borderBottom: '2px solid black',
          padding: '6px 10px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          backgroundColor: '#f8f9fa',
        }}
      >
        <span>{section.title}</span>
        {headerRight}
      </div>

      <div style={{ padding: 10 }}>
        <Row>
          {section.fields.map((field) => {
            if (field.type === 'spacer') {
              return <Col key={field.key} xs={12} md={12 / cols} className="mb-1" />;
            }
            const isDate = field.type === 'date';
            const value =
              isDate && formData[field.key]
                ? String(formData[field.key]).slice(0, 10)
                : (formData[field.key] ?? '');

            const isNumeric = numericKeys.has(field.key);
            const precision = NUMERIC_FORMATS[field.key];

            return (
              <Col key={field.key} xs={12} md={12 / cols} className="mb-1">
                <Form.Group as={Row} controlId={field.key}>
                  <Form.Label
                    column
                    sm={6}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {field.label}
                  </Form.Label>
                  <Col sm={6}>
                    {field.type === 'time_mmss' ? (
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="mm:ss"
                        name={field.key}
                        value={value}
                        onChange={(e) =>
                          onChange({
                            target: {
                              name: field.key,
                              value: formatMMSS(e.target.value),
                            },
                          })
                        }
                      />
                    ) : field.type === 'select' ? (
                      <Form.Select
                        size="sm"
                        name={field.key}
                        value={value}
                        onChange={onChange}
                      >
                        {field.options.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.value === ''}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        size="sm"
                        type={isNumeric ? 'number' : field.type || 'text'}
                        step={
                          isNumeric && precision != null
                            ? Number(`0.${'0'.repeat(precision - 1)}1`)
                            : undefined
                        }
                        inputMode={isNumeric ? 'decimal' : undefined}
                        name={field.key}
                        value={value}
                        readOnly={!!field.readOnly}
                        disabled={!!field.readOnly}
                        onChange={onChange}
                      />
                    )}
                  </Col>
                </Form.Group>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

function RecipeInfoModal({ selectedRecipe, show, onHide }) {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { showQuickChecking, setShowQuickChecking } = useModalContext();

  const lotesListCakes = useSelector((state) => state.lotesListCakes);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cakeData, setCakeData] = useState({});
  const [batchData, setBatchData] = useState({});
  const [selectedCakeId, setSelectedCakeId] = useState(null);
  const [applyToAllCakes, setApplyToAllCakes] = useState(false);

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'recipe_products');
  //     setUserAccess(access);
  //     if (!access?.canRead) navigate('/');
  //   }
  // }, [user, roles]);

  const getCakeFromStore = (cakeId) => {
    const idNum = Number(cakeId);
    if (!Number.isFinite(idNum)) return null;

    const fromRedux = Array.isArray(lotesListCakes)
      ? lotesListCakes.find((el) => Number(el?.id) === idNum)
      : null;

    if (fromRedux) return fromRedux;

    const fromRecipe = Array.isArray(selectedRecipe?.lotes_list_cakes)
      ? selectedRecipe.lotes_list_cakes.find((el) => Number(el?.id) === idNum)
      : null;

    return fromRecipe || null;
  };

  useEffect(() => {
    if (!selectedRecipe) return;

    setBatchData({ ...selectedRecipe });

    const related = Array.isArray(selectedRecipe.relatedBatches)
      ? selectedRecipe.relatedBatches
      : [];

    const starts = related
      .map((b) => Number(b?.cake_id_start))
      .filter(Number.isFinite);

    const minStart = starts.length
      ? Math.min(...starts)
      : Number(selectedRecipe.cake_id_start);

    setSelectedCakeId(Number.isFinite(minStart) ? minStart : null);
  }, [selectedRecipe]);

  useEffect(() => {
    if (selectedCakeId == null) {
      setCakeData({});
      return;
    }

    const found = getCakeFromStore(selectedCakeId);
    setCakeData(found ? { ...found } : { id: Number(selectedCakeId) });
  }, [selectedCakeId, lotesListCakes, selectedRecipe]);

  const batchCakeRange = useMemo(() => {
    const related = Array.isArray(batchData.relatedBatches)
      ? batchData.relatedBatches
      : [];

    const fallbackStart = Number(batchData.cake_id_start);
    const fallbackFinish = Number(batchData.cake_id_finish);

    let minStart = Number.isFinite(fallbackStart) ? fallbackStart : null;
    let maxFinish = Number.isFinite(fallbackFinish) ? fallbackFinish : null;

    for (const b of related) {
      const s = Number(b?.cake_id_start);
      const f = Number(b?.cake_id_finish);
      if (!Number.isFinite(s) || !Number.isFinite(f)) continue;

      if (minStart == null || s < minStart) minStart = s;
      if (maxFinish == null || f > maxFinish) maxFinish = f;
    }

    if (
      minStart == null ||
      maxFinish == null ||
      !Number.isFinite(minStart) ||
      !Number.isFinite(maxFinish) ||
      maxFinish < minStart
    ) {
      return { start: null, finish: null };
    }

    return { start: minStart, finish: maxFinish };
  }, [batchData.relatedBatches, batchData.cake_id_start, batchData.cake_id_finish]);

  const cakeOptions = useMemo(() => {
    const start = Number(batchCakeRange.start);
    const finish = Number(batchCakeRange.finish);

    if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start)
      return [];

    const arr = [];
    for (let i = start; i <= finish; i += 1) arr.push(i);
    return arr;
  }, [batchCakeRange.start, batchCakeRange.finish]);

  const cakeSelectOptions = useMemo(() => {
    return ['all', ...cakeOptions];
  }, [cakeOptions]);

  const quickCheckingInitialByCake = useMemo(() => {
    const map = {};
    cakeOptions.forEach((id) => {
      const c = getCakeFromStore(id);
      if (c) map[id] = c;
    });
    return map;
  }, [cakeOptions, lotesListCakes, selectedRecipe]);

  const roundTo = (value, digits) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const p = 10 ** digits;
    return Math.round(n * p) / p;
  };

  const limitDecimals = (raw, digits) => {
    if (raw === '' || raw == null) return '';

    let s = String(raw).replace(',', '.');

    s = s.replace(/[^\d.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
    }

    if (digits == null) return s;

    const [intPart, fracPart = ''] = s.split('.');
    if (s.includes('.')) {
      return `${intPart}.${fracPart.slice(0, digits)}`;
    }
    return intPart;
  };

  const handleBatchChange = (e) => {
    const { name, value } = e.target;

    if (!numericKeys.has(name)) {
      setBatchData((p) => ({ ...p, [name]: value }));
      return;
    }

    const precision = NUMERIC_FORMATS[name];

    const limited = value === '' ? '' : limitDecimals(value, precision);

    const next =
      limited === ''
        ? ''
        : precision != null
          ? roundTo(limited, precision)
          : Number(limited);

    setBatchData((p) => ({ ...p, [name]: next }));
  };

  const handleCakeChange = (e) => {
    const { name, value } = e.target;

    if (!numericKeys.has(name)) {
      setCakeData((p) => ({ ...p, [name]: value }));
      return;
    }

    const precision = NUMERIC_FORMATS[name];
    const limited = value === '' ? '' : limitDecimals(value, precision);

    const next =
      limited === ''
        ? ''
        : precision != null
          ? roundTo(limited, precision)
          : Number(limited);

    setCakeData((p) => ({ ...p, [name]: next }));
  };

  // const onSelectCake = (nextValue) => {
  //   if (nextValue === 'all') {
  //     setApplyToAllCakes(true);
  //     return;
  //   }

  //   const nextCakeId = Number(nextValue);
  //   if (!Number.isFinite(nextCakeId)) return;

  //   setApplyToAllCakes(false);
  //   setSelectedCakeId(nextCakeId);

  //   const found = getCakeFromStore(nextCakeId);
  //   setCakeData(found ? { ...found } : { id: nextCakeId });
  // };

  const onSelectCake = (nextValue) => {
    if (nextValue === 'all') {
      setApplyToAllCakes(true);
      return;
    }

    const nextCakeId = Number(nextValue);
    if (!Number.isFinite(nextCakeId)) return;

    setApplyToAllCakes(false);
    setSelectedCakeId(nextCakeId);

    const found = getCakeFromStore(nextCakeId);
    setCakeData(found ? { ...found } : { id: nextCakeId });

    setBatchData((prev) => {
      const related = Array.isArray(prev.relatedBatches) ? prev.relatedBatches : [];

      const match = related.find((b) => {
        const s = Number(b?.cake_id_start);
        const f = Number(b?.cake_id_finish);
        return (
          Number.isFinite(s) &&
          Number.isFinite(f) &&
          nextCakeId >= s &&
          nextCakeId <= f
        );
      });

      if (!match) return prev;

      const nextSub = Number(match.sub_batch_id);
      const currentSub = Number(prev.sub_batch_id ?? prev.activeSubBatchId);

      if (
        Number.isFinite(nextSub) &&
        Number.isFinite(currentSub) &&
        nextSub === currentSub
      ) {
        return prev;
      }

      return {
        ...prev,
        ...match,
        relatedBatches: related,
        activeSubBatchId: Number.isFinite(nextSub) ? nextSub : prev.activeSubBatchId,
        sub_batch_id: Number.isFinite(nextSub) ? nextSub : prev.sub_batch_id,
      };
    });
  };

  const onSelectSubBatch = (nextSubRaw) => {
    const nextSub = Number(nextSubRaw);
    if (!Number.isFinite(nextSub)) return;

    const related = Array.isArray(batchData.relatedBatches)
      ? batchData.relatedBatches
      : [];

    const nextBatch = related.find((b) => Number(b?.sub_batch_id) === nextSub);
    if (!nextBatch) return;

    setBatchData((prev) => ({
      ...prev,
      ...nextBatch,
      relatedBatches: related,
      activeSubBatchId: nextSub,
    }));

    const rangeStart = Number(batchCakeRange.start);
    const rangeFinish = Number(batchCakeRange.finish);

    if (
      Number.isFinite(rangeStart) &&
      Number.isFinite(rangeFinish) &&
      rangeFinish >= rangeStart
    ) {
      setSelectedCakeId((prevId) => {
        const prev = Number(prevId);
        if (Number.isFinite(prev) && prev >= rangeStart && prev <= rangeFinish) {
          return prev;
        }
        return rangeStart;
      });
    }
  };

  const buildBatchPayload = () => {
    const {
      relatedBatches,
      relatedBatchesRecipes,
      activeSubBatchId,
      activeBatchId,
      ...payload
    } = batchData;

    if (activeSubBatchId != null) payload.sub_batch_id = Number(activeSubBatchId);

    return payload;
  };

  const resolveActiveBatchIds = () => {
    const related = Array.isArray(batchData.relatedBatches)
      ? batchData.relatedBatches
      : [];

    const wantedSub = Number(batchData.sub_batch_id ?? batchData.activeSubBatchId);
    if (Number.isFinite(wantedSub)) {
      const bySub = related.find((b) => Number(b?.sub_batch_id) === wantedSub);
      if (bySub) {
        return {
          batch_id: Number(bySub.batch_id ?? batchData.batch_id),
          sub_batch_id: Number(bySub.sub_batch_id),
          cake_id_start: Number(bySub.cake_id_start),
          cake_id_finish: Number(bySub.cake_id_finish),
        };
      }
    }

    const cakeId = Number(selectedCakeId);
    if (Number.isFinite(cakeId)) {
      const byCake = related.find((b) => {
        const s = Number(b?.cake_id_start);
        const f = Number(b?.cake_id_finish);
        return (
          Number.isFinite(s) && Number.isFinite(f) && cakeId >= s && cakeId <= f
        );
      });

      if (byCake) {
        return {
          batch_id: Number(byCake.batch_id ?? batchData.batch_id),
          sub_batch_id: Number(byCake.sub_batch_id),
          cake_id_start: Number(byCake.cake_id_start),
          cake_id_finish: Number(byCake.cake_id_finish),
        };
      }
    }

    return {
      batch_id: Number(batchData.batch_id),
      sub_batch_id: Number(batchData.sub_batch_id ?? batchData.activeSubBatchId),
      cake_id_start: Number(batchData.cake_id_start),
      cake_id_finish: Number(batchData.cake_id_finish),
    };
  };

  const buildBatchUpdates = () => {
    const {
      relatedBatches,
      relatedBatchesRecipes,
      activeSubBatchId,
      activeBatchId,

      id,
      batch_id,
      sub_batch_id,
      cake_id_start,
      cake_id_finish,

      ...updates
    } = batchData;

    return updates;
  };

  // const buildSingleCakePayload = (cake_id) => {
  //   return {
  //     ...cakeData,
  //     id: cake_id,
  //   };
  // };

  const UI_ONLY_CAKE_KEYS = new Set(['al_paste_types_2', 'al_paste_proportion_2']);

  const stripUiOnlyKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const out = { ...obj };
    for (const k of UI_ONLY_CAKE_KEYS) delete out[k];
    return out;
  };

  const buildSingleCakePayload = (cake_id) => {
    const cleanedCakeData = stripUiOnlyKeys(cakeData);

    return {
      ...cleanedCakeData,
      id: cake_id,
    };
  };

  const buildCakePayloads = () => {
    if (applyToAllCakes) {
      return cakeOptions.map((id) => buildSingleCakePayload(Number(id)));
    }

    if (selectedCakeId == null) return [];
    return [buildSingleCakePayload(Number(selectedCakeId))];
  };

  // const onSaveAll = async (e) => {
  //   e.preventDefault();

  //   const batchPayload = buildBatchPayload();
  //   dispatch(updateLotesListRecipe(batchPayload));

  //   const cakePayloads = buildCakePayloads();

  //   for (const payload of cakePayloads) {
  //     dispatch(updateLotesListCakesRecipe(payload));
  //   }

  //   setApplyToAllCakes(false);
  //   onHide();
  // };

  const onSaveAll = async (e) => {
    e.preventDefault();

    const ids = resolveActiveBatchIds();
    const updates = buildBatchUpdates();

    dispatch(updateLotesListRecipe({ ids, updates }));

    const cakePayloads = buildCakePayloads();
    console.log('ids LotesListModal.jsx line 764', ids);
    console.log('updates LotesListModal.jsx line 765', updates);
    console.log('cakePayloads LotesListModal.jsx line 764', cakePayloads);
    for (const payload of cakePayloads) {
      dispatch(updateLotesListCakesRecipe({ ids, payload }));
    }

    setApplyToAllCakes(false);
    onHide();
  };

  const onSaveQuickChecking = (changes) => {
    dispatch(updateLotesListCakesBooleanRecipe(changes));
    setShowQuickChecking(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        dialogClassName="modal-auto-size"
      >
        <Modal.Title
          className="d-flex align-items-center gap-2"
          style={{ padding: '12px 16px' }}
        >
          <span>
            Batch Details: {batchData.batch_id} / sub {batchData.sub_batch_id}
          </span>

          {Array.isArray(batchData.relatedBatches) &&
            batchData.relatedBatches.length > 1 && (
              <>
                <span className="ms-3" style={{ fontWeight: 600 }}>
                  sub
                </span>

                <Form.Select
                  size="sm"
                  style={{ width: 140 }}
                  value={batchData.sub_batch_id ?? batchData.activeSubBatchId ?? ''}
                  onChange={(e) => onSelectSubBatch(e.target.value)}
                >
                  {batchData.relatedBatches
                    .slice()
                    .sort((a, b) => Number(a.sub_batch_id) - Number(b.sub_batch_id))
                    .map((b) => (
                      <option key={b.sub_batch_id} value={b.sub_batch_id}>
                        {b.sub_batch_id}
                      </option>
                    ))}
                </Form.Select>
              </>
            )}
        </Modal.Title>

        <Modal.Body>
          <Container fluid>
            <Form onSubmit={onSaveAll}>
              <Row>
                <Col md={4}>
                  <RenderSection
                    section={SECTIONS.batchInfo}
                    formData={batchData}
                    onChange={handleBatchChange}
                  />
                </Col>

                <Col md={4}>
                  <RenderSection
                    section={SECTIONS.mixerBatch}
                    formData={batchData}
                    onChange={handleBatchChange}
                  />
                </Col>

                <Col md={4}>
                  <RenderSection
                    section={SECTIONS.mixerCake}
                    formData={cakeData}
                    onChange={handleCakeChange}
                    headerRight={
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontWeight: 600 }}>cake id</span>

                        <Form.Check
                          type="checkbox"
                          label="all"
                          checked={applyToAllCakes}
                          onChange={(e) => setApplyToAllCakes(e.target.checked)}
                        />

                        <Form.Select
                          size="sm"
                          style={{ width: 140 }}
                          value={applyToAllCakes ? 'all' : (selectedCakeId ?? '')}
                          onChange={(e) => onSelectCake(e.target.value)}
                          disabled={!cakeOptions.length || applyToAllCakes}
                        >
                          {cakeSelectOptions.map((v) => (
                            <option key={String(v)} value={String(v)}>
                              {v === 'all' ? 'all' : v}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    }
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <RenderSection
                    section={SECTIONS.actualRecipe}
                    formData={batchData}
                    onChange={handleBatchChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <RenderSection
                    section={SECTIONS.rawMaterials}
                    formData={cakeData}
                    onChange={handleCakeChange}
                  />
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setShowQuickChecking(true)}
          >
            Show quick checking
          </Button>

          {userAccess?.canWrite && (
            <Button variant="primary" onClick={onSaveAll}>
              Save
            </Button>
          )}
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <QuickCheckingModal
        show={showQuickChecking}
        onHide={() => setShowQuickChecking(false)}
        cakeOptions={cakeOptions}
        initialRecipe={quickCheckingInitialByCake}
        onSave={onSaveQuickChecking}
      />
    </>
  );
}

export default RecipeInfoModal;
