import { useState } from 'react';
import '#components/Styles/autoclave.css';
import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';

function Autoclave() {
  const { autoclave, setSelectedCell } = useAutoclaveContext();

  const [idColorMap, setIdColorMap] = useState({});

  const getClassForAutoclave = (num) => {
    const classes = [
      'cell-white',
      'cell-red',
      'cell-green',
      'cell-orange',
      'cell-black',
      'cell-yellow',
      'cell-gray',
      'cell-purple',
      'cell-blue',
      'cell-pink',
    ];

    return classes[num % classes.length] || 'cell-white';
  };

  const assignColorToId = (id) => {
    if (id == null) return 0;

    if (idColorMap[id] !== undefined) {
      return idColorMap[id];
    }

    const nextColor = Object.keys(idColorMap).length % 10;

    setIdColorMap((prev) => ({
      ...prev,
      [id]: nextColor,
    }));

    return nextColor;
  };

  return (
    <div className="autoclave-wrapper">
      <div className="autoclave-container">
        {autoclave?.map((autoclaveRow, rowIndex) => (
          <div key={rowIndex} className="autoclave-row">
            <h3 className="autoclave-header">Autoclave {rowIndex + 1}</h3>

            {autoclaveRow?.map((el, cellIndex) => (
              <div
                key={cellIndex}
                className={`autoclave-cell ${getClassForAutoclave(
                  assignColorToId(el?.id),
                )}`}
                onClick={() => {
                  if (!el) return;

                  setSelectedCell({
                    id: el?.id ?? null,
                    article: el?.article ?? '',
                    density: el?.density ?? '',
                    width: el?.width ?? '',
                  });
                }}
              >
                {el?.id !== null ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Autoclave;
