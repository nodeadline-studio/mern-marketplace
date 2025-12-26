# Service Marketplace - Codebase Analysis

**Date:** December 2025  
**Foundation:** MERN Marketplace 2.0  
**Purpose:** Complete codebase mapping for transformation

---

## Executive Summary

This document provides a comprehensive analysis of the MERN Marketplace 2.0 codebase to guide the transformation to Service Marketplace 1.0.

**Total Files to Transform:** ~50+ files  
**Primary Transformations:** Product → Service, Shop → Seller

---

## Backend Structure

### Models (server/models/)

**Current Models:**
1. `product.model.js` → **Transform to** `service.model.js` ✅ Created
2. `shop.model.js` → **Integrate into** `user.model.js`
3. `user.model.js` → **Add seller profile fields**
4. `order.model.js` → **Update for services**
5. `auction.model.js` → **Keep or adapt for service bidding**

**Model Relationships:**
```
User (seller) → Service (one-to-many)
User (buyer) → Order (one-to-many)
Service → Order (one-to-many)
Order → Service (many-to-one)
```

### Controllers (server/controllers/)

**Current Controllers:**
1. `product.controller.js` → `service.controller.js`
2. `shop.controller.js` → `seller.controller.js`
3. `order.controller.js` → Update for services
4. `user.controller.js` → Add seller profile methods
5. `auth.controller.js` → Keep as-is
6. `auction.controller.js` → Keep or adapt
7. `bidding.controller.js` → Keep or adapt

**Controller Methods to Update:**
- `create()` - Add service-specific fields
- `list()` - Update filters for services
- `read()` - Update service detail
- `update()` - Update service fields
- `remove()` - Keep as-is

### Routes (server/routes/)

**Current Routes:**
1. `product.routes.js` → `service.routes.js`
   - GET `/api/products` → `/api/services`
   - POST `/api/products` → `/api/services`
   - GET `/api/products/:productId` → `/api/services/:serviceId`
   - PUT `/api/products/:productId` → `/api/services/:serviceId`
   - DELETE `/api/products/:productId` → `/api/services/:serviceId`

2. `shop.routes.js` → `seller.routes.js`
   - GET `/api/shops` → `/api/sellers`
   - GET `/api/shops/:shopId` → `/api/sellers/:sellerId`
   - GET `/api/shops/:shopId/products` → `/api/sellers/:sellerId/services`

3. `order.routes.js` → Update for services
   - POST `/api/orders` - Update to accept service instead of products
   - Add: PUT `/api/orders/:orderId/status`
   - Add: PUT `/api/orders/:orderId/deliver`

4. `user.routes.js` → Add seller profile routes
   - PUT `/api/users/me/seller-profile`

---

## Frontend Structure

### Components (client/)

**Product Components (client/product/):**
- `Products.js` → `Services.js` - Service listing
- `Product.js` → `Service.js` - Service detail page
- `NewProduct.js` → `NewService.js` - Create service form
- `EditProduct.js` → `EditService.js` - Edit service form
- `DeleteProduct.js` → `DeleteService.js` - Delete confirmation
- `MyProducts.js` → `MyServices.js` - Seller's services
- `Categories.js` → Update for service categories
- `Search.js` → Update for service search
- `Suggestions.js` → Update for service suggestions
- `api-product.js` → `api-service.js` - API calls

**Shop Components (client/shop/):**
- `Shops.js` → Remove or adapt to `Sellers.js`
- `Shop.js` → `SellerProfile.js` - Seller profile page
- `NewShop.js` → Remove (integrate into user profile)
- `EditShop.js` → `EditSellerProfile.js`
- `MyShops.js` → `MyServices.js` (seller dashboard)
- `DeleteShop.js` → Remove
- `api-shop.js` → `api-seller.js`

**Other Components:**
- `cart/` → Simplify (services don't need quantity)
- `order/` → Update for service orders
- `auth/` → Keep as-is
- `user/` → Add seller profile components

### Main Router (client/MainRouter.js)

**Routes to Update:**
- `/products` → `/services`
- `/products/:productId` → `/services/:serviceId`
- `/shops` → `/sellers` or remove
- `/shops/:shopId` → `/sellers/:sellerId`
- `/shops/:shopId/products` → `/sellers/:sellerId/services`

---

## Data Flow Analysis

### Service Creation Flow

```
1. User (Seller) → NewService.js
2. Form submission → api-service.js
3. POST /api/services → service.controller.js
4. service.controller.create() → service.model.js
5. Save to MongoDB → Return service
6. Update UI → Redirect to service detail
```

### Service Purchase Flow

```
1. Buyer → Service.js (detail page)
2. Click "Order" → Checkout.js
3. Submit order → api-order.js
4. POST /api/orders → order.controller.js
5. Create order with service reference
6. Process payment → Stripe
7. Update order status → Return confirmation
```

### Search Flow

```
1. User → Search.js
2. Enter query → api-service.js
3. GET /api/services/search?q=query → service.controller.js
4. service.controller.list() with search → MongoDB query
5. Return results → Display in Services.js
```

---

## Key Transformations Required

### 1. Terminology Changes

**Backend:**
- `Product` → `Service` (all references)
- `shop` → `seller` (all references)
- `quantity` → Remove (services don't have inventory)
- `name` → `title`

**Frontend:**
- All "Product" text → "Service"
- All "Shop" text → "Seller" or "Profile"
- Update button labels
- Update form labels
- Update error messages

### 2. Model Field Changes

**Product → Service:**
- ✅ `name` → `title`
- ✅ Add `deliveryTime` (Number)
- ✅ Add `revisions` (Number)
- ✅ Add `requirements` (String)
- ✅ Add `portfolio` (Array)
- ✅ Add `tags` (Array)
- ✅ Add `status` (String: draft/active/paused)
- ✅ Add `featured` (Boolean)
- ✅ `shop` → `seller` (ObjectId ref: User)
- ❌ Remove `quantity`

**Shop → Seller Profile:**
- Integrate into User model
- Add `sellerProfile` object:
  - `bio` (String)
  - `skills` (Array)
  - `portfolio` (Array)
  - `rating` (Number)
  - `totalOrders` (Number)
  - `verified` (Boolean)

**Order Updates:**
- Change `products[]` → `service` (single ObjectId)
- Add `requirements` (String)
- Add `deliveryDeadline` (Date)
- Add `revisionsUsed` (Number)
- Update `status` enum

### 3. API Endpoint Changes

**Product Routes → Service Routes:**
```
GET    /api/products           → GET    /api/services
POST   /api/products           → POST   /api/services
GET    /api/products/:id       → GET    /api/services/:id
PUT    /api/products/:id       → PUT    /api/services/:id
DELETE /api/products/:id       → DELETE /api/services/:id
GET    /api/products/categories → GET    /api/services/categories
GET    /api/products/search    → GET    /api/services/search
```

**Shop Routes → Seller Routes:**
```
GET    /api/shops              → GET    /api/sellers
GET    /api/shops/:id          → GET    /api/sellers/:id
GET    /api/shops/:id/products → GET    /api/sellers/:id/services
```

**New Service-Specific Routes:**
```
GET    /api/services/featured
GET    /api/services/category/:category
GET    /api/services/seller/:sellerId
```

### 4. Component Updates

**Service Components:**
- Add delivery time display
- Add revisions counter
- Add requirements input
- Add portfolio gallery
- Add tags display
- Update search/filter UI

**Order Components:**
- Add requirements field
- Add delivery deadline display
- Add revision tracking
- Update status workflow

---

## Dependencies Analysis

### Current Dependencies (Outdated)

**Frontend:**
- React 16.13.1 → Update to 18.2.0
- React Router 5.1.2 → Update to 6.22.3
- Material-UI 4.9.8 → Migrate to Tailwind CSS
- react-stripe-elements 6.1.1 → Update to @stripe/react-stripe-js

**Backend:**
- Express 4.17.1 → Update to 4.18.2
- Mongoose 5.9.7 → Update to 8.2.1
- Stripe 8.38.0 → Update to latest
- Node.js 13.12.0 → Already on 22.15.0 ✅

### Update Strategy

1. **Phase 1:** Update critical security patches
2. **Phase 2:** Update major versions incrementally
3. **Phase 3:** Test after each update
4. **Phase 4:** Fix breaking changes

---

## File Count Summary

**Backend Files to Transform:**
- Models: 2 files (product, shop)
- Controllers: 2 files (product, shop)
- Routes: 2 files (product, shop)
- **Total:** ~6 core files

**Frontend Files to Transform:**
- Product components: 10 files
- Shop components: 7 files
- Router: 1 file
- **Total:** ~18 core files

**Total Core Files:** ~24 files  
**Supporting Files:** ~30+ files (imports, references, etc.)

---

## Transformation Priority

### High Priority (Week 1)
1. ✅ Create Service model
2. Update Product → Service terminology
3. Update API routes
4. Update main components

### Medium Priority (Week 2)
1. Add service-specific features
2. Update search/filter
3. Update order system

### Low Priority (Week 3-4)
1. UI/UX polish
2. Performance optimization
3. Advanced features

---

## Risk Areas

### High Risk
- **Dependency Updates:** Breaking changes possible
- **Image Handling:** Current Buffer storage may need migration
- **Cart System:** Needs simplification for services

### Medium Risk
- **Route Updates:** Many files import routes
- **Component Imports:** Many cross-references
- **State Management:** May need updates

### Low Risk
- **Authentication:** Should work as-is
- **Payment:** Stripe integration should work
- **Database:** MongoDB structure flexible

---

## Testing Strategy

### Unit Tests
- Service model validation
- Service controller methods
- Service API endpoints

### Integration Tests
- Service creation flow
- Service purchase flow
- Service search flow

### E2E Tests
- Complete service lifecycle
- Order placement
- Payment processing

---

## Next Steps

1. ✅ Service model created
2. Update product controller → service controller
3. Update product routes → service routes
4. Update frontend components
5. Test basic functionality
6. QA checkpoint

---

**Status:** Analysis Complete  
**Next:** Begin transformation implementation

