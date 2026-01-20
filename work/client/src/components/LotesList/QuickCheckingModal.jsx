import { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const QUICK_CHECKING_REASONS = [
  'no_alcanza_altura',
  'marcas_de_medidicion_de_plasticidad',
  'superficie_irregular',
  'se_aprecian_manchas_grises',
  'se_aprecian_manchas_marrones',
  'se_aprecian_incrustaciones',
  'color_de_bloques_no_uniforme',
  'manchas_de_goteo',
  'se_aprecian_huecos',
  'marcas_de_mesa_de_separacion',
  'marcas_de_cambio_de_hilo_de_corte',
  'otro_tipo_de_marcas_en_superficie',
  'corte_incompleto',
  'corte_irregular',
  'dimension_de_corte_erronea',
  'grietas_en_pastel',
  'bordes_rotos',
  'caida_de_fragmentos_en_separacion',
  'caida_de_fragmentos_en_paletizado',
  'faltan_bloques',
  'mala_separacion',
  'se_sutituyen_bloques_en_separacion',
  'se_sustituyen_bloques_en_paletizado',
  'pastel_sale_completo_sin_paletizar',
  'pastel_de_muestra',
  'otros',
];

const buildDefaultRecipe = (existing) => {
  const base = {};
  QUICK_CHECKING_REASONS.forEach((k) => (base[k] = false));

  if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
    QUICK_CHECKING_REASONS.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(existing, k)) base[k] = !!existing[k];
    });
  }
  return base;
};

export default function QuickCheckingModal({
  show,
  onHide,
  cakeOptions,
  initialRecipe,
  onSave,
}) {
  const cakes = useMemo(() => {
    if (!Array.isArray(cakeOptions)) return [];
    return cakeOptions
      .map((c) =>
        typeof c === 'object' && c !== null ? c.value ?? c.id ?? c.cake_id : c
      )
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  }, [cakeOptions]);

  const [recipesByCake, setRecipesByCake] = useState({});
  const [changes, setChanges] = useState([]);

  const getInitialForCake = (cakeId) => {
    if (
      initialRecipe &&
      typeof initialRecipe === 'object' &&
      !Array.isArray(initialRecipe)
    ) {
      if (Object.prototype.hasOwnProperty.call(initialRecipe, cakeId)) {
        return initialRecipe[cakeId];
      }
      const hasAnyReasonKey = QUICK_CHECKING_REASONS.some((k) =>
        Object.prototype.hasOwnProperty.call(initialRecipe, k)
      );
      if (hasAnyReasonKey) return initialRecipe;
    }
    return null;
  };

  useEffect(() => {
    if (!show) return;

    const init = {};
    cakes.forEach((cakeId) => {
      init[cakeId] = buildDefaultRecipe(getInitialForCake(cakeId));
    });

    setRecipesByCake(init);
    setChanges([]);
  }, [show, cakes, initialRecipe]);

  const upsertChange = (cakeId, key, value) => {
    setChanges((prev) => {
      const idx = prev.findIndex((x) => Number(x.cake_id) === Number(cakeId));
      if (idx === -1) {
        return [...prev, { cake_id: cakeId, recipe: { [key]: value } }];
      }
      const next = prev.slice();
      next[idx] = {
        ...next[idx],
        recipe: {
          ...(next[idx].recipe || {}),
          [key]: value,
        },
      };
      return next;
    });
  };

  const toggle = (cakeId, key) => {
    setRecipesByCake((prev) => {
      const current = prev[cakeId] || buildDefaultRecipe(getInitialForCake(cakeId));
      const nextValue = !current[key];

      upsertChange(cakeId, key, nextValue);

      return {
        ...prev,
        [cakeId]: { ...current, [key]: nextValue },
      };
    });
  };

  const pretty = (key) => key.replaceAll('_', ' ');

  const handleSave = () => {
    onSave?.(changes);
    onHide?.();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      dialogClassName="quick-checking-dialog"
      contentClassName="quick-checking-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>Quick checking</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: 12 }}>
        <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              width: 'max-content',
              minWidth: '100%',
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Ref Pastel</th>

                {QUICK_CHECKING_REASONS.map((k) => (
                  <th key={k} style={rotatedTh} title={k}>
                    <div style={rotatedText}>{pretty(k)}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {cakes.map((cakeId) => {
                const recipe =
                  recipesByCake[cakeId] ||
                  buildDefaultRecipe(getInitialForCake(cakeId));

                return (
                  <tr key={cakeId}>
                    <td style={tdRef}>{cakeId}</td>

                    {QUICK_CHECKING_REASONS.map((k) => (
                      <td key={k} style={tdCheck}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                          <Form.Check
                            type="checkbox"
                            checked={!!recipe[k]}
                            onChange={() => toggle(cakeId, k)}
                            style={{ margin: 0 }}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <style>{`
          .quick-checking-dialog { max-width: 95vw !important; width: 95vw !important; }
          .quick-checking-content { overflow: hidden; }
        `}</style>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={changes.length === 0}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* ===== styles ===== */

const thStyle = {
  border: '2px solid black',
  padding: 6,
  textAlign: 'center',
  background: '#fff',
  color: '#000',
};

const rotatedText = {
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  whiteSpace: 'nowrap',
  fontWeight: 700,
  fontSize: 12,
  lineHeight: 1,
  display: 'inline-block',
  color: '#000',
};

const rotatedTh = {
  ...thStyle,
  width: 34,
  minWidth: 34,
  maxWidth: 34,
  height: 190,
  padding: 0,
  verticalAlign: 'bottom',
};

const tdRef = {
  border: '2px solid black',
  textAlign: 'center',
  fontWeight: 700,
  width: 60,
  minWidth: 60,
  maxWidth: 60,
};

const tdCheck = {
  border: '2px solid black',
  textAlign: 'center',
  padding: 0,
  width: 34,
  minWidth: 34,
  maxWidth: 34,
};
