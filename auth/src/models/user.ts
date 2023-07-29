import mongoose from "mongoose";
import { Password } from "../services/password";
//interface that describes the properties that are
// required to create a new user

interface userAttributes {
  email: string;
  password: string;
}

//An interface that describes the properties
//that a User Model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: userAttributes): UserDoc;
}

//An interface that describes the properties
//that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attributes: userAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("user", userSchema);

User.build({
  email: "",
  password: "",
});

const BuildUser = (attrs: userAttributes) => {
  return new User(attrs);
};

export { User, BuildUser };
