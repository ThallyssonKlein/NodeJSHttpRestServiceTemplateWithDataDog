import { Response, Request, NextFunction } from "express";

import Observability from "@adapters/outbound/observability";
import InboundUserAdapter from "@adapters/inbound/http/user";

export default class UserController {
  private readonly spanName = "UserController.getUserById";

  constructor(private inboundUserAdapter: InboundUserAdapter) {}

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const observability = new Observability();
    observability.startTransaction("getUserById");
    observability.startSpan(this.spanName);
    observability.addDataToSpan(this.spanName, "id", req.params.id);

    try {
      const adapterResponse = await this.inboundUserAdapter.getUserById(
        req.params.id,
        observability
      );
      observability.endSpan(this.spanName);
      observability.endTransaction();
      res.send(adapterResponse);
    } catch (err) {
      observability.addDataToSpan(this.spanName, "error", err.name);
      observability.endSpan(this.spanName);
      observability.endTransaction();

      next(err);
    }
  }
}
