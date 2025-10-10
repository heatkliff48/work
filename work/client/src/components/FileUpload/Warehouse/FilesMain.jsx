
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { FileProvider } from './FileContext';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useSelector } from 'react-redux';

const FilesMain = ({ type }) => {
  const { roles, checkUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);

  return (
    <FileProvider>
      <div>
        {checkUserAccess(user, roles, 'Warehouse_modal_upload_file')?.canWrite && (
          <FileUpload type={type} />
        )}
        {checkUserAccess(user, roles, 'Warehouse_modal_upload_file')?.canRead && (
          <FileDownload type={type} />
        )}
      </div>
    </FileProvider>
  );
};

export default FilesMain;
