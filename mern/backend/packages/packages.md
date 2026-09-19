# Project Packages

এই backend project-এ যেসব npm package ব্যবহার করা হয়েছে/হবে তার তালিকা নিচে দেওয়া হলো — `dependencies` আর `devDependencies` আলাদা টেবিলে ভাগ করে দেখানো হলো।

---

## `dependencies` (Production-এ লাগবে)

| Package Name | Description |
|---|---|
| express | Node.js-এ server ও API বানানোর জন্য ব্যবহৃত সবচেয়ে জনপ্রিয় web framework।<br>https://www.npmjs.com/package/express |
| mongoose | MongoDB-এর সাথে connect হয়ে schema/model দিয়ে data structure, validation ও CRUD operation করার জন্য ব্যবহৃত ODM লাইব্রেরি।<br>https://www.npmjs.com/package/mongoose |
| mongodb | MongoDB database-এর সাথে সরাসরি connect হওয়ার জন্য ব্যবহৃত official driver (Mongoose ভেতরে ভেতরে এটাই ব্যবহার করে)।<br>https://www.npmjs.com/package/mongodb |
| zod | Schema define করে data validate ও sanitize করার জন্য ব্যবহৃত TypeScript-friendly validation লাইব্রেরি।<br>https://www.npmjs.com/package/zod |
| bcrypt | Password hash করে নিরাপদে store করার জন্য ব্যবহৃত লাইব্রেরি।<br>https://www.npmjs.com/package/bcrypt |
| validator | Email, URL, phone number ইত্যাদির মতো ready-made validation function দেওয়ার জন্য ব্যবহৃত লাইব্রেরি।<br>https://www.npmjs.com/package/validator |
| cors | Frontend থেকে ভিন্ন domain/port থেকে backend-এ request পাঠানোর অনুমতি (CORS) দেওয়ার জন্য ব্যবহৃত middleware।<br>https://www.npmjs.com/package/cors |
| dotenv | `.env` ফাইলে রাখা environment variable (DB connection string, port ইত্যাদি) code-এ load করার জন্য ব্যবহৃত টুল।<br>https://www.npmjs.com/package/dotenv |

---

## `devDependencies` (শুধু Development-এ লাগবে)

| Package Name | Description |
|---|---|
| typescript | JavaScript-এর উপর static type-checking যোগ করার জন্য ব্যবহৃত language/compiler।<br>https://www.npmjs.com/package/typescript |
| tsx | TypeScript file সরাসরি (build/compile ছাড়াই) চালানো এবং file change হলে auto-restart করার জন্য ব্যবহৃত development টুল।<br>https://www.npmjs.com/package/tsx |
| @types/express | Express-এর জন্য TypeScript type definition, যাতে `Request`, `Response`-এর মতো type ঠিকভাবে চেনা যায়।<br>https://www.npmjs.com/package/@types/express |

---

## `dependencies` vs `devDependencies` — পার্থক্য কী?

- **`dependencies`** → যেসব package **production (live server)**-এও লাগবে, অর্থাৎ app আসলে **চালানোর জন্য** দরকার (যেমন `express`, `mongoose`)। App deploy করলেও এগুলো লাগবে।
- **`devDependencies`** → যেসব package শুধু **development (কোডিং করার সময়)**-এই লাগে, production-এ চালানোর সময় দরকার হয় না — যেমন `typescript` (compile করার জন্য), `tsx` (dev-এ দ্রুত রান করার জন্য), `@types/...` প্যাকেজগুলো (শুধু IDE/type-checking-এর জন্য, actual runtime-এ কোনো ভূমিকা নেই)।

Install করার সময় পার্থক্য:

```bash
npm install express         # dependencies-এ যোগ হবে
npm install -D typescript   # devDependencies-এ যোগ হবে (-D বা --save-dev)
```