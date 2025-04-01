
const { useState } = React;

const initialTasks = {
  pending: [
    { id: 1, text: "Tema 1: Derechos fundamentales" },
    { id: 2, text: "Tema 2: Procedimiento Administrativo" },
  ],
  "in-progress": [],
  completed: []
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragStart = (e, fromCol, task) => {
    e.dataTransfer.setData("fromCol", fromCol);
    e.dataTransfer.setData("taskId", task.id);
  };

  const onDrop = (e, toCol) => {
    const fromCol = e.dataTransfer.getData("fromCol");
    const taskId = parseInt(e.dataTransfer.getData("taskId"));

    const task = tasks[fromCol].find(t => t.id === taskId);
    const updatedFrom = tasks[fromCol].filter(t => t.id !== taskId);
    const updatedTo = [...tasks[toCol], task];

    setTasks({
      ...tasks,
      [fromCol]: updatedFrom,
      [toCol]: updatedTo
    });
  };

  const exportExcel = () => {
    const data = [];
    Object.keys(tasks).forEach(col => {
      tasks[col].forEach(t => data.push({ Estado: col, Tarea: t.text }));
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tareas");
    XLSX.writeFile(wb, "Plan_Estudio.xlsx");
  };

  return (
    <div className="container">
      <h1>Planificador de Estudio</h1>
      <div className="columns">
        {Object.keys(tasks).map(col => (
          <div
            key={col}
            className="column"
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, col)}
          >
            <h3>{col}</h3>
            {tasks[col].map(task => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={e => onDragStart(e, col, task)}
              >
                {task.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="export-btn" onClick={exportExcel}>Exportar a Excel</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
