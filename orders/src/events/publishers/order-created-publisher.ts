import {
  OrderCreatedEvent,
  Subjects,
  Publisher,
} from "@sporganization/commonauth";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
