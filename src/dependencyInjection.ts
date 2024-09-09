// dependencyInjection.ts
import UserService from "@domain/user/service/UserService";
import OutboundUserAdapter from "@adapters/outbound/http/user";
import OutboundUserPort from "@ports/outbound/http/user";
import InboundUserAdapter from "@adapters/inbound/http/user";

// outbound
// port
const outboundUserPort = new OutboundUserPort();
// adapter
const outboundUserAdapter = new OutboundUserAdapter(outboundUserPort);

import Tracer from 'dd-trace'
Tracer.init()


// domain
const userService = new UserService(outboundUserAdapter);

// inbound
// adapter
const inboundUserAdapter = new InboundUserAdapter(userService);

// port
import Routes from "@ports/inbound/http/Routes";
const routes = new Routes(inboundUserAdapter);

export { routes };