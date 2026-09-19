# Query Middleware & Post Hook (Mongoose)

---

## সমস্যাটা কী?

ধরা যাক, একজন User-এর অনেকগুলো Notes আছে। এখন সেই User-কে delete করলে, তার সাথে সাথে তার সব Notes-ও delete হয়ে যাওয়া উচিত। এই কাজটা করার জন্য আমরা একটা **post hook** বানাব।

---

## Query Middleware কী?

`findOneAndDelete`, `findOneAndUpdate`, `find`, `findOne`, `updateOne`, `deleteOne`, `deleteMany` — এই ধরনের **Query-related** operation-এর সময় যেই middleware কাজ করে, সেটাই **Query Middleware**। এখানে `this` একটা document না, বরং **query**-কে refer করে।

Post hook হলো — কোনো operation **সম্পন্ন হওয়ার পর** যেই function চলে।

---

## Post Hook দিয়ে Example

```ts
userSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    console.log(doc);

    await Note.deleteMany({ user: doc._id });
  }
  next();
});
```

- `"findOneAndDelete"` operation টা **সম্পন্ন হওয়ার পর** এই function-টা চলবে।
- এখানে `doc` হলো যেই document-টা delete করা হলো, সেটা।
- `doc` থাকলে (মানে সত্যিই কিছু delete হয়ে থাকলে), সেই `doc._id`-এর সাথে match করা সব Notes `Note.deleteMany()` দিয়ে delete করে দেওয়া হচ্ছে।

---

## Controller

```ts
usersRoutes.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOneAndDelete({ _id: userId });

    res.status(201).json({
      success: true,
      message: "User Deleted successfully",
      user,
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

> **তোমার প্রশ্ন ছিল — `findByIdAndDelete` line-টা কেন comment করা হলো?**
> আসলে এটা comment করার দরকার ছিল না — `findByIdAndDelete()` ভেতরে ভেতরে **`findOneAndDelete()`-কেই call করে**। তাই `User.findByIdAndDelete(userId)` লিখলেও একই post hook (`post("findOneAndDelete")`) ঠিকই চলবে। দুটোই সমানভাবে কাজ করবে, `findOneAndDelete({ _id: userId })` ব্যবহার করাটা শুধু style-এর পার্থক্য, প্রয়োজনীয়তা না।

---

## ⚠️ সংশোধন: `next()` নিয়ে

তুমি লিখেছিলে — **"প্রত্যেকটা middleware-এর শেষে অবশ্যই `next()` call করতে হবে, নাহলে আটকে থাকার risk থাকে।"**

এটা পুরোপুরি ঠিক না। নিয়মটা আসলে এরকম:

- Function-এ যদি `next` কে **parameter হিসেবে declare করা হয়** (যেমন উপরের `function (doc, next)`), তাহলে হ্যাঁ, শেষে অবশ্যই `next()` call করতে হবে — নাহলে middleware আটকে থাকবে।
- কিন্তু `async function` লিখলে, `next` parameter **না নিয়েও** কাজ চালানো যায় — তখন `next()` call করার দরকার নেই, Mongoose নিজে থেকেই বুঝে নেয় function শেষ হলে (promise resolve হলে) পরের ধাপে যেতে হবে:

```ts
userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Note.deleteMany({ user: doc._id });
  }
});
```

**সংক্ষেপে:** `next` কে parameter হিসেবে নিলে সেটা call করতেই হবে; না নিলে (শুধু `async function` ব্যবহার করলে) `next()` call করার দরকার নেই।