import App from "@ports/inbound/http";
import Config from "@config/index";

const config = new Config().getConfig();

import HttpError from "@ports/inbound/http/errors/HttpError";

import { routes } from 'dependencyInjection'
 
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

App.listen(config.port, function () {
  console.log("Server is running on port 3000");
});
