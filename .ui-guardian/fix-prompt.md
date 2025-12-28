# UI Guardian Fix Request

The following UI issues were detected in this project ('service-marketplace').
Please analyze the code and apply fixes according to the UI Guardian rules.

## Global Rules
1. Use design tokens instead of hardcoded values.
2. Ensure images have alt text.
3. Add loading states for async operations.
4. Ensure interactive elements have sufficient size and aria labels.

## Issues to Fix

### File: `tailwind.config.js`
- **[UG4] WARNING**: Hardcoded color: #93c5ae (Line 11)
  Code: `light: '#93c5ae',`
- **[UG4] WARNING**: Hardcoded color: #375a53 (Line 12)
  Code: `DEFAULT: '#375a53',`
- **[UG4] WARNING**: Hardcoded color: #2d4944 (Line 13)
  Code: `dark: '#2d4944',`
- **[UG4] WARNING**: Hardcoded color: #5f7c8b (Line 16)
  Code: `light: '#5f7c8b',`
- **[UG4] WARNING**: Hardcoded color: #455a64 (Line 17)
  Code: `DEFAULT: '#455a64',`
- **[UG4] WARNING**: Hardcoded color: #37474f (Line 18)
  Code: `dark: '#37474f',`

### File: `tests/checkout.controller.test.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `scripts/seed_dev_data.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/seller/SellerDashboard.js`
- **[UG4] INFO**: Hardcoded spacing: 1200px (Line 161)
  Code: `max-width: 1200px;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 163)
  Code: `padding: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 169)
  Code: `margin-bottom: 24px;`
- **[UG4] WARNING**: Hardcoded color: #111827 (Line 173)
  Code: `color: #111827;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 176)
  Code: `padding: 12px 24px;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 176)
  Code: `padding: 12px 24px;`
- **[UG4] WARNING**: Hardcoded color: #4f46e5 (Line 177)
  Code: `background: #4f46e5;`
- **[UG4] WARNING**: Hardcoded color: #4338ca (Line 185)
  Code: `background: #4338ca;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 190)
  Code: `gap: 16px;`
- **[UG4] INFO**: Hardcoded spacing: 32px (Line 191)
  Code: `margin-bottom: 32px;`
- **[UG4] INFO**: Hardcoded spacing: 20px (Line 195)
  Code: `padding: 20px;`
- **[UG4] WARNING**: Hardcoded color: rgba(0, 0, 0, 0.08) (Line 197)
  Code: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 201)
  Code: `margin-bottom: 8px;`
- **[UG4] WARNING**: Hardcoded color: #111827 (Line 206)
  Code: `color: #111827;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 210)
  Code: `color: #6b7280;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 214)
  Code: `padding: 24px;`
- **[UG4] WARNING**: Hardcoded color: rgba(0, 0, 0, 0.08) (Line 216)
  Code: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 217)
  Code: `margin-bottom: 24px;`
- **[UG4] WARNING**: Hardcoded color: #111827 (Line 221)
  Code: `color: #111827;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 222)
  Code: `margin-bottom: 16px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 230)
  Code: `padding: 12px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 232)
  Code: `border-bottom: 1px solid #e5e7eb;`
- **[UG4] WARNING**: Hardcoded color: #374151 (Line 236)
  Code: `color: #374151;`
- **[UG4] WARNING**: Hardcoded color: #f9fafb (Line 237)
  Code: `background: #f9fafb;`
- **[UG4] INFO**: Hardcoded spacing: 4px (Line 240)
  Code: `padding: 4px 8px;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 240)
  Code: `padding: 4px 8px;`
- **[UG4] WARNING**: Hardcoded color: #d1fae5 (Line 247)
  Code: `background: #d1fae5;`
- **[UG4] WARNING**: Hardcoded color: #065f46 (Line 248)
  Code: `color: #065f46;`
- **[UG4] WARNING**: Hardcoded color: #fef3c7 (Line 252)
  Code: `background: #fef3c7;`
- **[UG4] WARNING**: Hardcoded color: #92400e (Line 253)
  Code: `color: #92400e;`
- **[UG4] WARNING**: Hardcoded color: #f3f4f6 (Line 258)
  Code: `background: #f3f4f6;`
- **[UG4] WARNING**: Hardcoded color: #4b5563 (Line 259)
  Code: `color: #4b5563;`
- **[UG4] INFO**: Hardcoded spacing: 6px (Line 262)
  Code: `padding: 6px 12px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 262)
  Code: `padding: 6px 12px;`
- **[UG4] WARNING**: Hardcoded color: #f3f4f6 (Line 263)
  Code: `background: #f3f4f6;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 269)
  Code: `background: #e5e7eb;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 272)
  Code: `color: #6b7280;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 274)
  Code: `padding: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 48px (Line 278)
  Code: `padding: 48px;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 279)
  Code: `color: #6b7280;`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 146)
  Code: `onClick={() => navigate(`/seller/service/edit/${service._id}`)}`

### File: `client/order/api-order.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/core/Menu.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 78)
  Code: `onClick={() => { auth.clearJWT(() => navigate('/')) }}`

### File: `client/auth/Signin.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 79)
  Code: `onClick={clickSubmit}`

### File: `client/auth/api-auth.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/user/DeleteUser.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 59)
  Code: `onClick={handleRequestClose}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 65)
  Code: `onClick={deleteAccount}`

### File: `client/user/Signup.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 97)
  Code: `onClick={clickSubmit}`

### File: `client/user/api-user.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/user/StripeConnect.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 75)
  Code: `onClick={() => navigate(`/user/${jwt.user._id}`)}`

### File: `client/user/EditProfile.js`
- **[UG4] INFO**: Hardcoded spacing: 2px (Line 138)
  Code: `<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>`
- **[UG4] INFO**: Hardcoded spacing: 2px (Line 138)
  Code: `<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 184)
  Code: `onClick={clickSubmit}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 190)
  Code: `onClick={() => setValues({ ...values, redirectToProfile: true })}`

### File: `client/checkout/CheckoutFailure.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 25)
  Code: `onClick={() => navigate(-1)}`

### File: `client/checkout/CheckoutSuccess.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 32)
  Code: `onClick={() => navigate('/myorders')}`

### File: `client/checkout/StripeCheckout.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/review/ReviewComponents.js`
- **[UG4] INFO**: Hardcoded spacing: 2px (Line 25)
  Code: `gap: 2px;`
- **[UG4] WARNING**: Hardcoded color: #d1d5db (Line 28)
  Code: `color: #d1d5db;`
- **[UG4] WARNING**: Hardcoded color: #fbbf24 (Line 36)
  Code: `color: #fbbf24;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 121)
  Code: `padding: 24px;`
- **[UG4] WARNING**: Hardcoded color: #fff (Line 122)
  Code: `background: #fff;`
- **[UG4] WARNING**: Hardcoded color: rgba(0, 0, 0, 0.1) (Line 124)
  Code: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 127)
  Code: `margin-bottom: 16px;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 131)
  Code: `margin-bottom: 8px;`
- **[UG4] WARNING**: Hardcoded color: #374151 (Line 133)
  Code: `color: #374151;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 137)
  Code: `padding: 12px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 138)
  Code: `border: 1px solid #e5e7eb;`
- **[UG4] WARNING**: Hardcoded color: #9ca3af (Line 145)
  Code: `color: #9ca3af;`
- **[UG4] WARNING**: Hardcoded color: #dc2626 (Line 150)
  Code: `color: #dc2626;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 152)
  Code: `margin-bottom: 16px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 156)
  Code: `padding: 12px;`
- **[UG4] WARNING**: Hardcoded color: #4f46e5 (Line 157)
  Code: `background: #4f46e5;`
- **[UG4] WARNING**: Hardcoded color: #9ca3af (Line 165)
  Code: `background: #9ca3af;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 248)
  Code: `padding: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 251)
  Code: `margin-bottom: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 252)
  Code: `padding-bottom: 16px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 253)
  Code: `border-bottom: 1px solid #e5e7eb;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 258)
  Code: `gap: 12px;`
- **[UG4] WARNING**: Hardcoded color: #111827 (Line 263)
  Code: `color: #111827;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 266)
  Code: `color: #6b7280;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 269)
  Code: `color: #6b7280;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 271)
  Code: `padding: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 274)
  Code: `padding: 16px 0;`
- **[UG4] WARNING**: Hardcoded color: #f3f4f6 (Line 275)
  Code: `border-bottom: 1px solid #f3f4f6;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 280)
  Code: `gap: 12px;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 281)
  Code: `margin-bottom: 8px;`
- **[UG4] WARNING**: Hardcoded color: #111827 (Line 285)
  Code: `color: #111827;`
- **[UG4] WARNING**: Hardcoded color: #374151 (Line 288)
  Code: `color: #374151;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 289)
  Code: `margin-bottom: 8px;`
- **[UG4] WARNING**: Hardcoded color: #f9fafb (Line 292)
  Code: `background: #f9fafb;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 293)
  Code: `padding: 12px;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 295)
  Code: `margin-top: 8px;`
- **[UG4] INFO**: Hardcoded spacing: 4px (Line 298)
  Code: `margin: 4px 0 0 0;`
- **[UG4] WARNING**: Hardcoded color: #4b5563 (Line 299)
  Code: `color: #4b5563;`
- **[UG4] WARNING**: Hardcoded color: #9ca3af (Line 303)
  Code: `color: #9ca3af;`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 307)
  Code: `padding: 24px;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 308)
  Code: `color: #6b7280;`
- **[UG5] INFO**: Inline style detected - consider using CSS classes (Line 17)
  Code: `style={{ fontSize: size }}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 14)
  Code: `onClick={() => !readonly && onRatingChange && onRatingChange(star)}`

### File: `client/service/api-service.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `client/service/SearchFilters.js`
- **[UG4] INFO**: Hardcoded spacing: 20px (Line 120)
  Code: `padding: 20px;`
- **[UG4] WARNING**: Hardcoded color: rgba(0, 0, 0, 0.08) (Line 122)
  Code: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **[UG4] INFO**: Hardcoded spacing: 24px (Line 123)
  Code: `margin-bottom: 24px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 126)
  Code: `margin-bottom: 12px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 130)
  Code: `padding: 12px 16px;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 130)
  Code: `padding: 12px 16px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 131)
  Code: `border: 1px solid #e5e7eb;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 137)
  Code: `padding: 12px 16px;`
- **[UG4] INFO**: Hardcoded spacing: 16px (Line 137)
  Code: `padding: 12px 16px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 138)
  Code: `border: 1px solid #e5e7eb;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 146)
  Code: `gap: 8px;`
- **[UG4] INFO**: Hardcoded spacing: 12px (Line 150)
  Code: `padding: 12px;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 151)
  Code: `border: 1px solid #e5e7eb;`
- **[UG4] WARNING**: Hardcoded color: #6b7280 (Line 156)
  Code: `color: #6b7280;`
- **[UG4] INFO**: Hardcoded spacing: 10px (Line 160)
  Code: `padding: 10px;`
- **[UG4] WARNING**: Hardcoded color: #f3f4f6 (Line 161)
  Code: `background: #f3f4f6;`
- **[UG4] WARNING**: Hardcoded color: #4b5563 (Line 166)
  Code: `color: #4b5563;`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 169)
  Code: `background: #e5e7eb;`

### File: `client/service/NewService.js`
- **[UG4] INFO**: Hardcoded spacing: 25rem (Line 116)
  Code: `className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"`
- **[UG4] INFO**: Hardcoded spacing: 25rem (Line 187)
  Code: `className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 206)
  Code: `onClick={clickSubmit}`

### File: `client/service/DeleteService.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 58)
  Code: `onClick={handleRequestClose}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 64)
  Code: `onClick={deleteService}`

### File: `client/service/EditService.js`
- **[UG4] INFO**: Hardcoded spacing: 25rem (Line 144)
  Code: `className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"`
- **[UG4] INFO**: Hardcoded spacing: 25rem (Line 215)
  Code: `className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 234)
  Code: `onClick={clickSubmit}`

### File: `client/service/OrderService.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 38)
  Code: `onClick={handleClickOpen}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 52)
  Code: `onClick={handleClose}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 138)
  Code: `onClick={handleClose}`

### File: `client/service/Search.js`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 53)
  Code: `onClick={searchServices}`
- **[UG7] WARNING**: onClick on non-interactive element - add role and keyboard support (Line 64)
  Code: `onClick={() => setValues({ ...values, searched: false, results: [] })}`

### File: `server/models/user.model.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/order.controller.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/auth.controller.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/service.controller.js`
- **[UG4] WARNING**: Hardcoded color: #f3f4f6 (Line 97)
  Code: `<rect fill="#f3f4f6" width="400" height="300"/>`
- **[UG4] WARNING**: Hardcoded color: #e5e7eb (Line 98)
  Code: `<rect fill="#e5e7eb" x="150" y="100" width="100" height="80" rx="8"/>`
- **[UG4] WARNING**: Hardcoded color: #d1d5db (Line 99)
  Code: `<circle fill="#d1d5db" cx="180" cy="130" r="15"/>`
- **[UG4] WARNING**: Hardcoded color: #d1d5db (Line 100)
  Code: `<polygon fill="#d1d5db" points="160,170 200,140 240,170"/>`
- **[UG4] WARNING**: Hardcoded color: #9ca3af (Line 101)
  Code: `<text x="200" y="210" text-anchor="middle" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="14">No Image</text>`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/checkout.controller.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/review.controller.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `server/controllers/user.controller.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `archive/foundation/server/config/db.js`
- **[UG9] WARNING**: Async operations detected but no loading state found

### File: `archive/foundation/client/src/index.css`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 47)
  Code: `width: 8px;`
- **[UG4] INFO**: Hardcoded spacing: 8px (Line 48)
  Code: `height: 8px;`
