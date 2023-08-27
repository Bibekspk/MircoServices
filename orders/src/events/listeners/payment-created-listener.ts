import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@bibekorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queuegroupname";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

        const { id, orderId, stripeId } = data;

        //checking order 
        const order = await Order.findById(orderId);

        //if not found throw error
        if (!order) {
            throw new NotFoundError()
        }

        //if found set it to complete so that ticket will be reserved for user
        order.set({ status: OrderStatus.Complete })
        await order.save()

        // ack the message
        msg.ack()

    }

}