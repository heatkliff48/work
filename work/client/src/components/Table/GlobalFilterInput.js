import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import { useTranslation } from 'react-i18next';

export function GlobalFilterInput({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const { t } = useTranslation();
  const count = preGlobalFilteredRows?.length ?? 0;
  const [value, setValue] = useState(globalFilter || '');

  useEffect(() => {
    setValue(globalFilter || '');
  }, [globalFilter]);

  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <span>
      {t('table.globalSearch')} {''}
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={t('table.records', { count })}
      />
    </span>
  );
}
