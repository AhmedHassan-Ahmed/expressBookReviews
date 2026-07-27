const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

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
    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
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
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password not found",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }
  users.push({
    username: username,
    password: password,
  });
  return res.status(201).json({
    message: "User successfully registered",
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book  not in website",
    });
  }

  return res.status(200).json(books[isbn]);
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter((book)=>
    book.author.toLowerCase() === author.toLowerCase(),
  );

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter((book) => {
    return book.title.toLowerCase() === title.toLowerCase();
  });

  return res.status(200).json(result);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
