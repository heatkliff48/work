import React, { useEffect } from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileProvider } from './FileContext';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useSelector } from 'react-redux';

const FilesMain = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse_modal_upload_file');
      setUserAccess(access);
    }
  }, [user, roles]);

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
