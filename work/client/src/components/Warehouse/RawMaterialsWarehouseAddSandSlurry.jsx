import { TextSearchFilter } from "#components/Table/filters.js";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import * as warehouseActions from "#components/redux/actions/warehouseRawMaterialsAction.js";
import { updateRawMaterialsWarehouse } from "#components/redux/actions/warehouseAction.js";
import { useWarehouseContext } from "#components/contexts/WarehouseContext.js";

function RawMaterialsWarehouseAddSandSlurry(props) {
  const [sandSlurryWarehouseInput, setSandSlurryWarehouseInput] = useState({});
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();
  const { raw_materials_warehouse } = useWarehouseContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sand_slurry = [
    {
      Header: "Sand (dry)",
      accessor: "sand",
      Filter: TextSearchFilter,
    },
    {
      Header: "Gypsum stone",
      accessor: "gypsum_stone",
      Filter: TextSearchFilter,
    },
    {
      Header: "Water",
      accessor: "water",
      Filter: TextSearchFilter,
    },
    {
      Header: "Grinding balls",
      accessor: "grinding_balls",
      Filter: TextSearchFilter,
    },
    {
      Header: "AAC scrap",
      accessor: "aac",
      Filter: TextSearchFilter,
    },
  ];

  const handleRawMaterialWarehouseInputChange = useCallback((e) => {
    setSandSlurryWarehouseInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, "Warehouse");
      setUserAccess(access);

      if (!access?.canRead) {
        navigate("/");
      }
    }
  }, [user, roles]);

  const summ = useMemo(() => {
    if (
      !sandSlurryWarehouseInput.sand ||
      !sandSlurryWarehouseInput.gypsum_stone ||
      !sandSlurryWarehouseInput.grinding_balls ||
      !sandSlurryWarehouseInput.aac
    ) {
      return null;
    }

    const remainingQuantityPrev = raw_materials_warehouse.find(
      (el) => el?.material_type == "Sand slurry (dry)"
    ).remaining_quantity;

    return (
      (remainingQuantityPrev || 0) +
      (parseFloat(sandSlurryWarehouseInput.sand) || 0) +
      (parseFloat(sandSlurryWarehouseInput.gypsum_stone) || 0) +
      (parseFloat(sandSlurryWarehouseInput.grinding_balls) || 0) +
      (parseFloat(sandSlurryWarehouseInput.aac) || 0)
    ).toFixed(3);
  }, [sandSlurryWarehouseInput]);

  const validateForm = () => {
    const newErrors = {};

    sand_slurry.forEach(({ accessor }) => {
      const value = sandSlurryWarehouseInput?.[accessor];

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        newErrors[accessor] = `This field is required`; // ${accessor}
        return;
      }

      const num = Number(value);
      if (isNaN(num) || num <= 0) {
        newErrors[accessor] = `This field must contain a positive number`; // ${accessor}
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetModal = useCallback(() => {
    setSandSlurryWarehouseInput({});
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

    // const addAction = getAddAction(props?.material_type);

    // dispatch(
    //   addAction({
    //     supplier: sandSlurryWarehouseInput?.supplier,
    //     quantity: sandSlurryWarehouseInput?.quantity,
    //   })
    // );
    // const today = new Date();
    // const day = today.getDate().toString().padStart(2, '0');
    // const month = (today.getMonth() + 1).toString().padStart(2, '0');
    // const year = today.getFullYear();

    // const date = `${day}.${month}.${year}`;
    dispatch(
      updateRawMaterialsWarehouse({
        // material_type: "Sand slurry (dry)",
        // remaining_quantity: summ,
        // last_updated: date,
        materials: [
          {
            type: "Sand (dry)",
            quantity: parseFloat(sandSlurryWarehouseInput.sand),
          },
          {
            type: "Gypsum stone",
            quantity: parseFloat(sandSlurryWarehouseInput.gypsum_stone),
          },
          {
            type: "Grinding Balls",
            quantity: parseFloat(sandSlurryWarehouseInput.grinding_balls),
          },
          { type: "AAC", quantity: parseFloat(sandSlurryWarehouseInput.aac) },
        ],
      })
    );
    setSandSlurryWarehouseInput({});
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
            <Row>
              {sand_slurry.map((el) =>
                el.accessor === "date" ? null : (
                  // <Col key={el.accessor}>
                  <div className="md:flex md:items-center mb-6">
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
                        value={sandSlurryWarehouseInput[el.accessor] || ""}
                        onChange={handleRawMaterialWarehouseInputChange}
                      />
                      {errors[el.accessor] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[el.accessor]}
                        </p>
                      )}
                    </div>
                  </div>
                  // </Col>
                )
              )}
            </Row>
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
