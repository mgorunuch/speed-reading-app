/* eslint-disable */

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;

const app = express();


//здесь наше приложение отдаёт статику
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res, next) => {
  if (!req.connection.encrypted)
    res.redirect(`https://${req.header('host')}${req.url}`)
  else
    next()
})

//простой тест сервера
app.get('/ping', function (req, res) {
  return res.send('pong');
});

//обслуживание html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);
