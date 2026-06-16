import React, { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import { Switch, FormControlLabel } from '@mui/material';

const ModalTable = ({ isOpen, toggle, data = [], onClickRow = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('article'); // 'article' | 'all'

  // Фильтрация данных с поиском
  const filteredData = useMemo(() => {
    if (!data?.length) return [];

    let result = data;

    // Сначала применяем фильтр по артикулу (T)
    result = result.filter((item) => item?.article?.startsWith('T'));

    // Затем применяем поиск, если есть запрос
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
          const searchableFields = ['article', 'density', 'width'];
          return searchableFields.some((field) => {
            const value = item?.[field];
            if (value === undefined || value === null) return false;
            return String(value).toLowerCase().includes(term);
          });
        });
      }
    }

    return result;
  }, [data, searchTerm, searchMode]);

  // Подготовка данных для отображения
  const right_data = useMemo(() => {
    return filteredData.map((item) => ({
      id: item.id,
      article: item.article,
      density: item?.density,
      width: item?.width,
      m3InArray: item?.m3InArray,
      volumeBlockOnPallet: item?.volumeBlockOnPallet,
      normOfBrack: item?.normOfBrack,
    }));
  }, [filteredData]);

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
                : 'all fields (article, density, width)'}
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
