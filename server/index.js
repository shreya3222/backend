const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Failed to connect to MongoDB', err);
});

const cron = require('node-cron');
const { fetchEthPrice } = require('./controllers');

// Schedule the task to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Fetching Ethereum price...');
  fetchEthPrice();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
