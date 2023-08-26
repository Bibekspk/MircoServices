import {
  OrderCancelledEvent,
  Subjects,
  Publisher,
} from "@bibekorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
