const express = require("express");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const connectDb = require("./config/dbConnection");
require("dotenv").config();

// Connect to MongoDB Atlas
connectDb();

const app = express();
const port = process.env.PORT || 5400;

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Set up Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
