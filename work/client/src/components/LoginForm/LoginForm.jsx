import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser, resetAppState } from '../redux/actions/userAction';

import './Login.css';

function LoginForm() {
  const [formInput, setForm] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const authChecked = useSelector((state) => state.authChecked);

  const returnPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (authChecked && user) {
      navigate(returnPath, {
        replace: true,
      });
    }
  }, [authChecked, user, navigate, returnPath]);

  const inputChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const submitForm = (event) => {
    event.preventDefault();

    dispatch(resetAppState());
    dispatch(loginUser(formInput));
  };

  return (
    <div className="login_wrapper">
      <div className="login_topic">Login Form</div>

      <div className="login_form_wrapper">
        <form className="login_form" onSubmit={submitForm}>
          <label htmlFor="email">E-mail</label>

          <input
            className="login_input"
            type="email"
            id="email"
            name="email"
            value={formInput.email}
            onChange={inputChange}
            autoComplete="email"
            required
          />

          <br />

          <label htmlFor="password">Password</label>

          <input
            className="login_input"
            type="password"
            id="password"
            name="password"
            value={formInput.password}
            onChange={inputChange}
            autoComplete="current-password"
            required
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
