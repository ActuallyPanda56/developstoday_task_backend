import dotenv from "dotenv";

dotenv.config();

const config = {
  web: {
    port: parseInt(process.env.WEB_SERVER_PORT!, 10),
    cookieSecret: process.env.COOKIE_SECRET,
    allowedHosts: ["localhost"],
    appName: process.env.APP_NAME ?? "Backend",
    appUrl: process.env.APP_URL ?? "http://localhost",
    appKey: process.env.APP_KEY ?? ""
  },
  env: {
    isDevEnv: process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "migration",
    isMigrationEnv: process.env.MIGRATION_ENV === "true",
    isScriptEnv: process.env.NODE_ENV === "script",
    isProdEnv: process.env.NODE_ENV === "production"
  }
};

export default config;
