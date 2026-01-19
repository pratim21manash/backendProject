const express = require("express")
const router = express.Router()
const bookController = require('../controller/book.controller')

//POST/api/books -> Create a new book
router.post('/', bookController.createBook);

//GET /api/books -> Get all books
router.get("/", bookController.getAllBooks)

//GET /api/books/stats -> Get book by statistics
router.get("/stats", bookController.getBookStats)

//GET /api/books/author/:authorName -> Get books by specific author
router.get("/author/:authorName", bookController.getBooksByAuthor)

//PUT /api/books/:id -> Update a book
router.put("/:id", bookController.updateBook);

// DELETE /api/books/:id -> Delete a book
router.delete("/:id", bookController.deleteBook)

module.exports = router;

