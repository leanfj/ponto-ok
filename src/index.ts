import { Dialect } from "sequelize";

import { shutdownHttpServer, startHttpServer } from "@infrastructure/web/server";
import DataBase from "@infrastructure/database/db";

const {
  SEQUELIZE_DB_NAME,
  SEQUELIZE_DB_USER,
  SEQUELIZE_DB_PASSWORD,
  SEQUELIZE_DB_DIALECT,
  SEQUELIZE_DB_HOST,
  SEQUELIZE_DB_SCHEMA,
  SEQUELIZE_DB_PORT,
} = process.env;

const dataBase = new DataBase(
  SEQUELIZE_DB_NAME as string,
  SEQUELIZE_DB_USER as string,
  SEQUELIZE_DB_PASSWORD as string,
  SEQUELIZE_DB_HOST as string,
  parseInt(SEQUELIZE_DB_PORT as string),
  SEQUELIZE_DB_SCHEMA as string,
  SEQUELIZE_DB_DIALECT as Dialect
);

let server: any = null;

async function init() {
  try {
    server = await startHttpServer(dataBase);
    console.log("Bootstrapped");
  } catch (error) {
    console.log("Bootstrap error", error);
    shutdown(1, server);
  }
}

async function shutdown(exitCode: number, server: any) {
  console.info("Shutting down");

  const stopHttpServer = async () => {
    try {
      await shutdownHttpServer(server);
      console.info("HTTP server closed");
    } catch (err) {
      console.error("HTTP server shutdown error", { err });
    }
  };

  // @ts-ignore
  await Promise.allSettled([stopHttpServer()]);

  try {
    // unloadModels();
    await dataBase.disconnect();
    console.log("Fechando todas as conexões.");
    process.exit(exitCode);
  } catch (err) {
    console.error("Databases shutdown error", { err });
  }

  console.info("Bye");
  process.exit(exitCode);
}


process.on("SIGINT", () => {
  shutdown(0, server);
})
process.on("SIGTERM", () => {
  shutdown(0, server);
})

init();
