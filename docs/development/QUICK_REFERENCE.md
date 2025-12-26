# Service Marketplace - Quick Reference Guide

**For:** Senior Development System Architect
**Purpose:** Quick access to key information during development

---

## 🎯 Current Status

**Foundation:** MERN Marketplace 2.0 (MIT License) ✅ Cloned
**Repository:** `/Users/tommykuznets/Downloads/My Projects/service-marketplace`
**Status:** Ready for Week 1 development

---

## 📋 Key Transformations

### Terminology Changes
| Old (Product) | New (Service) |
|---------------|---------------|
| Product | Service |
| Shop | Seller/Profile |
| Inventory | N/A (remove) |
| Shipping | Delivery |

### Model Changes
- **Product Model** → **Service Model**
  - Add: `deliveryTime`, `revisions`, `requirements`, `portfolio`
  - Remove: `quantity`
  - Rename: `name` → `title`, `shop` → `seller`

- **Shop Model** → **Seller Profile** (integrate into User)
  - Add seller fields to User model
  - Remove separate Shop entity

- **Order Model** → **Service Order**
  - Change: `products[]` → `service` (single)
  - Add: `requirements`, `deliveryDeadline`, `revisionsUsed`

---

## 🗂️ File Structure

### Key Files to Modify

**Backend:**
```
server/models/
├── product.model.js     → service.model.js
├── shop.model.js        → (integrate into user.model.js)
└── order.model.js       → (update for services)

server/controllers/
├── product.controller.js → service.controller.js
├── shop.controller.js   → seller.controller.js
└── order.controller.js  → (update)

server/routes/
├── product.routes.js     → service.routes.js
└── shop.routes.js       → seller.routes.js
```

**Frontend:**
```
client/product/          → client/service/
client/shop/             → client/seller/ (or integrate)
client/cart/             → (simplify for services)
client/order/            → (update for service orders)
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev              # Dev server (Express + webpack HMR)

# Build
npm run build

# Production
npm start
```

---

## 🔑 Environment Variables

**server/.env:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/service-marketplace
JWT_SECRET=your_secret
JWT_EXPIRES_IN=30d
STRIPE_TEST_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:3000
```

**client/.env:**
Not required for Stripe. The publishable key is injected by the server into `window.STRIPE_PUBLISHABLE_KEY`.

---

## 📊 Development Roadmap Summary

### Week 1: Foundation
- Environment setup
- Codebase analysis
- Initial transformation

### Week 2: Core Features
- Service model & API
- Frontend components
- Search & filters

### Week 3: Order & Payment
- Order system
- Payment integration
- Review system

### Week 4: Polish & Launch
- Testing & bug fixes
- Documentation
- Marketplace assets

---

## 🎨 UI Framework Decision

**Decision:** Migrate from Material-UI v4 to Tailwind CSS

**Rationale:**
- More modern
- Better customization
- Smaller bundle
- Better for templates

---

## 🔄 State Management

**Decision:** React Context + React Query

- **React Context:** Auth, theme, global state
- **React Query:** Server state (services, orders)
- **Local State:** Component-specific UI state

---

## 🗄️ Database Schema

### Service Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  category: String,
  deliveryTime: Number,    // Days
  revisions: Number,
  requirements: String,
  portfolio: [String],
  tags: [String],
  seller: ObjectId,
  status: String,
  featured: Boolean
}
```

### Order Model
```javascript
{
  service: ObjectId,
  buyer: ObjectId,
  seller: ObjectId,
  requirements: String,
  deliveryDeadline: Date,
  revisionsUsed: Number,
  status: String,
  amount: Number
}
```

---

## 🔐 Security Checklist

- [ ] JWT tokens with expiration
- [ ] Password hashing (bcrypt)
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Helmet.js headers
- [ ] Stripe secure payments
- [ ] Environment variables for secrets

---

## 🧪 Testing Checklist

- [ ] User registration/login
- [ ] Service creation/editing
- [ ] Service search/filter
- [ ] Order placement
- [ ] Payment processing
- [ ] Order tracking
- [ ] Review submission
- [ ] Responsive design

---

## 📝 Documentation Files

- `SYSTEM_ARCHITECTURE.md` - Complete architecture
- `ADAPTATION_PLAN.md` - Detailed transformation plan
- `DEVELOPMENT_ROADMAP.md` - Week-by-week guide
- `FOUNDATION_DECISION.md` - Why MERN Marketplace
- `MERN_MARKETPLACE_REVIEW.md` - License verification

---

## 🚨 Common Issues & Solutions

### Issue: Dependencies outdated
**Solution:** Update incrementally, test after each update

### Issue: Breaking changes in React Router
**Solution:** Follow migration guide from v5 to v6

### Issue: Material-UI components
**Solution:** Migrate to Tailwind CSS or update to MUI v5

### Issue: MongoDB connection
**Solution:** Check MONGODB_URI, ensure MongoDB is running

---

## 📞 Quick Links

- **Repository:** `/Users/tommykuznets/Downloads/My Projects/service-marketplace`
- **Foundation:** https://github.com/shamahoque/mern-marketplace
- **Live Demo:** http://marketplace2.mernbook.com/
- **License:** MIT (see LICENSE.md)

---

## ✅ Daily Checklist

**Before starting work:**
- [ ] Pull latest changes
- [ ] Check current branch
- [ ] Review today's tasks from roadmap

**During development:**
- [ ] Test changes frequently
- [ ] Commit working changes
- [ ] Update documentation if needed

**End of day:**
- [ ] Commit all changes
- [ ] Update progress in roadmap
- [ ] Note any blockers

---

**Last Updated:** December 2025
**Status:** Ready for Week 1 Development

