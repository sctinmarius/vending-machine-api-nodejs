const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const ACCEPTED_COINS = [5, 10, 20, 50, 100];

const convertToDollars = (cents) => {
  return cents / 100;
};

const convertToCents = (dollars) => {
  return dollars * 100;
};

const isAvailableStock = (amountOfProducts, amountAvailable) => {
  if (amountOfProducts > amountAvailable) {
    return false;
  }
  return true;
};

const getTotalSpentOfProducts = (buyerDeposit, costProduct, amountOfProducts) => {
  const totalSpent = costProduct * amountOfProducts;
  if (totalSpent > buyerDeposit) {
    const error = new Error(`Insufficient funds. Please insert coins.`);
    error.statusCode = 200;
    throw error;
  }

  return totalSpent.toFixed(2);
};

const convertToCoins = (amountInCents, coins) => {
  const coinsCents = [...coins];
  const arrCountCoins = coinsCents
    .reverse()
    .map((coin) => {
      let amountCoin = Math.floor(amountInCents / coin);
      amountInCents -= amountCoin * coin;
      return amountCoin;
    })
    .reverse();

  const change = arrCountCoins.reduce((acc, val, index) => {
    if (val !== 0) {
      let coin = coins[index];
      return [...acc, { coin, qty: val }];
    }

    return acc;
  }, []);

  return change;
};

const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed;
  } catch (err) {
    return new Error(err);
  }
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateAuthToken = async (_id) => {
  const JWTKey = config.get("JWTKey");
  const token = jwt.sign({ _id }, JWTKey, { expiresIn: "1h" });
  return token;
};

const getBulkUpdateFields = (products) => {
  const bulkUpdate = [];

  products.forEach((doc) => {
    bulkUpdate.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            amountAvailable: doc.amountAvailable,
            cost: doc.cost,
          },
        },
      },
    });
  });
  return bulkUpdate;
};

module.exports = {
  HEADER_NAME: "x-auth-token",
  ACCEPTED_COINS,
  isAvailableStock,
  getTotalSpentOfProducts,
  convertToCoins,
  convertToDollars,
  convertToCents,
  hashPassword,
  validatePassword,
  generateAuthToken,
  getBulkUpdateFields
};
