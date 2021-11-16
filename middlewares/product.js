const { validate, validatProductIdAndAmountOfProducts } = require("../models/product");
const { productService } = require("../services/product");
const {
  getUpdatedProductsAndRemainingDepositBuyer,
} = require("../utils/product.helpers");

const validateProduct = (req, res, next) => {
  const product = {
    sellerId: req.sellerUser._id,
    amountAvailable: req.body.amountAvailable,
    productName: req.body.productName,
    cost: req.body.cost,
  };

  const { error } = validate(product);
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};

const validateOneLeastFieldProductUpdate = (req, res, next) => {
  if (req.body.amountAvailable || req.body.productName || req.body.cost) {
    next();
  } else {
    return res.status(400).send({ message: "It is required one least field!" });
  }
};

const validateProductId = (req, res, next) => {
  const productId = req.params.productId;
  const isValid = productService.isValidProductId(productId);
  if (!isValid) return res.status(400).send({ message: "Invalid productId!" });
  next();
};

const validateAndCheckStockOfProducts = async (req, res, next) => {
  try {
    const { body: arrayProductIdAndAmountOfProducts, buyerUser } = req;
    const { error } = validatProductIdAndAmountOfProducts(
      arrayProductIdAndAmountOfProducts
    );
    if (error) return res.status(400).send({ message: error.details[0].message });

    const updatedProducts = await getUpdatedProductsAndRemainingDepositBuyer(
      arrayProductIdAndAmountOfProducts,
      buyerUser
    );

    req.updatedProducts = updatedProducts;
  } catch (err) {
    const code = err.statusCode || 500;
    return res.status(code).send({ message: err.message });
  }

  next();
};

const checkIfProductIsCreatedBySellerId = async (req, res, next) => {
  const productId = req.params.productId;
  const sellerId = req.sellerUser._id;

  let [product] = await productService.findProductCreatedBySellerId(productId, sellerId);
  if (!product)
    return res.status(404).send({
      message: `Could not find this product added of the seller ${req.sellerUser.username}`,
    });
  req.product = product;
  next();
};

module.exports = {
  validateProduct,
  validateOneLeastFieldProductUpdate,
  validateProductId,
  checkIfProductIsCreatedBySellerId,
  validateAndCheckStockOfProducts,
};
