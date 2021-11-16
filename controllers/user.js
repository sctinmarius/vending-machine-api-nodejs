const { UserModel } = require("../models/user");
const { productService } = require("../services/product");
const { userService } = require("../services/user");
const {
  convertToCoins,
  ACCEPTED_COINS,
  convertToDollars,
  convertToCents,
  generateAuthToken,
  HEADER_NAME,
} = require("../utils/shared");

const postUser = async (req, res, next) => {
  try {
    let user = await userService.findUserByUsername(req.body.username);
    if (user) return res.status(400).send({ message: "Username already registered." });

    user = await userService.createUser(req.body);
    const token = await generateAuthToken(user._id);

    res.header(HEADER_NAME, token).send({
      id: user._id,
      message: "The user has been created!",
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await userService.findUserByUsername(username);
    if (!user) return res.status(404).send({ message: "Could not find user." });

    const token = await generateAuthToken(user._id);

    return res.status(200).send({
      token,
      message: "Authentication successful!",
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await userService.findUserById(userId);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const putUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await userService.findUserById(userId);
    if (!user) return res.status(404).send({ message: "Could not find user." });

    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;
    user.deposit = req.body.deposit || user.deposit;
    user.role = req.body.role || user.role;

    await userService.updateUser(user);
    res.status(200).send({
      message: "The user has been updated!",
      user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await userService.findUserById(userId);
    if (!user) return res.status(404).send({ message: "Could not find user." });

    await userService.deleteUser(userId);

    res.status(200).send({
      message: "The user has been deleted!",
    });
  } catch (err) {
    next(err);
  }
};

const updateDepositBuyer = async (req, res, next) => {
  try {
    const { buyerUser, body } = req;
    const { deposit: newDeposit } = body;
    buyerUser.deposit += convertToDollars(newDeposit);
    await userService.updateUser(buyerUser);
    res.status(200).send({
      message: `The new deposit of the buyer ${buyerUser.username} is ${buyerUser.deposit}`,
    });
  } catch (err) {
    next(err);
  }
};

const buyProducts = async (req, res, next) => {
  try {
    const { updatedProducts: products, buyerUser } = req;
    const listWithProductsName = products.reduce(
      (acc, product) => [...acc, { product: product.productName }],
      []
    );

    const { deposit: currentDeposit } = await userService.findUserById(buyerUser._id);
    const totalSpent = currentDeposit - buyerUser.deposit;
    const cents = convertToCents(buyerUser.deposit);
    const change = convertToCoins(cents, ACCEPTED_COINS);

    const updatedProducts = await productService.updateProducts(products);
    if (updatedProducts.result.nModified !== products.length) {
      return res
        .status(400)
        .send({ message: `Did not update all fields of the products!` });
    }

    const updatedBuyerUser = await userService.updateUser(buyerUser);
    if (!updatedBuyerUser) {
      return res.status(400).send({ message: `Could not update the buyer user!` });
    }

    res.status(200).send({
      message: `Your have been served!`,
      totalSpent,
      productsPurchased: listWithProductsName,
      change,
    });
  } catch (err) {
    next(err);
  }
};

const resetDeposit = async (req, res, next) => {
  try {
    const { buyerUser } = req;
    const buyerDeposit = buyerUser.deposit;
    buyerUser.deposit = 0;
    const cents = convertToCents(buyerDeposit);
    const change = convertToCoins(cents, ACCEPTED_COINS);
    await userService.updateUser(buyerUser);
    res.status(200).send({
      message: `Your funds $${buyerDeposit.toFixed(2)} has been returned!`,
      change,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postUser,
  loginUser,
  getUsers,
  getUser,
  putUser,
  deleteUser,
  updateDepositBuyer,
  buyProducts,
  resetDeposit,
};
