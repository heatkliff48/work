import MainOffcanvas from '#components/Main/MainOffcanvas.jsx';
// import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
// import { delUser } from '../redux/actions/userAction';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// function NavBar() {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   return (
//     <nav className="nav_wrapper">
//       <div className="nav_left_wrapper"></div>
//       <div className="nav_right_wrapper">

//         {!user && (
//           <div className="nav_link_wrapper">
//             <div
//               className="nav_link"
//               onClick={() => {
//                 navigate('/sign-in');
//               }}
//             >
//               <p className="p_nav">Войти</p>
//             </div>
//           </div>
//         )}
//         {/* {user && (
//           <div className="nav_link_wrapper">
//             <div
//               className="nav_link"
//               onClick={() => {
//                 navigate('/clients');
//               }}
//             >
//               <p className="p_nav">Контакты</p>
//             </div>
//           </div>
//         )} */}
//         {user && (
//           <div className="nav_link_wrapper">
//             <div
//               className="nav_link"
//               onClick={() => {
//                 window.localStorage.clear();
//                 dispatch(clearAccountingDataList());
//                 dispatch(delUser());
//                 navigate('/sign-in');
//               }}
//             >
//               <p className="p_nav">Выйти</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default NavBar;
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { delUser } from '../redux/actions/userAction';
import { useLocation } from 'react-router-dom';
import { useProjectContext } from '#components/contexts/Context.js';

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { getPageTitleByPath, getRoleName } = useProjectContext();

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(clearAccountingDataList());
    dispatch(delUser());
    navigate('/sign-in');
  };

  const { pathname } = useLocation();
  const title = getPageTitleByPath(pathname);

  return (
    <nav className="nav_wrapper">
      <div className="nav_left">
        <span
          className="nav_logo_title"
          onClick={() => {
            navigate('/');
          }}
        >
          BAUBLOCK ERP
        </span>
        {user && <MainOffcanvas />}
      </div>

      <div className="nav_center">{title}</div>

      <div className="nav_right">
        {user && (
          <div className="nav_user_info">
            <div className="nav_username">
              {user?.username?.toUpperCase() ?? 'User Name'}
            </div>
            <div className="nav_userrole">
              {getRoleName(user?.role) ?? 'user role/department'}
            </div>
          </div>
        )}
        {user && (
          <button className="nav_logout_button" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
