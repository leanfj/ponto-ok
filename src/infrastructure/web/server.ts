import "dotenv/config";
import App from "./app";

const startHttpServer = async (dataBase: any) => {
  const connection = await dataBase.connect();
  const app = new App([]);
  const server = app.listen();

  return server;
};

const shutdownHttpServer = async (server: any) => {
  console.log("Close Sever");
  await server.close();

  setTimeout(async () => {
    console.error("Desligamento forçado por não conseguir fechar as conexões");
    process.exit(1);
  }, 30 * 1000);
};

export { startHttpServer, shutdownHttpServer };
