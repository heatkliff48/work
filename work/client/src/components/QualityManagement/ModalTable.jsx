import React, { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import './qualityManagement.css';

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
      className="modal-products-table qm-modal"
      scrollable={true}
    >
      <ModalHeader toggle={handleToggle}>Select product</ModalHeader>
      <ModalBody>
        <div className="qm-modal-scope">
          {/* Панель поиска */}
          <div className="qm-modal-toolbar">
            <div className="qm-modal-search">
              <span className="qm-modal-search__ic">🔍</span>
              <input
                type="text"
                className="qm-modal-search__input"
                placeholder={
                  searchMode === 'article'
                    ? 'Search by article…'
                    : 'Search in all fields…'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="qm-seg">
              <button
                type="button"
                className={`qm-seg__btn ${
                  searchMode === 'article' ? 'qm-seg__btn--active' : ''
                }`}
                onClick={() => {
                  if (searchMode !== 'article') toggleSearchMode();
                }}
              >
                By article
              </button>
              <button
                type="button"
                className={`qm-seg__btn ${
                  searchMode === 'all' ? 'qm-seg__btn--active' : ''
                }`}
                onClick={() => {
                  if (searchMode !== 'all') toggleSearchMode();
                }}
              >
                All fields
              </button>
            </div>
          </div>

          {/* Подсказка о текущем режиме */}
          {searchTerm && (
            <div className="qm-modal-hint">
              Searching in{' '}
              <b>
                {searchMode === 'article'
                  ? 'article field only'
                  : 'all fields (article, density, width)'}
              </b>
            </div>
          )}

          <div className="qm-picker">
            <div className="qm-picker__scroll">
              {right_data.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(right_data[0]).map((key) => {
                        if (hiddenKeys.includes(key)) return null;
                        return <th key={key}>{key}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {right_data.map((row, index) => (
                      <tr key={index}>
                        {Object.entries(row).map(([key, value]) => {
                          if (hiddenKeys.includes(key)) return null;
                          return (
                            <td
                              key={key}
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
                <div className="qm-picker__empty">
                  <div className="qm-picker__empty-title">
                    {searchTerm.trim()
                      ? 'No products found'
                      : 'No data available for you'}
                  </div>
                  <div className="qm-picker__empty-sub">
                    {searchTerm.trim()
                      ? 'Try a different article, density or width.'
                      : 'Related products of the same density will appear here.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Информация о количестве результатов */}
          {right_data.length > 0 && (
            <div className="qm-modal-count">
              Found {right_data.length} product
              {right_data.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalTable;
