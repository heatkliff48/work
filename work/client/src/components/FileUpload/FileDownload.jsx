import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FileContext } from './FileContext';

const FileDownload = () => {
  const { files, message, setMessage } = useContext(FileContext);
  const [selectedFile, setSelectedFile] = useState('');

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

  return (
    <div>
      <h1>File Download</h1>
      <form onSubmit={onSubmit}>
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">Select a file</option>
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
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
