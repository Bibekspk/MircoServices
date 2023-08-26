import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@bibekorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
