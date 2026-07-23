import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useDispatch, useSelector } from 'react-redux';
import ShowPasswordChangeModal from './userPasswordChangeModal';
import { useProjectContext } from '#components/contexts/Context.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import {
  updateUsersInfo,
  updateUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import './styles.css';

const ROLE_THEME = {
  production: { bg: '#fdeee9', color: '#b4451f', dot: '#d97706' },
  sales:      { bg: '#e8eefc', color: '#1d4ed8', dot: '#2563eb' },
  warehouse:  { bg: '#e9f6ed', color: '#15803d', dot: '#16a34a' },
  quality:    { bg: '#efe9fb', color: '#6d28d9', dot: '#7c3aed' },
  admin:      { bg: '#fbe9e9', color: '#bc1212', dot: '#bc1212' },
  finance:    { bg: '#e6f3f6', color: '#0e7490', dot: '#0891b2' },
};

const AVATAR_COLORS = [
  { bg: '#fbe9e9', color: '#bc1212' },
  { bg: '#e8eefc', color: '#2563eb' },
  { bg: '#efe9fb', color: '#7c3aed' },
  { bg: '#e6f3f6', color: '#0891b2' },
  { bg: '#fdf3e3', color: '#b45309' },
  { bg: '#e9f6ed', color: '#16a34a' },
];

const SHIFT_THEME = {
  A: { bg: '#fbe9e9', color: '#bc1212' },
  B: { bg: '#e8eefc', color: '#2563eb' },
  C: { bg: '#e9f6ed', color: '#16a34a' },
};

function getRoleTheme(role) {
  if ([1, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14].includes(role)) return ROLE_THEME.production;
  if ([2, 16, 17].includes(role)) return ROLE_THEME.sales;
  if ([15, 18, 19].includes(role)) return ROLE_THEME.warehouse;
  if (role === 12) return ROLE_THEME.quality;
  if (role === 3) return ROLE_THEME.admin;
  if (role === 20) return ROLE_THEME.finance;
  return ROLE_THEME.admin;
}

function getInitials(fullName) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColors(id) {
  return AVATAR_COLORS[((id || 0) + AVATAR_COLORS.length - 1) % AVATAR_COLORS.length];
}

function getShiftTheme(shift) {
  return SHIFT_THEME[shift] || { bg: '#f3f4f6', color: '#9aa0ac' };
}

function getShiftBadge(shift) {
  return SHIFT_THEME[shift] ? shift : '—';
}

function getShiftLabel(shift) {
  if (shift === 'A') return 'Shift A';
  if (shift === 'B') return 'Shift B';
  if (shift === 'C') return 'Shift C';
  return 'Day shift';
}

const SHIFT_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

const INPUT_CLASS =
  'bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500';

function UsersEditModal({ show, onHide, user, roleMap }) {
  const dispatch = useDispatch();
  const [infoInput, setInfoInput] = useState({});
  const [mainInput, setMainInput] = useState({});

  const roleOptions = Object.entries(roleMap).map(([id, label]) => ({
    value: Number(id),
    label,
  }));

  useEffect(() => {
    if (!user || !show) return;
    setInfoInput({
      fullName: user.fullName || '',
      shift: user.shift || 'None',
      subdivision: user.subdivision || '',
      phone: user.phone || '',
    });
    setMainInput({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 1,
    });
  }, [user, show]);

  const handleInfoChange = (e) => {
    setInfoInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMainChange = (e) => {
    setMainInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const u_id = user.id;
    dispatch(updateUsersInfo({ usersInfo: { u_id, ...infoInput } }));
    dispatch(updateUsersMainInfo({ usersMainInfo: { u_id, ...mainInput } }));
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit user — {user?.fullName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="editUserForm" className="w-full max-w-sm" onSubmit={handleSubmit}>
          <h3>Main info</h3>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Username
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className={INPUT_CLASS}
                name="username"
                type="text"
                value={mainInput.username || ''}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                E-mail
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className={INPUT_CLASS}
                name="email"
                type="email"
                value={mainInput.email || ''}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Role
              </label>
            </div>
            <div className="md:w-2/3">
              <Select
                value={roleOptions.find((o) => o.value === mainInput.role) || null}
                onChange={(v) =>
                  setMainInput((prev) => ({ ...prev, role: v.value }))
                }
                options={roleOptions}
              />
            </div>
          </div>

          <h3>Additional info</h3>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Full Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className={INPUT_CLASS}
                name="fullName"
                type="text"
                value={infoInput.fullName || ''}
                onChange={handleInfoChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Phone
              </label>
            </div>
            <div className="md:w-2/3">
              <PhoneInput
                defaultCountry="es"
                value={infoInput.phone || ''}
                onChange={(phone) =>
                  setInfoInput((prev) => ({ ...prev, phone }))
                }
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Shift
              </label>
            </div>
            <div className="md:w-2/3">
              <Select
                value={
                  SHIFT_OPTIONS.find((o) => o.value === infoInput.shift) ||
                  SHIFT_OPTIONS[0]
                }
                onChange={(v) =>
                  setInfoInput((prev) => ({ ...prev, shift: v.value }))
                }
                options={SHIFT_OPTIONS}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Subdivision
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className={INPUT_CLASS}
                name="subdivision"
                type="text"
                value={infoInput.subdivision || ''}
                onChange={handleInfoChange}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button form="editUserForm" type="submit">
          Save changes
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UsersInfoFullModal({ show, onHide }) {
  const [editShow, setEditShow] = useState(false);

  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);
  const { currentUsersInfo, setCurrentUsersInfo, roleMap } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const user = useSelector((state) => state.user);

  const combine = (a, b, prop) =>
    Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop])
          acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v };
        return acc;
      }, {}),
    );

  useEffect(() => {
    if (!currentUsersInfo) return;
    if (Object.keys(currentUsersInfo).length === 0) return;
    const combined = combine(usersInfo, usersMainInfo, 'id');
    const u = combined.filter((el) => el.id === currentUsersInfo.id)[0];
    setCurrentUsersInfo(u);
  }, [usersMainInfo, usersInfo]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);
    }
  }, [user, roles]);

  if (!show) return null;

  const u = currentUsersInfo || {};
  const roleTheme = getRoleTheme(u.role);
  const av = getAvatarColors(u.id);
  const shiftTheme = getShiftTheme(u.shift);

  return (
    <>
      <div className="usr-drawer-overlay" onClick={onHide}>
        <div className="usr-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="usr-drawer__header">
            <button className="usr-drawer__close" onClick={onHide} type="button">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#565d6d"
                strokeWidth="2.1"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>

            <div className="usr-drawer__hero">
              <div
                className="usr-avatar usr-avatar--lg"
                style={{ background: av.bg, color: av.color }}
              >
                {getInitials(u.fullName)}
              </div>
              <div>
                <div className="usr-drawer__name">{u.fullName}</div>
                <div className="usr-drawer__meta">
                  <span
                    className="usr-role-pill"
                    style={{ background: roleTheme.bg, color: roleTheme.color }}
                  >
                    <span
                      className="usr-role-pill__dot"
                      style={{ background: roleTheme.dot }}
                    />
                    {roleMap[u.role] || u.role}
                  </span>
                  <span className="usr-drawer__username">@{u.username}</span>
                </div>
              </div>
            </div>

            <div className="usr-drawer__actions">
              <button
                type="button"
                className="usr-btn usr-btn--primary"
                onClick={() => setEditShow(true)}
              >
                Edit user
              </button>
              {userAccess?.canWrite && <ShowPasswordChangeModal />}
            </div>
          </div>

          <div className="usr-drawer__body">
            <div className="usr-section-label">Account</div>
            <div className="usr-info-card">
              <div className="usr-info-row">
                <span>Username</span>
                <span className="usr-mono">{u.username}</span>
              </div>
              <div className="usr-info-row">
                <span>E-mail</span>
                <span>{u.email}</span>
              </div>
              <div className="usr-info-row">
                <span>Role</span>
                <span>
                  {roleMap[u.role]} · #{u.role}
                </span>
              </div>
            </div>

            <div className="usr-section-label">Assignment</div>
            <div className="usr-assignment-grid">
              <div className="usr-mini-card">
                <div className="usr-mini-card__label">Subdivision</div>
                <div className="usr-mini-card__value">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#bc1212"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21V5l8-2v18" />
                    <path d="M11 21V9l8 2v10" />
                    <path d="M2 21h20" />
                  </svg>
                  {u.subdivision}
                </div>
              </div>
              <div className="usr-mini-card">
                <div className="usr-mini-card__label">Shift</div>
                <div className="usr-mini-card__value">
                  <span
                    className="usr-shift-badge"
                    style={{ background: shiftTheme.bg, color: shiftTheme.color }}
                  >
                    {getShiftBadge(u.shift)}
                  </span>
                  {getShiftLabel(u.shift)}
                </div>
              </div>
            </div>

            <div className="usr-section-label">Contact</div>
            <div className="usr-contact-card">
              <div className="usr-contact-item">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#bc1212"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5.5C4 4.7 4.7 4 5.5 4H8l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v2.5c0 .8-.7 1.5-1.5 1.5A14 14 0 0 1 4 5.5z" />
                </svg>
                {u.phone}
              </div>
              <div className="usr-contact-item">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#bc1212"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3.5 6.5 8.5 6 8.5-6" />
                </svg>
                {u.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UsersEditModal
        show={editShow}
        onHide={() => setEditShow(false)}
        user={currentUsersInfo}
        roleMap={roleMap}
      />
    </>
  );
}

export default UsersInfoFullModal;
