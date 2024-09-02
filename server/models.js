const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Create a schema for storing transac"tions
const transactionSchema = new mongoose.Schema({
  blockNumber: String,
  timeStamp: String,
  hash: String,
  nonce: String,
  blockHash: String,
  transactionIndex: String,
  from: String,
  to: String,
  value: String,
  gas: String,
  gasPrice: String,
  isError: String,
  txreceipt_status: String,
  input: String,
  contractAddress: String,
  cumulativeGasUsed: String,
  gasUsed: String,
  confirmations: String,
});

// Create a schema for storing addresses
const addressSchema = new mongoose.Schema({
  address: String,
  transactions: [transactionSchema],
});


// Ethereum price schema
const ethPriceSchema = new mongoose.Schema({
    price: Number,
    timestamp: { type: Date, default: Date.now },
  });
  
  const EthPrice = mongoose.model('EthPrice', ethPriceSchema);
const Address = mongoose.model('Address', addressSchema);

module.exports = { Address, EthPrice }; // Export the new model


