import NotAllowedToBeFound from "../errors/NotAllowedToBeFound";
import IUser from "../entity/IUser";
import OutboundUserAdapter from "@adapters/outbound/http/user";
import Observability from "@adapters/outbound/observability";

export default class UserService {
  private readonly spanName = "UserService.getUserById";

  constructor(private outboundUserAdapter: OutboundUserAdapter) {}

  private canGetUser(userId: number) {
    return userId < 10 && userId > 0;
  }

  async getUserById(id: number, observability: Observability): Promise<IUser> {
    observability.startSpan(this.spanName);
    if (this.canGetUser(id)) {
      const outboundResponse: IUser =
        await this.outboundUserAdapter.getUserById(id, observability);

      observability.endSpan(this.spanName);
      return outboundResponse;
    } else {
      observability.endSpan(this.spanName);
      throw new NotAllowedToBeFound("User not allowed to be found");
    }
  }
}
