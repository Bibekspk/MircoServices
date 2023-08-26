import { Ticket } from "../tickets";

it("implements optimistic concurrency control", async () => {
  //create an instance of ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 50,
    userId: "123",
  });

  //save the ticket
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes rto the tickets we fetched

  firstInstance!.set({ price: 10 });
  firstInstance!.set({ price: 10 });

  //save the first fetched ticket
  await firstInstance!.save();

  //save second instance
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
