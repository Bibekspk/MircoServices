import {
  OrderCancelledEvent,
  Subjects,
  Publisher,
} from "@sporganization/commonauth";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
