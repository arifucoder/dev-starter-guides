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
`tsconfig.json`-এ:
```json
"rootDir": "./src",
"outDir": "./dist",
```

`src` ফোল্ডারের ভেতরে `server.ts` এবং `app.ts` বানাও।

## ৩. প্যাকেজ ইনস্টল
```sh
npm install express dotenv
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