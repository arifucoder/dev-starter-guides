# Mongoose CRUD Notes

---

## Schema and Model

```ts
const noteSchema = new Schema({
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
});

const Note = model("Note", noteSchema);
```

---

## Create API

```ts
app.post("/notes/create-note", async (req: Request, res: Response) => {
	try {
		const body = req.body;
		const note = await Note.create(body);

		// অথবা এভাবেও করা যায়:
		// const note = new Note(body);
		// await note.save();

		res.status(201).json({
			success: true,
			note,
		});
	} catch (error: any) {
		console.log(error.message);
	}
});
```

Create করার জন্য দুইভাবে কাজ করা যায় —
1. `Note.create(body)` — এতে সরাসরি data database-এ save হয়ে যায়।
2. `new Note(body)` দিয়ে প্রথমে একটা instance বানিয়ে, তারপর `.save()` call করে save করা হয়।

দুইটার কাজ একই, শুধু লেখার style আলাদা।

---

## Get All Data

```ts
app.get("/notes", async (req, res) => {
	const notes = await Note.find();

	res.status(200).json({
		success: true,
		notes,
	});
});
```

---

## Get Single Data (by ID)

```ts
app.get("/notes/:noteId", async (req, res) => {
	const noteId = req.params.noteId;
	const notes = await Note.findById(noteId);

	res.status(200).json({
		success: true,
		notes,
	});
});
```

`findById()` ব্যবহার করলে সরাসরি `id` দিলেই হয়ে যায়। কিন্তু `find()` দিয়ে করতে চাইলে নিচের মতো লিখতে হয়:

```ts
const notes = await Note.find({ _id: noteId });
```

**খেয়াল রাখতে হবে:** `find()` সবসময় একটা **array** return করে, একটা মাত্র জিনিস খুঁজলেও। এছাড়া `_id` ছাড়া অন্য যেকোনো field দিয়েও `find()` দিয়ে data খোঁজা যায়।

একটা নির্দিষ্ট (single) data চাইলে `findOne()` ব্যবহার করা হয়, এটা array না, সরাসরি object return করে:

```ts
const result = await User.findOne({ _id: id });
```

---

## Update Data

```ts
app.patch("/notes/:noteId", async (req, res) => {
	const noteId = req.params.noteId;
	const updatedBody = req.body;
	const notes = await Note.findByIdAndUpdate(noteId, updatedBody);

	res.status(200).json({
		success: true,
		message: "Note updated successfully",
		notes,
	});
});
```

Update করার সময় `objectId` দিতে হবে। এই API hit করলে database-এ data সাথে সাথে update হয়ে যায়, কিন্তু response-এ **আগের (update হওয়ার আগের) data** পাঠানো হয় — instantly updated data response-এ দেখা যায় না, যদিও DB-তে change হয়ে গেছে।

এই সমস্যা সমাধানের জন্য options দিতে হয়। আগে এর জন্য `{ new: true }` ব্যবহার করা হতো, কিন্তু নতুন Mongoose version-এ **`new` option deprecated**, এখন officially recommended হলো `returnDocument`:

```ts
const notes = await Note.findByIdAndUpdate(noteId, updatedBody, {
	returnDocument: "after",
});
```

- `returnDocument: "after"` → update হওয়ার **পরের (নতুন)** data response-এ পাওয়া যাবে (আগের `new: true`-এর সমতুল্য)
- `returnDocument: "before"` (default) → update হওয়ার **আগের** data পাওয়া যাবে (আগের `new: false`-এর সমতুল্য, mongoose-এর default behavior)

> **⚠️ Note:** পুরনো `{ new: true }` এখনো কাজ করে, কিন্তু run করলে console-এ deprecation warning দেখাবে:
> `Warning: mongoose: the 'new' option for findOneAndUpdate() and findOneAndReplace() is deprecated. Use 'returnDocument: after' instead.`
> তাই নতুন কোডে `returnDocument` ব্যবহার করাই ভালো।

`updateOne()` দিয়ে update করলে:

```ts
const notes = await Note.updateOne({ _id: noteId }, updatedBody);
```

এটা MongoDB-এর নিজস্ব style-এ response দেয় — অর্থাৎ যেই data update করা হলো সেটা response-এ পাঠায় না, শুধু `matchedCount`, `modifiedCount`, `acknowledged: true` — এইরকম তথ্য দেয়, যদিও DB-তে change হয়ে যায়।

`findOneAndUpdate()` দিয়ে করলে:

```ts
const notes = await Note.findOneAndUpdate({ _id: noteId }, updatedBody, {
	returnDocument: "after",
});
```

এভাবে করলে updated data-টাই response-এ পাওয়া যায়।

---

## Delete Data

```ts
app.delete("/notes/:noteId", async (req, res) => {
	const noteId = req.params.noteId;
	const deletedNotes = await Note.findByIdAndDelete(noteId);

	res.status(200).json({
		success: true,
		message: "Note deleted successfully",
		deletedNotes,
	});
});
```

Update-এর মতো delete-ও কয়েক ভাবে (`deleteOne`, `findOneAndDelete`, `findByIdAndDelete`) করা যায়। তবে সবচেয়ে convenient হলো `findByIdAndDelete` — যেমনটা update-এর ক্ষেত্রে `findByIdAndUpdate` সবচেয়ে সহজ ছিল।

---

## Version Key (`__v`)

Database-এ save হওয়া একটা document দেখতে এমন হয়:

```json
{
  "_id": { "$oid": "6aaa29d04078de82b773bdf4" },
  "title": "orm learning",
  "content": "",
  "category": "Personal",
  "pinned": false,
  "date": { "$date": "2026-09-16T05:32:00.528Z" },
  "__v": 0
}
```

`__v` হলো **version key**, যেটা document-এর version detect করার জন্য ব্যবহার হয়। এটা সাধারণত খুব একটা দরকারি না, তাই চাইলে এটা remove করে দেওয়া যায়:

```ts
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
	},
);
```

`versionKey: false` করার পর নতুন করে data add করলে `__v` field থাকবে না। কিন্তু যেসব data আগে থেকেই `__v` সহ save করা ছিল, সেগুলোতে update করলেও `__v` field থেকে যাবে (পুরনো data-এর গঠন আগে থেকেই fix হয়ে আছে)।

---

## Timestamps (createdAt & updatedAt)

Document কখন তৈরি হলো এবং কখন সর্বশেষ update হলো — এই তথ্য অটোমেটিক রাখতে চাইলে schema options-এ `versionKey`-এর মতোই `timestamps: true` দিতে হয়:

```ts
const noteSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		// ...বাকি fields
	},
	{
		versionKey: false,
		timestamps: true,
	},
);
```

`timestamps: true` দিলে Mongoose নিজে থেকেই প্রতিটা document-এ দুইটা field add করে দেয়:

- **`createdAt`** — document প্রথমবার তৈরি হওয়ার সময়।
- **`updatedAt`** — document সবশেষ update হওয়ার সময় (প্রতিবার update হলে এটা automatic নতুন করে বসে)।

এটা খুবই useful, কারণ manually এই দুই field আলাদা করে maintain করতে হয় না।