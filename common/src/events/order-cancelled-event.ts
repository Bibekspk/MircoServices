import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-types";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
