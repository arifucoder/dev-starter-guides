# dev-starter-guides

Backend, frontend, fullstack এবং mobile framework গুলোর জন্য setup ও run করার গাইডের একটা সংকলন। প্রতিটা stack এর জন্য একটা করে `README.md` — install, structure আর commands, সব এক জায়গায়।

## 📁 Folder Structure

```
dev-starter-guides/
├── README.md                     # এই ফাইল
├── TEMPLATE.md                   # প্রতিটা গাইডের জন্য ব্যবহৃত টেমপ্লেট
│
├── backend/
│   ├── express-app/
│   ├── golang-echo/
│   ├── golang-fiber/
│   ├── django-app/
│   ├── flask-app/
│   ├── spring-boot-app/
│   └── nestjs-app/
│
├── frontend/
│   ├── react-app/
│   ├── nextjs-app/
│   ├── vue-app/
│   ├── svelte-app/
│   └── angular-app/
│
├── fullstack/
│   ├── express-react-app/
│   ├── golang-echo-react/
│   ├── nextjs-fullstack/
│   └── django-react-app/
│
├── mobile/
│   ├── react-native-app/
│   └── flutter-app/
│
├── database/
│   ├── postgres-setup/
│   ├── mongodb-setup/
│   └── redis-setup/
│
└── devops/
    ├── docker-basics/
    └── github-actions-ci/
```

## 📚 বর্তমান গাইডগুলো

| Category | Stack | Path |
|---|---|---|
| Backend | Express.js | [`backend/express-app`](./backend/express-app) |
| Backend | Go + Echo | [`backend/golang-echo`](./backend/golang-echo) |
| Frontend | React | [`frontend/react-app`](./frontend/react-app) |
| Frontend | Next.js | [`frontend/nextjs-app`](./frontend/nextjs-app) |
| Fullstack | Express + React | [`fullstack/express-react-app`](./fullstack/express-react-app) |

> সময়ের সাথে সাথে আরও গাইড যোগ হবে — সম্পূর্ণ লিস্টের জন্য উপরের ফোল্ডারগুলো দেখো।

## ✍️ নতুন গাইড যোগ করার নিয়ম (Contributing)

1. সঠিক category ফোল্ডার বেছে নাও (`backend`, `frontend`, `fullstack`, `mobile`, `database`, `devops`)।
2. `<tech>-<tech>-app` নামে একটা নতুন subfolder বানাও (অথবা standalone হলে শুধু `<tech>`)।
3. [`TEMPLATE.md`](./TEMPLATE.md) কপি করে ঐ ফোল্ডারে `README.md` নামে রাখো।
4. সেকশনগুলো পূরণ করো: Prerequisites, Installation, Project Structure, Run the App, Common Commands, Troubleshooting, Resources।
5. উপরের **বর্তমান গাইডগুলো** টেবিলে একটা row যোগ করো।

## 📄 License

MIT — free to use, share, এবং adapt করা যাবে।