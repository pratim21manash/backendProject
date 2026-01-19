const Book = require("../models/Book.model")
const Author = require("../models/Author.model")

exports.createBook = async(req, res) => {
    try {
        const {title, authorName, pages, genre, publishedYear} = req.body

        //check if author exist
        let author = await Author.findOne({name: authorName})
        if(!author)
            author = await Author.create({ name: authorName })

        const book = await Book.create({
            title,
            author: author._id,
            pages,
            genre,
            publishedYear
        })

        //Populate author details in response
        await book.populate("author", "name");

        res.status(201).json({
            success: true,
            data: book,
            message: "Book creted successfully"
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: err.response
        })
    }
}

exports.getAllBooks = async(req, res) => {
    try {
        const books = await Book.find().populate("author", "name")

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        })
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.response
        })
    }
}


//Get all books statistics
exports.getBookStats = async (req,res) => {
    try {
        const books = await Book.find().populate("author", "name");

        //calculate total pages
        const totalPages = books.reduce((sum, book) => sum + book.pages, 0);

        //Find longest Book
        const longestBook = books.reduce((longest, book) => 
            book.pages > longest.pages ? book : longest, books[0] || {}
        )

        //Get list of unique authors
        const authors = await Author.find().select("name");
        const uniqueAuthors = authors.map(author => author.name)

        //count book by author
        const booksByAuthor = {}
        books.forEach(book => {
            const authorName = book.author.name;
            booksByAuthor[authorName] = (booksByAuthor[authorName] || 0) + 1
        })

        res.status(200).json({
            success: true,
            data: {
                totalPages,
                longestBook: longestBook.title || "No books",
                longestBookPages: longestBook.pages || 0,
                uniqueAuthors,
                booksByAuthor,
                totalBooks: books.length
            }
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


// 4. Get books by specific author
exports.getBooksByAuthor = async (req, res) => {
    try {
        const authorName = req.params.authorName;
        
        // Find author first
        const author = await Author.findOne({ name: authorName });
        if (!author) {
            return res.status(404).json({
                success: false,
                message: 'Author not found'
            });
        }
        
        // Find books by this author
        const books = await Book.find({ author: author._id }).populate('author', 'name');
        
        res.status(200).json({
            success: true,
            author: author.name,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


//update a book
exports.updateBook = async (req, res) => {
    try {
        const {id} = req.params
        const book = await Book.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true}
        ).populate("author", 'name')

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            data: book,
            message: "Book updated successfully"
    })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}


//Delete a Book
exports.deleteBook = async (req,res) => {
    try {
        const {id} = req.params;
        const book = await Book.findByIdAndDelete(id)

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

       res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });        
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}