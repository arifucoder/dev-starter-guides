import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();

interface EnvConfig {
	NODE_ENV: "development" | "production";
	PORT: string;
	DATABASE_URL: string;
	FRONTEND_URL: string;
	// notun env lagle ekhane add koro (e.g. BETTER_AUTH_SECRET, STRIPE_SECRET_KEY)
}

const loadEnvVariables = (): EnvConfig => {
	const requiredEnvVariables = ["NODE_ENV", "PORT", "DATABASE_URL", "FRONTEND_URL"];

	requiredEnvVariables.forEach((variable) => {
		if (!process.env[variable]) {
			throw new AppError(
				status.INTERNAL_SERVER_ERROR,
				`Environment variable ${variable} is required but not set in .env file.`,
			);
		}
	});

	return {
		NODE_ENV: process.env.NODE_ENV as "development" | "production",
		PORT: process.env.PORT as string,
		DATABASE_URL: process.env.DATABASE_URL as string,
		FRONTEND_URL: process.env.FRONTEND_URL as string,
	};
};

export const envVars = loadEnvVariables();
