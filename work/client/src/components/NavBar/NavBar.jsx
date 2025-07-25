import MainOffcanvas from '#components/Main/MainOffcanvas.jsx';
import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { delUser } from '../redux/actions/userAction';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <nav className="nav_wrapper">
      <div className="nav_left_wrapper">{user && <MainOffcanvas />}</div>
      <div className="nav_right_wrapper">
        {/* {user &&  (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                navigate('/roles');
              }}
            >
              <p className="p_nav">Roles</p>
            </div>
          </div>
        )} */}

        {!user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                navigate('/sign-in');
              }}
            >
              <p className="p_nav">Войти</p>
            </div>
          </div>
        )}
        {/* {user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                navigate('/clients');
              }}
            >
              <p className="p_nav">Контакты</p>
            </div>
          </div>
        )} */}
        {user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                window.localStorage.clear();
                dispatch(clearAccountingDataList());
                dispatch(delUser());
                navigate('/sign-in');
              }}
            >
              <p className="p_nav">Выйти</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
