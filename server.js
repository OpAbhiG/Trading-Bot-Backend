const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let balance = 10000; // Starting balance
let stocks = 0; // Number of stocks owned
let purchasePrice = 0; // Price at which stocks were bought

const buyThreshold = -0.02;
const sellThreshold = 0.03;

function shouldBuy(currentPrice, previousPrice) {
  return (currentPrice - previousPrice) / previousPrice <= buyThreshold;
}

function shouldSell(currentPrice, purchasePrice) {
  return (currentPrice - purchasePrice) / purchasePrice >= sellThreshold;
}

function trade(currentPrice, previousPrice) {
  if (shouldBuy(currentPrice, previousPrice) && balance >= currentPrice) {
    stocks += 1;
    balance -= currentPrice;
    purchasePrice = currentPrice;
    console.log(`Bought at ${currentPrice}`);
  } else if (shouldSell(currentPrice, purchasePrice) && stocks > 0) {
    stocks -= 1;
    balance += currentPrice;
    console.log(`Sold at ${currentPrice}`);
  }
}

let previousPrice = 100; // Initial stock price

setInterval(() => {
  const currentPrice = previousPrice * (1 + (Math.random() - 0.5) / 10); // Simulate price change
  trade(currentPrice, previousPrice);
  previousPrice = currentPrice;
}, 1000); // Update every second

app.get('/report', (req, res) => {
  res.json({
    balance,
    stocks,
    purchasePrice,
    profitLoss: balance + (stocks * previousPrice) - 10000 // Initial balance
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
