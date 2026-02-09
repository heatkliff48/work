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
import { useProjectContext } from '#components/contexts/Context.js';
import FilesMain from '#components/FileUpload/LotesList/FilesMain.jsx';

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
        label: 'Delay before mixer cement, sec',
        key: 'dosing_delay_cem_sec',
      },
      {
        label: 'Delay before mixer cal, sec',
        key: 'dosing_delay_lime_sec',
      },
      { label: 'Mixer speed', key: 'mixer_speed_rpm' },
      { label: 'Mixing before Al, sec', key: 'mixing_before_al_sec' },
      { label: 'Mixing after Al, sec', key: 'mixing_after_al_sec' },
      { label: 'Vibrator working time, sec', key: 'vibrator_time_sec' },
      { label: 'Vibrator working speed', key: 'vibrator_speed_hz' },
    ],
  },

  mixerCake: {
    title: 'Mixer (cake)',
    columns: 1,
    fields: [
      { label: 'W/S', key: 'water_solid_ratio' },
      { label: 'Sand slurry density, kg/l', key: 'sand_slurry_density' },
      { label: 'Return slurry density, kg/l', key: 'return_slurry_density' },
      { label: 'Casting temperature, C', key: 'casting_temp_c' },
      { label: 'Temperature in the factory, C', key: 'factory_temp_c' },
      { label: 'Issues with mixer', key: 'mixer_issues' },
      { label: 'Issues with oiling machine', key: 'oiling_issues' },
      { label: 'Issues with moving the mold', key: 'mold_moving_issues' },
      { label: 'Mold id', key: 'mold_id' },
      { label: 'Flowability, cm', key: 'flowability' },
    ],
  },

  notes: {
    title: 'Notes',
    isNotes: true,
    columns: 1,
    fields: [{ label: 'Comment', key: 'note', type: 'textarea', rows: 3 }],
  },

  actualRecipe: {
    title: 'Actual Recepie',
    columns: 3,
    fields: [
      { label: 'Lime, kg', key: 'lime' },
      { label: 'Sand slurry (dry), kg', key: 'sand_slurry_dry' },
      { label: 'Aluminum 1, kg', key: 'aluminum_paste' },

      { label: 'Cement, kg', key: 'cement' },
      { label: 'Gypsum (dry), kg', key: 'gypsum_dry' },
      { label: 'Aluminum 2, kg', key: 'aluminum_paste_2' },

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
      { label: 'Lime', key: 'lime_producer' },
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
  fermentationArea: {
    title: 'Fermentation area',
    columns: 3,
    fields: [
      { label: 'Temperature, C', key: 'temperature_ferm' },
      { label: 'Precuring time, min', key: 'precuring_time' },
      { label: 'Reaction time, min', key: 'reaction_time' },

      { label: 'Cake height, cm', key: 'cake_height' },
      { label: 'Shrinkage, cm', key: 'shrinkage' },
      { label: 'Plasticity', key: 'plasticity' },

      { label: 'Surface of the cake', key: 'surface_of_the_cake' },
      { label: 'Issues with the cake', key: 'issues_with_the_cake' },
      { label: 'Issues with moving the mold', key: 'issues_with_moving_the_mold' },

      { label: 'Issues with position', key: 'issues_with_position' },
    ],
  },

  cuttingLine: {
    title: 'Cutting line (green line)',
    columns: 3,
    fields: [
      { label: 'Cutting temperature, C', key: 'cutting_temperature' },
      { label: 'Dimensions, mm', key: 'dimensions', type: 'dimensions_3x3x3' },
      { label: 'Issues with cake', key: 'issues_with_cake' },

      { label: 'Issues with wires', key: 'issues_with_wires' },
      { label: 'Issues with cutting line', key: 'issues_with_cutting_line' },
      { label: 'Tilting table', key: 'tilting_table' },

      { label: 'Separation table', key: 'separation_table' },
      { label: 'Grid number', key: 'grid_number' },
      { label: 'Waiting tunnel number', key: 'waiting_tunnel_number' },

      { label: 'Delays before autoclave', key: 'delays_before_autoclave' },
    ],
  },
};

const numericKeys = new Set([
  'dosing_delay_cem_sec',
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
  // 'w_s',
  'mold_id',
  'flowability',

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

  'temperature_ferm',
  'precuring_time',
  'reaction_time',
  'cake_height',
  'shrinkage',
  'cutting_temperature',

  'plasticity',
  'grid_number',
  'waiting_tunnel_number',
]);

const NUMERIC_FORMATS = {
  dosing_delay_cem_sec: 2,
  dosing_delay_lime_sec: 2,
  mixer_speed_rpm: 2,
  mixing_before_al_sec: 2,
  mixing_after_al_sec: 2,
  vibrator_time_sec: 2,
  vibrator_speed_hz: 2,
  flowability: 1,

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

  temperature_ferm: 2,
  precuring_time: 2,
  reaction_time: 2,
  cake_height: 2,
  shrinkage: 2,
  cutting_temperature: 2,
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
  const isNotes = !!section.isNotes;

  const formatMMSS = (input) => {
    if (input == null) return '';

    const digits = String(input).replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };

  const formatDimensions3x3x3 = (input) => {
    if (input == null) return '';

    const digits = String(input).replace(/\D/g, '').slice(0, 9);

    if (digits.length <= 3) return digits;

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}x${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)}x${digits.slice(3, 6)}x${digits.slice(6)}`;
  };

  return (
    <div
      className="section-container mb-3"
      style={{
        border: isNotes ? '2px solid black' : '2px solid black',
        padding: 0,
      }}
    >
      <div
        style={{
          borderBottom: isNotes ? '2px solid black' : '2px solid black',
          padding: '6px 10px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          backgroundColor: isNotes ? '#f5a623' : '#f8f9fa',
          color: '#000',
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
                : formData[field.key] ?? '';

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
                    {field.type === 'dimensions_3x3x3' ? (
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="600x300x250"
                        name={field.key}
                        value={value}
                        onChange={(e) =>
                          onChange({
                            target: {
                              name: field.key,
                              value: formatDimensions3x3x3(e.target.value),
                            },
                          })
                        }
                      />
                    ) : field.type === 'time_mmss' ? (
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
                    ) : field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={field.rows ?? 3}
                        size="sm"
                        name={field.key}
                        value={value}
                        onChange={onChange}
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
  const { DEFAULT_RAW_MATERIAL_VALUES } = useProjectContext();
  const lotesListCakes = useSelector((state) => state.lotesListCakes);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cakeData, setCakeData] = useState({});
  const [batchData, setBatchData] = useState({});
  const [selectedCakeId, setSelectedCakeId] = useState(null);
  const [applyToAllCakes, setApplyToAllCakes] = useState(false);
  const [saveSubBatch, setSaveSubBatch] = useState(false);
  const [slurried, setSlurried] = useState(false);

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

  const RAW_MATERIAL_KEYS = SECTIONS.rawMaterials.fields
    .filter((f) => f.key && f.type !== 'spacer')
    .map((f) => f.key);

  const MIXER_BATCH_KEYS = SECTIONS.mixerBatch.fields
    .filter((f) => f.key && f.type !== 'spacer')
    .map((f) => f.key);

  const DEFAULT_KEYS = [...RAW_MATERIAL_KEYS, ...MIXER_BATCH_KEYS];

  const applyRawMaterialDefaults = (data) => {
    const next = { ...data };

    DEFAULT_RAW_MATERIAL_VALUES.forEach(({ key, value }) => {
      if (!DEFAULT_KEYS.includes(key)) return;

      if (key in data && data[key] !== null && data[key] !== undefined) {
        return;
      }

      next[key] = value;
    });

    return next;
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
      const result = applyRawMaterialDefaults({});
      setCakeData(result);
      console.log('result LotesListModal.jsx line 424', result);
      return;
    }

    const found = getCakeFromStore(selectedCakeId);

    const baseData = found ? { ...found } : { id: Number(selectedCakeId) };

    console.log('baseData LotesListModal.jsx line 430', baseData);
    setCakeData(applyRawMaterialDefaults(baseData));
  }, [selectedCakeId, lotesListCakes, selectedRecipe]);

  useEffect(() => {
    setSlurried(batchData.slurried);
  }, [batchData]);

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
          quantity_cakes: Number(bySub.quantity_cakes),
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
          quantity_cakes: Number(byCake.quantity_cakes),
        };
      }
    }

    return {
      batch_id: Number(batchData.batch_id),
      sub_batch_id: Number(batchData.sub_batch_id ?? batchData.activeSubBatchId),
      cake_id_start: Number(batchData.cake_id_start),
      cake_id_finish: Number(batchData.cake_id_finish),
      quantity_cakes: Number(batchData.quantity_cakes),
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

    console.log('batchData LotesListModal.jsx line 678', batchData);
    return updates;
  };

  const stripUiOnlyKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const out = { ...obj };

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

  const buildSubBatchCakePayloads = (ids) => {
    const start = Number(ids?.cake_id_start);
    const finish = Number(ids?.cake_id_finish);

    if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start)
      return [];

    const arr = [];
    for (let id = start; id <= finish; id += 1) {
      arr.push(buildSingleCakePayload(id));
    }
    return arr;
  };

  const onSaveAll = async (e) => {
    e.preventDefault();

    const ids = resolveActiveBatchIds();
    const updates = buildBatchUpdates();

    dispatch(updateLotesListRecipe({ ids, updates }));

    const cakePayloads = saveSubBatch
      ? buildSubBatchCakePayloads(ids)
      : buildCakePayloads();
    console.log('cakePayloads LotesListModal.jsx line 777', cakePayloads);
    dispatch(updateLotesListCakesRecipe({ ids, payloads: cakePayloads }));

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

          <Form.Check
            type="checkbox"
            label="Save to all this sub-batch cakes"
            checked={saveSubBatch}
            onChange={(e) => {
              const v = e.target.checked;
              setSaveSubBatch(v);
              if (v) setApplyToAllCakes(false);
            }}
          />

          <Form.Check
            type="checkbox"
            label="Slurried"
            disabled
            checked={slurried}
            onChange={(e) => {
              const v = e.target.checked;
              setSlurried(v);
              setBatchData((p) => ({ ...p, slurried: v }));
            }}
          />
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
                    formData={cakeData}
                    onChange={handleCakeChange}
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
                          value={applyToAllCakes ? 'all' : selectedCakeId ?? ''}
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
                    section={SECTIONS.notes}
                    formData={batchData}
                    onChange={handleBatchChange}
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
                <Col md={6}>
                  <RenderSection
                    section={SECTIONS.fermentationArea}
                    formData={cakeData}
                    onChange={handleCakeChange}
                  />
                </Col>

                <Col md={6}>
                  <RenderSection
                    section={SECTIONS.cuttingLine}
                    formData={cakeData}
                    onChange={handleCakeChange}
                  />
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <FilesMain
            // userAccess={userAccess}
            lotesList_id={batchData.id}
          />

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
