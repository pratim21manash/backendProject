// ==============================================
// LIBRARY BOOK TRACKER - FRONTEND APPLICATION
// ==============================================

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/books';
let allBooks = [];
let currentTheme = 'light';

// DOM Elements
const elements = {
    // API Status
    apiStatus: document.getElementById('apiStatus'),
    statusDot: document.getElementById('statusDot'),
    
    // Forms
    addBookForm: document.getElementById('addBookForm'),
    updateBookForm: document.getElementById('updateBookForm'),
    addBookSection: document.getElementById('addBookSection'),
    updateBookSection: document.getElementById('updateBookSection'),
    
    // Buttons
    clearFormBtn: document.getElementById('clearForm'),
    cancelUpdateBtn: document.getElementById('cancelUpdate'),
    refreshBooksBtn: document.getElementById('refreshBooks'),
    refreshStatsBtn: document.getElementById('refreshStats'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Statistics
    heroTotalBooks: document.getElementById('heroTotalBooks'),
    heroTotalPages: document.getElementById('heroTotalPages'),
    heroUniqueAuthors: document.getElementById('heroUniqueAuthors'),
    totalPagesStat: document.getElementById('totalPagesStat'),
    totalBooksStat: document.getElementById('totalBooksStat'),
    pagesProgress: document.getElementById('pagesProgress'),
    longestBookTitle: document.getElementById('longestBookTitle'),
    longestBookPages: document.getElementById('longestBookPages'),
    topAuthor: document.getElementById('topAuthor'),
    authorBookCount: document.getElementById('authorBookCount'),
    topGenre: document.getElementById('topGenre'),
    genreCount: document.getElementById('genreCount'),
    avgPages: document.getElementById('avgPages'),
    
    // Tables & Lists
    booksTableBody: document.getElementById('booksTableBody'),
    noBooksRow: document.getElementById('noBooksRow'),
    searchBookInput: document.getElementById('searchBook'),
    authorsGrid: document.getElementById('authorsGrid'),
    
    // Toast Container
    toastContainer: document.getElementById('toastContainer')
};

/**
 * Initialize the application
 */
async function init() {
    console.log('📚 BookSage Frontend Initializing...');
    
    // Load theme preference
    loadTheme();
    
    // Check API connection
    await checkAPI();
    
    // Load initial data
    await fetchBooks();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup rating stars
    setupRatingStars();
    
    // Auto-refresh API status
    setInterval(checkAPI, 10000);
    
    console.log('✅ Application initialized successfully');
}

/**
 * Check API connection status
 */
async function checkAPI() {
    try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
            elements.apiStatus.textContent = 'Connected';
            elements.statusDot.className = 'status-dot connected';
            return true;
        }
    } catch (error) {
        elements.apiStatus.textContent = 'Disconnected';
        elements.statusDot.className = 'status-dot disconnected';
        console.warn('⚠️ API Connection Error:', error.message);
    }
    return false;
}

/**
 * Fetch all books from API
 */
async function fetchBooks() {
    try {
        showToast('Loading books...', 'info');
        
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success) {
            allBooks = data.data || [];
            displayBooks(allBooks);
            updateDashboardStats();
            updateHeroStats();
            updateAuthorsGrid();
            
            if (allBooks.length > 0) {
                showToast(`Loaded ${allBooks.length} books`, 'success');
            }
            return true;
        } else {
            throw new Error(data.error || 'Failed to fetch books');
        }
    } catch (error) {
        console.error('❌ Error fetching books:', error);
        showToast('Failed to load books. Check backend server!', 'error');
        displayBooks([]);
        return false;
    }
}

/**
 * Display books in the table
 */
function displayBooks(books) {
    if (!books || books.length === 0) {
        elements.noBooksRow.classList.remove('hidden');
        elements.booksTableBody.innerHTML = '';
        return;
    }

    elements.noBooksRow.classList.add('hidden');
    
    const booksHTML = books.map(book => `
        <tr class="book-row" data-id="${book._id}">
            <td>
                <div class="book-info">
                    <div class="book-title">${escapeHTML(book.title)}</div>
                    ${book.publishedYear ? `<div class="book-year">${book.publishedYear}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="author-info">
                    <i class="fas fa-user-pen"></i>
                    ${escapeHTML(book.author?.name || 'Unknown')}
                </div>
            </td>
            <td>
                <span class="page-count">${book.pages}</span>
                <span class="page-label">pages</span>
            </td>
            <td>
                ${book.genre ? `<span class="genre-badge">${escapeHTML(book.genre)}</span>` : '<span class="text-muted">-</span>'}
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="editBook('${book._id}')" class="btn-action btn-edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBook('${book._id}')" class="btn-action btn-delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    elements.booksTableBody.innerHTML = booksHTML;
}

/**
 * Add a new book - FIXED VERSION
 */
async function addBook(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const bookData = {
        title: document.getElementById('title').value.trim(),
        authorName: document.getElementById('author').value.trim(),
        pages: parseInt(document.getElementById('pages').value),
        genre: document.getElementById('genre').value || undefined,
        publishedYear: document.getElementById('publishedYear').value ? 
                      parseInt(document.getElementById('publishedYear').value) : undefined,
        rating: parseInt(document.getElementById('rating').value) || undefined
    };

    console.log('Book data to send:', bookData); // Debug log

    // Validation
    if (!bookData.title || !bookData.authorName || !bookData.pages || bookData.pages <= 0) {
        showToast('Please fill in all required fields (Title, Author, and valid Pages)', 'error');
        return;
    }

    try {
        showToast('Adding book...', 'info');
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        console.log('Response from server:', data); // Debug log
        
        if (data.success) {
            showToast('Book added successfully! 📖', 'success');
            form.reset();
            resetRatingStars();
            await fetchBooks();
        } else {
            showToast(`Error: ${data.error || 'Failed to add book'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error adding book:', error);
        showToast('Failed to add book. Check console for details.', 'error');
    }
}

/**
 * Edit book - show update form - FIXED VERSION
 */
async function editBook(bookId) {
    try {
        const book = allBooks.find(b => b._id === bookId);
        if (!book) {
            showToast('Book not found', 'error');
            return;
        }

        console.log('Editing book:', book); // Debug log

        // Show update form
        elements.addBookSection.classList.add('hidden');
        elements.updateBookSection.classList.remove('hidden');
        
        // Fill form with book data - using document.getElementById directly
        document.getElementById('updateId').value = book._id;
        document.getElementById('updateTitle').value = book.title;
        document.getElementById('updateAuthor').value = book.author?.name || '';
        document.getElementById('updatePages').value = book.pages;
        document.getElementById('updateGenre').value = book.genre || '';
        document.getElementById('updateYear').value = book.publishedYear || '';
        
        // Scroll to update form
        elements.updateBookSection.scrollIntoView({ behavior: 'smooth' });
        
        showToast('Edit mode activated', 'info');
    } catch (error) {
        console.error('❌ Error editing book:', error);
        showToast('Failed to load book details', 'error');
    }
}

/**
 * Update book - FIXED VERSION
 */
async function updateBook(event) {
    event.preventDefault();
    
    const bookId = document.getElementById('updateId').value;
    const bookData = {
        title: document.getElementById('updateTitle').value.trim(),
        authorName: document.getElementById('updateAuthor').value.trim(),
        pages: parseInt(document.getElementById('updatePages').value),
        genre: document.getElementById('updateGenre').value || undefined,
        publishedYear: document.getElementById('updateYear').value ? 
                      parseInt(document.getElementById('updateYear').value) : undefined
    };

    console.log('Updating book with ID:', bookId); // Debug log
    console.log('Update data:', bookData); // Debug log

    // Validation
    if (!bookData.title || !bookData.authorName || !bookData.pages || bookData.pages <= 0) {
        showToast('Please fill in all required fields (Title, Author, and valid Pages)', 'error');
        return;
    }

    try {
        showToast('Updating book...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        console.log('Update response:', data); // Debug log
        
        if (data.success) {
            showToast('Book updated successfully! ✏️', 'success');
            cancelUpdate();
            await fetchBooks();
        } else {
            showToast(`Error: ${data.message || data.error || 'Failed to update book'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error updating book:', error);
        showToast('Failed to update book. Check console for details.', 'error');
    }
}

/**
 * Delete a book
 */
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return;
    }

    try {
        showToast('Deleting book...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
            showToast('Book deleted successfully! 🗑️', 'success');
            await fetchBooks();
        } else {
            showToast(`Error: ${data.message || data.error}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error deleting book:', error);
        showToast('Failed to delete book', 'error');
    }
}

/**
 * Update dashboard statistics
 */
async function updateDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            const stats = data.data;
            
            // Update main statistics
            elements.totalPagesStat.textContent = stats.totalPages || 0;
            elements.totalBooksStat.textContent = stats.totalBooks || 0;
            
            // Update longest book
            elements.longestBookTitle.textContent = stats.longestBook || 'None';
            elements.longestBookPages.textContent = stats.longestBookPages || 0;
            
            // Calculate average pages
            const avg = stats.totalBooks > 0 ? Math.round(stats.totalPages / stats.totalBooks) : 0;
            elements.avgPages.textContent = avg;
            
            // Update progress bar
            const maxPages = 10000; // Arbitrary max for visualization
            const progress = Math.min((stats.totalPages / maxPages) * 100, 100);
            elements.pagesProgress.style.width = `${progress}%`;
            
            // Find top author
            if (stats.booksByAuthor) {
                const topAuthor = Object.entries(stats.booksByAuthor)
                    .sort((a, b) => b[1] - a[1])[0];
                
                if (topAuthor) {
                    elements.topAuthor.textContent = topAuthor[0];
                    elements.authorBookCount.textContent = topAuthor[1];
                }
            }
            
            // Find top genre
            const genreCounts = {};
            allBooks.forEach(book => {
                if (book.genre) {
                    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
                }
            });
            
            const topGenre = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])[0];
            
            if (topGenre) {
                elements.topGenre.textContent = topGenre[0];
                elements.genreCount.textContent = `${topGenre[1]} books`;
            }
        }
    } catch (error) {
        console.error('❌ Error updating statistics:', error);
    }
}

/**
 * Update hero statistics
 */
function updateHeroStats() {
    elements.heroTotalBooks.textContent = allBooks.length;
    
    const totalPages = allBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
    elements.heroTotalPages.textContent = totalPages.toLocaleString();
    
    const uniqueAuthors = new Set(allBooks.map(book => book.author?.name).filter(Boolean));
    elements.heroUniqueAuthors.textContent = uniqueAuthors.size;
}

/**
 * Update authors grid
 */
function updateAuthorsGrid() {
    const authorsMap = new Map();
    
    allBooks.forEach(book => {
        const authorName = book.author?.name || 'Unknown';
        if (!authorsMap.has(authorName)) {
            authorsMap.set(authorName, {
                name: authorName,
                bookCount: 0,
                totalPages: 0
            });
        }
        const author = authorsMap.get(authorName);
        author.bookCount++;
        author.totalPages += book.pages || 0;
    });
    
    const authors = Array.from(authorsMap.values())
        .sort((a, b) => b.bookCount - a.bookCount);
    
    if (authors.length === 0) {
        elements.authorsGrid.innerHTML = `
            <div class="empty-state-sm">
                <i class="fas fa-user-pen"></i>
                <p>No authors yet</p>
            </div>
        `;
        return;
    }
    
    const authorsHTML = authors.map(author => `
        <div class="author-card">
            <i class="fas fa-user-pen"></i>
            <h3>${escapeHTML(author.name)}</h3>
            <p class="author-stats">
                ${author.bookCount} book${author.bookCount !== 1 ? 's' : ''}
                • ${author.totalPages.toLocaleString()} pages
            </p>
        </div>
    `).join('');
    
    elements.authorsGrid.innerHTML = authorsHTML;
}

/**
 * Setup event listeners - FIXED VERSION
 */
function setupEventListeners() {
    // Form submissions
    if (elements.addBookForm) {
        elements.addBookForm.addEventListener('submit', addBook);
    }
    
    if (elements.updateBookForm) {
        elements.updateBookForm.addEventListener('submit', updateBook);
    }
    
    // Button clicks
    if (elements.clearFormBtn) {
        elements.clearFormBtn.addEventListener('click', () => {
            elements.addBookForm.reset();
            resetRatingStars();
            showToast('Form cleared', 'info');
        });
    }
    
    if (elements.cancelUpdateBtn) {
        elements.cancelUpdateBtn.addEventListener('click', cancelUpdate);
    }
    
    if (elements.refreshBooksBtn) {
        elements.refreshBooksBtn.addEventListener('click', fetchBooks);
    }
    
    if (elements.refreshStatsBtn) {
        elements.refreshStatsBtn.addEventListener('click', updateDashboardStats);
    }
    
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search functionality
    if (elements.searchBookInput) {
        elements.searchBookInput.addEventListener('input', (e) => {
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
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

/**
 * Setup rating stars
 */
function setupRatingStars() {
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('rating');
    
    if (!stars.length || !ratingInput) return;
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < value) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            stars.forEach((s, index) => {
                if (index < value) {
                    s.className = 'fas fa-star';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            const currentValue = parseInt(ratingInput.value) || 0;
            stars.forEach((s, index) => {
                if (index < currentValue) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
}

/**
 * Reset rating stars
 */
function resetRatingStars() {
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('rating');
    
    if (!stars.length || !ratingInput) return;
    
    ratingInput.value = 0;
    stars.forEach(star => {
        star.className = 'far fa-star';
    });
}

/**
 * Cancel update form
 */
function cancelUpdate() {
    elements.updateBookSection.classList.add('hidden');
    elements.addBookSection.classList.remove('hidden');
    
    // Reset form
    if (elements.updateBookForm) {
        elements.updateBookForm.reset();
    }
    
    // Scroll back to add form
    elements.addBookSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Toggle theme
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    const icon = elements.themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    showToast(`${currentTheme === 'light' ? 'Light' : 'Dark'} mode activated`, 'info');
}

/**
 * Load theme preference
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const icon = elements.themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Get icon for toast type
 */
function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Scroll to add form (for empty state button)
 */
function scrollToAddForm() {
    elements.addBookSection.scrollIntoView({ behavior: 'smooth' });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);