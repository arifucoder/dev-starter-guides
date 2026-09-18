# Static Methods (Mongoose)

> Instance method-এর মতোই, কিন্তু আমরা সাধারণত **static method-ই বেশি ব্যবহার করি** — তাই এটা গুরুত্বপূর্ণ।

---

## Static Method কী?

Static method হলো Instance method-এর মতোই একটা custom function, কিন্তু পার্থক্য হলো এটা document-level না, বরং সরাসরি **Model**-এর উপর কাজ করে (যেমন `User.hashPassword()`), আর এটা Mongoose-এর built-in method-গুলোর (যেমন `User.create()`, `User.find()`) মতোই এক ধাপেই কাজ করে ফেলে — আলাদা করে `.save()` করা লাগে না।

### তুলনা

```ts
// Built-in static method (এক ধাপেই কাজ হয়ে যায়)
const user = await User.create(body);
```

```ts
// Built-in instance method (২ ধাপ লাগে — নতুন document বানানো, তারপর save করা)
const user = new User(body);
await user.save();
```

---

## Example: Static Method দিয়ে Password Hashing

আগে instance method দিয়ে password hash করেছিলাম, এবার একই কাজ **static method** দিয়ে করব।

### `user.interface.ts`

```ts
import { Model } from "mongoose";

export interface UserStaticMethods extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}
```

`Model<IUser>`-কে **extend** করা হয়েছে, কারণ `UserStaticMethods`-কে পরে পুরো Model-এর জায়গায় (built-in `find`, `create` ইত্যাদিসহ) ব্যবহার করা হবে — শুধু নতুন static function-টাই আলাদা যোগ হচ্ছে।

> **⚠️ ছোট টাইপো:** তোমার লেখায় `extands` লেখা হয়েছিল, সঠিক বানান হলো **`extends`**।

### `user.model.ts`

```ts
import { Schema, model } from "mongoose";
import { IUser, UserInstanceMethods, UserStaticMethods } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, UserStaticMethods, UserInstanceMethods>({
  // ...schema fields (email, password, role, address ইত্যাদি)
});

userSchema.static("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

export const User = model<IUser, UserStaticMethods>("User", userSchema);
```

> **⚠️ সংশোধন:** তোমার লেখায় ছিল —
> ```ts
> export const User<IUser, UserStaticMethods> = model("User", userSchema);
> ```
> এভাবে variable-এর নামের পরে সরাসরি generic (`<...>`) বসানো যায় না — এটা invalid syntax। generic টাইপ বসাতে হয় **`model()`** function-এর সাথে, variable-এর সাথে না:
> ```ts
> export const User = model<IUser, UserStaticMethods>("User", userSchema);
> ```

### `Schema` generic-এর ক্রম (Order)

```ts
new Schema<IUser, UserStaticMethods, UserInstanceMethods>({...})
```

| ক্রম | Generic | কাজ |
|---|---|---|
| ১ম | `IUser` | document-এর data shape |
| ২য় | `UserStaticMethods` | Model-level (static) method-এর টাইপ |
| ৩য় | `UserInstanceMethods` | Document-level (instance) method-এর টাইপ |

---

## Controller-এ ব্যবহার

```ts
usersRoutes.post("/create-user", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // built-in না, এটা আমাদের নিজেদের বানানো custom static method
    const password = await User.hashPassword(body.password);
    console.log(password, "static");

    body.password = password;

    const user = await User.create(body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      error,
    });
  }
});
```

লক্ষ্য করো — এখানে `new User()` + `.save()` করা লাগেনি, সরাসরি `User.hashPassword()` (static) কল করে, তারপর `User.create()` (built-in static) দিয়েই কাজ শেষ। এটাই static method-কে instance method-এর চেয়ে বেশি সহজ ও popular করে তোলে।

---

## Instance vs Static — কখন কোনটা

| | Instance Method | Static Method |
|---|---|---|
| কার উপর কাজ করে | নির্দিষ্ট document (`user.method()`) | পুরো Model (`User.method()`) |
| ব্যবহার | `new Model()` করার পর, `this` দিয়ে ওই document-এর data লাগে এমন কাজে | Document আগে থেকে না থাকলেও চলে এমন কাজে (যেমন password hash করা, কোনো field validate/check করা) |
| Save লাগে? | সাধারণত হ্যাঁ (`.save()`) | না, `.create()`-এর মতো এক ধাপেই সম্পন্ন হয় |
| জনপ্রিয়তা | কম ব্যবহৃত | বেশি ব্যবহৃত (default choice) |