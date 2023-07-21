const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Make sure to supply a username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book) {
      res.send(book);
  } else {
     res.send(`Book with ISBN ${isbn} does not exist!`);
  }
//  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  /*const booksArr = [];
  Object.keys(books).forEach(key=>{
      booksArr.push({'isbn': key
                   , 'author': books[key].author
                   , 'title': books[key].title
                   , 'reviews': books[key].reviews});
  });
  */
 const authorBooks = {};

  let author = req.params.author;

  Object.keys(books).forEach(key=>{
      if(books[key].author == author) authorBooks[key] = books[key];
  });

  if(Object.keys(authorBooks).length > 0) {
      res.send(authorBooks);
  } else {
      res.send(`Sorry, there are no books by author ${author}.`)
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleBooks = {};

  let title = req.params.title;

  Object.keys(books).forEach(key=>{
      if(books[key].title == title) titleBooks[key] = books[key];
  });

  if(Object.keys(titleBooks).length > 0) {
      res.send(titleBooks);
  } else {
      res.send(`Sorry, there are no books with Title ${title}.`)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book) {
      res.send(book.reviews);
  } else {
     res.send(`Book with ISBN ${isbn} does not exist!`);
  }
});

module.exports.general = public_users;
