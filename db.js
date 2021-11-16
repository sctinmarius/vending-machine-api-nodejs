const { connect } = require("mongoose");
const config = require("config");

const runDB = async () => {
  const db = config.get("db");
  console.log(`Connect to ${db}..`);
  await connect(db);
  console.log(`MongoDB is connected!`);
};

module.exports = runDB;
