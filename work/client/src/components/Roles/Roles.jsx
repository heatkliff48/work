import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import ModalRole from './ModalRole';
import { getAllRoles, updateRoleActive } from '../redux/actions/rolesAction';

function Roles() {
  const { modalRoleCard, setModalRoleCard, setRoleId, roles } = useProjectContext();
  const dispatch = useDispatch();
  const [updatedRoles, setUpdatedRoles] = useState(roles);

  const handleRowClick = (id) => {
    setRoleId(id);
    setModalRoleCard(!modalRoleCard);
  };

  const handleCheckboxChange = (id, isActive) => {
    const result = updatedRoles.map((role) => {
      if (role.id === id) {
        return { ...role, isActive };
      }
      return { ...role };
    });
    setUpdatedRoles(result);
  };

  const handleSaveRoles = () => {
    dispatch(updateRoleActive({ updActiveRole: updatedRoles }));
  };

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

  return (
    <>
      <ModalRole isOpen={modalRoleCard} />
      <div className="roles-container">
        <div className="roles-header">
          <div className="role-name">Название роли</div>
          <div className="role-active">Активно</div>
        </div>
        {updatedRoles.map((role) => (
          <div key={role.id} className="role-row">
            <div className="role-name" onClick={() => handleRowClick(role.id)}>
              {role.role_name}
            </div>
            <div className="role-active">
              <input
                type="checkbox"
                checked={role.isActive}
                onChange={() => handleCheckboxChange(role.id, !role.isActive)}
              />
            </div>
          </div>
        ))}
        <button onClick={handleSaveRoles}>Сохранить</button>
      </div>
    </>
  );
}

export default Roles;
