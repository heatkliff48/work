import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useContext } from 'react';

export const FileContext = createContext();

export const FileContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const filesLotesList = useSelector((state) => state.filesLotesList);
  const filesOrder = useSelector((state) => state.filesOrder);
  const filesProduct = useSelector((state) => state.filesProduct);
  const filesWarehouse = useSelector((state) => state.filesWarehouse);

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
      value={{
        files,
        setFiles,
        message,
        setMessage,
        refreshFiles,
        filesWarehouse,
        filesLotesList,
        filesOrder,
        filesProduct,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext);
