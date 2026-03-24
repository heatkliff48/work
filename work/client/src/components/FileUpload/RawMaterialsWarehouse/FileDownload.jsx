import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useFileContext } from '#components/contexts/FileContext.js';

const FileDownload = ({ rowData, material_type }) => {
  const { message, setMessage } = useFileContext();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const folderPath = `rawMaterialsWarehouse/${material_type}/${rowData?.file_name}`;

      const res = await axios.get(
        `http://localhost:3001/files/download/${encodeURIComponent(folderPath)}`,
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
