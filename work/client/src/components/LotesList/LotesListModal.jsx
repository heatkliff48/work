import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';

const SECTIONS = {
  batchInfo: {
    title: 'Batch info',
    fields: [
      { label: 'Cacke id start', key: 'cake_id' },
      { label: 'Cacke id finish', key: 'cake_id_finish' },
      { label: 'Production date', key: 'production_date', type: 'date' },
      { label: 'Recepie', key: 'recipe' },
    ],
  },
  prodParams: {
    title: 'Production parameters',
    fields: [
      { label: 'Casting temperature', key: 'casting_temperature' },
      {
        label: 'Delay before dosing to the mixer',
        key: 'delay_before_dosing_to_the_mixer',
      },
      { label: 'W/S', key: 'w_s' },
      { label: 'Mixer speed', key: 'mixer_speed' },
      { label: 'Mixing time before Al', key: 'mixing_time_before_al' },
      { label: 'Temperature in the factory', key: 'temperature_in_the_factory' },
      { label: 'Mixing time with Al', key: 'mixing_time_with_al' },
      {
        label: 'Temperature in the precuring chamber',
        key: 'temperature_in_the_precuring_chamber',
      },
      { label: 'Dosing order', key: 'dosing_order' },
    ],
  },
  actualRecipe: {
    title: 'Actual Recepie',
    fields: [
      { label: 'Lime, kg', key: 'lime' },
      { label: 'Sand slurry (dry), kg', key: 'sand_slurry_dry' },
      { label: 'Aluminum 1', key: 'aluminum_paste' },
      { label: 'Cement, kg', key: 'cement' },
      { label: 'Gypsum (dry), kg', key: 'gypsum_dry' },
      { label: 'Aluminum 2', key: 'aluminum_paste_2' },
      { label: 'Sand (dry), kg', key: 'sand_dry' },
      { label: 'Return (dry), kg', key: 'return_dry' },
      { label: 'Water solids', key: 'water_total' },
    ],
  },
  rawMaterials: {
    title: 'Raw materials:',
    fields: [
      { label: 'Density of the sand slurry', key: 'density_of_the_sand_slurry' },
      { label: 'Lime activity', key: 'lime_activity' },
      { label: 'Al paste type', key: 'al_paste_type' },
      { label: 'Density of the return', key: 'density_of_the_return' },
      { label: 'Lime type', key: 'lime_type' },
      { label: 'Al paste proportion', key: 'al_paste_proportion' },
      { label: 'Fines of the sand', key: 'fines_of_the_sand' },
      { label: 'Cement type', key: 'cement_type' },
      { label: 'Sand type', key: 'sand_type' },
      { label: 'SO3 content', key: 'so3_content' },
      { label: 'Al paste producer', key: 'al_paste_producer' },
      { label: 'Gypsum type', key: 'gypsum_type' },
    ],
  },
  processParams: {
    title: 'Process parameters:',
    fields: [
      { label: 'Cake height', key: 'cake_height' },
      { label: 'Cutting temperature', key: 'cutting_temperature' },
      { label: 'Plasticity', key: 'plasticity' },
      { label: 'Surface of the cake', key: 'surface_of_the_cake' },
      { label: 'Reaction (precuring chamber)', key: 'reaction_precuring' },
      { label: 'Precuring time', key: 'precuring_time' },
      { label: 'Delays before autoclaving', key: 'delays_before_autoclaving' },
    ],
  },
  equipmentIssues: {
    title: 'Issues with equipment',
    fields: [
      { label: 'Mixer', key: 'issues_with_mixer' },
      { label: 'Cutting line', key: 'issues_with_cutting_line' },
      { label: 'Green line', key: 'issues_with_green_line' },
      { label: 'Separation table', key: 'issues_with_separation_table' },
      { label: 'Autoclave', key: 'issues_with_autoclave' },
      { label: 'White line', key: 'issues_with_white_line' },
      { label: 'Packing line', key: 'issues_with_packing_line' },
    ],
  },
  qualityParams: {
    title: 'Quality parameters:',
    fields: [
      { label: 'Rising cracks', key: 'rising_cracks' },
      { label: 'Mechanical cracks', key: 'mechanical_cracks' },
      { label: 'Dimensional error', key: 'dimensional_error' },
      {
        label: 'Broken corners / blocks...',
        key: 'broken_corners_blocks_on_the_cutting_line',
      },
      { label: 'Problems after autoclaving', key: 'problems_after_autoclaving' },
      { label: 'Autoclaving cycle', key: 'autoclaving_cycle' },
      {
        label: 'Compressive strength...',
        key: 'compressive_strength_of_the_end_product',
      },
      { label: 'Density of the end product', key: 'density_of_the_end_product' },
    ],
  },
};

const RenderSection = ({
  sectionData,
  columns = 1,
  formData,
  handleInputChange,
}) => {
  if (!sectionData) return null;

  return (
    <div
      className="section-container mb-3"
      style={{ border: '2px solid black', padding: '0' }}
    >
      <div
        style={{
          borderBottom: '2px solid black',
          padding: '5px',
          fontWeight: 'bold',
          backgroundColor: '#f8f9fa',
        }}
      >
        {sectionData.title}
      </div>
      <div style={{ padding: '10px' }}>
        <Row>
          {sectionData.fields.map((field, idx) => (
            <Col key={idx} xs={12} md={12 / columns} className="mb-1">
              <Form.Group as={Row} controlId={field.key}>
                <Form.Label
                  column
                  sm={6}
                  style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.2' }}
                >
                  {field.label}
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    size="sm"
                    type={field.type || 'text'}
                    name={field.key}
                    // Исправление для отображения 0
                    value={
                      formData[field.key] !== undefined &&
                      formData[field.key] !== null
                        ? formData[field.key]
                        : ''
                    }
                    onChange={handleInputChange}
                    style={{ border: '1px solid #ced4da' }}
                  />
                </Col>
              </Form.Group>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

function RecipeInfoModal({ selectedRecipe, show, onHide }) {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedRecipe) {
      setFormData({ ...selectedRecipe });
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'recipe_products');
      setUserAccess(access);
      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', formData);
    // dispatch(updateRecipe(formData));
    onHide();
  };

  // const deleteRecipeHandler = () => {
  //   if (window.confirm('Are you sure?')) {
  //     dispatch(deleteRecipe(selectedRecipe.id));
  //     onHide();
  //   }
  // };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Batch Details: {formData.id || 'New'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Form onSubmit={onSubmitForm}>
            <Row>
              <Col md={4}>
                <RenderSection
                  sectionData={SECTIONS.batchInfo}
                  columns={1}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
              <Col md={8}>
                <RenderSection
                  sectionData={SECTIONS.prodParams}
                  columns={2}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <RenderSection
                  sectionData={SECTIONS.actualRecipe}
                  columns={3}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <RenderSection
                  sectionData={SECTIONS.rawMaterials}
                  columns={3}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <RenderSection
                  sectionData={SECTIONS.processParams}
                  columns={1}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
              <Col md={4}>
                <RenderSection
                  sectionData={SECTIONS.equipmentIssues}
                  columns={1}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
              <Col md={4}>
                <RenderSection
                  sectionData={SECTIONS.qualityParams}
                  columns={1}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {userAccess?.canWrite && (
          <Button variant="primary" onClick={onSubmitForm}>
            Save Changes
          </Button>
        )}
        {/* {needDeleteButton && userAccess?.canWrite && (
          <Button variant="danger" onClick={deleteRecipeHandler}>
            Delete Recipe
          </Button>
        )} */}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeInfoModal;
