import React, { useContext, useEffect, useState } from 'react';
import urlAxios from '../../../api/axiosConfig.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useFileContext } from '#components/contexts/FileContext.js';
import '#components/Orders/ordersView.css';

const FileDownload = () => {
  const { message, setMessage, filesOrder } = useFileContext();
  const [selectedFile, setSelectedFile] = useState('');
  const [filteredFiles, setFilteredFiles] = useState(filesOrder);
  const { orderCartData } = useOrderContext();

  const onSubmit = async (e) => {
    e.preventDefault();

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
      console.error('Ошибка скачивания файла:', err);
      setMessage('Error downloading the file');
    }
  };

  useEffect(() => {
    const filteredFiles = filesOrder.filter(
      (el) => el.order_id === orderCartData?.id,
    );
    setFilteredFiles(filteredFiles);
  }, [filesOrder]);

  return (
    <div className="ord-field">
      <label className="ord-field__label">File download</label>
      <form onSubmit={onSubmit} className="ord-file-row">
        <select
          className="ord-select"
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
        <button
          type="submit"
          disabled={!selectedFile}
          className="ord-btn ord-btn--ghost ord-btn--sm"
        >
          Download
        </button>
      </form>
      {message ? (
        <div className="ord-muted" style={{ marginTop: 6 }}>
          {message}
        </div>
      ) : null}
    </div>
  );
};

export default FileDownload;
