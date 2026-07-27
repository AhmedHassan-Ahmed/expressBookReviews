const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const axios = require("axios");

const app = express();

app.use(express.json());

async function getAllBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`,
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`,
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.authorization) {
    return res.status(401).json({
      message: "User not logged in",
    });
  }
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    jwt.verify(token, "access", (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "invalid or expired token",
        });
      }
      req.user = user;
      next();
    });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
