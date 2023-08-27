import { PaymentCreatedEvent, Publisher, Subjects } from "@bibekorg/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}