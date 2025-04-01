const { useState, useEffect } = React;

const initialTasks = [
  {
    id: 1,
    date: "2025-04-01",
    week: "Semana 1",
    block: "Bloque 1",
    subject: "Derecho Constitucional",
    theme: "Tema 1",
    techniques: [
      { name: "Anki", status: "pending" },
      { name: "Active Recall", status: "pending" },
      { name: "Test", status: "pending" }
    ]
  },
  {
    id: 2,
    date: "2025-04-02",
    week: "Semana 1",
    block: "Bloque 1",
    subject: "Derecho Constitucional",
    theme: "Tema 2",
    techniques: [
      { name: "Anki", status: "pending" },
      { name: "Active Recall", status: "pending" },
      { name: "Test", status: "pending" }
    ]
  }
];

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("planTasks"));
    setTasks(saved || initialTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("planTasks", JSON.stringify(tasks));
  }, [tasks]);

  const completeTechnique = (taskId, techniqueName) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const techniques = task.techniques.map((tech) =>
          tech.name === techniqueName ? { ...tech, status: "completed" } : tech
        );
        const nextPending = techniques.find((t) => t.status === "pending");
        if (nextPending) {
          nextPending.status = "in-progress";
        }
        const isCompleted = techniques.every((t) => t.status === "completed");
        return { ...task, techniques, overallStatus: isCompleted ? "completed" : "in-progress" };
      }
      return task;
    });
    setTasks(updated);
  };

  const exportToExcel = () => {
    const flatTasks = tasks.map((t) => ({
      Date: t.date,
      Week: t.week,
      Block: t.block,
      Subject: t.subject,
      Theme: t.theme,
      Status: t.overallStatus || "pending",
      Techniques: t.techniques.map((tech) => `${tech.name}: ${tech.status}`).join(", ")
    }));
    const ws = XLSX.utils.json_to_sheet(flatTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plan Estudio");
    XLSX.writeFile(wb, "Plan_Estudio.xlsx");
  };

  useEffect(() => {
    // Inicializa técnica en progreso si hay pendiente
    setTasks((prev) =>
      prev.map((task) => {
        if (task.techniques.every((t) => t.status === "pending")) {
          const techniques = [...task.techniques];
          techniques[0].status = "in-progress";
          return { ...task, techniques, overallStatus: "in-progress" };
        }
        return task;
      })
    );
  }, []);

  return (
    <div className="container">
      <h1>📘 Planificador de Estudio</h1>
      <div className="status-columns">
        {["pending", "in-progress", "completed"].map((status) => (
          <div key={status} className="column">
            <h3>{status.toUpperCase()}</h3>
            {tasks
              .filter((task) => (task.overallStatus || "pending") === status)
              .map((task) => (
                <div key={task.id} className={`task ${status}`}>
                  <strong>{task.theme}</strong>
                  <div className="techniques">
                    {task.techniques.map((tech, i) => (
                      <div key={i} className="technique">
                        {tech.name}: {tech.status}
                        {tech.status !== "completed" && (
                          <button onClick={() => completeTechnique(task.id, tech.name)}>
                            Completar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <button className="export-btn" onClick={exportToExcel}>
        Exportar a Excel
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
