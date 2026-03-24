import React, { useState, useContext } from 'react';
import axios from 'axios';
import { addNewFilesProduct } from '#components/redux/actions/filesProductAction.js';
import { useDispatch } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import { useFileContext } from '#components/contexts/FileContext.js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setMessage } = useFileContext();
  const { productCardData } = useProjectContext();

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
        addNewFilesProduct({
          product_id: productCardData?.id,
          fileType: 'product',
          file_name: file.name,
        }),
      );

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_URL}/files/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setMessage(res.data);
        //refreshFiles(); // Refresh the file list after upload
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
        <input
          type="file"
          onChange={onChange}
          accept=".pdf,.txt,.doc,.docx.,jpg,.jpeg,.png,.gif,.bmp,.svg"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
