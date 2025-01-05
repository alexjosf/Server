const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const express = require('express');

const SERVICE_ACCOUNT = "./slice-orange-firebase-adminsdk-ud2kk-0fe9fb1319.json"; // Path to your .json key file
const FCM_URL = 'https://fcm.googleapis.com/v1/projects/slice-orange/messages:send';

const getAccessToken = async () => {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const accessToken = await auth.getAccessToken();
  return accessToken;
};

const app = express();
const PORT = 3000;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

app.post("/addExpense", (req, res) => {
  const user = JSON.stringify(req.body.user).replaceAll('\"', "").split(" ")[0]
  const description = JSON.stringify(req.body.description).replaceAll('\"', "")
  const totalAmount = JSON.stringify(req.body.totalAmount).replaceAll('\"', "")
  const currency = JSON.stringify(req.body.currency).replaceAll('\"', "")
  const amount = JSON.stringify(req.body.amount).replaceAll('\"', "")
  const deviceToken = JSON.stringify(req.body.token).replaceAll('\"', "")
  console.log("Data " + amount)
  res.send(" Expense Notification send!" + amount);
  addTransactionMessage(user, description, totalAmount, currency, amount, deviceToken);
});

app.post("/deleteExpense", (req, res) => {
  const user = JSON.stringify(req.body.user).replaceAll('\"', "").split(" ")[0]
  const description = JSON.stringify(req.body.description).replaceAll('\"', "")
  const totalAmount = JSON.stringify(req.body.totalAmount).replaceAll('\"', "")
  const currency = JSON.stringify(req.body.currency).replaceAll('\"', "")
  const amount = JSON.stringify(req.body.amount).replaceAll('\"', "")
  const deviceToken = JSON.stringify(req.body.token).replaceAll('\"', "")
  console.log("Data " + amount)
  res.send(" Expense Notification send!" + amount);
  deleteTransactionMessage(user, description, totalAmount, currency, amount, deviceToken);
});

app.post("/addSettlement", (req, res) => {
  const currency = JSON.stringify(req.body.currency).replaceAll('\"', "")
  const amount = JSON.stringify(req.body.amount).replaceAll('\"', "")
  const user = JSON.stringify(req.body.user).replaceAll('\"', "").split(" ")[0]
  const deviceToken = JSON.stringify(req.body.token).replaceAll('\"', "")
  console.log("Data " + amount)
  res.send(" Expense Notification send!" + amount);
  addSettlementMessage(currency, amount, user, deviceToken);
});

app.post("/deleteSettlement", (req, res) => {
  const currency = JSON.stringify(req.body.currency).replaceAll('\"', "")
  const amount = JSON.stringify(req.body.amount).replaceAll('\"', "")
  const user = JSON.stringify(req.body.user).replaceAll('\"', "").split(" ")[0]
  const deviceToken = JSON.stringify(req.body.token).replaceAll('\"', "")
  console.log("Data " + amount)
  res.send(" Expense Notification send!" + amount);
  deleteSettlementMessage(currency, amount, user, deviceToken);
});

const addTransactionMessage = async (user, description, totalAmount, currency, amount, deviceToken) => {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let bodyText = ''
  if (amount < 0) {
    bodyText = description + " (" + currency + totalAmount + "). \n" + "You owe " + currency + Math.abs(amount)
  } else {
    bodyText = description + " (" + currency + totalAmount + "). \n" + "You get " + currency + amount
  }
  const message = {
    message: {
      notification: {
        title: 'New expense added by ' + user,
        body: bodyText
      },
      token: deviceToken, // Replace with the target device token
    },
  };
  try {
    const response = await axios.post(FCM_URL, message, { headers });
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
};

const deleteTransactionMessage = async (user, description, totalAmount, currency, amount, deviceToken) => {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let bodyText = ''
  if (amount < 0) {
    bodyText = description + " (" + currency + totalAmount + "). \n" + "You owe " + currency + Math.abs(amount)
  } else {
    bodyText = description + " (" + currency + totalAmount + "). \n" + "You get " + currency + amount
  }
  const message = {
    message: {
      notification: {
        title: 'Expense deleted by ' + user,
        body: bodyText
      },
      token: deviceToken, // Replace with the target device token
    },
  };
  try {
    const response = await axios.post(FCM_URL, message, { headers });
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
};

const addSettlementMessage = async (currency, amount, user, deviceToken) => {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  const message = {
    message: {
      notification: {
        title: 'Dues settled by ' + user,
        body: "Settled " + currency + amount
      },
      token: deviceToken, // Replace with the target device token
    },
  };
  try {
    const response = await axios.post(FCM_URL, message, { headers });
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
};

const deleteSettlementMessage = async (currency, amount, user, deviceToken) => {
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const message = {
    message: {
      notification: {
        title: 'Settlement deleted by ' + user,
        body: "Settled amount " + currency + amount + " removed"
      },
      token: deviceToken, // Replace with the target device token
    },
  };
  try {
    const response = await axios.post(FCM_URL, message, { headers });
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
};