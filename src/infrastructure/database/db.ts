import { Dialect, Sequelize } from "sequelize";

export default class DataBase {
  private sequelizeConnection: Sequelize;
  private dbName: string;
  private user: string;
  private password: string;
  private host: string;
  private port: number;
  private schema: string;
  private dialect: Dialect;

  constructor(
    dbName: string,
    user: string,
    password: string,
    host: string,
    port: number,
    schema: string,
    dialect: Dialect
  ) {
    this.dbName = dbName;
    this.user = user;
    this.password = password;
    this.host = host;
    this.dialect = dialect;
    this.port = port;
    this.schema = schema;

    this.sequelizeConnection = new Sequelize(
      this.dbName,
      this.user,
      this.password,
      {
        host: this.host,
        port: this.port,
        schema: this.schema,
        dialect: this.dialect,
        logging: console.log,
        timezone: "-03:00",
        dialectOptions: {
          useUTC: false,
        },
      }
    );
  }

  public async connect() {
    await this.sequelizeConnection.authenticate();
    return this.sequelizeConnection;
  }

  public async disconnect() {
    await this.sequelizeConnection.close();
  }
}
