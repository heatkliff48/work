import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userAction';

function LoginForm() {
  const [formInput, setForm] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

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
