import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@sporganization/commonauth";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
