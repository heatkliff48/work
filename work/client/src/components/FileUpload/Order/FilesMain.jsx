import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileContextProvider } from '#components/contexts/FileContext.js';
import '#components/Orders/ordersView.css';

const FilesMain = ({ userAccess }) => {
  return (
    <FileContextProvider>
      <div className="ord-file-section">
        {userAccess?.canWrite && <FileUpload />}
        <FileDownload />
      </div>
    </FileContextProvider>
  );
};

export default FilesMain;
