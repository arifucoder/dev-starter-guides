import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import { prisma } from "./app/lib/prisma";

let server: Server;

const bootstrap = async () => {
	try {
		await prisma.$connect();
		console.log("Database connected");

		server = app.listen(envVars.PORT, () => {
			console.log(`Server is running on http://localhost:${envVars.PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

const shutdown = (signal: string, error?: unknown) => {
	console.log(`${signal} received. Shutting down server...`, error ?? "");
	if (server) {
		server.close(() => {
			console.log("Server closed gracefully.");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (error) => shutdown("Uncaught Exception", error));
process.on("unhandledRejection", (error) => shutdown("Unhandled Rejection", error));

bootstrap();
