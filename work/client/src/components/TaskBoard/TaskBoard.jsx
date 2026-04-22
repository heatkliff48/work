import React, { useEffect, useState } from 'react';
import '#components/Styles/TaskBoard.css';
import { useDispatch } from 'react-redux';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const TaskBoard = () => {
  const { raw_materials_warehouse } = useWarehouseContext();
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const filteredTasks = raw_materials_warehouse
      .filter((item) => item.isNeedCheck)
      .map((item) => ({
        id: item.id,
        title: `Проверить ${item.material_type} (осталось ${item.remaining_quantity})`,
      }));

    setTasks(filteredTasks);
  }, [raw_materials_warehouse]);

  const deleteTask = (id) => {
    // dispatch();
  };

  return (
    <div className="board">
      <div className="board-header">
        <h1>Доска задач</h1>
      </div>

      <div className="board-columns">
        <div className="column">
          <div className="column-header">
            <h2>Активные</h2>
            <span className="task-count">{tasks.length}</span>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-title">{task.title}</div>
                <div className="task-actions">
                  <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                    ✕ Удалить
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="empty-state">Все задачи выполнены!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
