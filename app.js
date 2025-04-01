import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const initialTasks = [
  {
    id: 1,
    date: "2025-04-01",
    week: "Semana 1",
    block: "Bloque 1",
    subject: "Derecho Constitucional",
    theme: "Tema 1",
    subtheme: "Los derechos y deberes fundamentales",
    techniques: [
      { name: "Anki", status: "pending" },
      { name: "Active Recall", status: "pending" },
      { name: "Test", status: "pending" },
    ],
    reviews: [],
  },
  {
    id: 2,
    date: "2025-04-02",
    week: "Semana 1",
    block: "Bloque 1",
    subject: "Derecho Constitucional",
    theme: "Tema 2",
    subtheme:
      "Ley 39/2015, Procedimiento Administrativo Común de las Administraciones Públicas",
    techniques: [
      { name: "Anki", status: "pending" },
      { name: "Active Recall", status: "pending" },
      { name: "Test", status: "pending" },
    ],
    reviews: [],
  },
];

function App() {
  const [tasks, setTasks] = useState([]);

  // Cargar tareas desde LocalStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("planTasks"));
    setTasks(saved || initialTasks);
  }, []);

  // Guardar tareas en LocalStorage
  useEffect(() => {
    localStorage.setItem("planTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Completar técnica y actualizar estado de la tarea
  const completeTechnique = (taskId, techniqueName) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const techniques = task.techniques.map((tech) =>
          tech.name === techniqueName ? { ...tech, status: "completed" } : tech
        );
        const nextPending = techniques.find((t) => t.status === "pending");
        if (nextPending) {
          nextPending.status = "in-progress";
        }
        const isCompleted = techniques.every((t) => t.status === "completed");
        if (isCompleted) scheduleReview(taskId); // Programar repasos
        return {
          ...task,
          techniques,
          overallStatus: isCompleted ? "completed" : "in-progress",
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Programar repasos automáticos
  const scheduleReview = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const today = new Date();
        const reviews = [
          { interval: 3, date: new Date(today.setDate(today.getDate() + 3)) },
          { interval: 7, date: new Date(today.setDate(today.getDate() + 7)) },
          { interval: 15, date: new Date(today.setDate(today.getDate() + 15)) },
          { interval: 30, date: new Date(today.setDate(today.getDate() + 30)) },
        ];
        return { ...task, reviews };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Exportar datos a Excel
  const exportToExcel = () => {
    const flatTasks = tasks.map((t) => ({
      Date: t.date,
      Week: t.week,
      Block: t.block,
      Subject: t.subject,
      Theme: t.theme,
      Subtheme: t.subtheme || "-",
      Status: t.overallStatus || "pending",
      Techniques: t.techniques
        .map((tech) => `${tech.name}: ${tech.status}`)
        .join(", "),
      Reviews:
        t.reviews.length > 0
          ? t.reviews
              .map(
                (r) =>
                  `Intervalo ${r.interval} días - ${r.date.toLocaleDateString()}`
              )
              .join("; ")
          : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(flatTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plan Estudio");
    XLSX.writeFile(wb, "Plan_Estudio.xlsx");
  };

  // Inicializar técnica en progreso si todas están pendientes
  useEffect(() => {
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
      <h1>Planificador de Estudio</h1>
      <div className="status-columns">
        <div className="column">
          <h2>PENDING</h2>
          {tasks
            .filter((task) => task.overallStatus === undefined)
            .map((task) => (
              <Task key={task.id} task={task} onComplete={completeTechnique} />
            ))}
        </div>
        <div className="column">
          <h2>IN-PROGRESS</h2>
          {tasks
            .filter((task) => task.overallStatus === "in-progress")
            .map((task) => (
              <Task key={task.id} task={task} onComplete={completeTechnique} />
            ))}
        </div>
        <div className="column">
          <h2>COMPLETED</h2>
          {tasks
            .filter((task) => task.overallStatus === "completed")
            .map((task) => (
              <Task key={task.id} task={task} onComplete={completeTechnique} />
            ))}
        </div>
      </div>
      <button className="export-btn" onClick={exportToExcel}>
        Exportar a Excel
      </button>
    </div>
  );
}

function Task({ task, onComplete }) {
  return (
    <div className={`task ${task.overallStatus}`}>
      <h3>{`${task.theme}: ${task.subtheme}`}</h3>
      <div className="techniques">
        {task.techniques.map((technique) => (
          <div key={technique.name} className="technique">
            <span>{`${technique.name}: ${technique.status}`}</span>
            {technique.status !== "completed" && (
              <button onClick={() => onComplete(task.id, technique.name)}>
                Completar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
