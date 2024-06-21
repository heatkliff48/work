import React from 'react';
import { ModalBody } from 'reactstrap';

const InputField = React.memo(({ el, inputValue, inputValueChange }) => {
  return (
    <div className="item_topic">
      <ModalBody key={el.id}>{el.Header}:</ModalBody>
      <input
        type="text"
        id={el.accessor}
        name={el.accessor}
        value={inputValue[el.accessor] || ''}
        onChange={(e) => {
          inputValueChange(e);
        }}
      />
    </div>
  );
});
export default InputField;
