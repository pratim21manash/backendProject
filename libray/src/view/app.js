// Configuration
const API_BASE_URL = 'http://localhost:3000/api/books';
let allBooks = [];

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const updateBookForm = document.getElementById('updateBookForm');
const updateCard = document.getElementById('updateCard');
const booksTableBody = document.getElementById('booksTableBody');
const noBooksRow = document.getElementById('noBooksRow');
const searchBookInput = document.getElementById('searchBook');
const refreshBooksBtn = document.getElementById('refreshBooks');
const refreshStatsBtn = document.getElementById('refreshStats');
const clearFormBtn = document.getElementById('clearForm');
const cancelUpdateBtn = document.getElementById('cancelUpdate');
const authorsList = document.getElementById('authorsList');

// Statistics Elements
const totalBooksEl = document.getElementById('totalBooks');
const totalPagesEl = document.getElementById('totalPages');
const uniqueAuthorsEl = document.getElementById('uniqueAuthors');
const longestBookEl = document.getElementById('longestBook');
const apiStatusEl = document.getElementById('apiStatus');

/**
 * Check API connection
 */
async function checkAPI() {
    try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
            apiStatusEl.textContent = 'Connected';
            apiStatusEl.className = 'status-online';
            return true;
        }
    } catch (error) {
        apiStatusEl.textContent = 'Disconnected';
        apiStatusEl.className = 'status-offline';
        console.error('API Connection Error:', error);
    }
    return false;
}

/**
 * Fetch all books from API
 */
async function fetchBooks() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch books');
        
        const data = await response.json();
        if (data.success) {
            allBooks = data.data;
            displayBooks(allBooks);
            updateStatistics();
            updateAuthorsList();
            return true;
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        showMessage('Failed to load books. Make sure backend is running!', 'error');
    }
    return false;
}

/**
 * Display books in the table
 */
function displayBooks(books) {
    if (!books || books.length === 0) {
        noBooksRow.classList.remove('hidden');
        booksTableBody.innerHTML = '';
        return;
    }

    noBooksRow.classList.add('hidden');
    
    const booksHTML = books.map(book => `
        <tr class="fade-in">
            <td><strong>${book.title}</strong></td>
            <td>${book.author?.name || 'Unknown'}</td>
            <td><span class="badge">${book.pages} pages</span></td>
            <td>${book.genre || '-'}</td>
            <td>
                <button onclick="editBook('${book._id}')" class="btn btn-info btn-sm">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteBook('${book._id}')" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');

    booksTableBody.innerHTML = booksHTML;
}

/**
 * Add a new book
 */
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('title').value.trim(),
        authorName: document.getElementById('author').value.trim(),
        pages: parseInt(document.getElementById('pages').value),
        genre: document.getElementById('genre').value.trim() || undefined,
        publishedYear: document.getElementById('publishedYear').value || undefined
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        
        if (data.success) {
            showMessage('Book added successfully!', 'success');
            addBookForm.reset();
            await fetchBooks();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showMessage('Failed to add book. Check console for details.', 'error');
    }
});

/**
 * Edit book - show update form
 */
async function editBook(bookId) {
    try {
        // First, fetch the book details
        const response = await fetch(`${API_BASE_URL}`);
        const data = await response.json();
        
        if (data.success) {
            const book = data.data.find(b => b._id === bookId);
            if (book) {
                // Show update form
                addBookForm.parentElement.classList.add('hidden');
                updateCard.classList.remove('hidden');
                
                // Fill form with book data
                document.getElementById('updateId').value = book._id;
                document.getElementById('updateTitle').value = book.title;
                document.getElementById('updateAuthor').value = book.author?.name || '';
                document.getElementById('updatePages').value = book.pages;
                document.getElementById('updateGenre').value = book.genre || '';
                document.getElementById('updateYear').value = book.publishedYear || '';
                
                // Scroll to update form
                updateCard.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        console.error('Error fetching book for edit:', error);
        showMessage('Failed to load book details', 'error');
    }
}

/**
 * Update book
 */
updateBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('updateId').value;
    const bookData = {
        title: document.getElementById('updateTitle').value.trim(),
        authorName: document.getElementById('updateAuthor').value.trim(),
        pages: parseInt(document.getElementById('updatePages').value),
        genre: document.getElementById('updateGenre').value.trim() || undefined,
        publishedYear: document.getElementById('updateYear').value || undefined
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        
        if (data.success) {
            showMessage('Book updated successfully!', 'success');
            cancelUpdateForm();
            await fetchBooks();
        } else {
            showMessage(`Error: ${data.message || data.error}`, 'error');
        }
    } catch (error) {
        console.error('Error updating book:', error);
        showMessage('Failed to update book', 'error');
    }
});

/**
 * Cancel update form
 */
function cancelUpdateForm() {
    updateCard.classList.add('hidden');
    addBookForm.parentElement.classList.remove('hidden');
    updateBookForm.reset();
}

/**
 * Delete a book
 */
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
            showMessage('Book deleted successfully!', 'success');
            await fetchBooks();
        } else {
            showMessage(`Error: ${data.message || data.error}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showMessage('Failed to delete book', 'error');
    }
}

/**
 * Update statistics display
 */
async function updateStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            const stats = data.data;
            totalBooksEl.textContent = stats.totalBooks || 0;
            totalPagesEl.textContent = stats.totalPages || 0;
            uniqueAuthorsEl.textContent = stats.uniqueAuthors?.length || 0;
            longestBookEl.textContent = `${stats.longestBook || 'None'} (${stats.longestBookPages || 0} pages)`;
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

/**
 * Update authors list display
 */
function updateAuthorsList() {
    const authors = {};
    allBooks.forEach(book => {
        const authorName = book.author?.name || 'Unknown';
        authors[authorName] = (authors[authorName] || 0) + 1;
    });

    if (Object.keys(authors).length === 0) {
        authorsList.innerHTML = '<div class="empty-message">No authors yet</div>';
        return;
    }

    const authorsHTML = Object.entries(authors)
        .sort((a, b) => b[1] - a[1])
        .map(([author, count]) => `
            <div class="author-tag">
                <i class="fas fa-user-pen"></i>
                ${author} <span class="book-count">(${count} book${count > 1 ? 's' : ''})</span>
            </div>
        `).join('');

    authorsList.innerHTML = authorsHTML;
}

/**
 * Search books
 */
searchBookInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayBooks(allBooks);
        return;
    }
    
    const filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        (book.author?.name || '').toLowerCase().includes(searchTerm) ||
        (book.genre || '').toLowerCase().includes(searchTerm)
    );
    
    displayBooks(filteredBooks);
});

/**
 * Show notification message
 */
function showMessage(message, type = 'info') {
    // Remove any existing message
    const existingMsg = document.querySelector('.notification');
    if (existingMsg) existingMsg.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'fadeIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Clear form
 */
clearFormBtn.addEventListener('click', () => {
    addBookForm.reset();
    showMessage('Form cleared', 'info');
});

/**
 * Event Listeners
 */
refreshBooksBtn.addEventListener('click', fetchBooks);
refreshStatsBtn.addEventListener('click', updateStatistics);
cancelUpdateBtn.addEventListener('click', cancelUpdateForm);

/**
 * Initialize the application
 */
async function init() {
    // Check API connection
    await checkAPI();
    
    // Load initial data
    await fetchBooks();
    
    // Add some CSS for badges
    const style = document.createElement('style');
    style.textContent = `
        .badge {
            background: #e0e7ff;
            color: #4a6baf;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .book-count {
            font-size: 0.8rem;
            opacity: 0.9;
        }
        .notification {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Show welcome message
    setTimeout(() => {
        if (allBooks.length === 0) {
            showMessage('Welcome! Start by adding your first book.', 'info');
        }
    }, 1000);
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Auto-refresh API status every 10 seconds
setInterval(checkAPI, 10000);