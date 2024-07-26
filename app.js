const express = require("express");
const swaggerUI = require("swagger-ui-express");

const path = require("path");
require("dotenv").config();
var cors = require("cors");

const swaggerSpec = require("./utilities/swagger");
const userRoute = require("./routes/user-route");
const postRoute = require("./routes/post-route");
const { verifyJwtToken } = require("./utilities/jwt-auth");
const { mongodbConnection } = require("./utilities/mongo-config");

const port = process.env.PORT || 8080;

mongodbConnection();

const app = express();

app.use(cors());

app.use(express.json());

try {
  app.use("/user", userRoute);
  app.use("/post", verifyJwtToken, postRoute);
} catch (error) {
  res.status(400).json({
    message: error.message,
    error: "Error while performing user operations",
  });
}

// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get(express.static(path.join(__dirname, "../client/build")));

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    (err) => err ?? res.status(500).send(err)
  );
});

app.listen(port, () => {
  console.log(`git-craft server is listening on port ${port} ...`);
});
