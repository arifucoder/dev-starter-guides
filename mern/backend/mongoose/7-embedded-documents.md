# Embedded Documents (Mongoose)

---

## Embedded Document কী?

**Embedded document** হলো — একটা document-এর নিজের schema থাকবে, আর সেই schema-র ভেতরে আরেকটা **ছোট (আলাদা) schema** field হিসেবে বসিয়ে দেওয়া যাবে। অর্থাৎ একটা schema-কে আরেকটা schema-র ভেতরে **nested** করে ব্যবহার করা।

---

## কেন Plain Nested Object না দিয়ে Embedded Schema ব্যবহার করব?

কোনো nested field-কে যদি শুধু একটা **plain object** হিসেবে লিখি (আলাদা Schema না বানিয়ে), তাহলে দুটো সমস্যা হয়:

1. এটা TypeScript **interface**-এর সাথে ঠিকভাবে **sync** থাকে না।
2. ভুলবশত কোনো **extra field** add করে ফেললেও Mongoose কোনো warning/error দেয় না।

এই কারণেই nested object গুলোকে আলাদা **Schema** বানিয়ে (অর্থাৎ **embedded document** হিসেবে) ব্যবহার করা উচিত — এতে structure নিয়ন্ত্রিত থাকে এবং ভুল field ধরা পড়ে।

---

## Interface

```ts
interface IAddress {
	city: string;
	street: string;
	zip: number;
}

interface IUser {
	firstName: string;
	lastName: string;
	role: "USER" | "ADMIN" | "SUPERADMIN";
	address: IAddress;
}
```

---

## Sub-schema (Embedded Schema)

```ts
const addressSchema = new Schema<IAddress>({
	city: { type: String },
	street: { type: String },
	zip: { type: Number },
}, {
	_id: false
});
```

> **⚠️ গুরুত্বপূর্ণ:** Sub-schema বানানোর সময় options-এ `_id: false` দিতে হবে। কারণ Mongoose default-ভাবে প্রতিটা sub-document-এও নিজে থেকে একটা `_id` add করে দেয়, যেটা এখানে সাধারণত দরকার হয় না। তাই `_id: false` দিয়ে সেটা বন্ধ করে দেওয়া হয়।

---

## Main Schema-তে Embed করা

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
});

export const User = model("User", userSchema);
```

এখানে `address` field-এর `type`-এ সরাসরি আগে বানানো **`addressSchema`** বসিয়ে দেওয়া হয়েছে। ফলে `User` document তৈরি করার সময় `address` এর ভেতরে `city`, `street`, `zip` — এই নির্দিষ্ট structure মেনেই data দিতে হবে, এর বাইরে কিছু দিলে বা ভুল field দিলে ধরা পড়বে।