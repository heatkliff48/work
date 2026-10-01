import React, { useContext, useEffect, useState } from 'react';
import urlAxios from '../../../api/axiosConfig.js';

import { useProjectContext } from '#components/contexts/Context.js';
import { useFileContext } from '#components/contexts/FileContext.js';

const FileDownload = () => {
  const { message, setMessage, filesProduct } = useFileContext();
  const [selectedFile, setSelectedFile] = useState('');
  const [filteredFiles, setFilteredFiles] = useState(filesProduct);
  const { productCardData } = useProjectContext();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    try {
      const response = await urlAxios.get(
        `/files/download/${encodeURIComponent(selectedFile)}`,
        {
          responseType: 'blob',
        },
      );

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = selectedFile;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setMessage('Error downloading the file');
    }
  };

  useEffect(() => {
    const filteredFiles = filesProduct.filter(
      (el) => el.product_id === productCardData?.id,
    );
    setFilteredFiles(filteredFiles);
  }, [filesProduct]);

  return (
    <div className="fileDownload">
      <h5>File Download</h5>
      <form onSubmit={onSubmit}>
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">Select a file</option>
          {filteredFiles.map((file) => (
            <option key={file.file_name} value={file.file_name}>
              {file.file_name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!selectedFile}>
          Download
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default FileDownload;
