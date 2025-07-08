import express from "express";
import cors from "cors";
import eventController from "./controllers/event-controller.js";

const app   = express();
const port  = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/events", eventController);

app.listen(port, () => {
    console.log('App running on port ' + port)
});