# Instance Methods (Mongoose)

---

## Instance Method কী?

Instance method হলো এমন একটা function, যা একটা নির্দিষ্ট **document**-এর উপর কাজ করে, আর `this` দিয়ে সেই document-এর নিজের data access করা যায়।

### সাধারণ Method vs Instance Method

- সাধারণ method (যেমন `User.find()`) কাজ করে পুরো **Model**-এর উপর (`Model.method()`)।
- Instance method কাজ করে একটা নির্দিষ্ট **document instance**-এর উপর (`user.method()`), যেমন `new User(body)` করে বানানো `user` object-এর উপর।

---

## Example: Password Hashing

Password hash করা instance method-এর একটা খুবই common এবং practical use case।

### `user.interface.ts`

```ts
export interface IUser {
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  address: IAddress;
}

export interface UserInstanceMethods {
  hashPassword(password: string): Promise<string>;
}
```

### `user.model.ts`

```ts
import { Schema, model, Model } from "mongoose";
import { IUser, UserInstanceMethods } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, Model<IUser>, UserInstanceMethods>({
  // ...schema fields (email, password, role, address ইত্যাদি)
});

// ⚠️ এই অংশটাই আসল instance method define করার জায়গা — এটা তোমার লেখায় ছিল না
userSchema.methods.hashPassword = async function (password: string) {
  return await bcrypt.hash(password, 10);
};

export const User = model("User", userSchema);
```

> **`Schema<IUser, Model<IUser>, UserInstanceMethods>`-এ ৩টা generic কেন?**
> - **১ম (`IUser`)** → document-এর field/data shape।
> - **২য় (`Model<IUser>`)** → মূলত **static method** (`User.someStatic()`)-এর `this`-টাইপ করার জন্য দরকার হয়। শুধু instance method ব্যবহার করলে এটা plain `Model<IUser>` রাখলেই যথেষ্ট, আলাদা কিছু করার দরকার নেই।
> - **৩য় (`UserInstanceMethods`)** → এটাই আসল জায়গা, যেখান থেকে TypeScript `schema.methods.hashPassword = function(){}` এবং পরে `user.hashPassword()`-এর টাইপ বুঝতে পারে।

---

## Controller-এ ব্যবহার

```ts
usersRoutes.post("/create-user", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = new User(body);

    const password = await user.hashPassword(body.password);

    user.password = password;

    await user.save();

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

এখানে `new User(body)` দিয়ে একটা document instance বানানো হচ্ছে, তারপর `user.hashPassword(...)` কল করে সেই instance-এর উপর hashing করা হচ্ছে, এবং হ্যাশ করা password টাকে `user.password`-এ বসিয়ে `.save()` করা হচ্ছে।

---

## ছোট্ট Extra Tip

- Instance method সবসময় **regular function** (`function () {}`) দিয়ে লিখতে হয়, **arrow function** দিয়ে না। কারণ arrow function-এর নিজস্ব `this` থাকে না — এটা `this`-কে document-এর সাথে bind করতে পারে না, ফলে `this.email`-এর মতো কিছু access করা যাবে না।