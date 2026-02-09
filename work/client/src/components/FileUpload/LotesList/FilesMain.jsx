import React from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileContextProvider } from '#components/contexts/FileContext.js';

const FilesMain = ({ userAccess, lotesList_id }) => {
  return (
    <FileContextProvider>
      <div>
        <div className="footer_button">
          {/* {userAccess?.canWrite && */}
          <FileUpload lotesList_id={lotesList_id} />
          {/* } */}
        </div>
        <div className="footer_button">
          <FileDownload lotesList_id={lotesList_id} />
        </div>
      </div>
    </FileContextProvider>
  );
};

export default FilesMain;
