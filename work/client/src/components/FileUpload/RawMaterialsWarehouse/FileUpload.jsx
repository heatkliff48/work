import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import * as warehouseActions from '#components/redux/actions/warehouseRawMaterialsAction.js';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ rowData, material_type, deleteCheck = false }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Сообщение показываем у своей строки: общий message из FileContext в окне склада не выводится
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const getUpdateAction = useCallback((materialType) => {
    const actionMap = {
      'Sand (dry)': warehouseActions.updateWarehouseSand,
      Lime: warehouseActions.updateWarehouseLime,
      Cement: warehouseActions.updateWarehouseCement,
      'Gypsum (dry)': warehouseActions.updateWarehouseGypsum,
      'Gypsum stone': warehouseActions.updateWarehouseGypsumStone,
      Aluminum: warehouseActions.updateWarehouseAluminum1,
      'Aluminum 2': warehouseActions.updateWarehouseAluminum2,
      'Grinding Balls': warehouseActions.updateWarehouseGrindingBalls,
      AAC: warehouseActions.updateWarehouseAAC,
      'Sand slurry (dry)': warehouseActions.updateWarehouseSandSlurry,
      Plastics: warehouseActions.updateWarehousePlastics,
      Pallets: warehouseActions.updateWarehousePallets,
      'Sand powder (dry)': warehouseActions.updateWarehouseSandPowder,
      'Release oil': warehouseActions.updateWarehouseReleaseOil,
    };

    // Без запасного варианта: иначе файл молча записывался бы в чужую таблицу
    return actionMap[materialType];
  }, []);

  const handleUpload = async () => {
    const updateRawMaterialAction = getUpdateAction(material_type);

    if (!updateRawMaterialAction) {
      console.error(`No file update action for material "${material_type}"`);
      setMessage(t('files.serverError'));
      return;
    }

    if (!file) {
      setMessage(t('files.noFileSelected'));
      return;
    }

    const formData = new FormData();
    formData.append('myFile', file);

    setUploading(true);
    try {
      const folderPath = `rawMaterialsWarehouse/${material_type}`;
      const res = await axios.post(
        `${getApiUrl()}/files/upload/${encodeURIComponent(folderPath)}?section=rawMaterialsWarehouse`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      dispatch(
        updateRawMaterialAction({
          id: rowData?.id,
          file_name: res.data.filename,
        }),
      );

      setMessage(t('files.uploaded', { name: res.data.filename }));
      setFile(null);
    } catch (err) {
      const data = err.response?.data;
      setMessage(
        typeof data === 'string'
          ? data
          : data?.error || data?.message || t('files.serverError'),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const updateRawMaterialAction = getUpdateAction(material_type);

    if (!updateRawMaterialAction) {
      console.error(`No file update action for material "${material_type}"`);
      setMessage(t('files.serverError'));
      return;
    }

    dispatch(
      updateRawMaterialAction({
        id: rowData?.id,
        file_name: '-1',
      }),
    );
  };

  return (
    <div className="fileUpload">
      {!deleteCheck && (
        <>
          <input
            type="file"
            onChange={onChange}
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.svg"
          />
          <button onClick={handleUpload} disabled={uploading}>
            {t('files.upload')}
          </button>
        </>
      )}
      {deleteCheck && (
        <>
          <button onClick={handleDelete}>{t('files.delete')}</button>
        </>
      )}
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default FileUpload;
