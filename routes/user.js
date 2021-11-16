const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const {
  validateUser,
  auth,
  validateLoginUser,
  checkIfTheUserIsBuyer,
  validateDepositBuyer,
} = require("../middlewares/user");

const { validateAndCheckStockOfProducts } = require("../middlewares/product");

router.post("/new", validateUser, userController.postUser);
router.post("/login", validateLoginUser, userController.loginUser);
router.get("/all", userController.getUsers);
router.put(
  "/deposit",
  [auth, checkIfTheUserIsBuyer, validateDepositBuyer],
  userController.updateDepositBuyer
);
router.put(
  "/buy",
  [auth, checkIfTheUserIsBuyer, validateAndCheckStockOfProducts],
  userController.buyProducts
);

router.put("/reset", [auth, checkIfTheUserIsBuyer], userController.resetDeposit);

module.exports = router;
