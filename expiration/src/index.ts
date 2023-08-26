import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) throw new Error("client id is not defined");
  if (!process.env.NATS_URL) throw new Error("nats uri is not defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("cluster id is not defined");

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close()); //signal interrupt
    process.on("SIGTERM", () => natsWrapper.client.close()); //signal terminate
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {}
};

start();
