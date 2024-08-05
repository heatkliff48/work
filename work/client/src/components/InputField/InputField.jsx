import React from 'react';
import { ModalBody } from 'reactstrap';
import { useState } from 'react';

const InputField = React.memo(({ el, inputValue, inputValueChange }) => {
  const [inputDirty, setInputDirty] = useState(false);
  const [inputError, setInputError] = useState("This field can't be empty");

  const [val, setVal] = useState(0);
  const [internalValue, setInternalValue] = useState(inputValue[el.accessor]);

  const isValid = (value) => value !== '' && value !== '-';

  const [valid, setValid] = useState(
    isValid(inputValue[el.accessor], el.min, el.max)
  );

  const regexp = new RegExp(`^[0-9]*$`);

  const inputChangeHandler = (e) => {
    inputValueChange(e);
    if (!e.target.value) {
      setInputError("This field can't be empty");
    } else if (parseInt(e.target.value) < parseInt(e.target.min)) {
      //e.target.value = e.target.min;
      setInputError(`Must be higher than ${e.target.min}`);
    } else if (parseInt(e.target.value) > parseInt(e.target.max)) {
      setInputError(`Must be lower than ${e.target.max}`);
    } else {
      setInputError('');
    }
  };

  return (
    <div className="item_topic">
      <ModalBody key={el.id}>{el.Header}:</ModalBody>
      {inputDirty && inputError && <div style={{ color: 'red' }}>{inputError}</div>}
      <input
        className={valid ? '' : 'invalid'}
        type="text"
        required
        min={el.min}
        max={el.max}
        id={el.accessor}
        name={el.accessor}
        value={inputValue[el.accessor] || ''}
        onChange={(e) => {
          if (regexp.test(e.target.value)) {
            // setInternalValue(e.target.value);
            // let newValid = isValid(e.target.value, el.min, el.max);
            // setValid(newValid);
            // if (newValid) {
            inputChangeHandler(e);
            // }
          }
          // inputValueChange(e);
        }}
        onBlur={(e) => {
          setInputDirty(true);
          // blurHandler(e);

          // if (internalValue < el.min) {
          //   setInternalValue(el.min);
          // } else if (internalValue > el.max) {
          //   setInternalValue(el.max);
          // } else {
          //   setInternalValue(inputValue[el.accessor]);
          // }
          // setValid(true);
        }}
      />
    </div>
  );
});
export default InputField;
