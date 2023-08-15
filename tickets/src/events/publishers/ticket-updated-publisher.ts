import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@sporganization/commonauth";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
