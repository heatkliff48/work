import React, { useContext, useEffect, useState } from 'react';
import urlAxios from '../../../api/axiosConfig.js';
import { useFileContext } from '#components/contexts/FileContext.js';

const FileDownload = ({ rowData, material_type }) => {
  const { message, setMessage } = useFileContext();

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
      setMessage('Error downloading the file');
    }
  };

  return (
    <div className="fileDownload">
      <form onSubmit={onSubmit}>
        <p>Existing file: {rowData?.file_name}</p>
        <button type="submit">Download</button>
      </form>
    </div>
  );
};

export default FileDownload;
