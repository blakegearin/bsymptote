'use strict';

// const express = require('express');
// const path = require('path');
// const serverless = require('serverless-http');
// const app = express();
// const bodyParser = require('body-parser');

// const router = express.Router();
// router.get('/', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write('<h1>Hello from Express.js!</h1>');
//   res.end();
// });
// router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
// router.post('/', (req, res) => res.json({ postBody: req.body }));

// app.use(bodyParser.json());
// app.use('/.netlify/functions/server', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));





const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

// app.listen(3000, () => {
//   console.log("Application started and listening on port 3000");
// });

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/paper/dist')));

router.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});



module.exports = app;
module.exports.handler = serverless(app);
