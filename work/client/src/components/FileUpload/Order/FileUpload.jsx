import React, { useState, useContext } from 'react';
import axios from 'axios';
import { addNewFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { useDispatch } from 'react-redux';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useFileContext } from '#components/contexts/FileContext.js';
import '#components/Orders/ordersView.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setMessage, refreshFiles } = useFileContext();
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
          fileType: 'order',
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
        refreshFiles();
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
    <div className="ord-field">
      <label className="ord-field__label">File upload</label>
      <form onSubmit={onSubmit} className="ord-file-row">
        <input
          type="file"
          onChange={onChange}
          accept=".pdf,.txt,.doc,.docx.,jpg,.jpeg,.png,.gif,.bmp,.svg"
          className="ord-file-input"
        />
        <button type="submit" className="ord-btn ord-btn--ghost ord-btn--sm">
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
