const { UserModel } = require("../models/user");
const { Types } = require("mongoose");
const { hashPassword } = require("../utils/shared");


const userService = {
  createUser: async (user) => {
    try {      
      const newUser = new UserModel({
        username: user.username,
        password: await hashPassword(user.password),
        deposit: user.deposit,
        role: user.role,
      });
      return await newUser.save();
    } catch (err) {
      return new Error(err);
    }
  },

  findUserByUsername: async (username) => {
    try {
      return await UserModel.findOne({ username });
    } catch (err) {
      throw new Error(err);
    }
  },

  findSellerUserById: async (userId) => {
    try {
      return await UserModel.find({ _id: userId, role: "seller" });
    } catch (err) {
      throw new Error(err);
    }
  },

  findBuyerUserById: async (userId) => {
    try {
      return await UserModel.find({ _id: userId, role: "buyer" });
    } catch (err) {
      throw new Error(err);
    }
  },

  findUserById: async (userId) => {
    try {
      return await UserModel.findById(userId);
    } catch (err) {
      throw new Error(err);
    }
  },

  updateUser: async (user) => {
    try {
      return await user.save();
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteUser: async (userId) => {
    try {
      return await UserModel.findByIdAndRemove(userId);
    } catch (err) {
      throw new Error(err);
    }
  },

  isValidUserId: (userId) => {
    return Types.ObjectId.isValid(userId);
  },

  findAllUsers: async () => {
    try {
      return await UserModel.find().select("-__v -createdAt -updatedAt");
    } catch (err) {
      return new Error(err);
    }
  },
};

module.exports = { userService };
