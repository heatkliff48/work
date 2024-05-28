import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { delUser } from '../redux/actions/userAction';

function NavBar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <nav className="nav_wrapper">
      <div className="nav_left_wrapper"></div>
      <div className="nav_right_wrapper">
        {user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                navigate('/');
              }}
            >
              <p className="p_nav">Главная</p>
            </div>
          </div>
        )}
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
        {!user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                navigate('/sign-up');
              }}
            >
              <p className="p_nav">Регистрация</p>
            </div>
          </div>
        )}
        <div className="nav_link_wrapper">
          <div className="nav_link">
            <p className="p_nav">Контакты</p>
          </div>
        </div>
        {user && (
          <div className="nav_link_wrapper">
            <div
              className="nav_link"
              onClick={() => {
                window.localStorage.clear();
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
