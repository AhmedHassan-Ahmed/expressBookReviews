const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
  if (!authenticatedUser(user.username, user.pass)) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
  if (!user) {
    return res.status(404).json({ message: "Body Empty" });
  }
  let accessToken = jwt.sign({ data: req.body.user }, "access", {
    expiresIn: 60 * 60,
  });
  req.session.authorization = { accessToken };
  return res.status(200).send("User successfully logged in");
});

regd_users.get("/user/profile", (req, res) => {
  console.log(req.user);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
    books[isbn].reviews[username] = review;
    return res.json({
    message: "Review added successfully",
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
