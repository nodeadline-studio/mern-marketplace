# Service Marketplace - System Architecture

## High-Level Architecture Diagram

```mermaid
graph TD
    A[Client - React] -->|API Calls| B[Server - Node.js]
    B -->|Database Operations| C[MongoDB]
    B -->|Payment Processing| D[Stripe API]
    B -->|Email Services| E[SMTP Server]
    B -->|File Storage| F[Cloud Storage]

    A -->|Authentication| G[JWT Tokens]
    A -->|State Management| H[React Context]
    A -->|Styling| I[Tailwind CSS]

    subgraph Frontend Components
        A1[Auth Pages]
        A2[Service Pages]
        A3[User Pages]
        A4[Order Pages]
        A5[Search Pages]
    end

    subgraph Backend Services
        B1[Auth Service]
        B2[Service Service]
        B3[User Service]
        B4[Order Service]
        B5[Payment Service]
        B6[Review Service]
    end

    subgraph Database Collections
        C1[Users]
        C2[Services]
        C3[Orders]
        C4[Reviews]
        C5[Payments]
    end
```

## Component Architecture

### Frontend Component Tree

```mermaid
graph TD
    App -->|contains| Layout
    Layout -->|contains| Header
    Layout -->|contains| MainContent
    Layout -->|contains| Footer

    MainContent -->|routes to| HomePage
    MainContent -->|routes to| AuthPages
    MainContent -->|routes to| ServicePages
    MainContent -->|routes to| UserPages
    MainContent -->|routes to| OrderPages

    AuthPages -->|contains| Login
    AuthPages -->|contains| Register
    AuthPages -->|contains| ForgotPassword

    ServicePages -->|contains| ServiceList
    ServicePages -->|contains| ServiceDetail
    ServicePages -->|contains| ServiceCreate
    ServicePages -->|contains| ServiceEdit

    UserPages -->|contains| UserProfile
    UserPages -->|contains| UserSettings
    UserPages -->|contains| UserPortfolio

    OrderPages -->|contains| OrderList
    OrderPages -->|contains| OrderDetail
    OrderPages -->|contains| Checkout
```

## Data Flow

### User Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>Server: POST /api/auth/login {email, password}
    Server->>Database: Find user by email
    Database-->>Server: User record
    Server->>Server: Verify password
    Server->>Server: Generate JWT token
    Server-->>Client: {token, userData}
    Client->>Client: Store token in localStorage
    Client->>Server: GET /api/users/me (with Authorization header)
    Server->>Server: Verify JWT token
    Server->>Database: Get user data
    Database-->>Server: User data
    Server-->>Client: User data
```

### Service Purchase Flow

```mermaid
sequenceDiagram
    participant Buyer
    participant Frontend
    participant Backend
    participant Stripe
    participant Database

    Buyer->>Frontend: Click "Purchase" on service
    Frontend->>Backend: POST /api/orders (with serviceId, requirements)
    Backend->>Database: Create order (status: pending)
    Database-->>Backend: Order created
    Backend->>Stripe: Create payment intent
    Stripe-->>Backend: Payment intent
    Backend-->>Frontend: {orderId, clientSecret}
    Frontend->>Stripe: Confirm payment (client-side)
    Stripe-->>Frontend: Payment success
    Frontend->>Backend: PUT /api/orders/:id/status (status: processing)
    Backend->>Database: Update order status
    Database-->>Backend: Order updated
    Backend-->>Frontend: Order confirmation
```

## Technical Implementation Details

### Frontend Layer

**State Management Strategy:**
- React Context for global state (auth, theme, user)
- React Query for server state (services, orders, reviews)
- Local component state for UI interactions

**Routing Strategy:**
- React Router v6 with lazy loading
- Protected routes for authenticated users
- Role-based route access control
- Dynamic route parameters for service/ID pages

### Backend Layer

**API Design Principles:**
- RESTful endpoints with consistent naming
- JWT authentication middleware
- Role-based access control
- Input validation and sanitization
- Rate limiting for public endpoints

**Error Handling:**
- Custom error classes
- Consistent error response format
- Error logging and monitoring
- User-friendly error messages

### Database Layer

**Data Modeling:**
- Mongoose schemas with validation
- Indexes for performance-critical queries
- Virtual properties for computed fields
- Pre/post hooks for data processing
- Population for related data

**Query Optimization:**
- Pagination for list endpoints
- Selective field projection
- Caching for frequent queries
- Aggregation pipelines for complex queries

## Security Architecture

```mermaid
graph TD
    A[Client Request] --> B[Rate Limiter]
    B --> C[Helmet Middleware]
    C --> D[CORS Middleware]
    D --> E[JWT Verification]
    E --> F[Role-Based Access Control]
    F --> G[Input Validation]
    G --> H[Controller]
    H --> I[Database Operation]
    I --> J[Response Sanitization]
    J --> K[Client]
```

## Performance Considerations

**Frontend:**
- Code splitting with React.lazy
- Image optimization and lazy loading
- Memoization with React.memo
- Virtualized lists for large datasets
- Service worker for offline caching

**Backend:**
- Database connection pooling
- Query optimization and indexing
- Response compression
- Caching strategies
- Load balancing readiness

## Deployment Architecture

```mermaid
graph LR
    A[Client] -->|HTTPS| B[Load Balancer]
    B --> C[Node.js Server 1]
    B --> D[Node.js Server 2]
    C --> E[MongoDB Primary]
    D --> E
    E --> F[MongoDB Secondary 1]
    E --> G[MongoDB Secondary 2]
    C --> H[Redis Cache]
    D --> H
    C --> I[Stripe API]
    D --> I
```

## Next Steps for Implementation

1. **Project Setup**
   - Create React frontend structure
   - Set up Node.js backend structure
   - Configure build tools and dependencies
   - Set up environment variables

2. **Core Implementation**
   - Implement authentication system
   - Build service listing components
   - Create API endpoints
   - Set up database models

3. **Feature Development**
   - User profile management
   - Search and filtering
   - Payment integration
   - Review system

4. **Polishing**
   - Responsive design
   - Theme system
   - Performance optimization
   - Documentation