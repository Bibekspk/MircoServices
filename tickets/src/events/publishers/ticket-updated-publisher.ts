import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@bibekorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
