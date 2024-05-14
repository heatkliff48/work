import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/actions/userAction';
import { signUpSchema } from './validtionSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

const defaultValues = {
  userName: '',
  password: '',
  role: 1,
};

const rolesList = [
  {
    id: 1,
    title: 'Администратор',
  },
  {
    id: 2,
    title: 'Модератор',
  },
  {
    id: 3,
    title: 'Пользователь',
  },
];

function RegForm() {
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
    dispatch(addUser(formInput));
  };

  return (
    <div className="login_wrapper">
      <div className="login_topic">Registration Form</div>
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
          <label htmlFor="username">User Name</label>
          <input
            className="login_input"
            type="text"
            id="username"
            name="username"
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
            value={formInput.password}
            onChange={inputChange}
          />
          <br />
          <button className="login_button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegForm;
