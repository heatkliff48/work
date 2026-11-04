import React, { useMemo, useState, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { useDispatch } from 'react-redux';
import { recalculateRecipes } from '#components/redux/actions/recipeAction.js';

// Default formula parameters matching system calculation logic
const DEFAULT_SETTINGS = {
  formLength: 6.262, // Mold length in meters
  formWidth: 1.58, // Mold width in meters
  densityMultiplier: 1.06, // Recipe density expansion factor
  producedReturnFactor: 0.93, // New formula: Density recipe * 0.93
  // --- OLD FORMULA SETTINGS ---
  // baseVolume85: 5.364, // Base volume for 85mm blocks
  // baseVolume75: 5.31, // Base volume for 75mm blocks
  // baseVolumeDefault: 5.4, // Base volume for other blocks
};

// --- OLD FORMULA HELPER (PRESERVED) ---
// const detectRecipeWidth = (recipe, latestProducts = []) => {
//   const desc = String(recipe?.description || '');
//   if (/\b(85|8\.5)\b/i.test(desc) || /x85x/i.test(desc)) return 85;
//   if (/\b(75|7\.5)\b/i.test(desc) || /x75x/i.test(desc)) return 75;
//   if (recipe?.density && recipe?.certificate && Array.isArray(latestProducts)) {
//     const matchingProducts = latestProducts.filter(
//       (p) =>
//         Number(p.density) === Number(recipe.density) &&
//         String(p.certificate || '').trim().toUpperCase() ===
//           String(recipe.certificate || '').trim().toUpperCase(),
//     );
//     if (matchingProducts.length > 0) {
//       const widths = [...new Set(matchingProducts.map((p) => Number(p.width)).filter((w) => Number.isFinite(w) && w > 0))];
//       if (widths.length === 1) return widths[0];
//       for (const p of matchingProducts) {
//         if (p.description && desc.toLowerCase().includes(p.description.toLowerCase().trim())) {
//           return Number(p.width);
//         }
//       }
//     }
//   }
//   return null;
// };

const RecalculateRecipesModal = ({ show, onHide, recipes = [] }) => {
  const dispatch = useDispatch();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnlyChanged, setShowOnlyChanged] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (field, value) => {
    const num = parseFloat(value);
    setSettings((prev) => ({
      ...prev,
      [field]: isNaN(num) ? value : num,
    }));
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Perform recalculation on all recipes
  const calculatedData = useMemo(() => {
    const formLength = parseFloat(settings.formLength) || DEFAULT_SETTINGS.formLength;
    const formWidth = parseFloat(settings.formWidth) || DEFAULT_SETTINGS.formWidth;
    const densityMultiplier =
      parseFloat(settings.densityMultiplier) || DEFAULT_SETTINGS.densityMultiplier;
    const producedReturnFactor =
      parseFloat(settings.producedReturnFactor) || DEFAULT_SETTINGS.producedReturnFactor;

    return recipes.map((r) => {
      const cakeHeight = parseFloat(r.cake_height);
      const lime = parseFloat(r.lime) || 0;
      const cement = parseFloat(r.cement) || 0;
      const returnDry = parseFloat(r.return_dry) || 0;
      const alu = parseFloat(r.aluminum_paste) || 0;

      const sandSlurry = parseFloat(r.sand_slurry_dry) || 0;
      const sandPowder = parseFloat(r.sand_powder_dry) || 0;
      const gypsum = parseFloat(r.gypsum_dry) || 0;

      let sand = sandSlurry;
      if (!sandSlurry && (sandPowder || gypsum)) {
        sand = sandPowder + gypsum;
      }

      // 1. Solids (kg)
      const newSolids = Math.round(lime + cement + sand + returnDry + alu);

      // 2. Volume (m3) = cake_height * length * width
      const newVolume =
        cakeHeight && cakeHeight > 0
          ? Number((cakeHeight * formLength * formWidth).toFixed(2))
          : null;

      // 3. Density recipe (kg/m3) = (solids / volume) * densityMultiplier
      const newDensityRecipe =
        newVolume && newSolids
          ? Math.round((newSolids / newVolume) * densityMultiplier)
          : null;

      // 4. Water total (kg) = solids * water_solids
      const ws = parseFloat(r.water_solids);
      const newWaterTotal =
        newSolids && ws > 0 ? Math.round(newSolids * ws) : null;

      // 5. Produced return dry (kg)
      // --- OLD FORMULA ---
      // const detectedWidth = detectRecipeWidth(r, latestProducts);
      // let baseVol = 5.4;
      // if (detectedWidth === 85) baseVol = 5.364;
      // else if (detectedWidth === 75) baseVol = 5.31;
      // const oldProducedReturnDry =
      //   newVolume && newSolids
      //     ? Math.round((newVolume - baseVol) * (newSolids / newVolume))
      //     : null;

      // --- NEW FORMULA: Density recipe * 0.93 ---
      const newProducedReturnDry =
        newDensityRecipe != null
          ? Math.round(newDensityRecipe * producedReturnFactor)
          : null;

      // Compare old vs new
      const oldSolids = r.solids != null ? Math.round(Number(r.solids)) : null;
      const oldVolume =
        r.volume != null ? Number(Number(r.volume).toFixed(2)) : null;
      const oldDensityRecipe =
        r.density_recipe != null ? Math.round(Number(r.density_recipe)) : null;
      const oldProducedReturn =
        r.produced_return_dry != null
          ? Math.round(Number(r.produced_return_dry))
          : null;
      const oldWaterTotal =
        r.water_total != null ? Math.round(Number(r.water_total)) : null;

      const hasSolidsDiff = newSolids !== null && oldSolids !== newSolids;
      const hasVolumeDiff = newVolume !== null && oldVolume !== newVolume;
      const hasDensityDiff =
        newDensityRecipe !== null && oldDensityRecipe !== newDensityRecipe;
      const hasReturnDiff =
        newProducedReturnDry !== null && oldProducedReturn !== newProducedReturnDry;
      const hasWaterDiff =
        newWaterTotal !== null && oldWaterTotal !== newWaterTotal;

      const hasChanges =
        hasSolidsDiff ||
        hasVolumeDiff ||
        hasDensityDiff ||
        hasReturnDiff ||
        hasWaterDiff;

      return {
        id: r.id,
        article: r.article,
        description: r.description,
        cake_height: r.cake_height,
        // Values
        oldSolids,
        newSolids,
        hasSolidsDiff,
        oldVolume,
        newVolume,
        hasVolumeDiff,
        oldDensityRecipe,
        newDensityRecipe,
        hasDensityDiff,
        oldProducedReturn,
        newProducedReturnDry,
        hasReturnDiff,
        oldWaterTotal,
        newWaterTotal,
        hasWaterDiff,
        hasChanges,
      };
    });
  }, [recipes, settings]);

  // Statistics
  const totalCount = calculatedData.length;
  const changedRecipes = useMemo(
    () => calculatedData.filter((item) => item.hasChanges),
    [calculatedData],
  );
  const changedCount = changedRecipes.length;
  const unchangedCount = totalCount - changedCount;

  // Filtered rows for display
  const displayedRows = useMemo(() => {
    let rows = showOnlyChanged ? changedRecipes : calculatedData;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          String(r.article || '').toLowerCase().includes(q) ||
          String(r.description || '').toLowerCase().includes(q),
      );
    }
    return rows;
  }, [calculatedData, changedRecipes, showOnlyChanged, searchQuery]);

  const handleApplyChanges = useCallback(async () => {
    if (changedRecipes.length === 0) return;

    setIsSaving(true);
    try {
      const payload = changedRecipes.map((r) => ({
        id: r.id,
        solids: r.newSolids,
        volume: r.newVolume,
        density_recipe: r.newDensityRecipe,
        produced_return_dry: r.newProducedReturnDry,
        water_total: r.newWaterTotal,
      }));

      await dispatch(recalculateRecipes(payload));
      onHide();
    } catch (err) {
      console.error('Error applying recalculated recipe values:', err);
    } finally {
      setIsSaving(false);
    }
  }, [changedRecipes, dispatch, onHide]);

  const renderValueDiff = (oldVal, newVal, hasDiff) => {
    if (hasDiff) {
      return (
        <div className="d-flex flex-column align-items-center">
          <span className="text-muted text-decoration-line-through small">
            {oldVal != null ? oldVal : '—'}
          </span>
          <span className="fw-bold text-success">
            {newVal != null ? newVal : '—'}
          </span>
        </div>
      );
    }
    return (
      <span className="text-secondary">
        {oldVal != null ? oldVal : newVal != null ? newVal : '—'}
      </span>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton className="bg-light">
        <div>
          <Modal.Title className="h5 mb-1">
            Recalculate Recipe Parameters / Пересчет параметров рецептов
          </Modal.Title>
          <div className="text-muted small">
            Recalculate Solids, Volume, Density, Produced Return and Water Total
            for existing recipes according to current formulas.
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* Status Alert */}
        {changedCount > 0 ? (
          <Alert variant="warning" className="d-flex justify-content-between align-items-center py-2 mb-3">
            <div>
              <strong>Action required:</strong> Found{' '}
              <Badge bg="danger" className="fs-6 me-1">
                {changedCount}
              </Badge>{' '}
              recipe(s) with outdated calculation parameters. Review the
              changes below before applying.
            </div>
            <div className="text-muted small">
              {unchangedCount} recipe(s) already up to date
            </div>
          </Alert>
        ) : (
          <Alert variant="success" className="py-2 mb-3">
            <strong>All parameters are up to date!</strong> None of the{' '}
            {totalCount} existing recipes need recalculation with the current
            parameters.
          </Alert>
        )}

        {/* Calculation Parameters Collapsible */}
        <div className="mb-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            aria-controls="calc-settings-collapse"
            aria-expanded={showSettings}
            className="mb-2"
          >
            {showSettings ? '▲ Hide' : '▼ View / Edit'} Calculation Parameters
          </Button>

          <Collapse in={showSettings}>
            <div id="calc-settings-collapse">
              <Card className="bg-light p-3 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">Calculation Formula Parameters</h6>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-decoration-none"
                    onClick={handleResetSettings}
                  >
                    Reset to defaults
                  </Button>
                </div>
                <Row className="g-2 small">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="mb-1">
                        Form Length (m):
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        step="0.001"
                        value={settings.formLength}
                        onChange={(e) =>
                          handleSettingChange('formLength', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="mb-1">
                        Form Width (m):
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        step="0.001"
                        value={settings.formWidth}
                        onChange={(e) =>
                          handleSettingChange('formWidth', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="mb-1">
                        Density Multiplier:
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        step="0.01"
                        value={settings.densityMultiplier}
                        onChange={(e) =>
                          handleSettingChange(
                            'densityMultiplier',
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="mb-1">
                        Return Factor (Density × k):
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        step="0.01"
                        value={settings.producedReturnFactor}
                        onChange={(e) =>
                          handleSettingChange(
                            'producedReturnFactor',
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="d-flex align-items-center mt-2">
                    <div className="text-muted small">
                      Form Area:{' '}
                      <strong>
                        {(
                          (parseFloat(settings.formLength) || 0) *
                          (parseFloat(settings.formWidth) || 0)
                        ).toFixed(5)}{' '}
                        m²
                      </strong>{' '}
                      | Volume = Height × Area | Density = (Solids / Volume) × {settings.densityMultiplier} | Produced Return = Density × {settings.producedReturnFactor}
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Collapse>
        </div>

        {/* Filter Toolbar */}
        <Row className="g-2 align-items-center mb-3">
          <Col md={6}>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Search by Recipe ID or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={6} className="d-flex justify-content-md-end align-items-center gap-3">
            <Form.Check
              type="checkbox"
              id="show-only-changed"
              label={`Show only recipes with changes (${changedCount})`}
              checked={showOnlyChanged}
              onChange={(e) => setShowOnlyChanged(e.target.checked)}
              className="fw-semibold user-select-none"
            />
          </Col>
        </Row>

        {/* Comparison Diff Table */}
        <div className="table-responsive border rounded" style={{ maxHeight: '55vh' }}>
          <Table striped hover size="sm" className="mb-0 text-center align-middle" style={{ fontSize: '0.88rem' }}>
            <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
              <tr>
                <th style={{ minWidth: '130px', textAlign: 'left' }}>Recipe ID</th>
                <th style={{ minWidth: '180px', textAlign: 'left' }}>Description</th>
                <th style={{ minWidth: '85px' }}>Cake Height</th>
                <th style={{ minWidth: '110px' }}>Solids (kg)</th>
                <th style={{ minWidth: '110px' }}>Volume (m³)</th>
                <th style={{ minWidth: '110px' }}>Density (kg/m³)</th>
                <th style={{ minWidth: '125px' }}>Produced Return (kg)</th>
                <th style={{ minWidth: '110px' }}>Water Total (kg)</th>
                <th style={{ minWidth: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-4 text-muted">
                    No recipes found matching the current filter.
                  </td>
                </tr>
              ) : (
                displayedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.hasChanges ? 'table-warning-subtle' : ''}
                    style={
                      row.hasChanges
                        ? { backgroundColor: '#fff9e6' }
                        : undefined
                    }
                  >
                    <td className="fw-semibold text-start">{row.article}</td>
                    <td className="text-start text-truncate" style={{ maxWidth: '220px' }} title={row.description}>
                      {row.description || '—'}
                    </td>
                    <td>{row.cake_height != null ? row.cake_height : '—'}</td>
                    <td>{renderValueDiff(row.oldSolids, row.newSolids, row.hasSolidsDiff)}</td>
                    <td>{renderValueDiff(row.oldVolume, row.newVolume, row.hasVolumeDiff)}</td>
                    <td>{renderValueDiff(row.oldDensityRecipe, row.newDensityRecipe, row.hasDensityDiff)}</td>
                    <td>{renderValueDiff(row.oldProducedReturn, row.newProducedReturnDry, row.hasReturnDiff)}</td>
                    <td>{renderValueDiff(row.oldWaterTotal, row.newWaterTotal, row.hasWaterDiff)}</td>
                    <td>
                      {row.hasChanges ? (
                        <Badge bg="warning" text="dark">
                          Changed
                        </Badge>
                      ) : (
                        <Badge bg="light" text="secondary" className="border">
                          Up to date
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-light d-flex justify-content-between">
        <div className="text-muted small">
          Showing {displayedRows.length} of {totalCount} recipes
          {changedCount > 0 && ` (${changedCount} with differences)`}
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onHide} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleApplyChanges}
            disabled={changedCount === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Applying changes...
              </>
            ) : (
              `Apply changes (${changedCount})`
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RecalculateRecipesModal;

