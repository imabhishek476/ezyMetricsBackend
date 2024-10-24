const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const processData = require('./etl/processData');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reports');
const app = express();
const PORT = 5000;

dotenv.config();
connectDB();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api', reportRoutes);

processData();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
