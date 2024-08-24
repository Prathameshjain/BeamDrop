const express = require("express");
const path = require("path");
const app = express();
const portfinder = require('portfinder');
const hbs = require("hbs");

require("./database/conn.js");

const template_path = path.join(__dirname, "../Frontend/Templates/views");
const partials_path = path.join(__dirname, "../Frontend/Templates/partials");
const css_path = path.join(__dirname, "../Frontend/Templates/CSS/");

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