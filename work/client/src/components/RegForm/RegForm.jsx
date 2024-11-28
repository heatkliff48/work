import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/actions/userAction';
import { getAllRoles } from '../redux/actions/rolesAction';
import { useProjectContext } from '../contexts/Context';

function RegForm() {
  const { roleTable } = useProjectContext();
  const [formInput, setForm] = useState({});
  const [curRoleName, setCurRoleName] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const inputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    dispatch(addUser(formInput));
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    dispatch(getAllRoles());
  }, [user]);

  useEffect(() => {
    const selectedRole = roleTable.find((role) => role.id === formInput.role_id);
    setCurRoleName(selectedRole?.role_name || 'Select Role');
  }, [formInput.role_id]);

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
            value={formInput.email || ''}
            onChange={inputChange}
          />
          <br />
          <label htmlFor="username">User Name</label>
          <input
            className="login_input"
            type="text"
            id="username"
            name="username"
            value={formInput.username || ''}
            onChange={inputChange}
          />
          <br />
          <label htmlFor="role">Role</label>
          <select
            className="login_input"
            id="role"
            name="role"
            onChange={inputChange}
          >
            <option value="">{curRoleName}</option>
            {roleTable.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="password">Password</label>
          <input
            className="login_input"
            type="password"
            id="password"
            name="password"
            value={formInput.password || ''}
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
