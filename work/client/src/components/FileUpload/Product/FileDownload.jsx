import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FileContext } from './FileContext';
import { useProjectContext } from '#components/contexts/Context.js';

const FileDownload = () => {
  const { message, setMessage, filesProduct } = useContext(FileContext);
  const [selectedFile, setSelectedFile] = useState('');
  const [filteredFiles, setFilteredFiles] = useState(filesProduct);
  const { productCardData } = useProjectContext();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:3001/files/download/${selectedFile}`,
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedFile);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setMessage('Error downloading the file');
    }
  };

  useEffect(() => {
    const filteredFiles = filesProduct.filter(
      (el) => el.product_id === productCardData?.id
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
