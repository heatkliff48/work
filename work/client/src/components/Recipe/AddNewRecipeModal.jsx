import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { addNewWarehouse } from '#components/redux/actions/warehouseAction.js';
import { useDispatch } from 'react-redux';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import Table from '#components/Table/Table.jsx';
import { addNewRecipe } from '#components/redux/actions/recipeAction.js';
import '#components/Styles/modal.css';

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
    'article',
    'sand',
    'lime_lhoist',
    'lime_barcelona',
    'cement',
    'gypsum',
    'alu_1',
    'alu_2',
    'return_slurry_solids',
  ];

  const formVolume = 6.78;

  const haveProduct = useMemo(
    () => productOfRecipe?.density ?? false,
    [productOfRecipe?.density] // --------- пока что через плотность
  );

  const handlerAddProductRecipe = useCallback((row) => {
    const product = productsDataList.filter((el) => el.id === row.original.id)[0];

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

  useEffect(() => {
    let filtered = latestProducts.filter((el) =>
      el.placeOfProduction?.includes('Spain')
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
    let versionNumber = '000001';
    const articleId =
      list_of_recipes.length === 0
        ? 1
        : parseInt(list_of_recipes[list_of_recipes.length - 1].article.slice(-6)) +
          1;
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
        updatedRecipeInput[accessor] === ''
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
        form_volume_m3: formVolume,
        dry_total: dryTotal,
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
        dialogClassName="modal-dialog"
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
                <h3></h3>
                <Row>
                  {recipe_info.map((el) => {
                    if (el.accessor === 'id' || el.accessor === 'article')
                      return null;
                    else {
                      return (
                        <Col key={el.id}>
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
                                value={recipeInput[el.accessor] || ''}
                                onChange={(e) => handleRecipeInfoInputChange(e)}
                              />
                            </div>
                            <div className="md:w-2/3">
                              {/* <h4>
                                {((selectedProduct?.density * formVolume) / 100) *
                                  recipeInput[el.accessor] || 0}
                              </h4> */}
                            </div>
                          </div>
                        </Col>
                      );
                    }
                  })}
                </Row>
                <h3>Density: {selectedProduct?.density}</h3>
                <h3>Form volume, m3: {formVolume}</h3>
                <h3>Dry total: {dryTotal}</h3>
              </form>
            </Container>
          ) : (
            <>
              <Table
                COLUMN_DATA={COLUMNS}
                dataOfTable={productsDataList}
                // userAccess={userAccess}
                onClickButton={() => {}}
                buttonText={''}
                tableName={'Products from Spain'}
                handleRowClick={(row) => {
                  handlerAddProductRecipe(row);
                }}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button form="addNewRecipeModal" onClick={addRecipeHandler}>
            Add new recipe
          </button>
          <Button onClick={closeHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddNewRecipeModal;
