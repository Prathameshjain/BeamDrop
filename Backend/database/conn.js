const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://nesar2004:nesar0704@beamdropuserprofiles.zmxlg.mongodb.net/Beamdrop")
  .then(() => {
    console.log("Connection Successfull.");
  })
  .catch((e) => {
    console.error("Connection failed:", e.message);
  })

 