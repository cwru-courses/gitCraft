const mongoose = require("mongoose");
require("dotenv").config();

function mongodbConnection() {
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;
  const dbUrl = process.env.DATABASE_URL;
  const dbName = "git-craft-" + "prod"; //change this to your name for maintaining different databases
  mongoose
    .connect(
      `mongodb+srv://${username}:${password}@${dbUrl}/${dbName}?retryWrites=true&w=majority&appName=Project`
    )
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) =>
      console.log(`Error in connecting the MongoDB: ${err?.message}`)
    );
}

module.exports = { mongodbConnection };
