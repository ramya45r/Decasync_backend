require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on("connected", () => {
  console.log("MongoDB connection is successful");
});
connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error);
});

