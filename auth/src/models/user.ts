import mongoose from "mongoose";
import { Password } from "../services/password";

//interface for creating user
interface UserAttrs {
  email: string;
  password: string;
}

//interface for usermodel
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the propeties that a user document has like _id, createdAt
interface UserDoc extends mongoose.Document {
  // /adding  these field to the document class that containers _id, updated,createdAt
  email: string;
  password: string;
}

// userDoc will have which is the created user  {
// id,updatedAt,createdAt,email,password
// }

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

//to run before saving something
// we are not uisng arrow function here becasue it wil get context of outer parent / userDoc
//so we are using async and done is to make sure everything is done after doing something
userSchema.pre("save", async function (done) {
  //for only running when password changes not while changing email
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
    done();
  }
});

//using it to add new user so that type can be checked (static methods )
//to use static method we donot need to create instance we can just user User.build()
userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attr);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
// here UserDoc is the type of dcoument that is going to be created
// User MOdel is the type of mongoose model that is being created with static method

export { User };
