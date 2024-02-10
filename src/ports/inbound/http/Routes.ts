import { Router, Response, Request, NextFunction } from "express";

import UserController from "./controllers/UserController";
import InboundUserAdapter from "@adapters/inbound/http/user";

export default class Routes {
  private router: Router = Router();
  private UserController: UserController;

  constructor(inboundUserAdapter: InboundUserAdapter) {
    this.UserController = new UserController(inboundUserAdapter);
    this.setupRouter();
  }

  getRouter() {
    return this.router;
  }

  private setupRouter() {
    this.router.get("/ping", (_, res: Response) => res.send("pong"));
    this.router.get(
      "/user/:id",
      (req: Request, res: Response, next: NextFunction) =>
        this.UserController.getUserById(req, res, next)
    );

    return this.router;
  }
}
