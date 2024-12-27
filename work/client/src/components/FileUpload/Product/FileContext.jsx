import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesProduct } from '#components/redux/actions/filesProductAction.js';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const filesProduct = useSelector((state) => state.filesProduct);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFilesProduct());
  }, []);

  const refreshFiles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/files/files');
      setFiles(res.data);
    } catch (err) {
      setMessage('Error fetching files');
    }
  };

  return (
    <FileContext.Provider
      value={{ files, setFiles, message, setMessage, refreshFiles, filesProduct }}
    >
      {children}
    </FileContext.Provider>
  );
};
