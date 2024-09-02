const express = require('express');
const { getTransactions } = require('./controllers');

const router = express.Router();

router.get('/transactions/:address', getTransactions);

const { getTotalExpenses } = require('./controllers');

router.get('/expenses/:address', getTotalExpenses);

module.exports = router;




