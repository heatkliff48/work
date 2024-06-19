// import { useCallback, useEffect } from 'react';

// const useCalculateValues = (formInput, setFormInput) => {
//   const calculateValues = useCallback((formInput) => {
//     const values = {};
//     const updateFuncs = {};

//     // Вычисление m3
//     if (formInput['lengths'] && formInput['height'] && formInput['width']) {
//       values.m3 =
//         Math.floor(1200 / formInput['lengths']) *
//         Math.floor(1000 / formInput['height']) *
//         Math.floor(1500 / formInput['width']) *
//         (
//           (formInput['lengths'] * formInput['height'] * formInput['width']) /
//           Math.pow(10, 9)
//         ).toFixed(2);
//       updateFuncs.m3 = (value) => setFormInput((prev) => ({ ...prev, m3: value }));
//     }

//     // Вычисление m2
//     if (values.m3 && formInput['width']) {
//       values.m2 = (values.m3 / (formInput['width'] / 1000)).toFixed(2);
//       updateFuncs.m2 = (value) => setFormInput((prev) => ({ ...prev, m2: value }));
//     }

//     // Вычисление m
//     if (values.m2 && formInput['height']) {
//       values.m = (values.m2 / (formInput['height'] / 1000)).toFixed(2);
//       updateFuncs.m = (value) => setFormInput((prev) => ({ ...prev, m: value }));
//     }

//     // Вычисление widthInArray
//     if (formInput['width']) {
//       values.widthInArray = Math.floor(1500 / formInput['width']).toFixed(2);
//       updateFuncs.widthInArray = (value) =>
//         setFormInput((prev) => ({ ...prev, widthInArray: value }));
//     }

//     // Вычисление m3InArray
//     if (
//       formInput['lengths'] &&
//       formInput['height'] &&
//       formInput['width'] &&
//       values.widthInArray
//     ) {
//       values.m3InArray =
//         Math.floor(600 / formInput['lengths']) *
//         Math.floor(6000 / formInput['height']) *
//         values.widthInArray *
//         (
//           (formInput['lengths'] * formInput['height'] * formInput['width']) /
//           Math.pow(10, 9)
//         ).toFixed(2);
//       updateFuncs.m3InArray = (value) =>
//         setFormInput((prev) => ({ ...prev, m3InArray: value }));
//     }

//     if (formInput['density']) {
//       values.densityDryMax = (formInput['density'] * 1.25).toFixed(2);
//       updateFuncs.densityDryMax = (value) =>
//         setFormInput((prev) => ({ ...prev, densityDryMax: value }));
//     }

//     // Вычисление densityDryDef
//     if (formInput['density']) {
//       values.densityDryDef = (formInput['density'] * 1.05).toFixed(2);
//       updateFuncs.densityDryDef = (value) =>
//         setFormInput((prev) => ({ ...prev, densityDryDef: value }));
//     }

//     // Вычисление densityHuminityMax
//     if (formInput['humidity'] && values.densityDryMax) {
//       values.densityHuminityMax = (
//         (1.05 + formInput['humidity']) *
//         values.densityDryMax
//       ).toFixed(2);
//       updateFuncs.densityHuminityMax = (value) =>
//         setFormInput((prev) => ({
//           ...prev,
//           densityHuminityMax: value,
//         }));
//     }

//     // Вычисление densityHuminityDef
//     if (formInput['humidity'] && values.densityDryDef) {
//       values.densityHuminityDef = (
//         (1 + formInput['humidity']) *
//         values.densityDryDef
//       ).toFixed(2);
//       updateFuncs.densityHuminityDef = (value) =>
//         setFormInput((prev) => ({
//           ...prev,
//           densityHuminityDef: value,
//         }));
//     }

//     // Вычисление weightMax
//     if (values.densityHuminityMax && values.m3) {
//       values.weightMax = (values.densityHuminityMax * values.m3 + 23).toFixed(2);
//       updateFuncs.weightMax = (value) =>
//         setFormInput((prev) => ({ ...prev, weightMax: value }));
//     }

//     // Вычисление weightDef
//     if (values.densityHuminityDef && values.m3) {
//       values.weightDef = (values.densityHuminityDef * values.m3 + 23).toFixed(2);
//       updateFuncs.weightDef = (value) =>
//         setFormInput((prev) => ({ ...prev, weightDef: value }));
//     }

//     return { values, updateFuncs };
//   }, []);

//   return calculateValues(formInput);
// };

// export default useCalculateValues;
