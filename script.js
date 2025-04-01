const { useState } = React;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);

  const addTask = () => {
    const date = document.getElementById('date').value;
    const week = document.getElementById('week').value;
    const block = document.getElementById('block').value;
    const subject = document.getElementById('subject').value;
    const topic = document.getElementById('topic').value;

    const newTask = {
      id: Date.now(),
      date,
      week,
      block,
      subject,
      topic,
      techniques: [
        { name: 'Anki', status: 'pending' },
        { name: 'Active Recall', status: 'pending' },
        { name: 'Test', status: 'pending' },
        { name: 'Simulacro', status: 'pending' }
      ]
    };
    setTasks([...tasks, newTask]);
    setReviews([...reviews, { date, topic }]);
  };

  const completeTechnique = (taskId, techniqueName) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            techniques: task.techniques.map(t =>
              t.name === techniqueName ? { ...t, status: 'completed' } : t
            )
          }
        : task
    ));
  };

  const exportExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="container">
      <h1>Planificador de Estudio</h1>
      <form>
        <input type="date" id="date" />
        <input type="text" id="week" placeholder="Semana" />
        <input type="text" id="block" placeholder="Bloque / Horario" />
        <select id="subject">
          <option>Derecho Constitucional, Administrativo y Régimen Local</option>
          <option>Personal, igualdad y prevención de riesgos</option>
          <option>Atención al ciudadano y protección de datos</option>
          <option>Funciones propias</option>
        </select>
        <select id="topic">
          <option>Tema 1</option>
          <option>Tema 2</option>
          <option>Tema 3</option>
          <option>Tema 4</option>
        </select>
        <button type="button" onClick={addTask}>Añadir</button>
      </form>
      <h2>Tareas Planificadas</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <strong>{task.date} - Semana {task.week} - Bloque {task.block}</strong>
          <p>{task.subject} → {task.topic}</p>
          <ul>
            {task.techniques.map(tech => (
              <li key={tech.name}>
                {tech.name}: {tech.status}
                {tech.status === 'pending' && (
                  <button onClick={() => completeTechnique(task.id, tech.name)}>Completar</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2>Repasos Programados</h2>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            {review.date} → {review.topic}
          </li>
        ))}
      </ul>
      <button onClick={() => exportExcel(tasks, 'Plan_Estudio.xlsx')}>Exportar Tareas</button>
      <button onClick={() => exportExcel(reviews, 'Repasos.xlsx')}>Exportar Repasos</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
