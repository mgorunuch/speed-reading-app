import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Theme, ThemeProvider } from './contexts/with-theme';
import Reader from './pages/reader/reader';
import './assets/scss/main.scss';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider initialTheme={Theme.Dark}>
      <Reader />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
