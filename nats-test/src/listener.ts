import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import TicketCreatedListener from "./events/ticket-creater-listener";
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  //   const options = stan
  //     .subscriptionOptions()
  //     .setManualAckMode(true) // by default NATS automatically acknowledge but we can do it manually
  //     .setDeliverAllAvailable() //delivers all messages that are sent in past again when service starts or restarts. Used here with durable for very first time when service starts to bring all messages in service
  //     .setDurableName("accounting-service"); //redeliver only failed messages
  //   const subscription = stan.subscribe(
  //     "ticket:created",
  //     "orders-service-queue-group", // for this case use this to make sure we dont accidently dump durable name even if our service restarts for small time
  //     options
  //   );

  //   subscription.on("message", (msg: Message) => {
  //     console.log("Message received", msg.getSequence(), msg.getData());
  //     msg.ack(); //acknowledging the msg to NATS streamiing
  //   });
  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close()); //signal interrupt
process.on("SIGTERM", () => stan.close()); //signal terminate
