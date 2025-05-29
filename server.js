const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});

/*
To setup Stripe products and prices:
1. Create a Stripe account at https://stripe.com if you don't already have one
2. Create three products in the Stripe dashboard:
   - Weekly subscription ($2.50/week)
   - Monthly subscription ($5.00/month)
   - Lifetime one-time payment ($15.00)
3. Get the price IDs from the Stripe dashboard and replace the placeholder values in the PRICES object
4. Replace the Stripe secret key placeholder with your actual test secret key
*/ 