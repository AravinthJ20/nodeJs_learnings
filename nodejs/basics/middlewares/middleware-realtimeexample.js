// Real-Life Example: Office Visitor

// Suppose you visit a company office.

// Visitor
//    ↓
// Security Guard
//    ↓
// Receptionist
//    ↓
// Manager
// Step 1: Security Guard

// The security guard checks:

// Who are you?
// Do you have an ID card?

// If valid:

// Go to Reception

// Otherwise:

// Access Denied

// This is like Authentication Middleware.

// Step 2: Receptionist

// Receptionist checks:

// Which department?
// Do you have an appointment?

// If valid:

// Go to Manager

// Otherwise:

// Please register first

// This is like Validation Middleware.

// Step 3: Manager

// Manager handles your actual request.

// This is like the Controller/Route Handler.

// Same Flow in Node.js
// Client Request
//       ↓
// Auth Middleware
//       ↓
// Validation Middleware
//       ↓
// Controller
//       ↓
// Response



// Middleware is like a security checkpoint between a client request and the final response.
//  In real projects, middleware is used for authentication, authorization, validation,
//   logging, and error handling. For example, in an ERP application, when a user creates 
//   a Purchase Order, the request first passes through JWT authentication middleware, then
//    validation middleware, and finally reaches the controller that creates 
// the PO. Middleware can either stop the request or pass it to the next step using next().