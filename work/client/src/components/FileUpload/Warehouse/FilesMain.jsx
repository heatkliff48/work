import FileUpload from './FileUpload';
import FileDownload from './FileDownload';

import { useUsersContext } from '#components/contexts/UserContext.js';
import { useSelector } from 'react-redux';
import { FileContextProvider } from '#components/contexts/FileContext.js';

const FilesMain = ({ type }) => {
  const { roles, checkUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);

  return (
    <FileContextProvider>
      <div>
        {checkUserAccess(user, roles, 'Warehouse_modal_upload_file')?.canWrite && (
          <FileUpload type={type} />
        )}
        {checkUserAccess(user, roles, 'Warehouse_modal_upload_file')?.canRead && (
          <FileDownload type={type} />
        )}
      </div>
    </FileContextProvider>
  );
};

export default FilesMain;
