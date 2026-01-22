import { TextSearchFilter } from '#components/Table/filters.js';
import { Modal, Button, Row } from 'react-bootstrap';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { updateRawMaterialsWarehouse } from '#components/redux/actions/warehouseAction.js';

function RawMaterialsWarehouseAddSandSlurry(props) {
  const [sandSlurryWarehouseInput, setSandSlurryWarehouseInput] = useState({
    portion_size: 100,
  });
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sand_slurry = [
    {
      Header: 'Sand (dry), t/hour',
      accessor: 'sand',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Gypsum stone, t/hour',
      accessor: 'gypsum_stone',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Water, m3/hour',
      accessor: 'water',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Grinding balls, t/hour',
      accessor: 'grinding_balls',
      Filter: TextSearchFilter,
    },
    {
      Header: 'AAC scrap, t/hour',
      accessor: 'aac',
      Filter: TextSearchFilter,
    },
  ];

  const handleRawMaterialWarehouseInputChange = useCallback((e) => {
    let processedValue = e.target.value;
    if (typeof e.target.value === 'string') {
      processedValue = e.target.value.replace(/(\d+),(\d*)/g, '$1.$2');
    }

    setSandSlurryWarehouseInput((prev) => ({
      ...prev,
      [e.target.name]: processedValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  const total = useMemo(() => {
    if (
      !sandSlurryWarehouseInput.sand ||
      !sandSlurryWarehouseInput.gypsum_stone ||
      !sandSlurryWarehouseInput.grinding_balls ||
      !sandSlurryWarehouseInput.aac ||
      !sandSlurryWarehouseInput.water ||
      !sandSlurryWarehouseInput.mixing_hours ||
      !sandSlurryWarehouseInput.portion_size
    ) {
      return null;
    }

    const totalMaterials =
      (parseFloat(sandSlurryWarehouseInput.sand) || 0) +
      (parseFloat(sandSlurryWarehouseInput.gypsum_stone) || 0) +
      (parseFloat(sandSlurryWarehouseInput.grinding_balls) || 0) +
      (parseFloat(sandSlurryWarehouseInput.aac) || 0);

    const mixingHours = parseFloat(sandSlurryWarehouseInput.mixing_hours) || 0;
    const portionSize = parseFloat(sandSlurryWarehouseInput.portion_size) || 0;

    return (totalMaterials * mixingHours * portionSize * 10).toFixed(0);
  }, [sandSlurryWarehouseInput]);

  const validateForm = () => {
    const newErrors = {};

    const mixingHoursValue = sandSlurryWarehouseInput?.mixing_hours;
    if (
      mixingHoursValue === null ||
      mixingHoursValue === undefined ||
      String(mixingHoursValue).trim() === ''
    ) {
      newErrors.mixing_hours = `This field is required`;
    } else {
      const num = Number(mixingHoursValue);
      if (isNaN(num) || num <= 0) {
        newErrors.mixing_hours = `This field must contain a positive number`;
      }
    }

    sand_slurry.forEach(({ accessor }) => {
      const value = sandSlurryWarehouseInput?.[accessor];

      if (value === null || value === undefined || String(value).trim() === '') {
        newErrors[accessor] = `This field is required`;
        return;
      }

      const num = Number(value);
      if (isNaN(num) || num < 0) {
        newErrors[accessor] = `This field must contain a non-negative number`;
      }
    });

    const portionSizeValue = sandSlurryWarehouseInput?.portion_size;
    if (
      portionSizeValue === null ||
      portionSizeValue === undefined ||
      String(portionSizeValue).trim() === ''
    ) {
      newErrors.portion_size = `This field is required`;
    } else {
      const num = Number(portionSizeValue);
      if (isNaN(num) || num <= 0) {
        newErrors.portion_size = `This field must contain a positive number`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetModal = useCallback(() => {
    setSandSlurryWarehouseInput({
      portion_size: 100,
    });
    setErrors({});
  }, []);

  const handleHide = useCallback(() => {
    props.onHide();
    resetModal();
  }, [props.onHide, resetModal]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(
      updateRawMaterialsWarehouse({
        materials: [
          {
            type: 'Sand (dry)',
            quantity: parseFloat(sandSlurryWarehouseInput.sand),
          },
          {
            type: 'Gypsum stone',
            quantity: parseFloat(sandSlurryWarehouseInput.gypsum_stone),
          },
          {
            type: 'Grinding Balls',
            quantity: parseFloat(sandSlurryWarehouseInput.grinding_balls),
          },
          {
            type: 'AAC',
            quantity: parseFloat(sandSlurryWarehouseInput.aac),
          },
          {
            type: 'water',
            quantity: parseFloat(sandSlurryWarehouseInput.water),
          },
        ],
        mixing_hours: parseFloat(sandSlurryWarehouseInput.mixing_hours),
        portion_size: parseFloat(sandSlurryWarehouseInput.portion_size),
      })
    );
    setSandSlurryWarehouseInput({ portion_size: 100 });
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
      onExited={resetModal}
    >
      <Modal.Header closeButton>Add sand slurry</Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addClientModel"
            className="w-full max-w-sm"
            onSubmit={onSubmitForm}
          >
            <h3>Add sand slurry</h3>

            <div className="md:flex md:items-center mb-6 pb-5 border-b border-gray-300">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="mixing_hours"
                >
                  Mill working time
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="mixing_hours"
                  name="mixing_hours"
                  type="text"
                  value={sandSlurryWarehouseInput.mixing_hours || ''}
                  onChange={handleRawMaterialWarehouseInputChange}
                />
                {errors.mixing_hours && (
                  <p className="text-red-500 text-xs mt-1">{errors.mixing_hours}</p>
                )}
              </div>
            </div>

            <Row className="mb-4">
              {sand_slurry.map((el) => (
                <div key={el.accessor} className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor={el.accessor}
                    >
                      {el.Header}
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id={el.accessor}
                      name={el.accessor}
                      type="text"
                      value={sandSlurryWarehouseInput[el.accessor] || ''}
                      onChange={handleRawMaterialWarehouseInputChange}
                    />
                    {errors[el.accessor] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[el.accessor]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </Row>

            <div className="md:flex md:items-center mb-6 pt-4 border-t border-gray-300">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="portion_size"
                >
                  Portion size, %
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="portion_size"
                  name="portion_size"
                  type="text"
                  value={sandSlurryWarehouseInput.portion_size || '100'}
                  onChange={handleRawMaterialWarehouseInputChange}
                />
                {errors.portion_size && (
                  <p className="text-red-500 text-xs mt-1">{errors.portion_size}</p>
                )}
              </div>
            </div>

            {total && (
              <div className="md:flex md:items-center mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="md:w-1/3">
                  <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Total, kg
                  </label>
                </div>
                <div className="md:w-2/3">
                  <span className="font-bold text-lg text-green-600">{total}</span>
                </div>
              </div>
            )}
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          Add sand slurry
        </Button>
        <Button onClick={handleHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseAddSandSlurry;
