import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/currentUser", (req, res) => {
  console.log("You are inside me ");
  res.send("Hi there");
});

console.log("hello");
app.listen(3000, () => {
  console.log("Server listening in 3000");
});
