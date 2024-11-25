import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileProvider } from './FileContext';

const FilesMain = () => {
  return (
    <FileProvider>
      <div>
        <FileUpload />
        <FileDownload />
      </div>
    </FileProvider>
  );
};

export default FilesMain;
