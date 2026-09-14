# SDLC (Software Development Life Cycle)

একটি প্রজেক্টের প্ল্যানিং থেকে শুরু করে ডেভেলপ, ডিপ্লয় এবং শেষে end user-দের কাছে ডেলিভারি করা পর্যন্ত — পুরো প্রক্রিয়াটিকেই **SDLC** বলা হয়।

## SDLC-এর কিছু মডেল

- **Waterfall**
- **Agile**
- **Spiral**
- **V-Model**

### Waterfall
এই মডেলে প্রজেক্ট একদম planning থেকে শুরু করে deploy পর্যন্ত ধাপে ধাপে এগোয়, এবং সম্পূর্ণভাবে টেস্ট করে একদম চূড়ান্ত (final) হওয়ার পরই তা end user-এর কাছে পৌঁছায়।

### Agile
একটি প্রোডাক্টকে আমরা প্রথমে **MVP (Minimum Viable Product)** আকারে তৈরি করি — যেসব ফিচার একদম অপরিহার্য (must-have), শুধু সেগুলো নিয়েই end user-দের হাতে তুলে দেওয়া হয়। ব্যবহারকারীরা প্রোডাক্টটি ব্যবহার করে feedback দেয়, সেই feedback দেখে আমরা উন্নতি (improve) করি এবং আবার user-দের কাছে পাঠাই।

এভাবে **feedback → কাজ → ডেলিভারি** — এই চক্রটি (loop) চলতেই থাকে।

### Spiral
এটি Agile-এর মতোই কাজ করে, তবে এখানে টেস্টিং অনেক বেশি গুরুত্ব দিয়ে করা হয় — ফলে feedback-এর প্রয়োজনীয়তা তুলনামূলকভাবে কমে যায়।

### V-Model
এই মডেলে টেস্টিংয়ের ওপর সবচেয়ে বেশি জোর দেওয়া হয়।

> প্রজেক্টের ধরন বিশ্লেষণ করেই সিদ্ধান্ত নিতে হবে কোন মডেল উপযুক্ত। **Tour Management System**-এর জন্য আমরা **Agile Hybrid Model** ব্যবহার করবো।

---

## আমাদের ডেভেলপমেন্ট লাইফ সাইকেলের ধাপসমূহ

| ক্রম | ধাপ | বিবরণ |
|---|---|---|
| ১ | Planning | কোডিং শুরুর আগে objective, constraint এবং stakeholder নির্ধারণ |
| ২ | Requirement Analysis | functional ও non-functional requirement সংগ্রহ |
| ৩ | Design | system architecture নির্ধারণ |
| ৪ | Development | architecture অনুযায়ী কোড লেখা |
| ৫ | Testing | unit ও system integration যাচাই |
| ৬ | Deployment | live environment-এ রিলিজ ও মনিটরিং |
| ৭ | Maintenance | ডিপ্লয়মেন্টের পরও চলমান উন্নয়ন |

---

## Phase 1: Planning

**Business Goals নির্ধারণ**
সফটওয়্যারটি কী সমস্যার সমাধান করবে এবং এর strategic value কী — তা স্পষ্ট করা।

**Stakeholder চিহ্নিতকরণ**
মূল user, decision-maker এবং contributor-দের একটি তালিকা তৈরি করা।

**Budget ও Timeline নির্ধারণ**
scope ও resource allocation ঠিক করার জন্য প্রাথমিক প্রজেকশন তৈরি করা।

---

## Phase 2: Requirement Analysis

**Functional vs Non-functional**
সিস্টেমটি কী কী কাজ করবে (যেমন: booking, payment) এবং কতটা ভালোভাবে করবে (যেমন: speed, security) — তা নির্ধারণ।

**User Persona ও Story**
সাধারণ ব্যবহারকারীদের মডেল করে তাদের লক্ষ্য (goal) user story-র মাধ্যমে বর্ণনা করা।

**Tech Stack নির্বাচন**
ফিচার, স্কেলেবিলিটি এবং টিমের দক্ষতা বিবেচনা করে টেকনোলজি বেছে নেওয়া।

---

## Phase 3: System Design

**Architecture Planning**
সিস্টেমের গঠনগত ডিজাইন নির্ধারণ (যেমন: modular, MVC, layered)।

**Data Modeling**
relational/non-relational database গঠনের জন্য schema diagram তৈরি।

**UI/UX Wireframe**
user navigation ও interaction ভিজ্যুয়ালাইজ করার জন্য ইন্টারফেস লেআউটের স্কেচ তৈরি।

---

## Phase 4: Development

**Modular Coding**
প্রতিটি ফিচারকে independent block হিসেবে, নির্দিষ্ট interface সহ তৈরি করা।

**Clean Code Standards**
কোডের readability ও maintainability নিশ্চিত করতে formatting, linting এবং best practice মেনে চলা।

**Version Control Discipline**
নিয়মিত কোড commit করা এবং GitHub বা এ ধরনের সিস্টেমে branch পরিচালনা করা।

---

## Phase 5: Testing

**Unit & Integration Testing**
প্রতিটি কম্পোনেন্ট আলাদাভাবে এবং সম্পূর্ণ সিস্টেমের অংশ হিসেবে যাচাই করা।

**Manual & Automated QA**
regression ও performance চেকের জন্য exploratory testing-এর পাশাপাশি স্ক্রিপ্ট ব্যবহার করা।

**Error Handling**
edge case, failure response এবং logging behavior টেস্ট করা।

---

## Phase 6: Deployment

**Hosting Platform**
স্কেলেবিলিটি ও সুবিধার জন্য Render, Railway বা Vercel-এর মতো সার্ভিস ব্যবহার করে deploy করা।

**CI/CD Pipeline**
ডেলিভারির গতি বাড়াতে integration, testing ও deployment স্বয়ংক্রিয় (automate) করা।

**Post-Deploy Monitoring**
স্থিতিশীলতা (stability) নিশ্চিত করতে uptime, log ও performance ট্র্যাক করা।

---

## Phase 7: Maintenance

**Bug Fix ও Patch**
ডিপ্লয়মেন্টের পরবর্তী সমস্যা ও পারফরম্যান্স ইস্যু সমাধান করা।

**Feature Enhancement**
user feedback ও business need অনুযায়ী নতুন ফিচার যোগ করা।

**Scalability Upgrade**
ক্রমবর্ধমান user ও data load সামলানোর জন্য infrastructure অপ্টিমাইজ করা।

> যতই ভালোভাবে টেস্টিং করা হোক না কেন, কিছু bug থেকেই যায় — Facebook, YouTube-এর মতো সফটওয়্যারেও bug থাকে। এই bug গুলো সমাধান করাই **Maintenance** ধাপের কাজ।
>
> প্রজেক্ট যতদিন চালু থাকবে, SDLC ততদিন চলতেই থাকবে।

---

## আমরা কীভাবে PH Tour Management শুরু করেছিলাম

1. **Project Brief** — ক্লায়েন্টের প্রয়োজন ও ব্যবসায়িক লক্ষ্য বোঝা।
2. **Requirements Document** — বিস্তারিত functional ও non-functional চাহিদা নির্ধারণ।
3. **Modular Design** — user, auth, tour, booking ও payment মডিউল সংজ্ঞায়িত করা।
4. **Tech Stack Selection** — performance ও simplicity বিবেচনা করে বাছাই: **Node.js, MongoDB, Redis**।
5. **Repo Setup** — GitHub repository এবং base folder structure তৈরি করা।