const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { checkIfTheUserIsSeller, auth } = require("../middlewares/user");
const {
  validateProduct,
  validateProductId,
  validateOneLeastFieldProductUpdate,
  checkIfProductIsCreatedBySellerId,
} = require("../middlewares/product");

router.post(
  "/new",
  [auth, checkIfTheUserIsSeller, validateProduct],
  productController.postProduct
);

router.get("/all", productController.getProducts);

router.put(
  "/:productId",
  [
    auth,
    checkIfTheUserIsSeller,
    validateProductId,
    validateOneLeastFieldProductUpdate,
    checkIfProductIsCreatedBySellerId,
  ],
  productController.putProduct
);
router.delete(
  "/:productId",
  [auth, checkIfTheUserIsSeller, validateProductId, checkIfProductIsCreatedBySellerId],
  productController.deleteProduct
);

module.exports = router;
