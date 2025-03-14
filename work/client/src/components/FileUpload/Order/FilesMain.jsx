import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileProvider } from './FileContext';

const FilesMain = ({ userAccess }) => {
  return (
    <FileProvider>
      <div>
        <div className="footer_button">{userAccess?.canWrite && <FileUpload />}</div>
        <div className="footer_button">
          <FileDownload />
        </div>
      </div>
    </FileProvider>
  );
};

export default FilesMain;
