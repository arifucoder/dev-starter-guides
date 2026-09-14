# API Endpoints

Base URL: `http://localhost:5000/api/v1`

---

## Auth Endpoints

### 1. Custom Login
`POST /auth/login`

**Body:**
```json
{ "email": "a@gmail.com", "password": "12345" }
```

### 2. Logout
`POST /auth/logout`

### 3. Get Refresh Token
`POST /auth/refresh-token`

### 4. Set Password
`POST /auth/set-password`

**Body:**
```json
{ "password": "newpass" }
```

### 5. Forgot Password
`POST /auth/forgot-password`

**Body:**
```json
{ "email": "mehediimun@gmail.com" }
```

### 6. Reset Password
`POST /auth/reset-password`

**Body:**
```json
{ "userId": "user-id", "token": "token", "newPassword": "new-password" }
```

---

## OTP Endpoints

### 1. Send OTP
`POST /otp/send`

**Body:**
```json
{ "email": "mirhussainmurtaza@gmail.com", "name": "Mir" }
```

### 2. Verify OTP
`POST /otp/verify`

**Body:**
```json
{ "email": "mirhussainmurtaza@gmail.com", "otp": "993501" }
```

---

## Admin Endpoints

### 1. Get All Users
`GET /user`

**Query params:** `role=GUIDE`, `isVerified=false`

### 2. Get All Guides
`GET /guide`

**Query params:** `status=APPROVED`, `user=user-id`

### 3. Approve Guide
`POST /guide/approve/:guideId`

**Body:**
```json
{ "status": "APPROVED" }
```

---

## User Endpoints

### 1. User Registration
`POST /user/register`

**Form data:** User details and file

### 2. Get Current User
`GET /user/me`

### 3. Update User
`PATCH /user/:id`

**Body:**
```json
{ "name": "Mir", "password": "12345" }
```

---

## Tour Endpoints

### 1. Create Tour Type
`POST /tour/create-tour-type`

**Body:**
```json
{ "name": "hello type" }
```

### 2. Get All Tour Types
`GET /tour/tour-types`

### 3. Update Tour Type by ID
`PATCH /tour/tour-types/:id`

**Body:**
```json
{ "name": "new name" }
```

### 4. Get Tour by ID
`GET /tour/tour-types/:id`

### 5. Create Tour
`POST /tour/create`

**Form data:** Tour details and files

### 6. Get All Tours
`GET /tour`

### 7. Update Tour by ID
`PATCH /tour/:id`

**Form data:** Tour details and files

### 8. Delete Tour by ID
`DELETE /tour/:id`

---

## Booking Endpoints

### 1. Create Booking
`POST /booking`

**Body:**
```json
{ "tourId": "tour-id", "guestCount": 2, "phone": "01611846448" }
```

### 2. Get My Bookings
`GET /booking/my-bookings`

### 3. Get Booking by ID
`GET /booking/:bookingId`

### 4. Get All Bookings
`GET /booking`

**Query params:** `status=COMPLETED`

### 5. Update Booking Status
`PATCH /booking/:bookingId/status`

**Body:**
```json
{ "status": "COMPLETED" }
```

---

## Payment Endpoints

### 1. Initialize Payment
`POST /payment/init-payment/:paymentId`

### 2. Verify Payment
`GET /payment/ipn`

### 3. Payment Stats
`GET /payment/stats`

---

## Stats Endpoints

### 1. Booking Stats
`GET /stats/booking`

### 2. Payment Stats
`GET /stats/payment`

### 3. User Stats
`GET /stats/user`

### 4. Tour Stats
`GET /stats/tour`