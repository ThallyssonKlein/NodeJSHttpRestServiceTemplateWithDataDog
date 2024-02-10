import User from "@domain/user/entity/User";
import { InternalError } from "@ports/inbound/http/errors";
import OutboundUserPort from "@ports/outbound/http/user";
import OutboundIUserDTO from "@ports/outbound/http/user/dto/OutboundIUserDTO";
import IUser from "@domain/user/entity/User";
import Observability from "../../observability";

export default class OutboundUserAdapter {
  private readonly spanName = "OutboundUserAdapter.getUserById"

  constructor(private userPort: OutboundUserPort) {}

  private convertOutboundIUserDTOToIUser(user: OutboundIUserDTO): IUser {
    return {
      id: user.id,
      name: user.name,
    };
  }

  async getUserById(id: number, observability: Observability): Promise<IUser> {
    observability.startSpan(this.spanName);
    try {
      const outboundPortResponse: OutboundIUserDTO =
        await this.userPort.getUserById(id);

      observability.endSpan(this.spanName);
      return this.convertOutboundIUserDTOToIUser(outboundPortResponse);
    } catch (e) {
      observability.endSpan(this.spanName);
      throw new InternalError("Unexpected error getting user");
    }
  }
}
