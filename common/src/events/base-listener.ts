import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  private client: Stan;
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
