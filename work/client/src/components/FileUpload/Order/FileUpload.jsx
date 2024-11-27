import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FileContext } from './FileContext';
import { addNewFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { useDispatch } from 'react-redux';
import { useOrderContext } from '#components/contexts/OrderContext.js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setMessage, refreshFiles } = useContext(FileContext);
  const { orderCartData } = useOrderContext();

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('myFile', file);

      dispatch(
        addNewFilesOrder({
          order_id: orderCartData?.id,
          file_name: file.name,
        })
      );

      try {
        const res = await axios.post(
          'http://localhost:3001/files/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setMessage(res.data);
        refreshFiles(); // Refresh the file list after upload
      } catch (err) {
        if (err.response) {
          setMessage(err.response.data);
        } else {
          setMessage('There was a problem with the server');
        }
      }
    } else {
      setMessage('No file selected!');
    }
  };

  return (
    <div className="fileUpload">
      <h5>File Upload</h5>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onChange} accept=".pdf,.txt,.doc,.docx" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
