import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';
import { useFileContext } from '#components/contexts/FileContext.js';
import { useTranslation } from 'react-i18next';

const FileDownload = ({ rowData, material_type }) => {
  const { message, setMessage } = useFileContext();
  const { t } = useTranslation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const folderPath = `rawMaterialsWarehouse/${material_type}/${rowData?.file_name}`;

      const res = await axios.get(
        `${getApiUrl()}/files/download/${encodeURIComponent(folderPath)}`,
        {
          responseType: 'blob',
        },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', rowData?.file_name);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setMessage(t('files.downloadError'));
    }
  };

  return (
    <div className="fileDownload">
      <form onSubmit={onSubmit}>
        <p>{t('files.existingFile', { name: rowData?.file_name })}</p>
        <button type="submit">{t('files.download')}</button>
      </form>
    </div>
  );
};

export default FileDownload;
