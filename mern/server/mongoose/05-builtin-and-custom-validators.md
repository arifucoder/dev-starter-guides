# Mongoose Validation

> **Reference:** [https://mongoosejs.com/docs/validation.html](https://mongoosejs.com/docs/validation.html)

---

## Built-in Validators

```ts
const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		trim: true,
		required: true,
		lowercase: true,
	},
})
```

এখানে `required` হলো একটা **built-in validator**।

- সব SchemaType-এই built-in **`required`** validator থাকে।
- **Number** type-এ থাকে **`min`** ও **`max`** validator।
- **String** type-এ থাকে **`enum`**, **`match`**, **`minLength`**, **`maxLength`** validator।

---

## Custom Validation Message

Validator fail করলে নিজের মতো message দেখাতে চাইলে array syntax `[value, "message"]` ব্যবহার করতে হয়:

```ts
const breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'Must be at least 6, got {VALUE}'],
    max: 12,
    required: [true, "eggs number kno daw nai"]
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  drink: {
    type: String,
    enum: {
      values: ['Coffee', 'Tea'],
      message: '{VALUE} is not supported'
    }
  }
});
```

`enum`-এর সাথেও এভাবে (উপরে `drink`-এর মতো) custom message দেওয়া যায়।

`lowercase`, `trim` — এগুলোর জন্য কোনো validation message লাগে না, কারণ এগুলো validator না, বরং data-কে **mutate (রূপান্তর)** করে মাত্র। কিন্তু `required`, `min`, `max`, `enum`-এর মতো যেগুলো আসলেই কোনো শর্ত **check** করে, সেগুলোর জন্যই custom message কাজে লাগে।

> **⚠️ সংশোধন:** তোমার লেখা কোডে `unique: [true, "email common hoye geche"]` ব্যবহার করা হয়েছিল — এটা কাজ করবে না, কারণ **`unique` আসলে কোনো validator না**। এটা শুধু MongoDB-কে বলে দেয় ওই field-এ একটা **index** বানাতে, যাতে duplicate value block হয়। Duplicate value দিলে Mongoose validation error না দিয়ে MongoDB-এর নিজস্ব **`E11000 duplicate key error`** দেয় — তাই `unique`-এর সাথে array দিয়ে custom message দেওয়া যায় না। Duplicate-এর জন্য নিজের মতো message দেখাতে চাইলে `try/catch`-এ `error.code === 11000` চেক করে নিজে message বানাতে হয়।

---

## Custom Validators

```ts
const userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});
```

এখানে regex দিয়ে `validator` function-এর ভেতরে নিজের শর্ত অনুযায়ী **test/validate** করা হচ্ছে। একইভাবে email-এর জন্যও custom validator লেখা যায়।

---

## `validator` npm Package ব্যবহার

Ready-made validation function ব্যবহার করতে চাইলে [`validator`](https://www.npmjs.com/package/validator) package ব্যবহার করা যায় — নিজে regex না লিখেও কাজ চলে:

```ts
import validator from "validator";

const userSchema = new Schema({
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email"],
    required: [true, 'User email is required']
  }
});
```

এখানে শুধু `validator.isEmail` function-টা pass করে দিলেই হয়ে যায়, নিজে থেকে validation logic লিখতে হয় না।