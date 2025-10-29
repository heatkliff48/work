import { TextSearchFilter } from "#components/Table/filters.js";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import * as warehouseActions from "#components/redux/actions/warehouseRawMaterialsAction.js";

function RawMaterialsWarehouseAdd(props) {
  const [rawMaterialWarehouseInput, setRawMaterialWarehouseInput] = useState(
    {}
  );
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const raw_material_table = [
    {
      Header: "Supplier",
      accessor: "supplier",
      Filter: TextSearchFilter,
    },
    {
      Header: "Quantity, kg",
      accessor: "quantity",
      Filter: TextSearchFilter,
    },
    {
      Header: "Date",
      accessor: "date",
      Filter: TextSearchFilter,
    },
  ];

  const handleRawMaterialWarehouseInputChange = useCallback((e) => {
    setRawMaterialWarehouseInput((prev) => ({
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

  const getAddAction = useCallback((materialType) => {
    const actionMap = {
      "Sand (dry)": warehouseActions.addNewWarehouseSand,
      Lime: warehouseActions.addNewWarehouseLime,
      Cement: warehouseActions.addNewWarehouseCement,
      "Gypsum (dry)": warehouseActions.addNewWarehouseGypsum,
      "Gypsum stone": warehouseActions.addNewWarehouseGypsumStone,
      "Aluminum 1": warehouseActions.addNewWarehouseAluminum1,
      "Aluminum 2": warehouseActions.addNewWarehouseAluminum2,
      "Grinding Balls": warehouseActions.addNewWarehouseGrindingBalls,
      AAC: warehouseActions.addNewWarehouseAAC,
    };

    return actionMap[materialType] || warehouseActions.addNewWarehouseSand;
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!rawMaterialWarehouseInput?.supplier?.trim()) {
      newErrors.supplier = "Supplier is required";
    }

    if (!rawMaterialWarehouseInput?.quantity?.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (
      isNaN(rawMaterialWarehouseInput.quantity) ||
      parseFloat(rawMaterialWarehouseInput.quantity) <= 0
    ) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetModal = useCallback(() => {
    setRawMaterialWarehouseInput({});
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

    const addAction = getAddAction(props?.material_type);

    dispatch(
      addAction({
        supplier: rawMaterialWarehouseInput?.supplier,
        quantity: rawMaterialWarehouseInput?.quantity,
      })
    );
    setRawMaterialWarehouseInput({});
    setErrors({});
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
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addClientModel"
            className="w-full max-w-sm"
            onSubmit={onSubmitForm}
          >
            <h3>Add {props?.material_type}</h3>
            <Row>
              {raw_material_table.map((el) =>
                el.accessor === "date" ? null : (
                  <Col key={el.accessor}>
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
                          className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                            errors[el.accessor]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          value={rawMaterialWarehouseInput[el.accessor] || ""}
                          onChange={handleRawMaterialWarehouseInputChange}
                        />
                        {errors[el.accessor] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[el.accessor]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          Add {props?.material_type.toLowerCase()}
        </Button>
        <Button onClick={handleHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseAdd;
