import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import ModalRole from './ModalRole';
import { updateRoleActive } from '../redux/actions/rolesAction';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import './role.css'

function Roles() {
  const { setRoleId } = useProjectContext();
  const { roles } = useUsersContext();
  const { modalRoleCard, setModalRoleCard } = useModalContext();

  const [updatedRoles, setUpdatedRoles] = useState(roles);
  const dispatch = useDispatch();

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

  return (
    <>
      <ModalRole isOpen={modalRoleCard} />
      <div className="roles-container">
        <div className="roles-header">
          <div className="role-name">Role name</div>
          <div className="role-active">Active</div>
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
        <button onClick={handleSaveRoles}>Save</button>
      </div>
    </>
  );
}

export default Roles;
