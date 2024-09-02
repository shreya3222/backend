const axios = require('axios');
const { Address } = require('./models');

const getTransactions = async (req, res) => {
  const { address } = req.params;
  try {

    // Check if transactions are already stored in the database
    let addressData = await Address.findOne({ address });
    if (addressData) {
      return res.json(addressData.transactions);
    }

    // Fetch transactions from Etherscan
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apikey:"5ZH68ZYAMCVF4I1V4W1A66QQJ6RF55RTZA",
      },
    });

    const transactions = response.data.result;

    // Store transactions in the database
    addressData = new Address({ address, transactions });
    await addressData.save();
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
};


const { EthPrice } = require('./models'); // Import the EthPrice model
const fetchEthPrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'ethereum',
        vs_currencies: 'inr',
      },
    });

    const ethPrice = response.data.ethereum.inr;

    // Store the price in the database
    const newPrice = new EthPrice({ price: ethPrice });
    await newPrice.save();
    console.log('Ethereum price stored:', ethPrice);
  } catch (error) {
    console.error('Error fetching Ethereum price:', error);
  }
};

const getTotalExpenses = async (req, res) => {
    const { address } = req.params;
    try {
      // Fetch the stored transactions for the given address
      const addressData = await Address.findOne({ address });
      if (!addressData) {
        return res.status(404).send('Address not found');
      }
      // Calculate total expenses
      let totalExpenses = 0;
      addressData.transactions.forEach((tx) => {
        totalExpenses += (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18;
      });
  
      // Fetch the latest Ethereum price from the database
      const ethPriceData = await EthPrice.findOne().sort({ timestamp: -1 });
      const ethPrice = ethPriceData ? ethPriceData.price : null;
  
      // Respond with total expenses and current Ether price
      res.json({ totalExpenses, ethPrice });
    } catch (error) {
      res.status(500).send('Error calculating expenses');
    }
  };
  
  module.exports = { getTransactions, fetchEthPrice, getTotalExpenses };
  

