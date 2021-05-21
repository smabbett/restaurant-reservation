const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const errorHandler = require('./errors/errorHandler');
const notFound = require('./errors/notFound');
const reservationsRouter = require('./reservations/reservations.router');
const tablesRouter = require('./tables/tables.router');

const app = express();

app.use(cors());
app.use(express.json());

// let nextId = 1;
// app.post('/tables', (req, res) => {
//   const newTable = req.body.data;

//   newTable.table_id = nextId++;

//   res.status(201).json({
//     data: newTable,
//   });
// });
app.use('/tables', tablesRouter);
app.use('/reservations', reservationsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
