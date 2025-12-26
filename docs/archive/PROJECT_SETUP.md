# Service Marketplace Template - Project Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- MongoDB 6+ (local or cloud)
- Stripe account (for payment processing)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/service-marketplace.git
cd service-marketplace

# Install dependencies (root level)
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root
cd ..
```

### Environment Configuration

Create `.env` files in both client and server directories:

**client/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-marketplace
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
FRONTEND_URL=http://localhost:3000
```

### Development Workflow

```bash
# Start MongoDB (if local)
sudo systemctl start mongod

# In separate terminals:

# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm start

# Terminal 3: Run tests (optional)
cd client
npm test
```

## Project Structure Details

### Frontend Structure

```
client/
├── public/                  # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/         # Reusable components
│   │   ├── common/         # Basic UI elements
│   │   ├── layout/         # Layout components
│   │   ├── auth/           # Authentication components
│   │   ├── services/       # Service-related components
│   │   ├── users/          # User profile components
│   │   └── orders/         # Order management components
│   ├── context/            # React context providers
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── UserContext.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useForm.js
│   ├── pages/              # Main application pages
│   │   ├── Auth/           # Authentication pages
│   │   ├── Services/       # Service-related pages
│   │   ├── Users/          # User profile pages
│   │   ├── Orders/         # Order management pages
│   │   └── Home.js         # Home page
│   ├── services/           # API service calls
│   │   ├── authService.js
│   │   ├── serviceService.js
│   │   ├── userService.js
│   │   ├── orderService.js
│   │   └── reviewService.js
│   ├── styles/             # CSS/SCSS files
│   │   ├── base/           # Base styles
│   │   ├── components/     # Component-specific styles
│   │   ├── layout/         # Layout styles
│   │   ├── themes/         # Theme files
│   │   └── main.scss      # Main SCSS file
│   ├── utils/              # Utility functions
│   │   ├── api.js          # API helper
│   │   ├── auth.js         # Auth utilities
│   │   ├── format.js       # Formatting utilities
│   │   └── validate.js     # Validation functions
│   ├── App.js              # Main App component
│   ├── index.js            # Entry point
│   └── routes.js           # Application routes
├── .env                    # Environment variables
├── package.json
└── ...
```

### Backend Structure

```
server/
├── config/                 # Configuration files
│   ├── db.js               # Database connection
│   ├── email.js            # Email configuration
│   ├── stripe.js           # Stripe configuration
│   └── upload.js           # File upload configuration
├── controllers/            # Route controllers
│   ├── authController.js
│   ├── serviceController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── reviewController.js
│   └── paymentController.js
├── middleware/             # Express middleware
│   ├── auth.js             # Authentication middleware
│   ├── error.js            # Error handling
│   ├── upload.js           # File upload middleware
│   ├── validate.js         # Validation middleware
│   └── rateLimit.js        # Rate limiting
├── models/                 # Database models
│   ├── User.js
│   ├── Service.js
│   ├── Order.js
│   ├── Review.js
│   ├── Payment.js
│   └── index.js
├── routes/                 # API routes
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── paymentRoutes.js
│   └── index.js
├── services/               # Business logic
│   ├── authService.js
│   ├── serviceService.js
│   ├── userService.js
│   ├── orderService.js
│   ├── paymentService.js
│   └── emailService.js
├── utils/                  # Utility functions
│   ├── apiError.js         # API error handling
│   ├── asyncHandler.js     # Async route handler
│   ├── generateToken.js    # Token generation
│   └── validate.js         # Validation utilities
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── .env                    # Environment variables
└── package.json
```

## Available Scripts

### Frontend Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "analyze": "source-map-explorer build/static/js/*.js"
  }
}
```

### Backend Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --detectOpenHandles",
    "lint": "eslint .",
    "format": "prettier --write .",
    "seed": "node scripts/seed.js"
  }
}
```

## Development Best Practices

### Frontend Development

1. **Component Organization**
   - Keep components small and focused
   - Use functional components with hooks
   - Follow the "smart vs dumb" component pattern

2. **State Management**
   - Use React Context for global state
   - Use React Query for server state
   - Keep local state minimal

3. **Styling**
   - Use Tailwind CSS utility classes
   - Create reusable component styles
   - Follow BEM methodology for custom CSS

4. **Performance**
   - Use React.memo for pure components
   - Implement code splitting with React.lazy
   - Optimize images and assets

### Backend Development

1. **API Design**
   - Follow RESTful conventions
   - Use consistent naming (kebab-case for endpoints)
   - Version your API (/api/v1/)

2. **Error Handling**
   - Use custom error classes
   - Provide meaningful error messages
   - Log errors appropriately

3. **Security**
   - Always validate and sanitize input
   - Use parameterized queries
   - Implement rate limiting
   - Use HTTPS in production

4. **Performance**
   - Implement caching where appropriate
   - Optimize database queries
   - Use connection pooling

## Testing Strategy

### Frontend Testing
- Unit tests with Jest + React Testing Library
- Component tests for critical UI
- Integration tests for user flows
- End-to-end tests with Cypress (optional)

### Backend Testing
- Unit tests for services and utilities
- Integration tests for API endpoints
- Mock database for testing
- Test error scenarios

## Deployment Guide

### Docker Setup

Create a `Dockerfile` in the root directory:

```dockerfile
# Stage 1: Build frontend
FROM node:18-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
RUN npm run build

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=client-builder /app/client/build ./client/build

# Copy backend
COPY --from=server-builder /app/server .

# Install production dependencies
RUN npm install --production

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
```

### Production Environment

1. **Server Requirements**
   - Node.js 18+
   - MongoDB 6+
   - PM2 for process management
   - Nginx for reverse proxy (recommended)

2. **Deployment Steps**
   ```bash
   # Build the project
   npm run build

   # Start with PM2
   pm2 start server.js --name service-marketplace

   # Set up Nginx reverse proxy
   # Configure SSL with Let's Encrypt
   ```

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Configure logging
   - Implement health checks
   - Set up performance monitoring

## Troubleshooting

### Common Issues

**Frontend Issues:**
- Clear browser cache if changes don't appear
- Check console for errors
- Verify API endpoints are correct
- Ensure CORS is properly configured

**Backend Issues:**
- Check MongoDB connection
- Verify environment variables
- Review error logs
- Test API endpoints with Postman

**Payment Issues:**
- Verify Stripe API keys
- Check webhook configuration
- Test in Stripe test mode first
- Review payment logs

## Next Steps

The project is now ready for implementation. The architecture and setup are complete, and you can proceed with:

1. Creating the React frontend components
2. Building the Node.js backend API
3. Implementing the database models
4. Setting up authentication
5. Developing the core marketplace features