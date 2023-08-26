import {
  OrderCreatedEvent,
  Subjects,
  Publisher,
} from "@bibekorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
