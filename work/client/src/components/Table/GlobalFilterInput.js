import React from 'react';
import { useAsyncDebounce } from 'react-table';

export function GlobalFilterInput({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 300);

  return (
    <span>
      Global search: {''}
      <input
        value={globalFilter || ''}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}
