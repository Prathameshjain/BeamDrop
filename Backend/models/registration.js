const mongoose = require("mongoose");
const validator = require("validator");

const userschema = new mongoose.Schema({
    fullname :
    {
     type:String,
     required:true
    },
    email:
    {
     type:String,
     required:true,
     unique:true,
     validate: [validator.isEmail, 'Invalid email format']
    },
    passwordregister:
    {
        type:String,
        required:true,
        validate: {
            validator: function(v) {
              // Regular expression for password validation
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.'
          }
    }
})

const Registration = new mongoose.model("Userprofiles",userschema);

module.exports = Registration;