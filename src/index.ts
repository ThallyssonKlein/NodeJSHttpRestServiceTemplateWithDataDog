import App from "@ports/inbound/http";
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

import Tracer from 'dd-trace'
Tracer.init()


App.listen(3000, function () {
  console.log("Server is running on port 3000");
});
