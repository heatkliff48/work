import React from 'react';
import { useAsyncDebounce } from 'react-table';
import { useTranslation } from 'react-i18next';

export function GlobalFilterInput({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const { t } = useTranslation();
  const count = preGlobalFilteredRows.length;
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 300);

  return (
    <span>
      {t('table.globalSearch')} {''}
      <input
        value={globalFilter || ''}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={t('table.records', { count })}
      />
    </span>
  );
}
