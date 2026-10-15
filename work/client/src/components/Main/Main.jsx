import { useUsersContext } from '#components/contexts/UserContext.js';
import { useLocation } from 'react-router-dom';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '#components/contexts/OrderContext.js';

import '#components/Styles/dashboard.css';

import '#components/Styles/dashboard.css';
import '#components/Styles/Main.css';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

// Отдельное право на кнопку, сама страница открывается и из меню склада
const RAW_MATERIALS_WAREHOUSE_BUTTON_ACCESS = 'main_raw_materials_warehouse_button';

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { setStoredData } = useOrderContext();
  const { roles, checkUserAccess, canOpenPath } = useUsersContext();
  const { warehouse_sand_slurry } = useWarehouseContext();

  useEffect(() => {
    // та же проверка, что и в LoginForm — иначе редиректы зациклятся
    if (!user?.id) {
      navigate('/sign-in');
    }
  }, [user]);

  useEffect(() => {
    // Общие данные загружаются в App.js — при входе, загрузке страницы
    // и переподключении WebSocket
    dispatch(clearBatchState());
    setStoredData(null);
  }, [dispatch, setStoredData]);

  const [taskBoardData, setTaskBoardData] = useState(0);

  useEffect(() => {
    const tasks = warehouse_sand_slurry.filter((el) => el.isNeedCheck).length;
    setTaskBoardData(tasks);
  }, [warehouse_sand_slurry]);

  return (
    <>
      <div className="bb-section-title">Quick Actions</div>

      <div className="bb-actions">
        {canOpenPath('/orders') && (
          <button
            className="bb-action-btn bb-primary"
            onClick={() => navigate('/orders')}
            type="button"
          >
            Add New Order
          </button>
        )}

        {/* <button
          className="bb-action-btn"
          onClick={() => navigate('/clients')}
          type="button"
        >
          Add New Client
        </button> */}

        {canOpenPath('/warehouse_products_type') && (
          <button
            className="bb-action-btn"
            onClick={() => navigate('/warehouse_products_type')}
            type="button"
          >
            Update Inventory
          </button>
        )}

        {checkUserAccess(user, roles, RAW_MATERIALS_WAREHOUSE_BUTTON_ACCESS)
          .canRead &&
          canOpenPath('/warehouse_raw_materials') && (
            <button
              className="bb-action-btn"
              onClick={() => navigate('/warehouse_raw_materials')}
              type="button"
            >
              Raw Materials Warehouse
            </button>
          )}

        {canOpenPath('/production_batch_designer_new') && (
          <button
            className="bb-action-btn"
            onClick={() => navigate('/production_batch_designer_new')}
            type="button"
          >
            Batch Plan
          </button>
        )}

        {canOpenPath('/task_board') && (
          <button
            className="bb-action-btn"
            onClick={() => navigate('/task_board')}
            type="button"
          >
            Task Board
            {taskBoardData > 0 && <span className="badge">{taskBoardData}</span>}
          </button>
        )}
      </div>
    </>
  );
}

export default Main;
