const Book = require('../models/Book');

// Get all books
exports.getBooks = async (req, res) => {
    try {
      const books = await Book.find();
      res.render("index", { books });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving books from the database.");
    }
  };
  

// Add a new book
exports.addBook = async (req, res) => {
    const { title, author, price } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            price
        });

        const book = await newBook.save();
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { title, author, price } = req.body;
    const bookId = req.params.id;

    try {
        const book = await Book.findByIdAndUpdate(bookId, { title, author, price });
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findByIdAndDelete(bookId);
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
