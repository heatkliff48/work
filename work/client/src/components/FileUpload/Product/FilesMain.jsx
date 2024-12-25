import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileProvider } from './FileContext';

const FilesMain = ({ userAccess }) => {
  return (
    <FileProvider>
      <div>
        {userAccess?.canWrite && <FileUpload />}
        <FileDownload />
      </div>
    </FileProvider>
  );
};

export default FilesMain;
