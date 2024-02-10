import dotenv from "dotenv";

type IConfig = {
  sentryDsn: string;
  tracesSampleRate: number;
  logLevel: string;
  transport: {
    target: string;
    options: {
      colorize: boolean;
    };
  };
};

export default class Config {
  private config: IConfig;

  constructor() {
    dotenv.config();

    if (!process.env.SENTRY_DSN) {
      throw new Error("SENTRY_DSN is not defined");
    }

    this.config = {
      sentryDsn: process.env.SENTRY_DSN,
      tracesSampleRate: parseFloat(process.env.TRACES_SAMPLE_RATE) || 1.0,
      logLevel: process.env.LOG_LEVEL || "info",
      transport: {
        target: process.env.LOG_TARGET || "pino-pretty",
        options: {
          colorize: Boolean(process.env.LOG_COLORIZE) || true,
        },
      },
    };
  }

  getConfig() {
    return this.config;
  }
}
