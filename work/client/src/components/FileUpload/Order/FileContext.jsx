import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesOrder } from '#components/redux/actions/filesOrderAction.js';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const filesOrder = useSelector((state) => state.filesOrder);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFilesOrder());
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
      value={{ files, setFiles, message, setMessage, refreshFiles, filesOrder }}
    >
      {children}
    </FileContext.Provider>
  );
};
