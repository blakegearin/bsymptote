'use strict';

const app = require('./express/server');

app.listen(3000, () => console.log('Local app listening on port 3000'));





// const express = require('express');
// // const app = express();
// const app = require('./express/server');
// const path = require('path');

// // app.listen(3000, () => {
// //   console.log("Application started and listening on port 3000");
// // });

// app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use('/scripts', express.static(path.join(__dirname, 'node_modules/paper/dist')));

// router.get('/', (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });
