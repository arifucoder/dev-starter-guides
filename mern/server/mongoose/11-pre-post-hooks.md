# Middleware (Pre & Post Hooks) — Mongoose

---

## Middleware কী?

Mongoose-এ middleware কাজ করে মূলত **২টা সময়** — **`pre`** আর **`post`**। তাই middleware-কে বলা হয় **`pre`/`post` hooks**।

**Hook** মানে এমন একটা function, যেটা কোনো কাজের **আগে (pre)** অথবা **পরে (post)** নিজে থেকে চলতে পারে।

এটা হলো middleware **কখন** কাজ করে সেই ব্যাপার। এবার দেখব **কোথায়** (কোন ধরনের operation-এ) কাজ করে।

---

## Middleware-এর ৪টা ধরন

Mongoose-এ ৪ ধরনের middleware আছে:

### ১. Document Middleware
এটা কাজ করে যখন আমরা `validate`, `save`, `updateOne`, `deleteOne`, `init` — এসব করি (মানে document instance-এর উপর করা operation)।

### ২. Query Middleware
`find`, `findOne`, `findOneAndUpdate` — এই ধরনের **find-related** operation-এর সময় কাজ করে।

### ৩. Aggregate Middleware
আমরা যখন `aggregate()` চালাই, তখন এটা কাজ করে।

### ৪. Model Middleware
মূলত `insertMany()`-এর সময় কাজ করে (একসাথে অনেকগুলো document insert করার সময়)।

> **⚠️ সংশোধন:** তোমার লেখায় "Model Middleware"-এর কথা আলাদা করে বলা হয়নি, বরং ভুলবশত "Query Middleware" অংশটা দুইবার লেখা হয়ে গিয়েছিল। উপরে সেটা ঠিক করে ৪টা ধরনই আলাদাভাবে দেখানো হলো।

---

## Example: Pre Hook দিয়ে Password Hashing

আগে static/instance method দিয়ে password hash করেছিলাম, এবার সেই একই কাজ **`pre` hook** দিয়ে করব — এটাই সবচেয়ে সহজ এবং clean উপায়।

### `user.model.ts`

```ts
userSchema.pre("save", async function () {
  console.log("inside pre save hook");
  this.password = await bcrypt.hash(this.password, 10);
});
```

`"save"` মানে — document **save হওয়ার ঠিক আগে** এই function-টা চলবে। `this` দিয়ে সরাসরি ওই document-এর data (`this.password`) access করা যাচ্ছে।

এখন Controller-এ আলাদা করে static বা instance method call করে password hash করা লাগবে না — শুধু `Note.create()` বা `user.save()` করলেই hook automatic কাজ করে দেবে।

```ts
usersRoutes.post("/create-user", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // password hashing এখন pre hook নিজে থেকেই করে দিচ্ছে
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

---

## ⚠️ গুরুত্বপূর্ণ Extra Tip

উপরের কোডে একটা সমস্যা আছে — `pre("save")` প্রতিবার document save হওয়ার সময় চলে, তাই user যদি শুধু তার `firstName` বা অন্য কোনো field **update** করে (password change না করেও), তাহলেও password টা আবার নতুন করে hash হয়ে যাবে — যেটা ভুল password তৈরি করে ফেলবে।

এটা এড়াতে `this.isModified("password")` দিয়ে check করে নেওয়া উচিত, password field আসলেই change হয়েছে কিনা:

```ts
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
```

এতে করে শুধু password নতুন করে সেট বা পরিবর্তন হলেই hashing চলবে, অন্যথায় আগের hash করা password-ই থেকে যাবে।


---

## Developer-রা যেসব কাজে বেশি Pre Hook ব্যবহার করে

1. **Password hash করা** — user create/update করার আগে plain password-কে hash করে ফেলা (`pre("save")`)।
2. **Slug তৈরি করা** — কোনো blog/product title থেকে save হওয়ার আগে automatic `slug` field বানিয়ে দেওয়া (যেমন `"Hello World"` → `"hello-world"`)।
3. **Default/computed field বসানো** — save হওয়ার আগে কোনো field-এর মান নিজে থেকে হিসাব করে বসানো, যেমন `fullName = firstName + " " + lastName`।
4. **Data sanitize/normalize করা** — save করার আগে email lowercase করা, extra space trim করা ইত্যাদি।
5. **Duplicate/অবৈধ data আটকানো** — save হওয়ার আগে extra custom check চালিয়ে প্রয়োজনে error throw করা।

---

## Developer-রা যেসব কাজে বেশি Post Hook ব্যবহার করে

1. **User delete করলে তার সাথে সাথে তার সব Notes delete করে দেওয়া** — (`post("findOneAndDelete")`)।
2. **Order create হওয়ার পর confirmation email/SMS পাঠানো** — payment/order save হয়ে যাওয়ার পর notification পাঠানো।
3. **Logging/Audit trail রাখা** — কোনো data create, update বা delete হওয়ার পর সেটার log আলাদা একটা collection-এ রেখে দেওয়া।
4. **Cache/Counter update করা** — যেমন কোনো post like/comment হলে post-এর সাথে যুক্ত অন্য collection-এর count আপডেট করা।
5. **Related collection clean-up করা** — কোনো main document delete হলে তার সাথে সম্পর্কিত (referenced) সব document ও data মুছে ফেলা (উপরের User–Notes example-টাই এর একটা বাস্তব example)।

---

## Middleware-এর ৪টা ধরন কোথায় বেশি ব্যবহার হয়

1. **Document Middleware** → `save`-এর সময় password hash করা, বা `save`-এর আগে slug/fullName-এর মতো computed field বসানো।
2. **Query Middleware** → user delete করলে (`findOneAndDelete`) তার সাথে সম্পর্কিত notes/orders delete করা, বা `find`-এর আগে soft-deleted (`isDeleted: true`) data বাদ দিয়ে query চালানো।
3. **Aggregate Middleware** → aggregation চালানোর আগে বা পরে filter/log যোগ করা, যেমন সবসময় `status: "active"` data-ই aggregate-এ ধরা।
4. **Model Middleware** → `insertMany()` দিয়ে একসাথে অনেক data insert করার আগে/পরে প্রতিটার উপর কোনো common validation বা transformation চালানো।