import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { setModalWindow } from '../redux/actions/modalAction';
import { useEffect, useState } from 'react';
import { addNewProduct } from '../redux/actions/productsAction';

const ModalWindow = ({ list }) => {
  const [m3Value, setM3Value] = useState(0);
  const [m2Value, setM2Value] = useState(0);
  const [mValue, setMValue] = useState(0);
  const [widthInArrayValue, setWidthInArrayValue] = useState(0);
  const [m3InArrayValue, setM3InArrayValue] = useState(0);
  const [densityDryMaxValue, setDensityDryMaxValue] = useState(0);
  const [densityDryDefValue, setDensityDryDefValue] = useState(0);
  const [densityHuminityMaxValue, setDensityHuminityMaxValue] = useState(0);
  const [densityHuminityDefValue, setDensityHuminityDefValue] = useState(0);
  const [weightMaxValue, setWeightMaxValue] = useState(0);
  const [weightDefValue, setWeightDefValue] = useState(0);

  const [value, setValue] = useState('default');
  const [formInput, setForm] = useState({});
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const selectValue = {
    form: [
      { value: 'normal', label: 'Normal' },
      { value: 'U-block', label: 'U-block' },
      { value: 'Lintel', label: 'Lintel' },
      { value: 'O-block', label: 'O-block' },
      { value: 'Forjado', label: 'Forjado' },
    ],
    certificate: [
      { value: 'CE', label: 'CE' },
      { value: 'DAU', label: 'DAU' },
    ],
  };

  const haveMath = {
    m3: { value: m3Value, func: setM3Value },
    m2: { value: m2Value, func: setM2Value },
    m: { value: mValue, func: setMValue },
    widthInArray: { value: widthInArrayValue, func: setWidthInArrayValue },
    m3InArray: { value: m3InArrayValue, func: setM3InArrayValue },
    densityDryMax: { value: densityDryMaxValue, func: setDensityDryMaxValue },
    densityDryDef: { value: densityDryDefValue, func: setDensityDryDefValue },
    densityHuminityMax: {
      value: densityHuminityMaxValue,
      func: setDensityHuminityMaxValue,
    },
    densityHuminityDef: {
      value: densityHuminityDefValue,
      func: setDensityHuminityDefValue,
    },
    weightMax: { value: weightMaxValue, func: setWeightMaxValue },
    weightDef: { value: weightDefValue, func: setWeightDefValue },
  };

  const inputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onChangeSelect = (v, key) => {
    setValue(v.value);
    setForm((prev) => ({ ...prev, [key]: v.value }));
  };

  const getValue = (selVal) =>
    value ? selectValue[selVal].find((e) => e.value === value) : '';

  useEffect(() => {
    setM3Value(() => {
      if (formInput['lengths'] && formInput['height'] && formInput['width']) {
        let result =
          Math.floor(1200 / formInput['lengths']) *
          Math.floor(1000 / formInput['height']) *
          Math.floor(1500 / formInput['width']) *
          ((formInput['lengths'] * formInput['height'] * formInput['width']) /
            Math.pow(10, 9));
        setForm((prev) => ({ ...prev, m3: result }));
        return result;
      }
      return 0;
    });
    setM2Value(() => {
      if (m3Value && formInput['width']) {
        let result = m3Value / (formInput['width'] / 1000);
        setForm((prev) => ({ ...prev, m2: result }));
        return result;
      }
      return 0;
    });
    setMValue(() => {
      if (m2Value && formInput['height']) {
        let result = m2Value / (formInput['height'] / 1000);
        setForm((prev) => ({ ...prev, m: result }));
        return result;
      }
      return 0;
    });
    setWidthInArrayValue(() => {
      if (formInput['width']) {
        let result = Math.floor(1500 / formInput['width']);
        setForm((prev) => ({ ...prev, widthInArray: result }));
        return result;
      }

      return 0;
    });
    setM3InArrayValue(() => {
      if (
        formInput['lengths'] &&
        formInput['height'] &&
        formInput['width'] &&
        widthInArrayValue
      ) {
        let result =
          Math.floor(600 / formInput['lengths']) *
          Math.floor(6000 / formInput['height']) *
          widthInArrayValue *
          ((formInput['lengths'] * formInput['height'] * formInput['width']) /
            Math.pow(10, 9));
        setForm((prev) => ({ ...prev, m3InArray: result }));
        return result;
      }

      return 0;
    });
    setDensityDryMaxValue(() => {
      if (formInput['density']) {
        let result = formInput['density'] * 1.25;
        setForm((prev) => ({ ...prev, densityDryMax: result }));
        return result;
      }
      return 0;
    });
    setDensityDryDefValue(() => {
      if (formInput['density']) {
        let result = formInput['density'] * 1.05;
        setForm((prev) => ({ ...prev, densityDryDef: result }));
        return result;
      }
      return 0;
    });
    setDensityHuminityMaxValue(() => {
      if (formInput['humidity'] && densityDryMaxValue) {
        let result = (1.05 + formInput['humidity']) * densityDryMaxValue;
        setForm((prev) => ({ ...prev, densityHuminityMax: result }));
        return result;
      }
      return 0;
    });
    setDensityHuminityDefValue(() => {
      if (formInput['humidity'] && densityDryDefValue) {
        let result = (1 + formInput['humidity']) * densityDryDefValue;
        setForm((prev) => ({ ...prev, densityHuminityDef: result }));
        return result;
      }
      return 0;
    });
    setWeightMaxValue(() => {
      if (densityHuminityMaxValue && m3Value) {
        let result = densityHuminityMaxValue * m3Value + 23;
        setForm((prev) => ({ ...prev, weightMax: result }));
        return result;
      }
      return 0;
    });
    setWeightDefValue(() => {
      if (densityHuminityDefValue && m3Value) {
        let result = densityHuminityDefValue * m3Value + 23;
        setForm((prev) => ({ ...prev, weightDef: result }));
        return result;
      }
      return 0;
    });
  }, [
    densityDryDefValue,
    densityDryMaxValue,
    densityHuminityDefValue,
    densityHuminityMaxValue,
    formInput,
    m2Value,
    m3Value,
    widthInArrayValue,
  ]);

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={() => {
          dispatch(setModalWindow(!modal));
        }}
      >
        <ModalHeader
          toggle={() => {
            dispatch(setModalWindow(!modal));
          }}
        >
          New product
        </ModalHeader>
        <div className="item">
          {list.map((el) => {
            if (el.accessor === 'id') return;
            if (selectValue[el.accessor]) {
              return (
                <div className="item_select">
                  <Select
                    key={el.id}
                    value={getValue(el.accessor)}
                    defaultValue={el.accessor}
                    onChange={(v) => {
                      onChangeSelect(v, el.accessor);
                    }}
                    options={selectValue[el.accessor]}
                  />
                </div>
              );
            }
            if (haveMath[el.accessor]) {
              return (
                <div className="item_topic">
                  <ModalBody key={el.id}>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={haveMath[el.accessor].value}
                    readOnly
                  />
                </div>
              );
            }
            return (
              <div className="item_topic">
                <ModalBody key={el.id}>{el.Header}:</ModalBody>
                <input
                  type="text"
                  id={el.accessor}
                  name={el.accessor}
                  value={formInput[el.accessor] || ''}
                  onChange={inputChange}
                />
              </div>
            );
          })}
        </div>

        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              dispatch(addNewProduct(formInput));
              setForm({});
              dispatch(setModalWindow(!modal));
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalWindow;
