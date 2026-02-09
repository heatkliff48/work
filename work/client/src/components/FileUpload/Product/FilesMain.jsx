import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileContextProvider } from '#components/contexts/FileContext.js';


const FilesMain = ({ userAccess }) => {
  return (
    <FileContextProvider>
      <div>
        {userAccess?.canWrite && <FileUpload />}
        <FileDownload />
      </div>
    </FileContextProvider>
  );
};

export default FilesMain;
