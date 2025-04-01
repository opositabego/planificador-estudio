
const { useState } = React;

const initialTasks = [
  { id: 1, text: "Tema 1: Derechos fundamentales", status: "pending" },
  { id: 2, text: "Tema 2: Procedimiento Administrativo", status: "pending" },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  function onDragStart(e, id) {
    e.dataTransfer.setData("id", id);
  }

  function onDrop(e, status) {
    const id = e.dataTransfer.getData("id");
    const newTasks = tasks.map(task => {
      if (task.id == id) task.status = status;
      return task;
    });
    setTasks(newTasks);
  }

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plan");
    XLSX.writeFile(workbook, "Plan_Estudio.xlsx");
  }

  return (
    <div className="container">
      <h1>Planificador de Estudio</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {["pending", "in-progress", "completed"].map(status => (
          <div
            key={status}
            onDrop={e => onDrop(e, status)}
            onDragOver={e => e.preventDefault()}
            style={{ flex: 1, minHeight: "200px", background: "#ecf0f1", padding: "10px" }}
          >
            <h3>{status}</h3>
            {tasks.filter(t => t.status === status).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={e => onDragStart(e, task.id)}
                style={{ background: "white", margin: "5px", padding: "10px", borderRadius: "5px" }}
              >
                {task.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={exportToExcel} style={{ marginTop: "20px" }}>Exportar a Excel</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
