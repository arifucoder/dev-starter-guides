# Mongoose শেখার নোট

## MongoDB আর Mongoose কী

MongoDB হলো **unstructured** database। মানে কোনো fixed structure নেই। ধরুন আপনার একটা e-commerce site আছে। ভুলবশত user-এর collection-এ product-এর data ঢুকিয়ে ফেললেন — MongoDB কিছু বলবে না, কারণ এটা structure force করে না। তখন frontend-এ user-এর নাম দেখাতে গেলে সেখানে product-এর data চলে আসবে, বা user-এর `dob` দেখাতে গেলে সেটা পাওয়া যাবে না (কারণ product-এ `dob` নেই)।

**Mongoose** হলো MongoDB-এর উপর একটা layer, যেটা **ODM (Object Data Modeling)**। এটা proper structure ছাড়া data insert হতে বাধা দেয়।

## Project Setup

```sh
npm init -y
git init
```

`.gitignore` add করে নিতে হবে।

TypeScript initialize:

```sh
npx tsc --init
```

`tsconfig.json`-এ:

```json
"rootDir": "./src",
"outDir": "./dist"
```

`src` folder-এর ভেতরে `server.ts` আর `app.ts` বানাতে হবে।

Package install:

```sh
npm install express mongoose dotenv
```

## MongoDB Atlas Connection

MongoDB Atlas-এ গিয়ে login → Project → Cluster0 → Connect → connection string কপি করে `.env`-এ বসাতে হবে:

```env
MONGODB_URL=mongodb+srv://<db_username>:<db_password>@cluster0.mljuhsj.mongodb.net/?appName=Cluster0
```

## app.ts আর server.ts

**app.ts**

```ts
import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to mongoose note app",
  });
});

export default app;
```

**server.ts**

```ts
import type { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";

let server: Server;

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("connected to database mongodb using mongoose");

    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

main();
```

## Schema আর Model

- **Schema** হলো blueprint। বিল্ডিং বানানোর আগে যেমন কাগজে blueprint থাকে, তেমনি schema দিয়ে আগে থেকে ঠিক করে রাখা হয় collection-এ কী ধরনের data থাকবে।
- **Model** হলো builder/constructor। এটা schema দেখে সেই অনুযায়ী document তৈরি করে। Schema অনুযায়ী data না হলে model সেটা insert হতে দেয় না।

Mongoose-এর নিজস্ব data type আছে: `String`, `Number`, `Boolean` ইত্যাদি (বড় হাতের অক্ষরে লেখা হয়, কারণ এগুলো Mongoose-এর নিজস্ব **Schema Type**)। এগুলোকে JavaScript-এর সাধারণ `string`, `number` টাইপের সাথে গুলিয়ে ফেলা যাবে না।

```ts
import { Schema, model } from "mongoose";

const noteSchema = new Schema({
  title: String,
  content: String,
});

const Note = model("Note", noteSchema);
```

`model()`-এ প্রথম parameter হিসেবে যেই নাম দেবেন, ভেরিয়েবলের নামও সেটাই রাখলে সুবিধা হয় (এখানে `Note`)। Model-এর নাম বড় হাতের অক্ষর দিয়ে শুরু করা হয়, কারণ এটা একটা constructor/class-এর মতো ব্যবহৃত হয়।

## POST API উদাহরণ

```ts
app.post("/create-note", async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const myNote = new Note({
      title,
      content,
    });

    await myNote.save();

    res.json({
      success: true,
      note: myNote,
    });
  } catch (error: any) {
    console.log(error.message);
  }
});
```

## জরুরি Middleware

JSON বা form data ঠিকভাবে `req.body`-তে পেতে হলে এই দুটো middleware অবশ্যই route-এর **আগে** বসাতে হবে:

```ts
app.use(express.json());
// JSON আকারে আসা data parse করে req.body-তে বসায়

app.use(express.urlencoded({ extended: true }));
// form data (যেমন: title=Hello&price=100) parse করে
```

এই দুটো না থাকলে `req.body` `undefined` থাকবে এবং destructure করতে গেলে error আসবে।

## Reference

- Mongoose Quick Start: https://mongoosejs.com/docs/index.html
- freeCodeCamp Mongoose Intro: https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/