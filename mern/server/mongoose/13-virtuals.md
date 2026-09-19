# Virtuals (Mongoose)

---

## Virtual কী?

Virtual হলো এমন একটা property, যেটা **database-এ store হয় না** — এটা বাইরে থেকে (existing field-গুলো দিয়ে) **compute** করে দেখানো হয়।

### Example

ধরা যাক, User schema-তে ২টা field আছে — `firstName` আর `lastName`। এখন এই দুইটা একসাথে জোড়া লাগিয়ে একটা `fullName` দেখাতে চাইলে **virtual** ব্যবহার করা যায়।

এতে করে আলাদা করে `fullName` নামে কোনো field database-এ **store করতে হয় না**, যেহেতু `firstName` আর `lastName` থেকেই এটা প্রতিবার হিসাব করে বের করা যায়।

---

## `user.model.ts`

```ts
const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		required: [true, "firstName keno dao nai?"],
		trim: true,
		minlength: [3, "First Name must be atleast 3 characters, got {VALUE}"],
		maxlength: 10,
	},

	lastName: {
		type: String,
		trim: true,
		required: [true, "lastName keno dao nai?"],
	},

	role: {
		type: String,
		uppercase: true,
		enum: {
			values: ["USER", "ADMIN", "SUPERADMIN"],
			message: "Role is not valid. got {VALUE} role",
		},
		default: "USER",
	},

	address: {
		type: addressSchema,
	},
}, {
	versionKey: false,
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

export const User = model("User", userSchema);
```

### কী কী হচ্ছে এখানে

- `userSchema.virtual('fullName').get(function () {...})` — এখানে `'fullName'` নামে একটা virtual property define করা হচ্ছে, আর `.get()`-এর ভেতরের function-টা বলে দিচ্ছে এই property-টার value কীভাবে বের করতে হবে। `this` দিয়ে ওই document-এর `firstName`, `lastName` access করা হচ্ছে।
- `toJSON: { virtuals: true }` এবং `toObject: { virtuals: true }` — এই ২টা option schema options-এ দেওয়া **must**। কারণ default-এ virtual field গুলো `res.json()` বা `console.log()`-এ (JSON/plain object-এ convert করার সময়) দেখায় না। এই option দিলে তখনই virtual field output-এ যুক্ত হয়।

---

## ⚠️ গুরুত্বপূর্ণ কয়েকটা কথা

1. **Arrow function ব্যবহার করা যাবে না** — `.get(function () {...})`-এ অবশ্যই regular function ব্যবহার করতে হবে, arrow function না। কারণ arrow function-এর নিজস্ব `this` থাকে না, ফলে `this.firstName` কাজ করবে না।
2. **Query/Filter করা যায় না** — যেহেতু virtual field database-এ store হয় না, তাই `User.find({ fullName: "John Doe" })`-এর মতো virtual field দিয়ে সরাসরি database-এ query চালানো যায় না।
3. চাইলে virtual-এ `.set()`-ও দেওয়া যায় — যাতে ওই virtual field-এ value বসালে সেটা ভেঙে আসল field-গুলোতে (যেমন `firstName`, `lastName`) বসিয়ে দেওয়া যায়।