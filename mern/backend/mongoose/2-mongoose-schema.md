# Mongoose Schema — Class 17.4

> **Reference:**
> - [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
> - [Mongoose SchemaTypes](https://mongoosejs.com/docs/schematypes.html)

---

## আমার নোট

### Schema কী?

Mongoose-এ যখন আমরা schema-তে কোনো field add করি, তখন সাধারণ convention হলো সেটার জন্য একটা `object` লেখা — যেমন `{ type: String }`। কিন্তু চাইলে আমরা **shorthand** হিসেবে সরাসরি `String` লিখে দিতে পারি।

```ts
const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});
```

- `date` field-এ object syntax ব্যবহার করা হয়েছে — `type: Date` আর সাথে `default: Date.now` set করা হয়েছে। এখানে `date` হলো একটা **type define করার syntax**, এটা real object না।
- `comments` হলো একটা **array**। array-এর ভেতরে একটা **object আকারে** data add হবে (`{ body: String, date: Date }`)।
- `meta` হলো একটা **আসল object**, এবং এর ভেতরে আরেকটা object-type structure আছে। `meta`-এর ভেতরে `votes` আর `favs`-এ shorthand-এ type দেওয়া হয়েছে, চাইলে `date`-এর মতো পূর্ণ object syntax দিয়েও দেওয়া যেত।

**সারমর্ম:** আমাদের data type হতে পারে —
1. সাধারণ **data structure** (String, Number, Boolean ইত্যাদি), অথবা
2. আরেকটা **syntactical object structure** (nested object / array of objects)।

### Enum

TypeScript-এ যেমন `enum` থাকে, ঠিক তেমনিভাবে Mongoose-এও `enum` আছে। এখানে enum দেওয়া মানে হলো — নির্দিষ্ট কয়েকটা option-এর মধ্যে থেকেই একটা value হতে হবে, এর বাইরের কোনো value গ্রহণযোগ্য না।

### নতুন Field যোগ করা (Aggregation)

যদি অনেক data insert করার পর নতুন কোনো field schema-তে add করা হয়, তাহলে যেসব পুরনো data-তে ওই নতুন field নেই, সেগুলোর মধ্যে field-টা insert করে দিতে হবে — এটা করা হয় **aggregation**-এর মাধ্যমে।

### Note Schema উদাহরণ

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

app.post("/create-note", async (req: Request, res: Response) => {
	try {
		const { title, content, category, pinned, date, tags } = req.body;
		const myNote = new Note({
			title,
			content,
			category,
			pinned,
			date,
			tags,
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

এখানে `required: true` মানে field-টা বাধ্যতামূলক, `trim: true` মানে string-এর আগে-পরের extra space auto কেটে যাবে, আর `default` দিয়ে কোনো value না দিলে কী বসবে সেটা ঠিক করা হয়েছে।

---

## অতিরিক্ত: বাকি SchemaType গুলো সংক্ষেপে

Mongoose-এ উপরেরগুলো ছাড়াও আরও কিছু common SchemaType আছে —

| Type | কাজ | Example |
|---|---|---|
| `Number` | সংখ্যা রাখার জন্য | `age: { type: Number, min: 0, max: 120 }` |
| `Boolean` | true/false রাখার জন্য | `isActive: { type: Boolean, default: true }` |
| `ObjectId` (Schema.Types.ObjectId) | অন্য কোনো document-এর সাথে **reference/relation** তৈরি করতে | `author: { type: Schema.Types.ObjectId, ref: "User" }` |
| `Array` | list of values, যেকোনো type-এরই হতে পারে | `tags: [String]` অথবা `comments: [{ body: String }]` |
| `Buffer` | binary data (যেমন file/image) রাখতে | `avatar: Buffer` |
| `Mixed` (Schema.Types.Mixed) | যেকোনো ধরনের data (flexible, schema-less) | `extra: Schema.Types.Mixed` |
| `Map` | key-value pair (dynamic key) রাখতে | `socialLinks: { type: Map, of: String }` |
| `Decimal128` | খুব precise decimal number (যেমন টাকা-পয়সা) | `price: mongoose.Schema.Types.Decimal128` |

**দুটো ছোট টিপস:**
- `required`, `default`, `min`/`max`, `trim`, `unique`, `enum` — এগুলো হলো **validator/option**, যেকোনো type-এর সাথে (যেটা applicable) বসানো যায়।
- `ObjectId` + `ref` দিয়ে সাধারণত দুটো collection-এর মধ্যে **relation** (SQL-এর foreign key-এর মতো) তৈরি করা হয়, এবং পরে `.populate()` দিয়ে সেই related data আনা যায়।