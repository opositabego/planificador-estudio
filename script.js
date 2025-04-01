const e = React.createElement;

function App() {
  return e('div', { className: 'container' },
    e('h1', null, 'Planificador de Estudio'),
    e('p', null, 'App funcionando sin Babel, lista para GitHub Pages')
  );
}

ReactDOM.render(e(App), document.getElementById('root'));
