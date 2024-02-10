import IOutboundIUserDTO from "./dto/OutboundIUserDTO";

export default class OutboundUserPort {
  async getUserById(id: number): Promise<IOutboundIUserDTO> {
    return {
      id,
      name: `User ${id}`,
    };
  }
}
