import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { addNewProduct } from '../redux/actions/productsAction';
import UpdateModalWindow from './UpdateModalWindow';
import { useProjectContext } from '../contexts/Context';

const ModalWindow = ({ list }) => {
  const [value, setValue] = useState('default');
  const [formInput, setForm] = useState({});
  const [haveMath, setHaveMath] = useState({});
  const [trMark, setTrMark] = useState('');
  const {
    version,
    setPromProduct,
    modal,
    setModal,
    modalUpdate,
    setModalUpdate,
  } = useProjectContext();
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
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

  const inputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onChangeSelect = (v, key) => {
    setValue(v.value);
    setForm((prev) => ({ ...prev, [key]: v.value }));
  };

  const clearData = () => {
    setHaveMath({});
    setTrMark('');
    setValue('default');
    setForm({});
  };

  const updateProductHandler = () => {
    let upd = false;

    for (let i = 0; i < products.length; i++) {
      if (
        formInput.density == products[i].density &&
        formInput.form == products[i].form &&
        formInput.width == products[i].width &&
        formInput.height == products[i].height &&
        formInput.lengths == products[i].lengths &&
        formInput.certificate == products[i].certificate
      ) {
        upd = true;
        setPromProduct({ ...formInput, id: products[i].id });
        setModalUpdate(!modalUpdate);
      }
    }
    if (!upd) dispatch(addNewProduct({ product: formInput, user }));
  };

  const getValue = (selVal) =>
    value ? selectValue[selVal].find((e) => e.value === value) : '';

  const calculateValues = (formInput) => {
    const values = {};
    const updateFuncs = {};

    // Вычисление m3
    if (formInput['lengths'] && formInput['height'] && formInput['width']) {
      values.m3 =
        Math.floor(1200 / formInput['lengths']) *
        Math.floor(1000 / formInput['height']) *
        Math.floor(1500 / formInput['width']) *
        ((formInput['lengths'] * formInput['height'] * formInput['width']) /
          Math.pow(10, 9));
      updateFuncs.m3 = (value) => setForm((prev) => ({ ...prev, m3: value }));
    }

    // Вычисление m2
    if (values.m3 && formInput['width']) {
      values.m2 = values.m3 / (formInput['width'] / 1000);
      updateFuncs.m2 = (value) => setForm((prev) => ({ ...prev, m2: value }));
    }

    // Вычисление m
    if (values.m2 && formInput['height']) {
      values.m = values.m2 / (formInput['height'] / 1000);
      updateFuncs.m = (value) => setForm((prev) => ({ ...prev, m: value }));
    }

    // Вычисление widthInArray
    if (formInput['width']) {
      values.widthInArray = Math.floor(1500 / formInput['width']);
      updateFuncs.widthInArray = (value) =>
        setForm((prev) => ({ ...prev, widthInArray: value }));
    }

    // Вычисление m3InArray
    if (
      formInput['lengths'] &&
      formInput['height'] &&
      formInput['width'] &&
      values.widthInArray
    ) {
      values.m3InArray =
        Math.floor(600 / formInput['lengths']) *
        Math.floor(6000 / formInput['height']) *
        values.widthInArray *
        ((formInput['lengths'] * formInput['height'] * formInput['width']) /
          Math.pow(10, 9));
      updateFuncs.m3InArray = (value) =>
        setForm((prev) => ({ ...prev, m3InArray: value }));
    }

    if (formInput['density']) {
      values.densityDryMax = formInput['density'] * 1.25;
      updateFuncs.densityDryMax = (value) =>
        setForm((prev) => ({ ...prev, densityDryMax: value }));
    }

    // Вычисление densityDryDef
    if (formInput['density']) {
      values.densityDryDef = formInput['density'] * 1.05;
      updateFuncs.densityDryDef = (value) =>
        setForm((prev) => ({ ...prev, densityDryDef: value }));
    }

    // Вычисление densityHuminityMax
    if (formInput['humidity'] && values.densityDryMax) {
      values.densityHuminityMax =
        (1.05 + formInput['humidity']) * values.densityDryMax;
      updateFuncs.densityHuminityMax = (value) =>
        setForm((prev) => ({ ...prev, densityHuminityMax: value }));
    }

    // Вычисление densityHuminityDef
    if (formInput['humidity'] && values.densityDryDef) {
      values.densityHuminityDef = (1 + formInput['humidity']) * values.densityDryDef;
      updateFuncs.densityHuminityDef = (value) =>
        setForm((prev) => ({ ...prev, densityHuminityDef: value }));
    }

    // Вычисление weightMax
    if (values.densityHuminityMax && values.m3) {
      values.weightMax = values.densityHuminityMax * values.m3 + 23;
      updateFuncs.weightMax = (value) =>
        setForm((prev) => ({ ...prev, weightMax: value }));
    }

    // Вычисление weightDef
    if (values.densityHuminityDef && values.m3) {
      values.weightDef = values.densityHuminityDef * values.m3 + 23;
      updateFuncs.weightDef = (value) =>
        setForm((prev) => ({ ...prev, weightDef: value }));
    }

    return { values, updateFuncs };
  };

  const treadingMarkHandler = () => {
    if (formInput.density < 200) {
      setTrMark('SA-TEC');
    } else if (formInput.density >= 200 && formInput.density < 360) {
      setTrMark('Termeco');
    } else if (formInput.density >= 360 && formInput.density < 460) {
      setTrMark('Utilitas');
    } else if (formInput.density > 460) {
      setTrMark('Silenso');
    } else {
      setTrMark('');
    }

    if (formInput.form === 'U-block') {
      setTrMark('U-TEC');
    } else if (formInput.form === 'Lintel') {
      setTrMark('L-TEC');
    } else if (formInput.form === 'Forjado') {
      setTrMark('Forja-TEC');
    }
  };

  useEffect(() => {
    treadingMarkHandler();
    setForm((prev) => ({ ...prev, tradingMark: trMark }));
  }, [formInput.density, formInput.form]);

  useEffect(() => {
    const { values, updateFuncs } = calculateValues(formInput);
    const newHaveMath = {};

    Object.keys(values).forEach((key) => {
      newHaveMath[key] = {
        value: values[key],
        func: updateFuncs[key],
      };
    });

    setHaveMath(newHaveMath);
    Object.keys(updateFuncs).forEach((key) => {
      updateFuncs[key](values[key]);
    });
  }, [formInput]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, version }));
  }, [version]);

  return (
    <div>
      {modalUpdate && <UpdateModalWindow />}
      <Modal
        isOpen={modal}
        toggle={() => {
          setModal(!modal);
          clearData();
        }}
      >
        <ModalHeader
          toggle={() => {
            setModal(!modal);
            clearData();
          }}
        >
          New product
        </ModalHeader>
        <div className="item">
          {list.map((el) => {
            if (el.accessor === 'id') return;
            if (el.accessor === 'version') {
              return (
                <div className="item_topic">
                  <ModalBody key={el.id}>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={version}
                    readOnly
                  />
                </div>
              );
            } else if (el.accessor === 'tradingMark') {
              return (
                <div className="item_topic">
                  <ModalBody key={el.id}>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={trMark}
                    readOnly
                  />
                </div>
              );
            } else if (selectValue[el.accessor]) {
              return (
                <div className="item_select">
                  <ModalBody key={el.id}>{el.Header}:</ModalBody>
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
            } else if (haveMath[el.accessor]) {
              return (
                <div className="item_topic">
                  <ModalBody key={el.id}>{el.Header}:</ModalBody>
                  <input
                    type="text"
                    id={el.accessor}
                    name={el.accessor}
                    value={haveMath[el.accessor].value}
                  />
                </div>
              );
            } else
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
              updateProductHandler();
              clearData();
              setModal(!modal);
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
