import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import qs from "qs";
import { envVars } from "./app/config/env";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();

// nested query support: ?price[gte]=100&price[lte]=500
app.set("query parser", (str: string) => qs.parse(str));
app.set("trust proxy", 1);

// 1. CORS
app.use(
	cors({
		origin: [envVars.FRONTEND_URL, "http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// 2. (optional) Better Auth handler — express.json() er AGE dite hobe
// app.use("/api/auth", toNodeHandler(auth));

// 3. (optional) Stripe webhook — raw body lage, tai express.json() er AGE
// app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);

// 4. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Health check
app.get("/", (req, res) => {
	res.json({ success: true, message: "Server is running" });
});

// 6. Routes
app.use("/api/v1", IndexRoutes);

// 7. Error handling (always last)
app.use(globalErrorHandler);
app.use(notFound);

export default app;
