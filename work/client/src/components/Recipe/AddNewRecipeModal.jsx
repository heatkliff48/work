import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useProductsContext } from "#components/contexts/ProductContext.js";
import { useDispatch } from "react-redux";
import { useRecipeContext } from "#components/contexts/RecipeContext.js";
import Table from "#components/Table/Table.jsx";
import { addNewRecipe } from "#components/redux/actions/recipeAction.js";
import "#components/Styles/modals.css";

function AddNewRecipeModal({ show, onHide }) {
  const [recipeInput, setRecipeInput] = useState({});
  const dispatch = useDispatch();

  const { COLUMNS, latestProducts } = useProductsContext();

  const {
    recipe_info,
    list_of_recipes,
    selectedProduct,
    setSelectedProduct,
    productOfRecipe,
    setProductOfRecipe,
  } = useRecipeContext();

  const [productsDataList, setCProductsDataList] = useState(latestProducts);
  const [dryTotal, setDryTotal] = useState(0);
  const dryTotalSumm = [
    "article",
    "sand",
    "lime_lhoist",
    "lime_barcelona",
    "cement",
    "gypsum",
    "alu_1",
    "alu_2",
    "return_slurry_solids",
  ];

  const solidsNormalRequerideFields = [
    "lime",
    "cement",
    "sand_slurry_dry",
    "return_dry",
    "aluminum_paste",
  ];

  const solidsOddRequerideFields = [
    "lime",
    "cement",
    "sand_dry",
    "gypsum_dry",
    "return_dry",
    "aluminum_paste",
  ];

  const haveProduct = useMemo(
    () => productOfRecipe?.density ?? false,
    [productOfRecipe?.density] // --------- пока что через плотность
  );

  const handlerAddProductRecipe = useCallback((row) => {
    const product = productsDataList.filter(
      (el) => el.id === row.original.id
    )[0];

    setSelectedProduct(product);
    setProductOfRecipe((prev) => ({
      ...prev,
      density: product?.density,
      certificate: product?.certificate,
    }));
  }, []);

  const handleRecipeInfoInputChange = useCallback((e) => {
    setRecipeInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (dryTotalSumm.includes(e.target.name)) {
      setDryTotal((prev) => prev + Number(e.target.value));
    }
  }, []);

  const solids = useMemo(() => {
    const allFilled =
      selectedProduct?.density > 100
        ? solidsNormalRequerideFields.every(
            (field) => recipeInput[field] !== "" && recipeInput[field] != null
          )
        : solidsOddRequerideFields.every(
            (field) => recipeInput[field] !== "" && recipeInput[field] != null
          );

    if (!allFilled) {
      return null;
    }

    return (
      (parseFloat(recipeInput.lime) || 0) +
      (parseFloat(recipeInput.cement) || 0) +
      (parseFloat(recipeInput.sand_slurry_dry) || 0) +
      (parseFloat(recipeInput.return_dry) || 0) +
      (parseFloat(recipeInput.aluminum_paste) || 0)
    ).toFixed(3);
  }, [recipeInput]);

  const volume = useMemo(() => {
    if (!recipeInput.cake_height) {
      return null;
    }

    return (parseFloat(recipeInput.cake_height) * 6.262 * 1.58).toFixed(3);
  }, [recipeInput?.cake_height]);

  const density_recipe = useMemo(() => {
    if (!volume || !solids) {
      return null;
    }

    return ((solids / volume) * 1.06).toFixed(3);
  }, [volume, solids]);

  const producedReturnDry = useMemo(() => {
    if (!volume || !solids) {
      return null;
    }

    return selectedProduct?.width == 85
      ? ((volume - 5.364) * (solids / volume)).toFixed(3)
      : selectedProduct?.width == 75
      ? ((volume - 5.31) * (solids / volume)).toFixed(3)
      : ((volume - 5.4) * (solids / volume)).toFixed(3);
  }, [volume, solids]);

  const water_total = useMemo(() => {
    if (!recipeInput.water_solids || !solids) {
      return null;
    }

    return (solids * parseFloat(recipeInput?.water_solids)).toFixed(3);
  }, [solids, recipeInput?.water_solids]);

  useEffect(() => {
    let filtered = latestProducts.filter((el) =>
      el.placeOfProduction?.includes("Spain")
    );
    setCProductsDataList(filtered);
  }, [latestProducts]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    onHide();
    setRecipeInput({});
  };

  const recipeArticle = () => {
    // M.+00+D+плотность(300)+скртификат(DE)+00000(i++)
    let versionNumber = "000001";
    const articleId =
      list_of_recipes.length === 0
        ? 1
        : parseInt(
            list_of_recipes[list_of_recipes.length - 1].article.slice(-6)
          ) + 1;
    versionNumber = `0000000${articleId}`.slice(-6);
    const recipe_article = `M.00D${selectedProduct?.density}${selectedProduct?.certificate}${versionNumber}`; //
    return recipe_article;
  };

  const addRecipeHandler = async () => {
    const article = recipeArticle();

    // Create a local copy of recipeInput and update it
    const updatedRecipeInput = { ...recipeInput };

    recipe_info.forEach(({ accessor }) => {
      if (!(accessor in updatedRecipeInput)) {
        updatedRecipeInput[accessor] = 0; // Add missing key with value 0
      } else if (
        updatedRecipeInput[accessor] === null ||
        updatedRecipeInput[accessor] === ""
      ) {
        updatedRecipeInput[accessor] = 0;
      }
    });

    setRecipeInput(updatedRecipeInput);

    await dispatch(
      addNewRecipe({
        ...updatedRecipeInput,
        article,
        density: selectedProduct?.density,
        certificate: selectedProduct?.certificate,
        volume,
        solids,
        produced_return_dry: producedReturnDry,
        density_recipe,
        water_total,
      })
    );

    setProductOfRecipe({});
    setSelectedProduct({});

    onHide();
    // }
  };

  const closeHandler = () => {
    setProductOfRecipe({});
    setSelectedProduct({});

    onHide();
  };

  return (
    <div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-new-recipe"
        show={show}
        onHide={onHide}
        scrollable={true}
      >
        <Modal.Header closeButton>
          {haveProduct ? (
            <Modal.Title id="contained-modal-title-vcenter">
              Add New Recipe
            </Modal.Title>
          ) : (
            <Modal.Title id="contained-modal-title-vcenter">
              Select Product
            </Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {haveProduct ? (
            <Container>
              <form
                id="addNewRecipeModal"
                className="w-full max-w-sm"
                onSubmit={(e) => {
                  onSubmitForm(e);
                }}
              >
                <Row>
                  <Col>
                    {recipe_info.map((el) => {
                      if (
                        el.accessor === "id" ||
                        el.accessor === "article" ||
                        el.accessor === "solids" ||
                        el.accessor === "volume" ||
                        el.accessor === "density_recipe" ||
                        el.accessor === "water_total" ||
                        el.accessor === "produced_return_dry" ||
                        (selectedProduct?.density <= 100 &&
                          el.accessor === "sand_slurry_dry") ||
                        (selectedProduct?.density > 100 &&
                          (el.accessor === "sand_dry" ||
                            el.accessor === "gypsum_dry"))
                      )
                        return null;
                      else {
                        return (
                          <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                              <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                for="version"
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
                                value={recipeInput[el.accessor] || ""}
                                onChange={(e) => handleRecipeInfoInputChange(e)}
                              />
                            </div>
                            <div className="md:w-2/3">
                              {/* <h4>
                                {((selectedProduct?.density * volume) / 100) *
                                  recipeInput[el.accessor] || 0}
                              </h4> */}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </Col>
                  <Col>
                    <h3>
                      Solids: {solids !== null ? solids : "Fill in all fields"}
                    </h3>
                    <h3>
                      Volume: {volume !== null ? volume : "Fill in all fields"}
                    </h3>
                    <h3>
                      Density:{" "}
                      {density_recipe !== null
                        ? density_recipe
                        : "Fill in all fields"}
                    </h3>
                    <h3>
                      Produced amount of return (dry):{" "}
                      {producedReturnDry !== null
                        ? producedReturnDry
                        : "Fill in all fields"}
                    </h3>
                    <h3>
                      Water total:{" "}
                      {water_total !== null
                        ? water_total
                        : "Fill in all fields"}
                    </h3>
                  </Col>
                </Row>
              </form>
            </Container>
          ) : (
            <>
              <Table
                COLUMN_DATA={COLUMNS}
                dataOfTable={productsDataList}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={""}
                tableName={"Products from Spain"}
                handleRowClick={(row) => {
                  handlerAddProductRecipe(row);
                }}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {haveProduct && (
            <Button form="addNewRecipeModal" onClick={addRecipeHandler}>
              Add new recipe
            </Button>
          )}
          <Button onClick={closeHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddNewRecipeModal;
