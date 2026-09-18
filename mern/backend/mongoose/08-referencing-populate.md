# Referencing & Populate (Mongoose)

---

## Referencing কী?

ধরা যাক, আমার **`User`** এবং **`Notes`** নামে ২টা model/schema আছে — মানে ২টা আলাদা DB collection (table)। এখন আমি চাই প্রতিটা note-এ কোন **user**-এর note সেটা রাখতে। এর জন্য পুরো user object রাখার দরকার নেই, শুধু ওই user-এর **`_id`** (ObjectId) রাখলেই হয়ে যায়।

এই concept-টাকেই বলা হয় **Referencing**।

---

## `notes.interface.ts`

```ts
import { Types } from "mongoose";

export interface INotes {
  title: string;
  content: string;
  category: "personal" | "work" | "study" | "other";
  pinned: boolean;
  tags: {
    label: string;
    color: string;
  };
  userId: Types.ObjectId;
}
```

---

## `notes.model.ts`

```ts
import { Schema, model } from "mongoose";
import { INotes } from "./notes.interface";

const notesSchema = new Schema<INotes>(
  {
    title: {
      type: String,
    },

    content: {
      type: String,
    },

    category: {
      type: String,
      default: "personal",
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    tags: {
      label: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: "gray",
      },
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Notes = model("Notes", notesSchema);
```

এখানে `ref: "User"` লেখা মানে — এই `userId` field-টা আসলে `User` নামের model-এর একটা document-কে **reference** করছে। `ref`-এর ভেতরে quotation-এর মধ্যে যেই নাম দেওয়া হবে, সেটা অবশ্যই সেই model define করার সময় দেওয়া নামের সাথে মিলতে হবে — যেমন:

```ts
export const User = model("User", userSchema);
```

এখানে `model("User", ...)`-এর প্রথম argument-টাই (`"User"`) হলো সেই নাম, যেটা `ref`-এ বসাতে হবে।

---

## Populate করা

শুধু `userId` (ObjectId) না দেখে পুরো User-এর data দেখতে চাইলে **`.populate()`** ব্যবহার করতে হয়:

```ts
const notes = await Notes.find().populate("userId");
```

> **⚠️ সংশোধন:** তোমার লেখা কোডে `Note.find()` লেখা হয়েছিল, কিন্তু model export করা হয়েছে `Notes` নামে (`export const Notes = model("Notes", notesSchema)`) — তাই ব্যবহার করার সময়ও `Notes.find()` লিখতে হবে, `Note` না।

`.populate("userId")`-এ যেই string দেওয়া হয়, সেটা হতে হবে schema-র সেই **field-এর নাম**, যেটাতে `ref` দেওয়া আছে।

---

## Field-এর নাম আরও Meaningful করা

`userId`-এর জায়গায় শুধু **`user`** নাম দিলে ব্যাপারটা আরও meaningful/readable হয় (কারণ populate করার পর ওখানে আসলে পুরো user object-ই বসে, শুধু id না)। এটা করতে হলে schema আর interface দুই জায়গাতেই field-এর নাম পরিবর্তন করতে হবে:

```ts
// interface
user: Types.ObjectId;

// schema
user: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true
},
```

আর populate করার সময়ও নতুন নাম অনুযায়ী লিখতে হবে:

```ts
const notes = await Notes.find().populate("user");
```