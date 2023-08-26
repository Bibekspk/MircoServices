import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@sporganization/commonauth";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
