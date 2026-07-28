import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userAction';
import './Login.css';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

function LoginForm() {
  const [formInput, setForm] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { resetOrderState } = useOrderContext();
  const { resetWarehouseState } = useWarehouseContext();
  const { resetAutocalveState } = useAutoclaveContext();
  const { resetProjectState } = useProjectContext();
  const { resetProductTypeJState } = useProductsTypeJournalContext();
  const { resetRecipeState } = useRecipeContext();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const inputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    resetProjectState();
    resetAutocalveState();
    resetOrderState();
    resetProductTypeJState();
    resetRecipeState();
    resetWarehouseState();

    dispatch(loginUser(formInput));
  };

  return (
    <div className="login_wrapper">
      <div className="login_topic">Login Form</div>
      <div className="login_form_wrapper">
        <form className="login_form" onSubmit={(e) => submitForm(e)}>
          <label htmlFor="email">E-mail</label>
          <input
            className="login_input"
            type="text"
            id="email"
            name="email"
            value={formInput.name}
            onChange={inputChange}
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            className="login_input"
            type="password"
            id="password"
            name="password"
            value={formInput.name}
            onChange={inputChange}
          />
          <br />
          <button className="login_button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
