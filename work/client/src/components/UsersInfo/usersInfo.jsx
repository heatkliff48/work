import { Fragment, createContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import UsersInfoFullModal from './usersInfoFullModal.jsx';
import ShowUsersInfoModal from './usersInfoModal.jsx';
import { useProjectContext } from '#components/contexts/Context.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import './styles.css';

export const ClientContext = createContext();

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

const UsersInfo = () => {
  const [modalShow, setModalShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subdivisionFilter, setSubdivisionFilter] = useState('all');

  const {
    setCurrentUsersInfo,
    usersInfoDataList,
    setUsersInfoDataList,
    roleMap,
  } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);

  const clientHandler = (id) => {
    const u = usersInfoDataList.find((el) => el.id === id);
    setCurrentUsersInfo(u);
    setModalShow(true);
  };

  const combine = (a, b, prop) =>
    Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop])
          acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v };
        return acc;
      }, {}),
    );

  useEffect(() => {
    const combined = combine(usersInfo, usersMainInfo, 'id');
    setUsersInfoDataList(combined);
  }, [usersInfo, usersMainInfo]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Users_info');
      setUserAccess(access);
    }
  }, [user, roles]);

  const subdivisions = useMemo(() => {
    const seen = new Set();
    usersInfoDataList.forEach((u) => { if (u.subdivision) seen.add(u.subdivision); });
    return Array.from(seen).sort();
  }, [usersInfoDataList]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return usersInfoDataList.filter((u) => {
      const matchQ =
        !q ||
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q);
      const matchSub =
        subdivisionFilter === 'all' || u.subdivision === subdivisionFilter;
      return matchQ && matchSub;
    });
  }, [usersInfoDataList, searchQuery, subdivisionFilter]);

  return (
    <Fragment>
      <div className="usr-page">
        <div className="usr-toolbar">
          <div className="usr-toolbar__search-wrap">
            <svg
              className="usr-toolbar__search-icon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9aa0ac"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, e-mail or username…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="usr-toolbar__input"
            />
          </div>
          <select
            value={subdivisionFilter}
            onChange={(e) => setSubdivisionFilter(e.target.value)}
            className="usr-toolbar__select"
          >
            <option value="all">All subdivisions</option>
            {subdivisions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="usr-toolbar__spacer" />
          {userAccess?.canWrite && <ShowUsersInfoModal />}
        </div>

        <div className="usr-card">
          <table className="usr-table">
            <thead>
              <tr className="usr-table__head-row">
                <th className="usr-table__th">User</th>
                <th className="usr-table__th">E-mail</th>
                <th className="usr-table__th">Role</th>
                <th className="usr-table__th">Subdivision</th>
                <th className="usr-table__th">Shift</th>
                <th className="usr-table__th" style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const roleTheme = getRoleTheme(u.role);
                const av = getAvatarColors(u.id);
                const shiftTheme = getShiftTheme(u.shift);
                return (
                  <tr
                    key={u.id}
                    className="usr-table__row"
                    onClick={() => clientHandler(u.id)}
                  >
                    <td className="usr-table__td">
                      <div className="usr-user-cell">
                        <div
                          className="usr-avatar"
                          style={{ background: av.bg, color: av.color }}
                        >
                          {getInitials(u.fullName)}
                        </div>
                        <div>
                          <div className="usr-user-cell__name">{u.fullName}</div>
                          <div className="usr-user-cell__username">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="usr-table__td usr-table__td--email">{u.email}</td>
                    <td className="usr-table__td">
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
                    </td>
                    <td className="usr-table__td usr-table__td--sub">{u.subdivision}</td>
                    <td className="usr-table__td">
                      <span className="usr-shift-cell">
                        <span
                          className="usr-shift-badge"
                          style={{ background: shiftTheme.bg, color: shiftTheme.color }}
                        >
                          {getShiftBadge(u.shift)}
                        </span>
                        {getShiftLabel(u.shift)}
                      </span>
                    </td>
                    <td className="usr-table__td usr-table__td--arrow">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c4c8d0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="usr-empty">
              <div className="usr-empty__title">No users match your search</div>
              <div className="usr-empty__sub">
                Try a different name, e-mail, username or subdivision.
              </div>
            </div>
          )}

          <div className="usr-footer">
            <span>
              Showing {filteredUsers.length} of {usersInfoDataList.length} users
            </span>
          </div>
        </div>
      </div>

      <UsersInfoFullModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default UsersInfo;
