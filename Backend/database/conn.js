const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/beamdrop")
  .then(() => {
    console.log("Connection Successfull.");
  })
  .catch((e) => {
    console.error("Connection failed:", e.message);
  })