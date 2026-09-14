# Data Modeling

## Entities and Their Attributes

### 1. User
| Attribute | Type |
|---|---|
| name | String |
| email | String (unique) |
| password | String |
| role | String (e.g., Admin, User) |
| phone | String |
| picture | String |
| address | String |
| isDeleted | Boolean |
| isActive | String (e.g., Active, Inactive) |
| isVerified | Boolean |
| auths | Array of auth providers (e.g., Google, Facebook) |

### 2. Tour
| Attribute | Type |
|---|---|
| slug | String (unique) |
| title | String |
| description | String |
| images | Array of Strings |
| location | String |
| costFrom | Number |
| startDate | Date |
| endDate | Date |
| tourType | ObjectId (references TourType) |
| included | Array of Strings (e.g., Meals, Transport) |
| excluded | Array of Strings (e.g., Insurance) |
| amenities | Array of Strings |
| tourPlan | Array of Strings (daily itinerary) |

### 3. TourType
| Attribute | Type |
|---|---|
| name | String (e.g., Adventure, Leisure) |

### 4. Booking
| Attribute | Type |
|---|---|
| user | ObjectId (references User) |
| tour | ObjectId (references Tour) |
| guestCount | Number |
| phone | String |
| address | String |
| status | String (e.g., Pending, Completed) |
| payment | ObjectId (references Payment) |

### 5. Payment
| Attribute | Type |
|---|---|
| booking | ObjectId (references Booking) |
| transactionId | String (unique) |
| status | String (e.g., Paid, Unpaid, Refunded) |
| amount | Number |
| paymentGatewayData | Any |
| invoiceUrl | String |

---

## Relationships

- **User → Booking**: A user can make multiple bookings.
- **Tour → Booking**: A tour can have many bookings.
- **Tour → TourType**: A tour belongs to one type.
- **Booking → Payment**: A booking has one payment.