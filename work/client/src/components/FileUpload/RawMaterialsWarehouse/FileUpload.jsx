import React, { useState, useContext } from 'react';
import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';
import { useDispatch } from 'react-redux';
import { useFileContext } from '#components/contexts/FileContext.js';
import { useCallback } from 'react';
import * as warehouseActions from '#components/redux/actions/warehouseRawMaterialsAction.js';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ rowData, material_type, deleteCheck = false }) => {
  const [file, setFile] = useState(null);
  const { setMessage } = useFileContext();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getUpdateAction = useCallback((materialType) => {
    const actionMap = {
      'Sand (dry)': warehouseActions.updateWarehouseSand,
      Lime: warehouseActions.updateWarehouseLime,
      Cement: warehouseActions.updateWarehouseCement,
      'Gypsum (dry)': warehouseActions.updateWarehouseGypsum,
      'Gypsum stone': warehouseActions.updateWarehouseGypsumStone,
      'Aluminum 1': warehouseActions.updateWarehouseAluminum1,
      'Aluminum 2': warehouseActions.updateWarehouseAluminum2,
      'Grinding Balls': warehouseActions.updateWarehouseGrindingBalls,
      AAC: warehouseActions.updateWarehouseAAC,
      'Sand slurry (dry)': warehouseActions.updateWarehouseSandSlurry,
      Plastics: warehouseActions.updateWarehousePlastics,
      Pallets: warehouseActions.updateWarehousePallets,
      'Sand powder (dry)': warehouseActions.updateWarehouseSandPowder,
      'Release oil': warehouseActions.updateWarehouseReleaseOil,
    };

    return actionMap[materialType] || warehouseActions.updateWarehouseSand;
  }, []);

  const handleUpload = async () => {
    console.log(material_type, 'material_type FileUpload.jsx line 38');
    const updateRawMaterialAction = getUpdateAction(material_type);

    if (!file) {
      setMessage(t('files.noFileSelected'));
      return;
    }

    const formData = new FormData();
    formData.append('myFile', file);

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
      if (err.response) {
        setMessage(err.response.data);
      } else {
        setMessage(t('files.serverError'));
      }
    }
  };

  const handleDelete = async () => {
    const updateRawMaterialAction = getUpdateAction(material_type);

    console.log(rowData);

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
            accept=".pdf,.txt,.doc,.docx.,jpg,.jpeg,.png,.gif,.bmp,.svg"
          />
          <button onClick={handleUpload}>{t('files.upload')}</button>
        </>
      )}
      {deleteCheck && (
        <>
          <button onClick={handleDelete}>{t('files.delete')}</button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
