import { app } from "./app";
import "./db-connect";

app.listen(4000, () => {
  console.log("listening on port 3000");
});
