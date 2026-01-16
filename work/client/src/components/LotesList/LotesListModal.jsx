// // import Button from 'react-bootstrap/Button';
// // import Modal from 'react-bootstrap/Modal';
// // import React, { useEffect, useState } from 'react';
// // import Container from 'react-bootstrap/Container';
// // import Row from 'react-bootstrap/Row';
// // import Col from 'react-bootstrap/Col';
// // import Form from 'react-bootstrap/Form';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useUsersContext } from '#components/contexts/UserContext.js';
// // import { useNavigate } from 'react-router-dom';
// // import { useRecipeContext } from '#components/contexts/RecipeContext.js';
// // import { updateLotesListRecipe } from '#components/redux/actions/lotesListAction.js';

// // const SECTIONS = {
// //   batchInfo: {
// //     title: 'Batch info',
// //     fields: [
// //       { label: 'Cacke id start', key: 'cake_id_start' },
// //       { label: 'Cacke id finish', key: 'cake_id_finish' },
// //       { label: 'Production date', key: 'production_date', type: 'date' },
// //       { label: 'Recepie', key: 'recipe' },
// //     ],
// //   },
// //   prodParams: {
// //     title: 'Production parameters',
// //     fields: [
// //       { label: 'Casting temperature', key: 'casting_temperature' },
// //       {
// //         label: 'Delay before dosing to the mixer',
// //         key: 'delay_before_dosing_to_the_mixer',
// //       },
// //       { label: 'W/S', key: 'w_s' },
// //       { label: 'Mixer speed', key: 'mixer_speed' },
// //       { label: 'Mixing time before Al', key: 'mixing_time_before_al' },
// //       { label: 'Temperature in the factory', key: 'temperature_in_the_factory' },
// //       { label: 'Mixing time with Al', key: 'mixing_time_with_al' },
// //       {
// //         label: 'Temperature in the precuring chamber',
// //         key: 'temperature_in_the_precuring_chamber',
// //       },
// //       { label: 'Dosing order', key: 'dosing_order' },
// //     ],
// //   },
// //   actualRecipe: {
// //     title: 'Actual Recepie',
// //     fields: [
// //       { label: 'Lime, kg', key: 'lime' },
// //       { label: 'Sand slurry (dry), kg', key: 'sand_slurry_dry' },
// //       { label: 'Aluminum 1', key: 'aluminum_paste' },
// //       { label: 'Cement, kg', key: 'cement' },
// //       { label: 'Gypsum (dry), kg', key: 'gypsum_dry' },
// //       { label: 'Aluminum 2', key: 'aluminum_paste_2' },
// //       { label: 'Sand (dry), kg', key: 'sand_dry' },
// //       { label: 'Return (dry), kg', key: 'return_dry' },
// //       { label: 'Water solids', key: 'water_total' },
// //     ],
// //   },
// //   rawMaterials: {
// //     title: 'Raw materials:',
// //     fields: [
// //       { label: 'Density of the sand slurry', key: 'density_of_the_sand_slurry' },
// //       { label: 'Lime activity', key: 'lime_activity' },
// //       { label: 'Al paste type', key: 'al_paste_type' },
// //       { label: 'Density of the return', key: 'density_of_the_return' },
// //       { label: 'Lime type', key: 'lime_type' },
// //       { label: 'Al paste proportion', key: 'al_paste_proportion' },
// //       { label: 'Fines of the sand', key: 'fines_of_the_sand' },
// //       { label: 'Cement type', key: 'cement_type' },
// //       { label: 'Sand type', key: 'sand_type' },
// //       { label: 'SO3 content', key: 'so3_content' },
// //       { label: 'Al paste producer', key: 'al_paste_producer' },
// //       { label: 'Gypsum type', key: 'gypsum_type' },
// //     ],
// //   },
// //   processParams: {
// //     title: 'Process parameters:',
// //     fields: [
// //       { label: 'Cake height', key: 'cake_height' },
// //       { label: 'Cutting temperature', key: 'cutting_temperature' },
// //       { label: 'Plasticity', key: 'plasticity' },
// //       { label: 'Surface of the cake', key: 'surface_of_the_cake' },
// //       { label: 'Reaction (precuring chamber)', key: 'reaction_precuring' },
// //       { label: 'Precuring time', key: 'precuring_time' },
// //       { label: 'Delays before autoclaving', key: 'delays_before_autoclaving' },
// //     ],
// //   },
// //   equipmentIssues: {
// //     title: 'Issues with equipment',
// //     fields: [
// //       { label: 'Mixer', key: 'issues_with_mixer' },
// //       { label: 'Cutting line', key: 'issues_with_cutting_line' },
// //       { label: 'Green line', key: 'issues_with_green_line' },
// //       { label: 'Separation table', key: 'issues_with_separation_table' },
// //       { label: 'Autoclave', key: 'issues_with_autoclave' },
// //       { label: 'White line', key: 'issues_with_white_line' },
// //       { label: 'Packing line', key: 'issues_with_packing_line' },
// //     ],
// //   },
// //   qualityParams: {
// //     title: 'Quality parameters:',
// //     fields: [
// //       { label: 'Rising cracks', key: 'rising_cracks' },
// //       { label: 'Mechanical cracks', key: 'mechanical_cracks' },
// //       { label: 'Dimensional error', key: 'dimensional_error' },
// //       {
// //         label: 'Broken corners / blocks...',
// //         key: 'broken_corners_blocks_on_the_cutting_line',
// //       },
// //       { label: 'Problems after autoclaving', key: 'problems_after_autoclaving' },
// //       { label: 'Autoclaving cycle', key: 'autoclaving_cycle' },
// //       {
// //         label: 'Compressive strength...',
// //         key: 'compressive_strength_of_the_end_product',
// //       },
// //       { label: 'Density of the end product', key: 'density_of_the_end_product' },
// //     ],
// //   },
// // };

// // const RenderSection = ({
// //   sectionData,
// //   columns = 1,
// //   formData,
// //   handleInputChange,
// // }) => {
// //   if (!sectionData) return null;

// //   return (
// //     <div
// //       className="section-container mb-3"
// //       style={{ border: '2px solid black', padding: '0' }}
// //     >
// //       <div
// //         style={{
// //           borderBottom: '2px solid black',
// //           padding: '5px',
// //           fontWeight: 'bold',
// //           backgroundColor: '#f8f9fa',
// //         }}
// //       >
// //         {sectionData.title}
// //       </div>
// //       <div style={{ padding: '10px' }}>
// //         <Row>
// //           {sectionData.fields.map((field, idx) => (
// //             <Col key={idx} xs={12} md={12 / columns} className="mb-1">
// //               <Form.Group as={Row} controlId={field.key}>
// //                 <Form.Label
// //                   column
// //                   sm={6}
// //                   style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.2' }}
// //                 >
// //                   {field.label}
// //                 </Form.Label>
// //                 <Col sm={6}>
// //                   <Form.Control
// //                     size="sm"
// //                     type={field.type || 'text'}
// //                     name={field.key}
// //                     // Исправление для отображения 0
// //                     value={
// //                       formData[field.key] !== undefined &&
// //                       formData[field.key] !== null
// //                         ? formData[field.key]
// //                         : ''
// //                     }
// //                     onChange={handleInputChange}
// //                     style={{ border: '1px solid #ced4da' }}
// //                   />
// //                 </Col>
// //               </Form.Group>
// //             </Col>
// //           ))}
// //         </Row>
// //       </div>
// //     </div>
// //   );
// // };

// // function RecipeInfoModal({ selectedRecipe, show, onHide }) {
// //   const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
// //   const { list_of_recipes } = useRecipeContext();
// //   const user = useSelector((state) => state.user);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const [formData, setFormData] = useState({});

// //   useEffect(() => {
// //     if (selectedRecipe) {
// //       setFormData({ ...selectedRecipe });
// //     }
// //   }, [selectedRecipe]);

// //   useEffect(() => {
// //     if (user && roles.length > 0) {
// //       const access = checkUserAccess(user, roles, 'recipe_products');
// //       setUserAccess(access);
// //       if (!access?.canRead) {
// //         navigate('/');
// //       }
// //     }
// //   }, [user, roles]);

// //   const handleInputChange = (e) => {
// //     const { name, value, type } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: type === 'number' ? Number(value) : value,
// //     }));
// //   };

// //   const preparePayloadForSave = (formData) => {
// //     const { activeBatchId, relatedBatches, ...payload } = formData;

// //     return payload;
// //   };

// //   const onSubmitForm = async (e) => {
// //     e.preventDefault();
// //     console.log('Submitting data:', formData);
// //     const result = preparePayloadForSave(formData);
// //     dispatch(updateLotesListRecipe(result));
// //     onHide();
// //   };

// //   // const deleteRecipeHandler = () => {
// //   //   if (window.confirm('Are you sure?')) {
// //   //     dispatch(deleteRecipe(selectedRecipe.id));
// //   //     onHide();
// //   //   }
// //   // };

// //   const buildResolvedRecipe = (batch, list_of_recipes) => {
// //     if (!batch) return null;

// //     const baseRecipe = list_of_recipes.find(
// //       (r) => String(r.article) === String(batch.recipe)
// //     );

// //     if (!baseRecipe) return null;

// //     const RECIPE_PARAMS = [
// //       'sand_dry',
// //       'sand_slurry_dry',
// //       'lime',
// //       'cement',
// //       'gypsum_dry',
// //       'return_dry',
// //       'gypsum_stone',
// //       'aluminum_paste',
// //       'aluminum_paste_2',
// //       'grinding_balls',
// //       'aac',
// //     ];

// //     let resolved = {
// //       ...baseRecipe,
// //       ...batch,
// //     };

// //     if (batch.custom_recipe === true) {
// //       RECIPE_PARAMS.forEach((key) => {
// //         const val = batch[key];
// //         if (
// //           val !== null &&
// //           val !== undefined &&
// //           Number(val) !== 0 &&
// //           Number.isFinite(Number(val))
// //         ) {
// //           resolved[key] = Number(val);
// //         }
// //       });
// //     }

// //     return resolved;
// //   };

// //   return (
// //     <Modal
// //       show={show}
// //       onHide={onHide}
// //       size="xl"
// //       aria-labelledby="contained-modal-title-vcenter"
// //       centered
// //       dialogClassName="modal-auto-size"
// //     >
// //       <Modal.Title className="d-flex align-items-center gap-2">
// //         Batch Details: {formData.id}
// //         {formData.relatedBatches?.length > 1 && (
// //           <>
// //             <span className="ms-3">id</span>
// //             <Form.Select
// //               size="sm"
// //               style={{ width: 120 }}
// //               value={formData.id}
// //               onChange={(e) => {
// //                 const selectedId = Number(e.target.value);

// //                 const selectedBatch = formData.relatedBatches.find(
// //                   (b) => b.id === selectedId
// //                 );

// //                 if (!selectedBatch) return;

// //                 const resolved = buildResolvedRecipe(
// //                   selectedBatch,
// //                   formData.relatedBatchesRecipes || list_of_recipes
// //                 );

// //                 if (resolved) {
// //                   setFormData({
// //                     ...resolved,
// //                     relatedBatches: formData.relatedBatches,
// //                   });
// //                 }
// //               }}
// //             >
// //               {formData.relatedBatches.map((b) => (
// //                 <option key={b.id} value={b.id}>
// //                   {b.id}
// //                 </option>
// //               ))}
// //             </Form.Select>
// //           </>
// //         )}
// //       </Modal.Title>

// //       <Modal.Body>
// //         <Container fluid>
// //           <Form onSubmit={onSubmitForm}>
// //             <Row>
// //               <Col md={4}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.batchInfo}
// //                   columns={1}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //               <Col md={8}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.prodParams}
// //                   columns={2}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //             </Row>

// //             <Row>
// //               <Col md={12}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.actualRecipe}
// //                   columns={3}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //             </Row>

// //             <Row>
// //               <Col md={12}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.rawMaterials}
// //                   columns={3}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //             </Row>

// //             <Row>
// //               <Col md={4}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.processParams}
// //                   columns={1}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //               <Col md={4}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.equipmentIssues}
// //                   columns={1}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //               <Col md={4}>
// //                 <RenderSection
// //                   sectionData={SECTIONS.qualityParams}
// //                   columns={1}
// //                   formData={formData}
// //                   handleInputChange={handleInputChange}
// //                 />
// //               </Col>
// //             </Row>
// //           </Form>
// //         </Container>
// //       </Modal.Body>
// //       <Modal.Footer>
// //         {userAccess?.canWrite && (
// //           <Button variant="primary" onClick={onSubmitForm}>
// //             Save Changes
// //           </Button>
// //         )}
// //         {/* {needDeleteButton && userAccess?.canWrite && (
// //           <Button variant="danger" onClick={deleteRecipeHandler}>
// //             Delete Recipe
// //           </Button>
// //         )} */}
// //         <Button variant="secondary" onClick={onHide}>
// //           Close
// //         </Button>
// //       </Modal.Footer>
// //     </Modal>
// //   );
// // }

// // export default RecipeInfoModal;

// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import React, { useEffect, useMemo, useState } from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import { useDispatch, useSelector } from 'react-redux';
// import { useUsersContext } from '#components/contexts/UserContext.js';
// import { useNavigate } from 'react-router-dom';
// import { useRecipeContext } from '#components/contexts/RecipeContext.js';

// import {
//   updateLotesListRecipe,
//   // ⬇️ ТЕБЕ НУЖНО ДОБАВИТЬ ЭТОТ ACTION + SAGA/ROUTE
//   updateLotesListCake,
//   updateLotesListCakesRecipe,
//   addNewLotesListCakes,
// } from '#components/redux/actions/lotesListAction.js';

// //
// // ======== Секции по твоему макету ========
// // Большие буквы = заголовки, маленькие_с_подчерк = ключи
// //
// const SECTIONS = {
//   batchInfo: {
//     title: 'Batch info',
//     columns: 1,
//     fields: [
//       { label: 'Cake id start', key: 'cake_id_start', readOnly: true },
//       { label: 'Cake id finish', key: 'cake_id_finish', readOnly: true },
//       { label: 'Production date', key: 'production_date', type: 'date' },
//       { label: 'Recepie', key: 'recipe', readOnly: true },
//     ],
//   },

//   mixerBatch: {
//     title: 'Mixer (batch)',
//     columns: 2,
//     fields: [
//       { label: 'Dosing order', key: 'dosing_order' },
//       {
//         label: 'Delay before dosing to the mixer',
//         key: 'dosing_delay_lime_sec',
//       },
//       { label: 'Mixer speed', key: 'mixer_speed_rpm' },
//       { label: 'Mixing before Al', key: 'mixing_before_al_sec' },
//       { label: 'Mixing after Al', key: 'mixing_after_al_sec' },
//       { label: 'Vibrator working time', key: 'vibrator_time_sec' },
//       { label: 'Vibrator working speed', key: 'vibrator_speed_hz' },
//     ],
//   },

//   // Это НЕ часть batchPayload — это сохраняется в lotes_list_cake
//   mixerCake: {
//     title: 'Mixer (cake)',
//     columns: 1,
//     fields: [
//       { label: 'W/S', key: 'water_solid_ratio' },
//       { label: 'Sand slurry density', key: 'sand_slurry_density' },
//       { label: 'Return slurry density', key: 'return_slurry_density' },
//       { label: 'Casting temperature', key: 'casting_temp_c' },
//       { label: 'Temperature in the factory', key: 'factory_temp_c' },
//       { label: 'Issues with mixer', key: 'mixer_issues' },
//       { label: 'Issues with oiling machine', key: 'oiling_issues' },
//       { label: 'Issues with moving the mold', key: 'mold_moving_issues' },
//     ],
//   },

//   actualRecipe: {
//     title: 'Actual Recepie',
//     columns: 3,
//     fields: [
//       { label: 'Lime, kg', key: 'lime' },
//       { label: 'Sand slurry (dry), kg', key: 'sand_slurry_dry' },
//       { label: 'Aluminum 1', key: 'aluminum_paste' },

//       { label: 'Cement, kg', key: 'cement' },
//       { label: 'Gypsum (dry), kg', key: 'gypsum_dry' },
//       { label: 'Aluminum 2', key: 'aluminum_paste_2' },

//       { label: 'Sand (dry), kg', key: 'sand_dry' },
//       { label: 'Return (dry), kg', key: 'return_dry' },
//       { label: 'Water solids', key: 'water_total' },
//     ],
//   },

//   rawMaterials: {
//     title: 'Raw materials:',
//     columns: 3,
//     fields: [
//       { label: 'Fines of the sand', key: 'sand_fines' },
//       { label: 'Sand', key: 'sand_producer' },
//       { label: 'Cement', key: 'cement_producer' },

//       { label: 'SO3 content in sand slurry', key: 'sand_slurry_so3' },
//       { label: 'Sand type', key: 'sand_type' },
//       { label: 'Cement type', key: 'cement_type' },

//       { label: 'SO3 content in return slurry', key: 'return_slurry_so3' },
//       { label: 'Gypsum stone', key: 'gypsum_producer' },
//       { label: 'Al paste', key: 'al_paste_producer' },

//       { label: 'Activity of return slurry', key: 'return_slurry_activity' },
//       { label: 'Gypsum', key: 'gypsum_type' },
//       { label: 'Al paste types', key: 'al_paste_types' },

//       { label: 'Lime activity', key: 'lime_activity' },
//       { label: 'Lime', key: 'lime_producer' },
//       { label: 'Al paste proportions', key: 'al_paste_proportion' },

//       { label: 'Slaking time for lime', key: 'lime_slaking_time' },
//       { label: 'Lime type', key: 'lime_type' },
//     ],
//   },
// };

// const numericKeys = new Set([
//   // batch
//   'dosing_order',
//   'dosing_delay_lime_sec',
//   'mixer_speed_rpm',
//   'mixing_before_al_sec',
//   'mixing_after_al_sec',
//   'vibrator_time_sec',
//   'vibrator_speed_hz',

//   'lime',
//   'sand_slurry_dry',
//   'aluminum_paste',
//   'cement',
//   'gypsum_dry',
//   'aluminum_paste_2',
//   'sand_dry',
//   'return_dry',
//   'water_total',

//   'sand_fines',
//   'sand_slurry_so3',
//   'return_slurry_so3',
//   'return_slurry_activity',
//   'lime_activity',
//   'lime_slaking_time',

//   // cake
//   'water_solid_ratio',
//   'sand_slurry_density',
//   'return_slurry_density',
//   'casting_temp_c',
//   'factory_temp_c',
// ]);

// function RenderSection({
//   section,
//   formData,
//   onChange,
//   headerRight = null,
//   columnsOverride = null,
// }) {
//   if (!section) return null;

//   const cols = columnsOverride ?? section.columns ?? 1;

//   return (
//     <div
//       className="section-container mb-3"
//       style={{ border: '2px solid black', padding: 0 }}
//     >
//       <div
//         style={{
//           borderBottom: '2px solid black',
//           padding: '6px 10px',
//           fontWeight: 'bold',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: 10,
//           backgroundColor: '#f8f9fa',
//         }}
//       >
//         <span>{section.title}</span>
//         {headerRight}
//       </div>

//       <div style={{ padding: 10 }}>
//         <Row>
//           {section.fields.map((field) => {
//             const isDate = field.type === 'date';
//             const value =
//               isDate && formData[field.key]
//                 ? String(formData[field.key]).slice(0, 10)
//                 : formData[field.key] ?? '';

//             return (
//               <Col key={field.key} xs={12} md={12 / cols} className="mb-1">
//                 <Form.Group as={Row} controlId={field.key}>
//                   <Form.Label
//                     column
//                     sm={6}
//                     style={{
//                       fontSize: '0.85rem',
//                       fontWeight: 500,
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     {field.label}
//                   </Form.Label>
//                   <Col sm={6}>
//                     <Form.Control
//                       size="sm"
//                       type={field.type || 'text'}
//                       name={field.key}
//                       value={value}
//                       readOnly={!!field.readOnly}
//                       disabled={!!field.readOnly}
//                       onChange={onChange}
//                     />
//                   </Col>
//                 </Form.Group>
//               </Col>
//             );
//           })}
//         </Row>
//       </div>
//     </div>
//   );
// }

// function RecipeInfoModal({ selectedRecipe, show, onHide }) {
//   const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [batchData, setBatchData] = useState({});

//   const [selectedCakeId, setSelectedCakeId] = useState(null);

//   const [cakeData, setCakeData] = useState({});

//   const [cakeCache, setCakeCache] = useState({});

//   // useEffect(() => {
//   //   if (user && roles.length > 0) {
//   //     const access = checkUserAccess(user, roles, 'recipe_products');
//   //     setUserAccess(access);
//   //     if (!access?.canRead) navigate('/');
//   //   }
//   // }, [user, roles]);

//   useEffect(() => {
//     if (!selectedRecipe) return;

//     setBatchData({ ...selectedRecipe });

//     const start = Number(selectedRecipe.cake_id_start);
//     const finish = Number(selectedRecipe.cake_id_finish);

//     const initialCakeId =
//       Number.isFinite(start) && Number.isFinite(finish) ? start : null;

//     setSelectedCakeId(initialCakeId);

//     const initialCache = {};
//     if (Array.isArray(selectedRecipe.lotes_list_cakes)) {
//       for (const c of selectedRecipe.lotes_list_cakes) {
//         if (c && c.id != null) initialCache[Number(c.id)] = { ...c };
//       }
//     }
//     setCakeCache(initialCache);

//     if (initialCakeId != null) {
//       setCakeData(
//         initialCache[initialCakeId] ? { ...initialCache[initialCakeId] } : {}
//       );
//     } else {
//       setCakeData({});
//     }
//   }, [selectedRecipe]);
//   const cakeOptions = useMemo(() => {
//     const start = Number(batchData.cake_id_start);
//     const finish = Number(batchData.cake_id_finish);
//     if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start)
//       return [];
//     const arr = [];
//     for (let i = start; i <= finish; i += 1) arr.push(i);
//     return arr;
//   }, [batchData.cake_id_start, batchData.cake_id_finish]);
//   const handleBatchChange = (e) => {
//     const { name, value } = e.target;
//     setBatchData((prev) => ({
//       ...prev,
//       [name]: numericKeys.has(name) ? (value === '' ? '' : Number(value)) : value,
//     }));
//   };
//   const handleCakeChange = (e) => {
//     const { name, value } = e.target;
//     setCakeData((prev) => ({
//       ...prev,
//       [name]: numericKeys.has(name) ? (value === '' ? '' : Number(value)) : value,
//     }));
//   };

//   const onSelectCake = (nextCakeIdRaw) => {
//     const nextCakeId = Number(nextCakeIdRaw);
//     if (!Number.isFinite(nextCakeId)) return;

//     if (selectedCakeId != null) {
//       setCakeCache((prev) => ({
//         ...prev,
//         [selectedCakeId]: {
//           ...(prev[selectedCakeId] || {}),
//           ...cakeData,
//           id: selectedCakeId,
//         },
//       }));
//     }

//     setSelectedCakeId(nextCakeId);
//     setCakeData(
//       cakeCache[nextCakeId] ? { ...cakeCache[nextCakeId] } : { id: nextCakeId }
//     );
//   };

//   const buildBatchPayload = () => {
//     const {
//       relatedBatches,
//       relatedBatchesRecipes,
//       activeSubBatchId,
//       activeBatchId,
//       ...payload
//     } = batchData;

//     if (activeSubBatchId != null) payload.sub_batch_id = Number(activeSubBatchId);

//     return payload;
//   };

//   const buildCakePayload = () => {
//     const cake_id = selectedCakeId;
//     const batch_id = batchData.batch_id;
//     const sub_batch_id =
//       batchData.sub_batch_id != null
//         ? batchData.sub_batch_id
//         : batchData.activeSubBatchId;

//     return {
//       id: cake_id,
//       cake_id,
//       batch_id,
//       sub_batch_id,
//       ...cakeData,
//     };
//   };

//   const onSaveAll = async (e) => {
//     e.preventDefault();

//     const batchPayload = buildBatchPayload();
//     dispatch(updateLotesListRecipe(batchPayload));

//     const cakePayload = buildCakePayload();
//     dispatch(addNewLotesListCakes(cakePayload));

//     onHide();
//   };

//   // если нужно оставить логику "подмешать базовый рецепт", можешь адаптировать позже
//   // сейчас делаем простой UX: batch поля редактируются напрямую

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="xl"
//       centered
//       dialogClassName="modal-auto-size"
//     >
//       <Modal.Title
//         className="d-flex align-items-center gap-2"
//         style={{ padding: '12px 16px' }}
//       >
//         Batch Details: {batchData.batch_id} / sub {batchData.sub_batch_id}
//       </Modal.Title>

//       <Modal.Body>
//         <Container fluid>
//           <Form onSubmit={onSaveAll}>
//             {/* Верхняя линия: Batch info + Mixer(batch) + Mixer(cake) */}
//             <Row>
//               <Col md={4}>
//                 <RenderSection
//                   section={SECTIONS.batchInfo}
//                   formData={batchData}
//                   onChange={handleBatchChange}
//                 />
//               </Col>

//               <Col md={4}>
//                 <RenderSection
//                   section={SECTIONS.mixerBatch}
//                   formData={batchData}
//                   onChange={handleBatchChange}
//                 />
//               </Col>

//               <Col md={4}>
//                 <RenderSection
//                   section={SECTIONS.mixerCake}
//                   formData={cakeData}
//                   onChange={handleCakeChange}
//                   headerRight={
//                     <div className="d-flex align-items-center gap-2">
//                       <span style={{ fontWeight: 600 }}>cake id</span>
//                       <Form.Select
//                         size="sm"
//                         style={{ width: 140 }}
//                         value={selectedCakeId ?? ''}
//                         onChange={(e) => onSelectCake(e.target.value)}
//                         disabled={!cakeOptions.length}
//                       >
//                         {cakeOptions.map((id) => (
//                           <option key={id} value={id}>
//                             {id}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </div>
//                   }
//                 />
//               </Col>
//             </Row>

//             {/* Actual Recepie */}
//             <Row>
//               <Col md={12}>
//                 <RenderSection
//                   section={SECTIONS.actualRecipe}
//                   formData={batchData}
//                   onChange={handleBatchChange}
//                 />
//               </Col>
//             </Row>

//             {/* Raw materials */}
//             <Row>
//               <Col md={12}>
//                 <RenderSection
//                   section={SECTIONS.rawMaterials}
//                   formData={batchData}
//                   onChange={handleBatchChange}
//                 />
//               </Col>
//             </Row>
//           </Form>
//         </Container>
//       </Modal.Body>

//       <Modal.Footer>
//         {userAccess?.canWrite && (
//           <Button variant="primary" onClick={onSaveAll}>
//             Save
//           </Button>
//         )}
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default RecipeInfoModal;

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
  addNewLotesListCakes,
  updateLotesListCakesRecipe,
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
    title: 'Mixer (batch)',
    columns: 2,
    fields: [
      { label: 'Dosing order', key: 'dosing_order' },
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

      { label: 'Sand (dry), kg', key: 'sand_dry' },
      { label: 'Return (dry), kg', key: 'return_dry' },
      { label: 'Water solids', key: 'water_total' },
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
      { label: 'Al paste types', key: 'al_paste_types' },

      { label: 'Lime activity', key: 'lime_activity' },
      { label: 'Lime', key: 'lime_producer' },
      { label: 'Al paste proportions', key: 'al_paste_proportion' },

      { label: 'Slaking time for lime', key: 'lime_slaking_time_sec' },
      { label: 'Lime type', key: 'lime_type' },
    ],
  },
};

const numericKeys = new Set([
  'dosing_order',
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
  'water_total',

  'sand_fines',
  'sand_slurry_so3',
  'return_slurry_so3',
  'return_slurry_activity',
  'lime_activity',
  'lime_slaking_time_sec',

  'water_solid_ratio',
  'sand_slurry_density',
  'return_slurry_density',
  'casting_temp_c',
  'factory_temp_c',
]);

function RenderSection({
  section,
  formData,
  onChange,
  headerRight = null,
  columnsOverride = null,
}) {
  if (!section) return null;

  const cols = columnsOverride ?? section.columns ?? 1;

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
            const isDate = field.type === 'date';
            const value =
              isDate && formData[field.key]
                ? String(formData[field.key]).slice(0, 10)
                : formData[field.key] ?? '';

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
                    <Form.Control
                      size="sm"
                      type={field.type || 'text'}
                      name={field.key}
                      value={value}
                      readOnly={!!field.readOnly}
                      disabled={!!field.readOnly}
                      onChange={onChange}
                    />
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
  const user = useSelector((state) => state.user);

  const lotesListCakes = useSelector((state) => state.lotesListCakes);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [batchData, setBatchData] = useState({});
  const [selectedCakeId, setSelectedCakeId] = useState(null);
  const [cakeData, setCakeData] = useState({});
  const { showQuickChecking, setShowQuickChecking } = useModalContext();

  // Если хочешь вернуть ACL — раскомментируй
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

    const start = Number(selectedRecipe.cake_id_start);
    const finish = Number(selectedRecipe.cake_id_finish);

    const initialCakeId =
      Number.isFinite(start) && Number.isFinite(finish) ? start : null;

    setSelectedCakeId(initialCakeId);
  }, [selectedRecipe]);

  useEffect(() => {
    if (selectedCakeId == null) {
      setCakeData({});
      return;
    }

    const found = getCakeFromStore(selectedCakeId);
    setCakeData(found ? { ...found } : { id: Number(selectedCakeId) });
  }, [selectedCakeId, lotesListCakes, selectedRecipe]);

  const cakeOptions = useMemo(() => {
    const start = Number(batchData.cake_id_start);
    const finish = Number(batchData.cake_id_finish);
    if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start)
      return [];
    const arr = [];
    for (let i = start; i <= finish; i += 1) arr.push(i);
    return arr;
  }, [batchData.cake_id_start, batchData.cake_id_finish]);

  const quickCheckingInitialByCake = useMemo(() => {
    const map = {};
    cakeOptions.forEach((id) => {
      const c = getCakeFromStore(id);
      if (c) map[id] = c;
    });
    return map;
  }, [cakeOptions, lotesListCakes, selectedRecipe]);

  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prev) => ({
      ...prev,
      [name]: numericKeys.has(name) ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleCakeChange = (e) => {
    const { name, value } = e.target;
    setCakeData((prev) => ({
      ...prev,
      [name]: numericKeys.has(name) ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const onSelectCake = (nextCakeIdRaw) => {
    const nextCakeId = Number(nextCakeIdRaw);
    if (!Number.isFinite(nextCakeId)) return;

    setSelectedCakeId(nextCakeId);

    const found = getCakeFromStore(nextCakeId);
    setCakeData(found ? { ...found } : { id: nextCakeId });
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

    const start = Number(nextBatch.cake_id_start);
    const finish = Number(nextBatch.cake_id_finish);
    const initialCakeId =
      Number.isFinite(start) && Number.isFinite(finish) && finish >= start
        ? start
        : null;

    setSelectedCakeId(initialCakeId);
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

  const buildCakePayload = () => {
    const cake_id = selectedCakeId;
    const batch_id = batchData.batch_id;
    const sub_batch_id =
      batchData.sub_batch_id != null
        ? batchData.sub_batch_id
        : batchData.activeSubBatchId;

    return {
      id: cake_id,
      cake_id,
      batch_id,
      sub_batch_id,
      ...cakeData,
    };
  };

  const onSaveAll = async (e) => {
    e.preventDefault();

    const batchPayload = buildBatchPayload();
    dispatch(updateLotesListRecipe(batchPayload));

    const cakePayload = buildCakePayload();
    dispatch(addNewLotesListCakes(cakePayload));

    onHide();
  };

  const onSaveQuickChecking = (changes) => {
    dispatch(updateLotesListCakesRecipe(changes));

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
                        <Form.Select
                          size="sm"
                          style={{ width: 140 }}
                          value={selectedCakeId ?? ''}
                          onChange={(e) => onSelectCake(e.target.value)}
                          disabled={!cakeOptions.length}
                        >
                          {cakeOptions.map((id) => (
                            <option key={id} value={id}>
                              {id}
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
                    formData={batchData}
                    onChange={handleBatchChange}
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
