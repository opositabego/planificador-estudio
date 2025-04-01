const { useState, useEffect } = React;

const initialSubjects = [
{
  id: '1',
  name: 'Derecho Constitucional, Administrativo y Régimen Local',
  themes: [
  'La Constitución española de 1978',
  'Ley 39/2015 Procedimiento Administrativo Común',
  'Ley 22/2006 de Capitalidad y Régimen Especial de Madrid',
  'Reglamento Orgánico del Gobierno y Administración del Ayuntamiento de Madrid'] },


{
  id: '2',
  name: 'Personal, Igualdad y Prevención de Riesgos',
  themes: [
  'Estatuto Básico del Empleado Público',
  'Ley Orgánica 3/2007 Igualdad Efectiva',
  'Ley 31/1995 Prevención de Riesgos Laborales'] },


{
  id: '3',
  name: 'Atención al ciudadano y Protección de Datos',
  themes: [
  'Ordenanza de atención a la ciudadanía',
  'Ley Orgánica 3/2018 Protección de Datos Personales'] },


{
  id: '4',
  name: 'Funciones propias',
  themes: [
  'Normativa distribución del correo',
  'Seguridad en edificios municipales'] }];




const techniques = [
'Kaizen',
'Anki',
'Active Recall',
'Kumon',
'Kintsugi',
'Test',
'Simulacro'];


const App = () => {var _initialSubjects$find;
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ week: '', date: '' });
  const [form, setForm] = useState({
    date: '',
    week: '',
    block: '',
    subject: '',
    theme: '',
    technique: '' });


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
    if (
    !form.date ||
    !form.week ||
    !form.block ||
    !form.subject ||
    !form.theme ||
    !form.technique)
    {
      alert('Por favor completa todos los campos');
      return;
    }
    const newTask = {
      ...form,
      status: 'pending',
      id: Date.now() };

    setTasks([...tasks, newTask]);
    scheduleReviews(form.theme);
    setForm({
      date: '',
      week: '',
      block: '',
      subject: '',
      theme: '',
      technique: '' });

  };

  const updateStatus = (taskId, status) => {
    const updated = tasks.map((task) =>
    task.id === taskId ? { ...task, status } : task);

    setTasks(updated);
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
    if (tasks.length === 0) {
      alert('No hay tareas para exportar');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(tasks);
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

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement("h1", null, "Planificador de Estudio"), /*#__PURE__*/

    React.createElement("h2", null, "A\xF1adir Tarea"), /*#__PURE__*/
    React.createElement("form", { onSubmit: addTask }, /*#__PURE__*/
    React.createElement("input", {
      type: "date",
      name: "date",
      value: form.date,
      onChange: handleChange }), /*#__PURE__*/

    React.createElement("input", {
      type: "text",
      name: "week",
      placeholder: "Semana",
      value: form.week,
      onChange: handleChange }), /*#__PURE__*/

    React.createElement("input", {
      type: "text",
      name: "block",
      placeholder: "Bloque / Horario",
      value: form.block,
      onChange: handleChange }), /*#__PURE__*/

    React.createElement("select", { name: "subject", value: form.subject, onChange: handleChange }, /*#__PURE__*/
    React.createElement("option", { value: "" }, "Materia"),
    initialSubjects.map((s) => /*#__PURE__*/
    React.createElement("option", { key: s.id, value: s.name },
    s.name))), /*#__PURE__*/



    React.createElement("select", { name: "theme", value: form.theme, onChange: handleChange }, /*#__PURE__*/
    React.createElement("option", { value: "" }, "Tema"), (_initialSubjects$find =
    initialSubjects.
    find(s => s.name === form.subject)) === null || _initialSubjects$find === void 0 ? void 0 : _initialSubjects$find.
    themes.map((t, i) => /*#__PURE__*/
    React.createElement("option", { key: i, value: t },
    t))), /*#__PURE__*/



    React.createElement("select", {
      name: "technique",
      value: form.technique,
      onChange: handleChange }, /*#__PURE__*/

    React.createElement("option", { value: "" }, "T\xE9cnica"),
    techniques.map((t, i) => /*#__PURE__*/
    React.createElement("option", { key: i, value: t },
    t))), /*#__PURE__*/



    React.createElement("button", { type: "submit" }, "A\xF1adir")), /*#__PURE__*/


    React.createElement("h2", { className: "section-title" }, "Filtrar Tareas"), /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', gap: '10px', marginBottom: '20px' } }, /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "Semana",
      value: filters.week,
      onChange: e => setFilters({ ...filters, week: e.target.value }) }), /*#__PURE__*/

    React.createElement("input", {
      type: "date",
      value: filters.date,
      onChange: e => setFilters({ ...filters, date: e.target.value }) }), /*#__PURE__*/

    React.createElement("button", { onClick: () => setFilters({ week: '', date: '' }) }, "Limpiar")), /*#__PURE__*/




    React.createElement("h2", { className: "section-title" }, "Tareas Planificadas"),
    filteredTasks.length === 0 ? /*#__PURE__*/
    React.createElement("p", null, "No hay tareas para los filtros seleccionados.") :

    filteredTasks.map((task) => /*#__PURE__*/
    React.createElement("div", { key: task.id, className: `task ${task.status}` }, /*#__PURE__*/
    React.createElement("div", { className: "header" },
    task.date, " - Semana ", task.week, " - ", task.block), /*#__PURE__*/

    React.createElement("div", null, /*#__PURE__*/
    React.createElement("strong", null, task.subject), " \u2192 ", task.theme, " (", task.technique, ")"), /*#__PURE__*/

    React.createElement("button", { onClick: () => updateStatus(task.id, 'in-progress') }, "Empezar"), /*#__PURE__*/


    React.createElement("button", { onClick: () => updateStatus(task.id, 'completed') }, "Completar"))), /*#__PURE__*/






    React.createElement("h2", { className: "section-title" }, "Repasos Programados"),
    reviews.length === 0 ? /*#__PURE__*/
    React.createElement("p", null, "No hay repasos programados a\xFAn.") :

    reviews.map((review, i) => /*#__PURE__*/
    React.createElement("div", { key: i, className: "review" }, /*#__PURE__*/
    React.createElement("div", { className: "header" }, review.date), /*#__PURE__*/
    React.createElement("div", null, review.themeName))), /*#__PURE__*/




    React.createElement("button", { className: "export-btn", onClick: exportPlan }, "Exportar Plan a Excel"), /*#__PURE__*/


    React.createElement("button", { className: "export-btn", onClick: exportReviews }, "Exportar Repasos a Excel")));




};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));