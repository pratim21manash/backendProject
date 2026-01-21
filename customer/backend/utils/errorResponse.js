// This function is used to CREATE a custom error object
// It works like a factory that builds an error with extra information
function ErrorResponse(message, statusCode) {

    // STEP 1:
    // Call the built-in JavaScript Error constructor
    // This makes THIS object behave like a real Error
    // It sets things like: error.message and error.stack
    Error.call(this, message);

    // STEP 2:
    // Store the error message inside the object
    // Example: this.message = "Invalid input"
    this.message = message;

    // STEP 3:
    // Store the HTTP status code (400, 404, 500, etc.)
    this.statusCode = statusCode;

    // STEP 4:
    // Decide whether this is a client error or server error
    // If status code starts with 4 → client mistake → "fail"
    // Otherwise → server problem → "error"
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // STEP 5:
    // Mark this error as an expected (handled) error
    // This helps in production to separate known errors from crashes
    this.isOperational = true;

    // STEP 6:
    // Capture stack trace for debugging
    // This removes this constructor from the stack trace
    // so the error looks cleaner
    Error.captureStackTrace(this, this.constructor);
}

// STEP 7:
// Make ErrorResponse inherit from JavaScript's Error object
// This allows:
//   error instanceof Error → true
//   error instanceof ErrorResponse → true
ErrorResponse.prototype = Object.create(Error.prototype);

// STEP 8:
// Fix the constructor reference
// Without this, JS would think the constructor is Error
ErrorResponse.prototype.constructor = ErrorResponse;

// STEP 9:
// Export the function so other files can use it
module.exports = ErrorResponse;
