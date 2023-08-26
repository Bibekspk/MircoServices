import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@bibekorg/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queuegroupname";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName; //to send only one copy of event in a service of this queuegroup
  // constructor(props: any) {
  //   super(props);
  // }
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    console.log("data is", data);
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
