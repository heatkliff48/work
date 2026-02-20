import React from 'react';
import { ModalBody } from 'reactstrap';
import { useState } from 'react';

const InputField = React.memo(
  ({ el, uBlockHeader = '', inputValue, inputValueChange, isDisabled, onBlur }) => {
    const [inputDirty, setInputDirty] = useState(false);
    const [inputError, setInputError] = useState("This field can't be empty");

    const isValid = (value) => value !== '' && value !== '-';
    const [valid, setValid] = useState(
      isValid(inputValue[el.accessor], el.min, el.max),
    );

    const regexp = /^[0-9]*([,][0-9]{0,2})?$/;

    const inputChangeHandler = (e) => {
      const rawValue = e.target.value;
      inputValueChange(e);

      if (!rawValue) {
        setInputError("This field can't be empty");
        return;
      }

      const repVale = rawValue.replace(',', '.');
      const parsed = parseFloat(repVale);
      const min = parseFloat(e.target.min);
      const max = parseFloat(e.target.max);

      if (isNaN(parsed)) {
        setInputError('Неверный формат числа');
      } else if (parsed < min) {
        setInputError(`Must be higher than ${e.target.min}`);
      } else if (parsed > max) {
        setInputError(`Must be lower than ${e.target.max}`);
      } else {
        setInputError('');
      }
    };

    const handleBlur = (e) => {
      setInputDirty(true);
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="item_topic">
        <ModalBody key={el.id}>{uBlockHeader ? uBlockHeader : el.Header}:</ModalBody>
        {inputDirty && inputError && (
          <div style={{ color: 'red' }}>{inputError}</div>
        )}
        <input
          className={valid ? '' : 'invalid'}
          type="text"
          required
          min={el.min}
          max={el.max}
          id={el.accessor}
          name={el.accessor}
          value={
            inputValue[el.accessor]
              ? String(inputValue[el.accessor]).replace('.', ',')
              : ''
          }
          readOnly={isDisabled}
          step="any"
          onChange={(e) => {
            if (regexp.test(e.target.value)) {
              inputChangeHandler(e);
            }
          }}
          onBlur={handleBlur}
        />
      </div>
    );
  },
);

export default InputField;
// import React from 'react';
// import { ModalBody } from 'reactstrap';
// import { useState } from 'react';

// const InputField = React.memo(
//   ({ el, uBlockHeader = '', inputValue, inputValueChange, isDisabled }) => {
//     const [inputDirty, setInputDirty] = useState(false);
//     const [inputError, setInputError] = useState("This field can't be empty");

//     const isValid = (value) => value !== '' && value !== '-';
//     const [valid, setValid] = useState(
//       isValid(inputValue[el.accessor], el.min, el.max)
//     );

//     // Разрешаем числа вида 123, 123,4 или 123,45
//     const regexp = /^[0-9]*([,][0-9]{0,2})?$/;

//     const inputChangeHandler = (e) => {
//       const rawValue = e.target.value;
//       inputValueChange(e); // сохраняем как строку

//       if (!rawValue) {
//         setInputError("This field can't be empty");
//         return;
//       }

//       const repVale = rawValue.replace(',', '.');
//       const parsed = parseFloat(repVale);
//       const min = parseFloat(e.target.min);
//       const max = parseFloat(e.target.max);

//       if (isNaN(parsed)) {
//         setInputError('Неверный формат числа');
//       } else if (parsed < min) {
//         setInputError(`Must be higher than ${e.target.min}`);
//       } else if (parsed > max) {
//         setInputError(`Must be lower than ${e.target.max}`);
//       } else {
//         setInputError('');
//       }
//     };

//     return (
//       <div className="item_topic">
//         <ModalBody key={el.id}>{uBlockHeader ? uBlockHeader : el.Header}:</ModalBody>
//         {inputDirty && inputError && (
//           <div style={{ color: 'red' }}>{inputError}</div>
//         )}
//         <input
//           className={valid ? '' : 'invalid'}
//           type="text"
//           required
//           min={el.min}
//           max={el.max}
//           id={el.accessor}
//           name={el.accessor}
//           value={
//             inputValue[el.accessor]
//               ? String(inputValue[el.accessor]).replace('.', ',')
//               : ''
//           }
//           readOnly={isDisabled}
//           step="any"
//           onChange={(e) => {
//             if (regexp.test(e.target.value)) {
//               inputChangeHandler(e);
//             }
//           }}
//           onBlur={() => setInputDirty(true)}
//         />
//       </div>
//     );
//   }
// );

// export default InputField;
