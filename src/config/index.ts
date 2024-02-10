import dotenv from "dotenv";

type IConfig = {
  env: string;
};

export default class Config {
  private config: IConfig;

  constructor() {
    dotenv.config();

    if (!process.env.ENV) {
      throw new Error("ENV is not defined");
    }

    process.env.DD_ENV = process.env.ENV;
    process.env.DD_SERVICE = "local-template";

    this.config = {
      env: process.env.DD_ENV,
    };
  }

  getConfig() {
    return this.config;
  }
}
