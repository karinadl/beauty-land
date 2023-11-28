const express = require('express');
const cors = require('cors')
const taskRoutes = require('./routes/tasks.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use(taskRoutes);
app.listen(3000);
console.log('Me estoy ejecutando en http://localhost:3000');