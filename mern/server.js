import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// starts the Express server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
