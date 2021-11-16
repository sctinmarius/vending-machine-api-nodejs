const { model, Schema } = require("mongoose");
const Joi = require("joi-oid");

const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amountAvailable: {
      type: Number,
      required: true,
      default: 1,
    },
    productName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProductModel = model("Product", productSchema);

const validate = (product) => {
  const schema = Joi.object({
    sellerId: Joi.objectId().required(),
    amountAvailable: Joi.number().required(),
    productName: Joi.string().min(3).max(20).required(),
    cost: Joi.number().required(),
  });

  return schema.validate(product);
};


const validatProductIdAndAmountOfProducts = (arrayProductIdAndAmountOfProducts) => {
  const schema = Joi.array().min(1).items({
    productId: Joi.objectId().required(),
    amountOfProducts: Joi.number().min(1).required(),
    productName: Joi.string().min(3).max(20).required()
  });

  return schema.validate(arrayProductIdAndAmountOfProducts);
};

module.exports = {
  ProductModel,
  validate,
  validatProductIdAndAmountOfProducts,
};
