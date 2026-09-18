# MVC Pattern & TypeScript Interface — Mongoose/Express

---

## MVC Pattern কী?

আমরা **MVC (Model – View – Controller)** pattern follow করব।

- **Model** → এখানে হলো **Schema**। Model/Schema-এর কাজ হলো MongoDB-এর সাথে connect হয়ে data-এর একটা **structure** ঠিক করে দেওয়া, এবং সেই অনুযায়ী MongoDB-এ data insert, update, delete করা।
- **View** → আগের যুগে backend থেকে সরাসরি HTML বানিয়ে browser-এ পাঠানো হতো, সেটাই ছিল View। কিন্তু এখন (frontend আলাদা framework দিয়ে বানানো হওয়ায়) backend থেকে আর HTML পাঠানো হয় না, তাই View-এর জন্য এখন আলাদা করে কিছু কাজ করা হয় না।
- **Controller** → এটা হলো database-এর সাথে connection **control** করার অংশ। Frontend/browser থেকে user একটা request পাঠায়, Controller সেই request receive করে, Model-এর মাধ্যমে database-এ যায়, data আনে বা পাঠায়।

---

## Folder Structure

`src` folder-এর ভেতরে দুটো folder বানাতে হবে:

```
src/
├── controllers/
│   └── notes.controller.ts
├── models/
│   └── notes.model.ts
└── app.ts
```

- **`models/`** → এখানে schema-related file থাকবে (যেমন `notes.model.ts`)
- **`controllers/`** → এখানে route + logic-related file থাকবে (যেমন `notes.controller.ts`)

---

## ⚠️ NB: প্রথমে `tsconfig.json` পরিবর্তন করতে হবে

এই folder structure (relative import) ঠিকভাবে কাজ করানোর জন্য নিচের পরিবর্তনগুলো করতে হবে:

```diff
{
- "module": "nodenext",
+ "module": "CommonJS",

+ "moduleResolution": "Node",

- "verbatimModuleSyntax": true,
+ "verbatimModuleSyntax": false
}
```

---

## `notes.model.ts`

```ts
import { model, Schema } from "mongoose";

const noteSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		content: { type: String, default: "" },
		category: {
			type: String,
			enum: ["Personal", "Work", "Other"],
			default: "Personal",
		},
		pinned: {
			type: Boolean,
			default: false,
		},
		date: { type: Date, default: Date.now },
		tags: {
			label: { type: String, required: true },
			color: { type: String, default: "green" },
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

export const Note = model("Note", noteSchema);
```

---

## `notes.controller.ts`

```ts
import express, { type Request, type Response } from "express";
import { Note } from "../models/notes.model";

export const noteRoutes = express.Router();

noteRoutes.post("/create-note", async (req: Request, res: Response) => {
	try {
		const body = req.body;
		const note = await Note.create(body);

		res.status(201).json({
			success: true,
			note,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});
```

Controller-এ route define করে সেই route-টা `noteRoutes` নামে **export** করা হয়েছে, যাতে `app.ts`-এ গিয়ে সেটা ব্যবহার করা যায়।

---

## `app.ts`

```ts
app.use("/notes", noteRoutes);
```

`app.use()` দিয়ে `noteRoutes`-কে `/notes` path-এর সাথে **mount** করা হলো। তাই controller-এ লেখা `/create-note` route-টার আসল address হবে `/notes/create-note`।

---

## TypeScript Interface Integrate করা

> **Reference:** [https://mongoosejs.com/docs/typescript.html](https://mongoosejs.com/docs/typescript.html)

Interface রাখার জন্য `src` folder-এর ভেতরে আরেকটা folder বানাতে হবে — `interfaces`।

```
src/
├── interfaces/
│   └── user.interface.ts
├── models/
│   ├── notes.model.ts
│   └── user.model.ts
├── controllers/
│   ├── notes.controller.ts
│   └── user.controller.ts
└── app.ts
```

### `user.interface.ts`

```ts
interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: "user" | "admin";
}
```

এই interface-এ define করা হয়েছে একটা User document-এ কোন কোন field থাকবে এবং প্রতিটা field-এর data type কী হবে।

### Interface অনুযায়ী `user.model.ts`

```ts
import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		trim: true,
		required: true,
	},
	lastName: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
});

export const User = model("User", userSchema);
```

এখানে `Schema<IUser>` লিখে schema-টাকে `IUser` interface-এর সাথে **type-bind** করে দেওয়া হয়েছে। এতে করে TypeScript নিজেই check করে দেবে schema-এর field আর interface-এর field মিলছে কিনা, এবং IDE-তে autocomplete/type-checking ভালোভাবে কাজ করবে।

---

## `user.controller.ts`

`notes.controller.ts`-এর মতোই, `User` model ব্যবহার করে এখানে CRUD operation গুলো লেখা হলো:

```ts
import express, { type Request, type Response } from "express";
import { User } from "../models/user.model";

export const userRoutes = express.Router();

// Create
userRoutes.post("/create-user", async (req: Request, res: Response) => {
	try {
		const body = req.body;
		const user = await User.create(body);

		res.status(201).json({
			success: true,
			user,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});

// Get all users
userRoutes.get("/", async (req: Request, res: Response) => {
	try {
		const users = await User.find();

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});

// Get single user by id
userRoutes.get("/:userId", async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});

// Update user
userRoutes.patch("/:userId", async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const updatedBody = req.body;
		const user = await User.findByIdAndUpdate(userId, updatedBody, {
			returnDocument: "after",
		});

		res.status(200).json({
			success: true,
			message: "User updated successfully",
			user,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});

// Delete user
userRoutes.delete("/:userId", async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const deletedUser = await User.findByIdAndDelete(userId);

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
			deletedUser,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});
```

> `notes.controller.ts`-এ শুধু create route ছিল, এখানে সেই একই pattern অনুসরণ করে **সবগুলো CRUD route** (create, get all, get single, update, delete) দেখানো হলো, যাতে পুরো picture-টা সম্পূর্ণ হয়।

---

## `app.ts`-এ Route যোগ করা

```ts
app.use("/notes", noteRoutes);
app.use("/users", userRoutes);
```

`userRoutes`-কে `/users` path-এর সাথে mount করার ফলে final route গুলো হবে এমন:

| Method | Route | কাজ |
|---|---|---|
| `POST` | `/users/create-user` | নতুন user create করা |
| `GET` | `/users` | সব user পাওয়া |
| `GET` | `/users/:userId` | নির্দিষ্ট একটা user পাওয়া |
| `PATCH` | `/users/:userId` | user update করা |
| `DELETE` | `/users/:userId` | user delete করা |

---

## ছোট্ট Extra Tip

চাইলে Model-টাকেও generic দিয়ে type করা যায়, তাহলে `Note.create()` বা `User.find()`-এর মতো method call করার সময় TypeScript field-গুলোর type সঠিকভাবে চিনতে পারবে:

```ts
export const User = model<IUser>("User", userSchema);
```

এতে করে পুরো data flow (interface → schema → model) একই type মেনে চলে, ফলে ভুল field নাম বা ভুল data type লিখলে TypeScript নিজেই compile-time-এ error দেখিয়ে দেবে।