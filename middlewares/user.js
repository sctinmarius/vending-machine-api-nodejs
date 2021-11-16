const jwt = require("jsonwebtoken");
const config = require("config");
const { validate, validateDeposit, validateLogin } = require("../models/user");
const { userService } = require("../services/user");
const { HEADER_NAME } = require("../utils/shared");

const validateUser = (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};

const validateLoginUser = (req, res, next) => {
  const { error } = validateLogin({
    username: req.body.username,
    password: req.body.password,
  });
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};

const auth = (req, res, next) => {
  try {
    const token = req.header(HEADER_NAME);
    const JWTKey = config.get("JWTKey");

    if (!token)
      return res.status(401).send({ message: "Access denied. No token provided." });

    const decodedToken = jwt.verify(token, JWTKey);
    req.decodedToken = decodedToken;

    next();
  } catch (err) {
    const isTokenExpired = err.name === "TokenExpiredError";
    if (isTokenExpired) return res.status(400).send({ message: "Token expired!" });
    res.status(400).send({ message: "Invalid token." });
  }
};

const validateUserIdAndCheckIfUserExist = async (req, res, next) => {
  const userId = req.params.userId;
  const isValid = userService.isValidUserId(userId);
  if (!isValid) return res.status(400).send({ message: "Invalid userId!" });

  const user = await userService.findUserById(userId);
  if (!user) return res.status(404).send({ message: "This user does not exist" });
  next();
};

const validateDepositBuyer = (req, res, next) => {
  const { error } = validateDeposit(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};

const checkIfTheUserIsBuyer = async (req, res, next) => {
  const userId = req.decodedToken._id;
  const isValid = userService.isValidUserId(userId);

  if (isValid) {
    const [buyerUser] = await userService.findBuyerUserById(userId);
    if (!buyerUser)
      return res
        .status(401)
        .send({ message: "Access denied! This area is only for the buyers." });
    req.buyerUser = buyerUser;
  }

  if (!isValid) return res.status(404).send({ message: "This ID is not valid!" });
  next();
};

const checkIfTheUserIsSeller = async (req, res, next) => {
  const userId = req.decodedToken._id;
  const isValid = userService.isValidUserId(userId);

  if (isValid) {
    const [sellerUser] = await userService.findSellerUserById(userId);
    if (!sellerUser)
      return res
        .status(401)
        .send({ message: "Access denied! This area is only for the sellers." });
    req.sellerUser = sellerUser;
  }

  if (!isValid) return res.status(404).send({ message: "This ID is not valid!" });

  next();
};

module.exports = {
  validateUser,
  validateLoginUser,
  auth,
  validateUserIdAndCheckIfUserExist,
  checkIfTheUserIsSeller,
  checkIfTheUserIsBuyer,
  validateDepositBuyer,
};
