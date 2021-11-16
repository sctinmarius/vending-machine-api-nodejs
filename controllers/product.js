const { productService } = require("../services/product");

const postProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct({
      sellerId: req.sellerUser._id,
      amountAvailable: req.body.amountAvailable,
      productName: req.body.productName,
      cost: req.body.cost,
    });

    res.status(200).send({
      id: product._id,
      message: "The product has been created!",
    });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.findAllProducts();
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

const putProduct = async (req, res, next) => {
  try {
    const { product } = req;
  
    product.amountAvailable = req.body.amountAvailable || product.amountAvailable;
    product.productName = req.body.productName || product.productName;
    product.cost = req.body.cost || product.cost;

    await productService.updateProduct(product);
    res.status(200).send({
      message: `The product ${product.productName} has been updated!`,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { _id: productId, productName } = req.product;

    await productService.deleteProduct(productId);
    res.status(200).send({
      message: `The prodcut ${productName} has been deleted!`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postProduct,
  getProducts,
  putProduct,
  deleteProduct,
};
