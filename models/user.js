const { model, Schema } = require("mongoose");
const Joi = require("joi");
const { ACCEPTED_COINS } = require("../utils/shared");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

function validate(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().min(5).max(1024).required(),
    deposit: Joi.number(),
    role: Joi.string().valid("buyer", "seller"),
  });

  return schema.validate(user);
}

function validateDeposit(deposit) {
  const schema = Joi.object({
    deposit: Joi.number()
      .required()
      .valid(...ACCEPTED_COINS),
  });

  return schema.validate(deposit);
}

const validateLogin = ({ username, password }) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate({ username, password });
};

module.exports = {
  UserModel,
  validate,
  validateDeposit,
  validateLogin,
};
