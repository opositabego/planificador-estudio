const { useState, useEffect } = React;

const data = [
  {
    materia: 'Derecho Constitucional, Administrativo y Régimen Local',
    temas: [
      'La Constitución española de 1978: derechos y deberes fundamentales',
      'Ley 39/2015 y Ley 22/2006 Capitalidad',
      'Reglamento Orgánico Ayuntamiento Madrid'
    ]
  },
  {
    materia: 'Personal, igualdad y prevención de riesgos',
    temas: [
      'Ley EBEP - Personal Administración Pública',
      'Ley Orgánica 3/2007 Igualdad',
      'Ley 31/1995 Prevención Riesgos Laborales'
    ]
  },
  {
    materia: 'Atención al ciudadano y protección de datos',
    temas: [
      'Ordenanza Atención a la Ciudadanía',
      'Ley Orgánica 3/2018 Protección de Datos'
    ]
  },
  {
    materia: 'Funciones propias',
    temas: [
      'Correspondencia, normativa distribución, atención al público',
      'Seguridad edificios municipales, evacuación, máquinas'
    ]
  }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setTasks(storedTasks);
    setReviews(storedReviews);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [tasks, reviews]);

  const addTask = () => {
    const date = document.getElementById('fecha').value;
    const week = document.getElementById('semana').value;
    const block = document.getElementById('bloque').value;
    const materia = document.getElementById('materia').value;
    const tema = document.getElementById('tema').value;

    if (!date || !week || !block || !materia || !tema) return;

    const task = {
      id: Date.now(),
      date,
      week,
      block,
      materia,
      tema,
      techniques: ['Anki', 'Active Recall', 'Test', 'Simulacro'].map(t => ({ name: t, status: 'pending' })),
    };

    setTasks([...tasks, task]);
    scheduleReviews(task);
  };

  const scheduleReviews = (task) => {
    const days = [1, 3, 7];
    const reviewDates = days.map(d => {
      const date = new Date(task.date);
      date.setDate(date.getDate() + d);
      return {
        id: task.id + '-' + d,
        date: date.toISOString().slice(0,10),
        description: task.tema
      };
    });
    setReviews([...reviews, ...reviewDates]);
  };

  const updateTechnique = (taskId, techniqueName) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          techniques: task.techniques.map(tech =>
            tech.name === techniqueName ? { ...tech, status: 'completed' } : tech
          ),
        };
      }
      return task;
    });
    setTasks(updated);
  };

  const exportExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="container">
      <h1>Planificador de Estudio</h1>
      <form>
        <input id="fecha" type="date" />
        <input id="semana" placeholder="Semana" />
        <input id="bloque" placeholder="Bloque / Horario" />
        <select id="materia">
          {data.map((d, i) => <option key={i}>{d.materia}</option>)}
        </select>
        <select id="tema">
          {data.flatMap(d => d.temas).map((t, i) => <option key={i}>{t}</option>)}
        </select>
        <button type="button" onClick={addTask}>Añadir</button>
      </form>

      <h2>Tareas Planificadas</h2>
      {tasks.map(task => (
        <div key={task.id} className="task">
          <div className="header">
            {task.date} - Semana {task.week} - {task.block}
            <br />
            <strong>{task.materia}</strong> → {task.tema}
          </div>
          <ul>
            {task.techniques.map((tech, i) => (
              <li key={i}>
                {tech.name}: {tech.status}
                {tech.status === 'pending' && (
                  <button onClick={() => updateTechnique(task.id, tech.name)}>
                    Completar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Repasos Programados</h2>
      {reviews.map(review => (
        <div key={review.id}>
          {review.date} → {review.description}
        </div>
      ))}

      <button onClick={() => exportExcel(tasks, 'Tareas.xlsx')}>Exportar Tareas</button>
      <button onClick={() => exportExcel(reviews, 'Repasos.xlsx')}>Exportar Repasos</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
