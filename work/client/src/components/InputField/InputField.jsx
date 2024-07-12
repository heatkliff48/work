import React from 'react';
import { ModalBody } from 'reactstrap';
import { useState } from 'react';

const InputField = React.memo(({ el, inputValue, inputValueChange }) => {
  const [val, setVal] = useState(0);
  let minValue = 0;
  let maxValue = Number.MAX_VALUE;
  switch (el.accessor) {
    case "width":
      minValue = 50;
      maxValue = 500;
      break;
  
    default:
      break;
  }
  const setNumber = (e) => {
    let { value, min, max } = e.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));

    setVal(value);
  };
  return (
    <div className="item_topic">
      <ModalBody key={el.id}>{el.Header}:</ModalBody>
      <input
        type="number"
        required
        min={minValue}
        max={maxValue}
        id={el.accessor}
        name={el.accessor}
        value={inputValue[el.accessor] || ''}
        onChange={(e) => {
          setNumber(e);
          inputValueChange(e);
        }}
      />
    </div>
  );
});
export default InputField;
