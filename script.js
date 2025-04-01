// Planificador mejorado con estados por técnica y repasos automáticos

const { useState, useEffect } = React;

const initialSubjects = [
{
  id: '1',
  name: 'Derecho Constitucional, Administrativo y Régimen Local',
  themes: [
  'La Constitución española de 1978: los derechos y deberes fundamentales',
  'Ley 39/2015 del Procedimiento Administrativo Común. Fases y recursos. Ley 22/2006 Capitalidad y Régimen Especial de Madrid',
  'Reglamento Orgánico del Gobierno y Administración del Ayuntamiento de Madrid: organización central y distritos'] },


{
  id: '2',
  name: 'Personal, Igualdad y Prevención de Riesgos',
  themes: [
  'El personal al servicio de la Administración Pública: clases, derechos y régimen disciplinario',
  'Ley Orgánica 3/2007 Igualdad efectiva de mujeres y hombres. Plan de Igualdad del Ayuntamiento de Madrid',
  'Ley 31/1995 Prevención de Riesgos Laborales. Acuerdo Convenio Ayuntamiento de Madrid'] },


{
  id: '3',
  name: 'Atención al Ciudadano y Protección de Datos',
  themes: [
  'Ordenanza de atención a la ciudadanía y administración electrónica',
  'Ley Orgánica 3/2018 Protección de Datos Personales y Código Buenas Prácticas Ayuntamiento de Madrid'] },


{
  id: '4',
  name: 'Funciones Propias',
  themes: [
  'La correspondencia y normativa de distribución de correo. Atención al público',
  'Nociones básicas sobre seguridad en edificios municipales'] }];




const techniques = ['Anki', 'Active Recall', 'Test', 'Simulacro'];

const App = () => {var _initialSubjects$find;
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ week: '', date: '' });
  const [form, setForm] = useState({
    date: '',
    week: '',
    block: '',
    subject: '',
    theme: '' });


  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedReviews = localStorage.getItem('reviews');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [tasks, reviews]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTask = e => {
    e.preventDefault();
    if (!form.date || !form.week || !form.block || !form.subject || !form.theme) {
      alert('Completa todos los campos');
      return;
    }
    const newTask = {
      ...form,
      id: Date.now(),
      techniques: techniques.map(t => ({ name: t, status: 'pending' })),
      overallStatus: 'pending' };

    setTasks([...tasks, newTask]);
    setForm({ date: '', week: '', block: '', subject: '', theme: '' });
  };

  const updateTechnique = (taskId, techniqueName) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTechniques = task.techniques.map((tech) =>
        tech.name === techniqueName ? { ...tech, status: 'completed' } : tech);

        const allCompleted = updatedTechniques.every(t => t.status === 'completed');
        if (allCompleted && task.overallStatus !== 'completed') {
          scheduleReviews(task.theme);
          alert(`Tema completado. Repasos programados para "${task.theme}"`);
        }
        return {
          ...task,
          techniques: updatedTechniques,
          overallStatus: allCompleted ? 'completed' : 'in-progress' };

      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const scheduleReviews = themeName => {
    const reviewDates = [1, 3, 7, 14];
    const newReviews = reviewDates.map(days => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return { themeName, date: date.toLocaleDateString() };
    });
    setReviews(prev => [...prev, ...newReviews]);
  };

  const exportPlan = () => {
    const exportData = tasks.map(task => ({
      Fecha: task.date,
      Semana: task.week,
      Bloque: task.block,
      Materia: task.subject,
      Tema: task.theme,
      Estado: task.overallStatus,
      Tecnicas: task.techniques.map(t => `${t.name} (${t.status})`).join(', ') }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plan de Estudio');
    XLSX.writeFile(workbook, 'plan_estudio.xlsx');
  };

  const exportReviews = () => {
    if (reviews.length === 0) {
      alert('No hay repasos para exportar');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(reviews);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Repasos');
    XLSX.writeFile(workbook, 'repasos.xlsx');
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.week && task.week !== filters.week) return false;
    if (filters.date && task.date !== filters.date) return false;
    return true;
  });

  return (
    React.createElement('div', { className: 'container' },
    React.createElement('h1', null, 'Planificador de Estudio'),
    React.createElement('h2', null, 'Añadir Tarea'),
    React.createElement('form', { onSubmit: addTask },
    React.createElement('input', { type: 'date', name: 'date', value: form.date, onChange: handleChange }),
    React.createElement('input', { type: 'text', name: 'week', placeholder: 'Semana', value: form.week, onChange: handleChange }),
    React.createElement('input', { type: 'text', name: 'block', placeholder: 'Bloque / Horario', value: form.block, onChange: handleChange }),
    React.createElement('select', { name: 'subject', value: form.subject, onChange: handleChange },
    React.createElement('option', { value: '' }, 'Materia'),
    initialSubjects.map(s => React.createElement('option', { key: s.id, value: s.name }, s.name))),

    React.createElement('select', { name: 'theme', value: form.theme, onChange: handleChange },
    React.createElement('option', { value: '' }, 'Tema'), (_initialSubjects$find =
    initialSubjects.find(s => s.name === form.subject)) === null || _initialSubjects$find === void 0 ? void 0 : _initialSubjects$find.themes.map((t, i) =>
    React.createElement('option', { key: i, value: t }, t))),


    React.createElement('button', { type: 'submit' }, 'Añadir')),

    React.createElement('h2', { className: 'section-title' }, 'Filtrar Tareas'),
    React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
    React.createElement('input', { type: 'text', placeholder: 'Semana', value: filters.week, onChange: e => setFilters({ ...filters, week: e.target.value }) }),
    React.createElement('input', { type: 'date', value: filters.date, onChange: e => setFilters({ ...filters, date: e.target.value }) }),
    React.createElement('button', { onClick: () => setFilters({ week: '', date: '' }) }, 'Limpiar')),

    React.createElement('h2', { className: 'section-title' }, 'Tareas Planificadas'),
    filteredTasks.length === 0 ?
    React.createElement('p', null, 'No hay tareas para los filtros seleccionados.') :
    filteredTasks.map((task) =>
    React.createElement('div', { key: task.id, className: `task ${task.overallStatus}` },
    React.createElement('div', { className: 'header' }, `${task.date} - Semana ${task.week} - ${task.block}`),
    React.createElement('div', null, React.createElement('strong', null, task.subject), ' → ', task.theme),
    React.createElement('ul', null,
    task.techniques.map((tech, i) =>
    React.createElement('li', { key: i }, `${tech.name}: ${tech.status} `,
    tech.status === 'pending' && React.createElement('button', { onClick: () => updateTechnique(task.id, tech.name) }, 'Completar')))))),





    React.createElement('h2', { className: 'section-title' }, 'Repasos Programados'),
    reviews.length === 0 ?
    React.createElement('p', null, 'No hay repasos programados aún.') :
    reviews.map((review, i) =>
    React.createElement('div', { key: i, className: 'review' },
    React.createElement('div', { className: 'header' }, review.date),
    React.createElement('div', null, review.themeName))),


    React.createElement('button', { className: 'export-btn', onClick: exportPlan }, 'Exportar Plan a Excel'),
    React.createElement('button', { className: 'export-btn', onClick: exportReviews }, 'Exportar Repasos a Excel')));


};

ReactDOM.render(React.createElement(App), document.getElementById('root'));