const { ProductModel } = require("../models/product");
const { Types } = require("mongoose");
const { getBulkUpdateFields } = require("../utils/shared");

const productService = {
  createProduct: async (product) => {
    try {
      const newProduct = new ProductModel({
        sellerId: product.sellerId,
        amountAvailable: product.amountAvailable,
        productName: product.productName,
        cost: product.cost,
      });
      return await newProduct.save();
    } catch (err) {
      return new Error(err);
    }
  },

  findAllProducts: async () => {
    try {
      return await ProductModel.find().select("-__v -createdAt -updatedAt");
    } catch (err) {
      return new Error(err);
    }
  },

  findProductCreatedBySellerId: async (productId, sellerId) => {
    try {
      return await ProductModel.find({ _id: productId, sellerId });
    } catch (err) {
      return new Error(err);
    }
  },

  findProductById: async (productId) => {
    try {
      return await ProductModel.findById(productId);
    } catch (err) {
      throw new Error(err);
    }
  },

  isValidProductId: (productId) => {
    return Types.ObjectId.isValid(productId);
  },
  updateProduct: async (product) => {
    try {
      return await product.save();
    } catch (err) {
      throw new Error(err);
    }
  },

  updateProducts: async (products) => {
    try {
      const bulkUpdate = getBulkUpdateFields(products);
      return await ProductModel.bulkWrite(bulkUpdate, { w: 1 });
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteProduct: async (productId) => {
    try {
      return await ProductModel.findByIdAndRemove(productId);
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = { productService };
