import React, { useState } from 'react';
import urlAxios from '../../../api/axiosConfig.js';
import { useTranslation } from 'react-i18next';

const FileDownload = ({ rowData, material_type }) => {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const onSubmit = async (e) => {
    e.preventDefault();

    const fileName = rowData?.file_name;
    if (!fileName) return;

    try {
      const folderPath = `rawMaterialsWarehouse/${material_type}/${fileName}`;

      const response = await urlAxios.get(
        `/files/download/${encodeURIComponent(folderPath)}`,
        {
          responseType: 'blob',
        },
      );

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
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
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default FileDownload;
