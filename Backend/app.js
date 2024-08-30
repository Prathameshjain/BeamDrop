const express = require("express");
const path = require("path");
const app = express();
const portfinder = require('portfinder');
const hbs = require("hbs");

require("./database/conn.js");
const registration = require("./models/registration.js");

const template_path = path.join(__dirname, "../Frontend/Templates/views");
const partials_path = path.join(__dirname, "../Frontend/Templates/partials");
const css_path = path.join(__dirname, "../Frontend/Templates/CSS/");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use("/css", express.static(css_path));
//hbs.watch(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/homepage', (req, res) => {
    res.render('homepage');
});

app.post('/', async(req, res) => {
  try {
    const userregister = new registration({
      fullname: req.body.fullname,
      email: req.body.email,
      passwordregister: req.body.passwordregister,
    })
    const registered = await userregister.save();
    res.status(201).render("homepage");
    
  } catch (error) {
    const userInput = {
      fullname: req.body.fullname,
      email: req.body.email,
      passwordregister: req.body.passwordregister
    };

    if (error.name === 'ValidationError') {
      // Extract error messages
      const errorMessages = Object.values(error.errors).map(err => err.message);
      res.status(400).render("index", {
        errorMessage: errorMessages.join(' '),
        userInput: userInput 
      });
    }
    else if (error.code === 11000) {
      res.status(400).render("index", {
        errorMessage: "Email already exists. Please use a different email.",
        userInput: userInput 
      });
    } 
    else {
      res.status(500).send(error);
    }
  }
});

app.get('/TransPage', (req, res) => {
    res.render('TransPage');
});

app.get('/TransHistory', (req, res) => {
    res.render('TransHistory');
});

app.get('/UserProfile', (req, res) => {
    res.render('UserProfile');
});

app.get('/TransUpload', (req, res) => {
    res.render('TransUpload');
});

portfinder.getPort((err, port) => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});