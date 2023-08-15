import { Message } from "node-nats-streaming";
import Listener from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //when no super is used the abtract class can
  //access the parameters of this class passed using class instace

  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event Data", data);
    msg.ack();
  }
}
