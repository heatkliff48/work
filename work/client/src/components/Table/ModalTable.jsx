import React, { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import { Switch, FormControlLabel } from '@mui/material';
import {
  blocksInHeight,
  calculatePalletDimensions,
} from '#utils/palletDimensions.js';

// Rows of blocks on the product's pallet, counted as the product card does
const getBlocksInHeight = (product) => {
  const width = Number(product?.width);

  if (!width || product?.palletHeight == null || product.palletHeight === '') {
    return null;
  }

  const { palletHeight, extraRows } = calculatePalletDimensions(
    product.palletSize,
    product.palletHeight,
  );

  return blocksInHeight(palletHeight, extraRows, width);
};

const ModalTable = ({ isOpen, toggle, data = [], onClickRow = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('article'); // 'article' | 'all'

  // Подготовка данных для отображения
  const productRows = useMemo(() => {
    if (!data?.length) return [];

    // Только продукты с артикулом на T
    return data
      .filter((item) => item?.article?.startsWith('T'))
      .map((item) => {
        const blocks = getBlocksInHeight(item);

        return {
          id: item.id,
          article: item.article,
          description: item?.description,
          density: item?.density,
          width: item?.width,
          palletSize: item?.palletSize,
          blocksInHeight: blocks,
          // Блоки лежат на ширине (мм), высота стопки в см
          heightCm: blocks === null ? null : (blocks * Number(item.width)) / 10,
          m3InArray: item?.m3InArray,
          volumeBlockOnPallet: item?.volumeBlockOnPallet,
          normOfBrack: item?.normOfBrack,
        };
      });
  }, [data]);

  // Фильтрация данных с поиском
  const right_data = useMemo(() => {
    let result = productRows;

    // Применяем поиск, если есть запрос
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();

      if (searchMode === 'article') {
        // Поиск только по артикулу
        result = result.filter((item) =>
          item?.article?.toLowerCase().includes(term),
        );
      } else {
        // Поиск по всем полям (кроме id и скрытых)
        result = result.filter((item) => {
          const searchableFields = [
            'article',
            'description',
            'density',
            'width',
            'palletSize',
            'blocksInHeight',
            'heightCm',
          ];
          return searchableFields.some((field) => {
            const value = item?.[field];
            if (value === undefined || value === null) return false;
            return String(value).toLowerCase().includes(term);
          });
        });
      }
    }

    return result;
  }, [productRows, searchTerm, searchMode]);

  const hiddenKeys = ['m3InArray', 'volumeBlockOnPallet', 'normOfBrack'];

  // Сброс поиска при закрытии модального окна
  const handleToggle = () => {
    setSearchTerm('');
    toggle();
  };

  // Переключение режима поиска
  const toggleSearchMode = () => {
    setSearchMode((prev) => (prev === 'article' ? 'all' : 'article'));
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleToggle}
      className="modal-products-table"
      scrollable={true}
    >
      <ModalHeader toggle={handleToggle}>Select product</ModalHeader>
      <ModalBody>
        {/* Панель поиска с toggle */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder={
                  searchMode === 'article'
                    ? '🔍 Search by article...'
                    : '🔍 Search in all fields...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-sm whitespace-nowrap ${
                  searchMode === 'article'
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-400'
                }`}
              >
                Search by Article
              </span>

              <Switch
                checked={searchMode === 'all'}
                onChange={toggleSearchMode}
                size="small"
              />

              <span
                className={`text-sm whitespace-nowrap ${
                  searchMode === 'all'
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-400'
                }`}
              >
                Search in All Fields
              </span>
            </div>
          </div>
        </div>

        {/* Подсказка о текущем режиме */}
        {searchTerm && (
          <div className="mb-2 text-xs text-gray-500">
            Searching in:{' '}
            <span className="font-medium">
              {searchMode === 'article'
                ? 'article field only'
                : 'all fields (article, description, density, width, pallet size, blocks in height, height in cm)'}
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          {right_data.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(right_data[0]).map((key) => {
                    if (hiddenKeys.includes(key)) return null;
                    return (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {key}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {right_data.map((row, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    {Object.entries(row).map(([key, value]) => {
                      if (hiddenKeys.includes(key)) return null;
                      return (
                        <td
                          key={key}
                          className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            if (onClickRow) {
                              onClickRow(row);
                              handleToggle();
                            }
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              {searchTerm.trim()
                ? 'No products found matching your search'
                : 'No data available for you'}
            </p>
          )}
        </div>

        {/* Информация о количестве результатов */}
        {right_data.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Found {right_data.length} product{right_data.length > 1 ? 's' : ''}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ModalTable;
