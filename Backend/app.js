const express = require("express");
const path = require("path");
const app = express();
const portfinder = require('portfinder');
const hbs = require("hbs");
const bcrypt = require('bcrypt');
const session = require('express-session');
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const fs = require('fs');

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sender-join", (data) => {
      console.log(`Sender joining room: ${data.uid}`);
      
      const previousRoom = Array.from(socket.rooms).find(room => room !== socket.id);
      if (previousRoom) {
          socket.leave(previousRoom);
          console.log(`Left previous room: ${previousRoom}`);
      }

      socket.join(data.uid);
      console.log("Rooms after sender joins:", io.sockets.adapter.rooms);
  });

  socket.on("leave-room", (data) => {
      console.log(`Leaving room: ${data.uid}`);
      socket.leave(data.uid);
      console.log("Rooms after leaving:", io.sockets.adapter.rooms);
  });

  socket.on("receiver-join", (data, callback) => {
      const { uid } = data;
      const roomExists = io.sockets.adapter.rooms.has(uid);
      console.log(`Room exists: ${roomExists} for room ID: ${uid}`);
      
      if (roomExists) {
          socket.join(uid);
          socket.to(uid).emit("init", uid); // Notify the sender that the receiver has joined
          if (typeof callback === 'function') {
              callback({ success: true });
          }
      } else {
          if (typeof callback === 'function') {
              callback({ success: false, message: 'Room does not exist.' });
          }
      }
  });

  socket.on("file-meta", (data) => {
      socket.to(data.uid).emit("fs-meta", data);
  });

  socket.on("fs-start", (data) => {
      socket.to(data.uid).emit("fs-share", {}); // Signal to start the file sharing
  });

  socket.on("file-raw", (data) => {
    const { uid, fileName, buffer } = data;
    socket.to(uid).emit("fs-meta", { fileName: fileName, fileSize: buffer.byteLength });
    socket.to(uid).emit("fs-share", buffer);
});

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});





require("./database/conn.js");
const registration = require("./models/registration.js");
const Registration = require("./models/registration.js");

const template_path = path.join(__dirname, "../Frontend/Templates/views");
const partials_path = path.join(__dirname, "../Frontend/Templates/partials");
const css_path = path.join(__dirname, "../Frontend/Templates/CSS/");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use("/css", express.static(css_path));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.get("/", (req, res) => {
  if (req.session.user) {
    // Redirect to homepage if user is already logged in
    res.redirect('/homepage');
  } else {
    // Render index page if no active session
    res.render("index");
  }
});

app.post('/', async (req, res) => {
  try {
    const userregister = new registration({
      fullname: req.body.fullname,
      email: req.body.email,
      passwordregister: req.body.passwordregister,
    });
    // Save the user, the password will be hashed automatically due to the pre-save hook
    await userregister.save();
    // Redirect to the index page with a query parameter
    res.redirect('/?showLogin=true');

  } catch (error) {
    const userInput = {
      fullname: req.body.fullname,
      email: req.body.email,
      passwordregister: req.body.passwordregister
    };

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      res.status(400).render("index", {
        errorMessage: errorMessages.join(' '),
        userInput: userInput 
      });
    } else if (error.code === 11000) {
      res.status(400).render("index", {
        errorMessage: "Email already exists. Please use a different email.",
        userInput: userInput 
      });
    } else {
      res.status(500).send(error);
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const Loginemail = req.body.Loginemail;
    const Loginpassword = req.body.Loginpassword;
    const user = await Registration.findOne({ email: Loginemail });

    if (user && await bcrypt.compare(Loginpassword, user.passwordregister)) {
      req.session.user = {
        email: user.email,
        fullname: user.fullname
      };
      res.redirect('/homepage');
    } else {
      res.status(400).render("index", {
        errorMessage1: "Invalid Email/Password.",
        showLogin: true,
        userInput: {
          Loginemail: Loginemail
        }
      });
    }
  } catch (error) {
    res.status(400).render("index", {
      errorMessage1: "An error occurred. Please try again.",
      showLogin: true,
      userInput: {
        Loginemail: req.body.Loginemail
      }
    });
  }
});

// Authentication middleware
function checkAuthentication(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

app.get('/homepage', checkAuthentication, (req, res) => {
  res.render('homepage', {
    fullname: req.session.user.fullname
  });
});

app.get('/TransPage', checkAuthentication, (req, res) => {
  res.render('TransPage', {
    fullname: req.session.user.fullname
  });
});

app.get('/TransHistory', checkAuthentication, (req, res) => {
  res.render('TransHistory', {
    fullname: req.session.user.fullname
  });
});

app.get('/TransUpload', checkAuthentication, (req, res) => {
  res.render('TransUpload', {
    fullname: req.session.user.fullname
  });
});

app.get('/Userprofile', checkAuthentication, (req, res) => {
  res.render('Userprofile', {
    fullname: req.session.user.fullname,
    email: req.session.user.email
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out. Please try again.');
    }
    res.redirect('/');
  });
});

app.get('/TransReceiver', checkAuthentication, (req, res) => {
  res.render('TransReceiver', {
    fullname: req.session.user.fullname
  });
});

portfinder.getPort((err, port) => {
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
