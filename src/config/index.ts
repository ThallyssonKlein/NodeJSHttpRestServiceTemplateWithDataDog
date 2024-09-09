import dotenv from "dotenv";

type IConfig = {
  env: string;
  port: number;
};

export default class Config {
  private config: IConfig;

  constructor() {
    dotenv.config();

    if (!process.env.ENV) {
      throw new Error("ENV is not defined");
    }

    process.env.DD_ENV = process.env.ENV;
    if (process.env.ENV === "development") {
      process.env.DD_SERVICE = "local-template";
    } else {
      process.env.DD_SERVICE = "production-template";
    }

    this.config = {
      env: process.env.DD_ENV,
      port: parseInt(process.env.PORT || "3000"),
    };
  }

  getConfig() {
    return this.config;
  }
}
