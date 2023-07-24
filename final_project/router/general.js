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
  //Creating a promise method. The promise will get resolved when book list retrieved from datasource 
  let promiseBookList = new Promise((resolve,reject) => {
    console.log('inside the promise');
    resolve(JSON.stringify(books,null,4));
  })
  //Call the promise and wait for it to be resolved and send back book list.
  promiseBookList.then((bookList) => {
  //  console.log("From Callback " + bookList)
    res.send(bookList);
  })
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Creating a promise method. The promise will get resolved when book is retrieved from datasource 
  let promiseBookByIsbn = new Promise((resolve,reject) => {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book) {
        resolve(book);
    } else {
        resolve(`Book with ISBN ${isbn} does not exist!`);
    }
})

  //Call the promise and wait for it to be resolved and send back book.
  promiseBookByIsbn.then((message) => {
    res.send(message);
  })

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Creating a promise method. The promise will get resolved when book list is retrieved from datasource 
  let promiseBookByAuthor = new Promise((resolve,reject) => {
    const authorBooks = {};

    let author = req.params.author;

    Object.keys(books).forEach(key=>{
      if(books[key].author == author) authorBooks[key] = books[key];
    });

    if(Object.keys(authorBooks).length > 0) {
        resolve(authorBooks)
    } else {
        resolve(`Sorry, there are no books by author ${author}.`)
    }
  })//end promise method

  //Call the promise and wait for it to be resolved and send back book list.
  promiseBookByAuthor.then((message) => {
    res.send(message);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Creating a promise method. The promise will get resolved when book is retrieved from datasource 
  let promiseBookByTitle = new Promise((resolve,reject) => {
    const titleBooks = {};

    let title = req.params.title;

    Object.keys(books).forEach(key=>{
      if(books[key].title == title) titleBooks[key] = books[key];
    });

    if(Object.keys(titleBooks).length > 0) {
      resolve(titleBooks);
    } else {
      resolve(`Sorry, there are no books with Title ${title}.`)
    }
  })//end promise method

  //Call the promise and wait for it to be resolved and send back book.
  promiseBookByTitle.then((message) => {
    res.send(message);
  })

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
