const { productService } = require("../services/product");
const { isAvailableStock, getTotalSpentOfProducts } = require("../utils/shared");

const getProduct = async (productId) => {
  const product = await productService.findProductById(productId);
  if (!product) throw new Error("Could not find the product!");
  return product;
};

const isStockOfProduct = async (amountOfProducts, amountAvailable) => {
  const isStock = isAvailableStock(amountOfProducts, amountAvailable);
  if (!isStock) {
    const error = new Error(
      `The quantity requested is bigger than current stock of ${amountAvailable}.`
    );
    error.statusCode = 200;
    throw error;
  }
  return;
};

const getUpdatedProductsAndRemainingDepositBuyer = async (
  arrayProductIdAndAmountOfProducts,
  buyerUser
) => {
  return Promise.all(
    arrayProductIdAndAmountOfProducts.map(async ({ productId, amountOfProducts }) => {
      const product = await getProduct(productId);
      const { amountAvailable, cost: costProduct } = product;
      await isStockOfProduct(amountOfProducts, amountAvailable);

      const totalSpent = getTotalSpentOfProducts(
        buyerUser.deposit,
        costProduct,
        amountOfProducts
      );

      product.amountAvailable -= amountOfProducts;
      buyerUser.deposit -= totalSpent;

      return product;
    })
  );
};

module.exports = {
  getUpdatedProductsAndRemainingDepositBuyer
};
