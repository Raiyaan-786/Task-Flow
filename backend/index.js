import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });
    server.on("error", (error) => {
      console.log("Server error:", error);
    });
  })
  .catch((err) => {
    console.log("MONGO database connection error !!");
    console.log(err);
  }
);
