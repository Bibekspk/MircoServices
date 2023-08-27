import mongoose, { Mongoose, mongo } from "mongoose";

interface Attrs {
    orderId: string,
    stripeId: string
}

//this is every document available in collection or table
interface PaymentDoc extends mongoose.Document {
    orderId: string,
    stripeId: string
}

//attached to model wrapper 
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: Attrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        required: true,
        type: String
    },
    stripeId: {
        required: true,
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        },
    }
})

//adding this as we wont need to create an instance of Model to add data 
// i.e. new Paymnet(). This will give us way to use directly on the model like Payment.build() without use of new Payment
paymentSchema.statics.build = (attrs: Attrs) => {
    return new Payment(attrs)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment }