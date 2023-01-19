import "dotenv/config";
import { Dialect } from "sequelize";
import App from "./app";

import DataBase from "./infra/db";

(async () => {
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

  const connection = await dataBase.connect();

  const app = new App([
  ]);

  const server = app.listen();

  const closeServer = () => {
    console.log("closeServer");

    server.close(async () => {
      console.log("Fechando todas as conexões.");
      await dataBase.disconnect();
      process.exit();
    });

    setTimeout(async () => {
      console.error(
        "Desligamento forçado por não conseguir fechar as conexões"
      );
      process.exit(1);
    }, 30 * 1000);
  };

  process.on("SIGINT", closeServer);
  process.on("SIGTERM", closeServer);
})();
