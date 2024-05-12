import User from "@domain/user/entity/IUser";
import InboundIUserDTO from "@ports/inbound/http/dto/InboundIUserDTO";
import UserService from "@domain/user/service/UserService";
import {
  BadRequestError,
  ForbiddenError,
  InternalError,
} from "@ports/inbound/http/errors";
import NotAllowedToBeFound from "@domain/user/errors/NotAllowedToBeFound";
import Observability from "@adapters/outbound/observability";

export default class InboundUserAdapter {
  private readonly spanName = "InboundUserAdapter.getUserById";

  constructor(private userService: UserService) {}

  private convertIUserToInboundIUserDTO(user: User): InboundIUserDTO {
    return {
      id: user.id,
      name: user.name,
    };
  }

  async getUserById(
    id: string,
    observability: Observability
  ): Promise<InboundIUserDTO> {
    observability.startSpan(this.spanName);

    if (!id) {
      observability.addDataToSpan(this.spanName, "error", "Missing id param");
      observability.endSpan(this.spanName);
      throw new BadRequestError("Missing id param");
    }

    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      observability.addDataToSpan(this.spanName, "id", id);
      observability.addDataToSpan(this.spanName, "error", "Id is not a number");
      observability.endSpan(this.spanName);
      throw new BadRequestError("Id is not a number");
    }

    try {
      const domainResponse: User = await this.userService.getUserById(
        idNumber,
        observability
      );
      const convertedObject: InboundIUserDTO =
        this.convertIUserToInboundIUserDTO(domainResponse);

      observability.endSpan(this.spanName);
      return convertedObject;
    } catch (e) {
      observability.endSpan(this.spanName);

      if (e instanceof NotAllowedToBeFound) {
        throw new ForbiddenError(e.message);
      }
      throw new InternalError("Unexpected error getting user");
    }
  }
}
