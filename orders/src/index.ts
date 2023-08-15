import { app } from "./app";
// import "./db-connect";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
  } catch (err) {}

  app.listen(4000, () => {
    console.log("listening on port 3000");
  });
};

start();
