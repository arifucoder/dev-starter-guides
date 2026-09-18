# Zod Validation

> **Reference:** [https://www.npmjs.com/package/zod](https://www.npmjs.com/package/zod)

---

## Mongoose Validation-এর সমস্যা

Mongoose-এর built-in বা custom validation-এ কিছু সমস্যা আছে। যেমন — কোনো **string** field-এ যদি আমরা **number** পাঠাই, তাহলে Mongoose সেটাকে error না দিয়ে auto-ভাবে **stringify** করে (string-এ রূপান্তর করে) database-এ add করে ফেলে। অর্থাৎ ভুল type-এর data দিলেও চুপচাপ ঢুকে যায় — strict validation হয় না।

এই কারণেই **Zod** এত জনপ্রিয়।

---

## Zod কী?

Zod হলো একটা **schema validation library**। এটা একটা schema define করে সেই অনুযায়ী data validate করে।

- Zod-এরও নিজস্ব data type আছে — অনেকটা Mongoose আর TypeScript-এর মতোই।
- Zod দুইটা কাজ করে:
  - **Validate** → schema অনুযায়ী data সঠিকভাবে এসেছে কিনা তা check করা।
  - **Sanitize** → schema-তে যেসব field নেই, কিন্তু user সেগুলো post করেছে — সেই extra field গুলোকে বাদ দিয়ে দেওয়া (by default)।

---

## Install করা

```bash
npm install zod
```

---

## Zod Schema বানানো

```ts
import { z } from "zod";

const CreateUserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.string().optional(),
});
```

Zod schema-তে **by default সব field required**। কোনো field **optional** করতে চাইলে তার শেষে `.optional()` লিখে দিতে হয় — যেমন উপরে `role`।

---

## Controller-এ ব্যবহার করা

```ts
usersRoutes.post('/create-user', async (req: Request, res: Response) => {
  try {
    const body = await CreateUserZodSchema.parseAsync(req.body);

    console.log(body, "zod body");

    const user = await User.create(body)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error
    });
  }
});
```

`.parseAsync(req.body)` দিয়ে incoming data validate করা হচ্ছে। data schema অনুযায়ী ঠিক থাকলে validated (এবং sanitized) data return করে, আর ভুল থাকলে **error throw** করে — যেটা `try/catch`-এ ধরে `400` status-এ পাঠানো হচ্ছে।

---

## ছোট্ট Extra Tip

- Data-তে কোনো **async validation** (যেমন: database query করে check করা) না থাকলে `.parse()` (sync version) ব্যবহার করলেই যথেষ্ট — `.parseAsync()` দরকার হয় মূলত async validation logic থাকলে।
- `.parse()`/`.parseAsync()` fail করলে সরাসরি **error throw** করে, তাই `try/catch` বাধ্যতামূলক। কিন্তু চাইলে `.safeParse()` / `.safeParseAsync()`-ও ব্যবহার করা যায় — এটা error throw না করে `{ success: boolean, data বা error }` আকারে একটা object return করে, ফলে `try/catch` ছাড়াও কাজ চালানো যায়।
- কোনো field-এর value `null` হতে পারলে `.optional()`-এর বদলে/সাথে `.nullable()` ব্যবহার করতে হয়, কারণ `.optional()` শুধু field **না থাকা**-কে allow করে, `null` value-কে না।