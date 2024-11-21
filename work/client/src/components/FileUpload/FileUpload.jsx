import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FileContext } from './FileContext';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setMessage, refreshFiles } = useContext(FileContext);

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('myFile', file);

    try {
      const res = await axios.post('http://localhost:3001/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data);
      refreshFiles(); // Refresh the file list after upload
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data);
      } else {
        setMessage('There was a problem with the server');
      }
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onChange} accept=".pdf,.txt,.doc,.docx" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
