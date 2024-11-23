import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesWarehouse } from '#components/redux/actions/filesWarehouseAction.js';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const filesWarehouse = useSelector((state) => state.filesWarehouse);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFilesWarehouse());
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:3001/files/files');
        setFiles(res.data);
      } catch (err) {
        setMessage('Error fetching files');
      }
    };

    fetchFiles();
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
      value={{ files, setFiles, message, setMessage, refreshFiles, filesWarehouse }}
    >
      {children}
    </FileContext.Provider>
  );
};
