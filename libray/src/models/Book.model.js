const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    pages: {
        type: Number,
        required: true,
        min: 1
    },
    genre: {
        type: String,
        trim: true
    },
    publishedYear: {
        type: Number
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;