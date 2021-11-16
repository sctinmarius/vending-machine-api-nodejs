require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("config");
const runDB = require("./db");
const app = express();

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

const JWTKey = config.get("JWTKey");

if (!process.env.PORT && !JWTKey) {
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("app is working..."));
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use((error, req, res, next) => {
  res.send({ error: error.message })
});

runDB();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));

/* RULE

    if users that have set header "Object-ID: ObjectId e.g.: (617866e71697502a1f7f55ee)",
      will be able to manipulate the products, so they are considered "sellers"
    else
      they can buy the products

*/