import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import TicketCreatedListener from "./ticket-creater-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("LISTENER ON");

  stan.on("close", () => {
    console.log("Listener closed");
    process.exit();
  });

  //creating instance and passing the already made up stan  and listening to it
  //this stan will be going to TicketCreatedListenr and then to Listener where actual use of stan is done
  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  protected client: Stan;
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  // can be changed in subclass too
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  //creating subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  //listening to events after connection
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message Recieved : ${this.subject} / ${this.queueGroupName}`
      );
      const parsedData = this.parseMessage(msg);
      //passing data to callback function
      this.onMessage(parsedData, msg);
    });
  }

  //parsing message
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

export default Listener;
