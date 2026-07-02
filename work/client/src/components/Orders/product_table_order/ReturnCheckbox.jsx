import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

const ReturnCheckbox = ({
  product,
  vatValue,
  setVatValue,
  isChecked,
  onCheckChange,
}) => {
  const handleReturnToggle = (e) => {
    e.stopPropagation();
    const checked = e.target.checked;

    onCheckChange?.(product?.id, checked);

    setVatValue((prev) => ({
      ...prev,
      vat_result: checked ? prev.vat_result - 999 : prev.vat_result,
    }));
  };

  return (
    <FormGroup check className="mb-0 d-inline-block">
      <Label check>
        <Input
          type="checkbox"
          checked={isChecked}
          onChange={handleReturnToggle}
          onClick={(e) => e.stopPropagation()}
        />{' '}
        Return
      </Label>
    </FormGroup>
  );
};

export default ReturnCheckbox;
