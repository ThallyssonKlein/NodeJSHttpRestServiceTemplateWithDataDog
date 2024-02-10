import App from "@ports/inbound/http";
import * as Sentry from "@sentry/node";
import Config from "@config/index";

const config = new Config().getConfig();

import UserService from "@domain/user/service/UserService";

import OutboundUserAdapter from "@adapters/outbound/http/user";
import OutboundUserPort from "@ports/outbound/http/user";
import InboundUserAdapter from "@adapters/inbound/http/user";

// outbound
// port
const outboundUserPort = new OutboundUserPort();
// adapter
const outboundUserAdapter = new OutboundUserAdapter(outboundUserPort);

// domain
const userService = new UserService(outboundUserAdapter);

// inbound
// adapter
const inboundUserAdapter = new InboundUserAdapter(userService);

// port
import Routes from "@ports/inbound/http/Routes";
import HttpError from "@ports/inbound/http/errors/HttpError";
const routes = new Routes(inboundUserAdapter);

App.use(routes.getRouter());
App.use(function (err, _req, res, _next) {
  if (err) {
    if (err instanceof HttpError) {
      res.status(err.getStatus()).send({
        message: err.message,
        name: err.name,
        status: err.getStatus(),
      });
    } else {
      res.status(500).send({
        message: err.message,
        name: err.name,
        status: 500,
      });
    }
  }
});

Sentry.init({
  dsn: config.sentryDsn,
  // Performance Monitoring
  tracesSampleRate: config.tracesSampleRate, // Capture 100% of the transactions, reduce in production!
  integrations: [
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      // to trace all requests to the default router
      app: App,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    })
  ]
});

// transactions/spans/breadcrumbs are isolated across requests
App.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
App.use(Sentry.Handlers.tracingHandler());
App.use(Sentry.Handlers.errorHandler());


App.listen(3000, function () {
  console.log("Server is running on port 3000");
});
