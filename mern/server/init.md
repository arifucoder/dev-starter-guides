# Backend Project Init গাইড

## ১. প্রজেক্ট সেটআপ
```sh
npm init -y
git init
```
`.gitignore` ফাইল অ্যাড করো (`node_modules`, `.env` ইত্যাদি এখানে থাকবে)।

## ২. TypeScript ইনিশিয়ালাইজ
```sh
npx tsc --init
```

### ⚠️ NB: `tsconfig.json`-এ কিছু পরিবর্তন করতে হবে

Folder structure অনুযায়ী relative import (যেমন `./app.js`, `../models/...`) ঠিকভাবে কাজ করানোর জন্য নিচের পরিবর্তনগুলো করতে হবে:

```diff
{
- "module": "nodenext",
+ "module": "CommonJS",

+ "moduleResolution": "Node",

- "verbatimModuleSyntax": true,
+ "verbatimModuleSyntax": false
}
```

এছাড়া source আর build ফাইল আলাদা রাখার জন্য `tsconfig.json`-এ:

```json
"rootDir": "./src",
"outDir": "./dist"
```

`src` ফোল্ডারের ভেতরে `server.ts` এবং `app.ts` বানাও।

## ৩. প্যাকেজ ইনস্টল
```sh
npm install express dotenv
npm install -D typescript tsx
```

### `package.json`-এ `dev` script যোগ করা

`server.ts` file-টা সরাসরি চালানো এবং code change হলে auto-restart করার জন্য `package.json`-এ `scripts`-এর ভেতরে এটা যোগ করতে হবে:

```json
"scripts": {
	"dev": "tsx watch src/server.ts"
}
```

এরপর থেকে server চালানোর জন্য শুধু লিখলেই হবে:

```sh
npm run dev
```

## ৪. `app.ts` — সার্ভার তৈরি
```ts
import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Welcome to the app",
	});
});

export default app;
```

## ৫. `server.ts`
```ts
import type { Server } from "http";
import app from "./app.js";

let server: Server;

const PORT = process.env.PORT || 5000;

async function main() {
	try {
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