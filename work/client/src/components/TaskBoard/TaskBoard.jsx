import { useEffect, useState } from 'react';
import '#components/Styles/TaskBoard.css';
import { useDispatch } from 'react-redux';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import RawMaterialsWarehouseSupplierInfoAdd from '#components/Warehouse/RawMaterialsWarehouseSupplierInfoAdd.jsx';

const TaskBoard = () => {
  const { warehouse_sand_slurry } = useWarehouseContext();
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [taskModalContent, setTaskModalContent] = useState(null);

  useEffect(() => {
    const filteredTasks = warehouse_sand_slurry
      .filter((item) => item.isNeedCheck)
      .map((item) => ({
        ...item,
        title: `${item.id}. Check sand slurry ${item.date}`,
      }));

    setTasks(filteredTasks);
  }, [warehouse_sand_slurry]);

  const tasckClickHandler = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTaskModalContent(task);
    setTaskModal(true);
  };

  return (
    <div className="board">
      {taskModal && (
        <RawMaterialsWarehouseSupplierInfoAdd
          show={taskModal}
          onHide={() => {
            setTaskModal(false);
            setTaskModalContent(null);
          }}
          supplierInfo={taskModalContent}
          material_type={'Sand slurry (dry)'}
        />
      )}
      <div className="board-header">
        <h1>Task Board</h1>
      </div>

      <div className="board-columns">
        <div className="column">
          <div className="column-header">
            <h2>Active</h2>
            <span className="task-count">{tasks.length}</span>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
                onClick={() => tasckClickHandler(task.id)}
              >
                <div className="task-title">{task.title}</div>
                <div className="task-actions"></div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="empty-state">All tasks completed!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
