import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '../contexts/Context';
import { updateRoles } from '../redux/actions/rolesAction';
import { getPagesList } from '../redux/actions/pagesAction';
import { useModalContext } from '#components/contexts/ModalContext.js';

function ModalRole() {
  const { roleId, setRoleId } = useProjectContext();
  const { modalRoleCard, setModalRoleCard } = useModalContext();
  const pages = useSelector((state) => state.pages);
  const role = useSelector((state) => state.roles.find((el) => el.id === roleId));
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPagesList());
  }, []);

  useEffect(() => {
    if (role && pages) {
      const rolePermissions = role.PageAndRolesArray || [];
      setPermissions(
        pages.map((page) => {
          const pageInfo = rolePermissions.find((p) => p.id === page.id);
          return {
            role_id: role.id, // Используем role.id вместо roleId
            page_id: page.id,
            read: pageInfo ? pageInfo.PageAndRoles.read : false,
            write: pageInfo ? pageInfo.PageAndRoles.write : false,
          };
        })
      );
    }
  }, [role, pages]);

  const handleCheckboxChange = (pageId, type) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.page_id === pageId ? { ...perm, [type]: !perm[type] } : perm
      )
    );
  };

  const updateHandler = () => {
    const updatedPageAndRolesArray = permissions.map((perm) => ({
      id: perm.page_id,
      PageAndRoles: {
        page_id: perm.page_id,
        role_id: roleId,
        read: perm.read,
        write: perm.write,
      },
    }));

    dispatch(
      updateRoles({
        updRole: { ...role, PageAndRolesArray: updatedPageAndRolesArray },
      })
    );
    setRoleId(0);
    setModalRoleCard(false);
  };

  if (!role || !pages || permissions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      isOpen={modalRoleCard}
      toggle={() => setModalRoleCard(false)}
      className="role-modal"
    >
      <ModalHeader toggle={() => setModalRoleCard(false)} className="role-header">
        {role.role_name}
      </ModalHeader>
      <ModalBody>
        <div className="permissions-table">
          <div className="table-header">
            <div>Название страницы</div>
            <div>Чтение</div>
            <div>Запись</div>
          </div>
          {permissions.map((perm) => (
            <div key={perm.page_id} className="table-row">
              <div>{pages.find((page) => page.id === perm.page_id)?.page_name}</div>
              <div>
                <input
                  type="checkbox"
                  checked={perm.read}
                  onChange={() => handleCheckboxChange(perm.page_id, 'read')}
                />
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={perm.write}
                  onChange={() => handleCheckboxChange(perm.page_id, 'write')}
                />
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={updateHandler}>
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalRole;
