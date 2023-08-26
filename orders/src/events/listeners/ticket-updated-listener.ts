import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@sporganization/commonauth";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queuegroupname";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  constructor(props: any) {
    super(props);
  }
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log("created", data);
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket?.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
