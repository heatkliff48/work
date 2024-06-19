import React from 'react';
import { ModalBody } from 'reactstrap';

const InputField = React.memo(
  ({ el, formInput, inputChange }) => {
    return (
      <div className="item_topic">
        <ModalBody key={el.id}>{el.Header}:</ModalBody>
        <input
          type="text"
          id={el.accessor}
          name={el.accessor}
          value={formInput[el.accessor] || ''}
          onChange={(e) => {
            inputChange(e);
          }}
        />
      </div>
    );
  }
);
export default InputField;
