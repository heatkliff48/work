import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import '#components/Styles/modals.css';

import ClientsAddress from '../ClientsAddress/ClientsAddress';
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import ClientsContactInfo from '../ClientsContactInfo/ClientsContactInfo';
import { useProjectContext } from '#components/contexts/Context.js';
import { useUsersContext } from '#components/contexts/UserContext.js';

/* ── helpers (вид, без новых данных) ───────────────────────────── */
const AVATARS = [
  { bg: '#fbe9e9', fg: '#bc1212' },
  { bg: '#e8eefc', fg: '#2563eb' },
  { bg: '#efe9fb', fg: '#7c3aed' },
  { bg: '#e6f3f6', fg: '#0891b2' },
  { bg: '#fdf3e3', fg: '#b45309' },
  { bg: '#e9f6ed', fg: '#16a34a' },
];

const DOT_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#be123c',
  '#ca8a04', '#d97706', '#16a34a', '#64748b', '#0d9488',
];

function getInitials(name = '') {
  const parts = String(name)
    .replace(/[^A-Za-zÀ-ÿ\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function pickAvatar(id) {
  const n = Number(id) || 0;
  return AVATARS[n % AVATARS.length];
}

function dotForCategory(category = '') {
  // стабильный цвет точки на основе строки категории
  let h = 0;
  for (let i = 0; i < String(category).length; i++) {
    h = (h * 31 + String(category).charCodeAt(i)) >>> 0;
  }
  return DOT_COLORS[h % DOT_COLORS.length];
}

/* ── component ─────────────────────────────────────────────────── */
function MydModalWithGrid({ show, onHide }) {
  const clients = useSelector((state) => state.clients);
  const contactInfo = useSelector((state) => state.contactInfo);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { currentClient, setCurrentClient, priceCategoryOptions } =
    useProjectContext();
  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  // под-панель: { kind: 'contact' | 'project', id }
  const [sub, setSub] = useState(null);

  useEffect(() => {
    if (Object.keys(currentClient)?.length === 0) {
      return;
    }
    const client = clients.filter((el) => el.id === currentClient?.id)[0];
    setCurrentClient(client);
  }, [clients]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);
      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  // сбрасываем под-панель при закрытии/смене клиента
  useEffect(() => {
    if (!show) setSub(null);
  }, [show]);
  useEffect(() => {
    setSub(null);
  }, [currentClient?.id]);

  if (!show) return null;

  const priceLabel =
    priceCategoryOptions.find(
      (option) => option.value == currentClient.price_category,
    )?.label || currentClient.price_category;

  const avatar = pickAvatar(currentClient?.id);
  const dot = dotForCategory(currentClient?.category);

  // выбранная сущность В УЖЕ ПОЛУЧЕННЫХ ДАННЫХ (без новых запросов)
  const subContact =
    sub?.kind === 'contact'
      ? (contactInfo || []).find((c) => c.id === sub.id)
      : null;
  const subProject =
    sub?.kind === 'project'
      ? (deliveryAddresses || []).find((d) => d.id === sub.id)
      : null;

  const closeDrawer = () => {
    setSub(null);
    onHide();
  };

  return (
    <div className="cl-drawer-root">
      <div className="cl-drawer-overlay" onClick={closeDrawer} />

      <aside className="cl-drawer" role="dialog" aria-label="Client's card">
        {/* ── header ── */}
        <div className="cl-drawer__head">
          <button
            type="button"
            className="cl-iconbtn cl-drawer__close"
            onClick={closeDrawer}
            aria-label="Close"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#565d6d" strokeWidth="2.1" strokeLinecap="round">
              <path d="M6 6l12 12" /><path d="M18 6 6 18" />
            </svg>
          </button>

          <div className="cl-drawer__ident">
            <div
              className="cl-avatar cl-avatar--lg"
              style={{ background: avatar.bg, color: avatar.fg }}
            >
              {getInitials(currentClient?.c_name)}
            </div>
            <div className="cl-min0">
              <div className="cl-drawer__name">{currentClient?.c_name}</div>
              <div className="cl-drawer__meta">
                {currentClient?.category && (
                  <span className="cl-pill">
                    <span className="cl-dot" style={{ background: dot }} />
                    {currentClient?.category}
                  </span>
                )}
                <span className="cl-mono cl-muted">{currentClient?.cif_vat}</span>
              </div>
            </div>
          </div>

          <div className="cl-actions">
            {/* <button type="button" className="cl-btn cl-btn--primary">Edit client</button>
            <button type="button" className="cl-btn cl-btn--ghost">New order</button> */}
          </div>
        </div>

        {/* ── body ── */}
        <div className="cl-drawer__body">
          <div className="cl-section-label">Commercial</div>
          <div className="cl-grid2">
            <div>
              <div className="cl-field-label">Price group</div>
              <div className="cl-field-value">{priceLabel}</div>
            </div>
            <div>
              <div className="cl-field-label">CIF / VAT</div>
              <div className="cl-field-value cl-mono">{currentClient?.cif_vat}</div>
            </div>
          </div>

          <div className="cl-section-label">Legal address</div>
          <div className="cl-card-soft">
            <ClientsAddress />
          </div>

          <div className="cl-section-label">Contacts</div>
          <ClientsContactInfo
            clickFunk={(id) => setSub({ kind: 'contact', id })}
          />

          <div className="cl-section-label">Delivery projects</div>
          <DeliveryAddress
            clickFunk={(id) => setSub({ kind: 'project', id })}
          />
        </div>
      </aside>

      {/* ── SUB-PANEL: contact / project ── */}
      {sub && (
        <div className="cl-sub-root">
          <div className="cl-sub-overlay" onClick={() => setSub(null)} />
          <aside className="cl-sub" role="dialog">
            <div className="cl-sub__head">
              <button
                type="button"
                className="cl-iconbtn"
                onClick={() => setSub(null)}
                aria-label="Back"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#565d6d" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m14 6-6 6 6 6" />
                </svg>
              </button>
              <div className="cl-section-label cl-section-label--inline">
                {sub.kind === 'contact' ? 'Contact' : 'Delivery project'}
              </div>
            </div>

            <div className="cl-sub__body">
              {/* CONTACT */}
              {sub.kind === 'contact' && subContact && (
                <>
                  {(() => {
                    const fullName =
                      [subContact.first_name, subContact.last_name]
                        .filter(Boolean)
                        .join(' ') ||
                      subContact.preffered_name ||
                      '—';
                    const role =
                      subContact.formal_position ||
                      subContact.role_in_the_org ||
                      '';
                    const phone =
                      subContact.phone_number_mobile ||
                      subContact.phone_number_office ||
                      subContact.phone_number_messenger ||
                      '';
                    return (
                      <>
                        <div className="cl-sub__hero">
                          <div
                            className="cl-avatar cl-avatar--xl"
                            style={{ background: avatar.bg, color: avatar.fg }}
                          >
                            {getInitials(fullName)}
                          </div>
                          <div className="cl-min0">
                            <div className="cl-sub__title">{fullName}</div>
                            <div className="cl-sub__subtitle">{role}</div>
                          </div>
                        </div>

                        <div className="cl-sub__cta">
                          <a
                            className="cl-btn cl-btn--primary"
                            href={`tel:${String(phone).replace(/[^+\d]/g, '')}`}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 5.5C4 4.7 4.7 4 5.5 4H8l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v2.5c0 .8-.7 1.5-1.5 1.5A14 14 0 0 1 4 5.5z" />
                            </svg>
                            Call
                          </a>
                          <a
                            className="cl-btn cl-btn--ghost"
                            href={`mailto:${subContact.email || ''}`}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" />
                            </svg>
                            Email
                          </a>
                        </div>

                        <div className="cl-section-label">Details</div>
                        <div className="cl-detail-list">
                          <div className="cl-detail-row">
                            <span className="cl-detail-key">Role</span>
                            <span className="cl-detail-val">{role || '—'}</span>
                          </div>
                          <div className="cl-detail-row">
                            <span className="cl-detail-key">Phone</span>
                            <span className="cl-detail-val cl-mono">{phone || '—'}</span>
                          </div>
                          <div className="cl-detail-row">
                            <span className="cl-detail-key">Email</span>
                            <span className="cl-detail-val cl-break">{subContact.email || '—'}</span>
                          </div>
                          <div className="cl-detail-row">
                            <span className="cl-detail-key">Client</span>
                            <span className="cl-detail-val">{currentClient?.c_name}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}

              {/* PROJECT */}
              {sub.kind === 'project' && subProject && (
                <>
                  <div className="cl-sub__hero">
                    <div className="cl-avatar cl-avatar--xl cl-avatar--pin">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21c5-4.5 7.5-8 7.5-11A7.5 7.5 0 0 0 4.5 10c0 3 2.5 6.5 7.5 11z" /><circle cx="12" cy="10" r="2.4" />
                      </svg>
                    </div>
                    <div className="cl-min0">
                      <div className="cl-sub__title">
                        {subProject.project_name ||
                          subProject.street ||
                          'Delivery site'}
                      </div>
                      <div className="cl-pill cl-pill--active">
                        <span className="cl-dot" style={{ background: '#16a34a' }} />
                        Active site
                      </div>
                    </div>
                  </div>

                  <div className="cl-section-label">Delivery address</div>
                  <div className="cl-card-soft cl-card-soft--row">
                    <svg className="cl-pin-ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#bc1212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21c5-4.5 7.5-8 7.5-11A7.5 7.5 0 0 0 4.5 10c0 3 2.5 6.5 7.5 11z" /><circle cx="12" cy="10" r="2.4" />
                    </svg>
                    <div className="cl-field-value">
                      {[
                        subProject.street,
                        subProject.additional_info,
                        subProject.zip_code,
                        subProject.city,
                        subProject.province,
                        subProject.country,
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </div>
                  </div>

                  <div className="cl-section-label">Details</div>
                  <div className="cl-detail-list">
                    <div className="cl-detail-row">
                      <span className="cl-detail-key">Client</span>
                      <span className="cl-detail-val">{currentClient?.c_name}</span>
                    </div>
                    <div className="cl-detail-row">
                      <span className="cl-detail-key">Category</span>
                      <span className="cl-detail-val">{currentClient?.category || '—'}</span>
                    </div>
                    <div className="cl-detail-row">
                      <span className="cl-detail-key">Site contact</span>
                      <span className="cl-detail-val">
                        {subProject.phone_number || subProject.email || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="cl-sub__cta cl-sub__cta--mt">
                    {/* <button type="button" className="cl-btn cl-btn--primary">New delivery</button>
                    <button type="button" className="cl-btn cl-btn--ghost">Edit site</button> */}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MydModalWithGrid;
